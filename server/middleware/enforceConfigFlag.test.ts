// Licensed under the Open Software License version 3.0
import { beforeEach, test } from "@jest/globals";
import { enforceConfigFlag } from "./enforceConfigFlag";

jest.mock("../../utils/redis", () => ({
  redis: {
    hget: async (key: string, field: string) => {
      if (key !== "flags") return null;
      switch (field) {
        case `trueFlag`:
          return true;
        case `falseFlag`:
          return false;
        case `numericFlagZero`:
          return 0;
        case `numericFlagOne`:
          return 1;
        default:
          return null;
      }
    },
  },
}));

const next = jest.fn();

beforeEach(() => {
  next.mockReset();
});

test("calls next() if flag is true", async () => {
  const middlewarePromise = enforceConfigFlag({
    flag: "trueFlag",
    defaultFlagValue: false,
  })._middlewares[0]({
    next,
  } as any);
  await expect(middlewarePromise).resolves.toBeUndefined();
  expect(next).toBeCalledTimes(1);
});

test("calls next() if flag is undefined but defaults to true", async () => {
  const middlewarePromise = enforceConfigFlag({
    flag: "missingFlag",
    defaultFlagValue: true,
  })._middlewares[0]({
    next,
  } as any);
  await expect(middlewarePromise).resolves.toBeUndefined();
  expect(next).toBeCalledTimes(1);
});

test("throws if flag is false", async () => {
  const middlewarePromise = enforceConfigFlag({
    flag: "falseFlag",
    defaultFlagValue: false,
  })._middlewares[0]({
    next,
  } as any);
  await expect(middlewarePromise).rejects.toThrowErrorMatchingInlineSnapshot(
    `"This procedure is disabled by falseFlag flag"`
  );
  expect(next).not.toBeCalled();
});

test("throws if flag is false regardless of default value", async () => {
  const middlewarePromise = enforceConfigFlag({
    flag: "falseFlag",
    defaultFlagValue: true,
  })._middlewares[0]({
    next,
  } as any);
  await expect(middlewarePromise).rejects.toThrowErrorMatchingInlineSnapshot(
    `"This procedure is disabled by falseFlag flag"`
  );
  expect(next).not.toBeCalled();
});

test("throws on undefined flag and if default value is false", async () => {
  const middlewarePromise = enforceConfigFlag({
    flag: "missingFlag",
    defaultFlagValue: false,
  })._middlewares[0]({
    next,
  } as any);
  await expect(middlewarePromise).rejects.toThrowErrorMatchingInlineSnapshot(
    `"This procedure is disabled by missingFlag flag"`
  );
  expect(next).not.toBeCalled();
});

test("throws if flag is not strictly true but 0", async () => {
  const middlewarePromise = enforceConfigFlag({
    flag: "numericFlagZero",
    defaultFlagValue: true,
  })._middlewares[0]({
    next,
  } as any);
  await expect(middlewarePromise).rejects.toThrowErrorMatchingInlineSnapshot(
    `"This procedure is disabled by numericFlagZero flag"`
  );
  expect(next).not.toBeCalled();
});

test("throws if flag is not strictly true but 1", async () => {
  const middlewarePromise = enforceConfigFlag({
    flag: "numericFlagOne",
    defaultFlagValue: true,
  })._middlewares[0]({
    next,
  } as any);
  await expect(middlewarePromise).rejects.toThrowErrorMatchingInlineSnapshot(
    `"This procedure is disabled by numericFlagOne flag"`
  );
  expect(next).not.toBeCalled();
});

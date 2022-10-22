import { beforeEach, test } from "@jest/globals";
import { disableOnProduction } from "./disableOnProduction";

const next = jest.fn();
const env = process.env;

beforeEach(() => {
  process.env = { ...env };
  next.mockReset();
});

test("throws on production", async () => {
  process.env = { ...env, NODE_ENV: "production" };
  const middlewarePromise = disableOnProduction({ next } as any);
  await expect(middlewarePromise).rejects.toThrowErrorMatchingInlineSnapshot(
    `"This procedure is not available in this environment"`
  );
  expect(next).not.toBeCalled();
});

test("calls next() on development", async () => {
  process.env = { ...env, NODE_ENV: "development" };
  const middlewarePromise = disableOnProduction({ next } as any);
  await expect(middlewarePromise).resolves.toBeUndefined();
  expect(next).toBeCalledTimes(1);
});

test("calls next() in test env", async () => {
  process.env = { ...env, NODE_ENV: "test" };
  const middlewarePromise = disableOnProduction({ next } as any);
  await expect(middlewarePromise).resolves.toBeUndefined();
  expect(next).toBeCalledTimes(1);
});

// Licensed under the Open Software License version 3.0
import edge from "@vercel/edge-config";
import { EdgeFlagEnv, defaultEdgeConfigValues } from "../types/EdgeConfig";
import { getEdgeConfigValues } from "./getEdgeConfigValues";

jest.mock("@vercel/edge-config", () => ({
  getAll: jest.fn(),
}));
const getAll = edge.getAll as jest.MockedFunction<typeof edge.getAll>;

test("EdgeFlagEnv === test", () => {
  expect(EdgeFlagEnv).toBe("test");
});

describe("Default/No values in EdgeConfig", () => {
  beforeEach(() => {
    getAll.mockResolvedValue({}).mockClear();
  });

  test("pushNotifyAbove returns default value if requested", async () => {
    const edgeConfig = await getEdgeConfigValues(["pushNotifyAbove"]);
    expect(edgeConfig.pushNotifyAbove).toBe(
      defaultEdgeConfigValues.pushNotifyAbove
    );
    expect(getAll).toBeCalledWith(["test_pushNotifyAbove"]);
  });

  test("pushTTLSeconds returns default value if requested", async () => {
    const edgeConfig = await getEdgeConfigValues(["pushTTLSeconds"]);
    expect(edgeConfig.pushTTLSeconds).toBe(
      defaultEdgeConfigValues.pushTTLSeconds
    );
    expect(getAll).toBeCalledWith(["test_pushTTLSeconds"]);
  });

  test("pushNotifyAbove returns undefined if not requested", async () => {
    const edgeConfig = await getEdgeConfigValues([]);
    expect(edgeConfig.pushNotifyAbove).toBe(undefined);
    expect(getAll).not.toBeCalled();
  });

  test("pushTTLSeconds returns undefined if not requested", async () => {
    const edgeConfig = await getEdgeConfigValues([]);
    expect(edgeConfig.pushTTLSeconds).toBe(undefined);
    expect(getAll).not.toBeCalled();
  });
});

describe("Custom values in EdgeConfig", () => {
  beforeEach(() => {
    getAll
      .mockResolvedValue({
        test_pushNotifyAbove: 99,
        test_pushTTLSeconds: 999,
      })
      .mockClear();
  });

  test("pushNotifyAbove returns correct value if requested", async () => {
    const edgeConfig = await getEdgeConfigValues(["pushNotifyAbove"]);
    expect(edgeConfig.pushNotifyAbove).toBe(99);
    expect(getAll).toBeCalledWith(["test_pushNotifyAbove"]);
  });

  test("pushTTLSeconds returns correct value if requested", async () => {
    const edgeConfig = await getEdgeConfigValues(["pushTTLSeconds"]);
    expect(edgeConfig.pushTTLSeconds).toBe(999);
    expect(getAll).toBeCalledWith(["test_pushTTLSeconds"]);
  });

  test("pushNotifyAbove returns undefined if not requested", async () => {
    const edgeConfig = await getEdgeConfigValues([]);
    expect(edgeConfig.pushNotifyAbove).toBe(undefined);
    expect(getAll).not.toBeCalled();
  });

  test("pushTTLSeconds returns undefined if not requested", async () => {
    const edgeConfig = await getEdgeConfigValues([]);
    expect(edgeConfig.pushTTLSeconds).toBe(undefined);
    expect(getAll).not.toBeCalled();
  });
});

// Licensed under the Open Software License version 3.0
import { defaultEdgeConfigValues } from "../types/EdgeConfig";
import { getEdgeConfigValues } from "./getEdgeConfigValues";
import { redis } from "./redis";

jest.mock("./redis", () => ({
  redis: {
    hmget: jest.fn(),
  },
}));
const hmget = redis.hmget as jest.MockedFunction<typeof redis.hmget>;

describe("Default/No values in EdgeConfig", () => {
  beforeEach(() => {
    hmget.mockResolvedValue({}).mockClear();
  });

  test("pushNotifyAbove returns default value if requested", async () => {
    const edgeConfig = await getEdgeConfigValues(["pushNotifyAbove"]);
    expect(edgeConfig.pushNotifyAbove).toBe(
      defaultEdgeConfigValues.pushNotifyAbove
    );
    expect(hmget).toBeCalledWith("config", "pushNotifyAbove");
  });

  test("pushTTLSeconds returns default value if requested", async () => {
    const edgeConfig = await getEdgeConfigValues(["pushTTLSeconds"]);
    expect(edgeConfig.pushTTLSeconds).toBe(
      defaultEdgeConfigValues.pushTTLSeconds
    );
    expect(hmget).toBeCalledWith("config", "pushTTLSeconds");
  });

  test("pushNotifyAbove returns undefined if not requested", async () => {
    const edgeConfig = await getEdgeConfigValues([]);
    expect(edgeConfig.pushNotifyAbove).toBe(undefined);
    expect(hmget).not.toBeCalled();
  });

  test("pushTTLSeconds returns undefined if not requested", async () => {
    const edgeConfig = await getEdgeConfigValues([]);
    expect(edgeConfig.pushTTLSeconds).toBe(undefined);
    expect(hmget).not.toBeCalled();
  });
});

describe("Custom values in EdgeConfig", () => {
  beforeEach(() => {
    hmget.mockClear();
  });

  test("pushNotifyAbove returns correct value if requested", async () => {
    hmget.mockResolvedValue({
      pushNotifyAbove: 99,
    });
    const edgeConfig = await getEdgeConfigValues(["pushNotifyAbove"]);
    expect(edgeConfig.pushNotifyAbove).toBe(99);
    expect(edgeConfig.pushTTLSeconds).toBeUndefined();
    expect(hmget).toBeCalledWith("config", "pushNotifyAbove");
  });

  test("pushTTLSeconds returns correct value if requested", async () => {
    hmget.mockResolvedValue({
      pushTTLSeconds: 999,
    });
    const edgeConfig = await getEdgeConfigValues(["pushTTLSeconds"]);
    expect(edgeConfig.pushTTLSeconds).toBe(999);
    expect(edgeConfig.pushNotifyAbove).toBeUndefined();
    expect(hmget).toBeCalledWith("config", "pushTTLSeconds");
  });

  test("pushNotifyAbove returns undefined if not requested", async () => {
    hmget.mockResolvedValue({
      pushNotifyAbove: 99,
      pushTTLSeconds: 999,
    });
    const edgeConfig = await getEdgeConfigValues([]);
    expect(edgeConfig.pushNotifyAbove).toBe(undefined);
    expect(hmget).not.toBeCalled();
  });

  test("pushTTLSeconds returns undefined if not requested", async () => {
    hmget.mockResolvedValue({
      pushNotifyAbove: 99,
      pushTTLSeconds: 999,
    });
    const edgeConfig = await getEdgeConfigValues([]);
    expect(edgeConfig.pushTTLSeconds).toBe(undefined);
    expect(hmget).not.toBeCalled();
  });
});

// Licensed under the Open Software License version 3.0
export const EdgeFlagEnv = process.env.NODE_ENV ?? "development";
export type EdgeConfig = {
  pushNotifyAbove?: number;
  pushTTLSeconds?: number;
};
export type EdgeFlag = keyof EdgeConfig;
export const edgeConfigFlags = ["pushNotifyAbove", "pushTTLSeconds"] as const;

export const defaultEdgeConfigValues: Required<EdgeConfig> = {
  pushNotifyAbove: 90, // degC
  pushTTLSeconds: 15 * 60, // seconds
};

// Licensed under the Open Software License version 3.0
export type RemoteFlag =
  | "seedRouter_initRedis"
  | "seedRouter_generateVapidKeys"
  | "seedRouter_generateKeys"
  | "seedRouter_createDefaultRoles"
  | "seedRouter_addRootRole";

export const allRemoteFlags = [
  "seedRouter_initRedis",
  "seedRouter_generateVapidKeys",
  "seedRouter_generateKeys",
  "seedRouter_createDefaultRoles",
  "seedRouter_addRootRole",
] as const;

export type RemoteNumericOption = "pushNotifyAbove" | "pushTTLSeconds";

export const allNumericOptions = ["pushNotifyAbove", "pushTTLSeconds"] as const;

// Licensed under the Open Software License version 3.0
import type { EdgeConfig, EdgeFlag } from "../types/EdgeConfig";
import { defaultEdgeConfigValues } from "../types/EdgeConfig";
import { redis } from "./redis";

/**
 * Easily get Edge Config values
 */
export async function getEdgeConfigValues(
  flagsToGet: EdgeFlag[]
): Promise<EdgeConfig> {
  // Return empty object if no flags requested
  if (flagsToGet.length === 0) return {};
  const config = await redis.hmget<Record<string, any>>(
    "config",
    ...flagsToGet
  );
  // Return default values if config doesn't exist
  if (!config) return defaultEdgeConfigValues;
  // Fallback to default values for missing flags
  flagsToGet.forEach((flag) => {
    config[flag] = config[flag] ?? defaultEdgeConfigValues[flag];
  });
  return config;
}

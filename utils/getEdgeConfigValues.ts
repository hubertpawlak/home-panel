// Licensed under the Open Software License version 3.0
import { getAll } from "@vercel/edge-config";
import type { EdgeConfig, EdgeFlag } from "../types/EdgeConfig";
import { EdgeFlagEnv, defaultEdgeConfigValues } from "../types/EdgeConfig";

/**
 * Easily get edge config values (fallback to hardcoded values)
 */
export async function getEdgeConfigValues(
  flagsToGet: EdgeFlag[]
): Promise<EdgeConfig> {
  // Return empty object if no flags requested
  if (flagsToGet.length === 0) return {};
  // Get all requested flags
  const flagsWithValues =
    (await getAll(flagsToGet.map((flag) => `${EdgeFlagEnv}_${flag}`))) ?? {};
  // Remove EdgeFlagEnv prefix (rename keys)
  for (const flag of flagsToGet) {
    // Fallback to default value
    flagsWithValues[flag] =
      flagsWithValues[`${EdgeFlagEnv}_${flag}`] ??
      defaultEdgeConfigValues[flag];
    delete flagsWithValues[`${EdgeFlagEnv}_${flag}`];
  }
  // Return object with renamed keys
  return flagsWithValues;
}

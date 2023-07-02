// Licensed under the Open Software License version 3.0
import { z } from "zod";
import type { RemoteFlag, RemoteNumericOption } from "../../../types/Config";
import { allNumericOptions, allRemoteFlags } from "../../../types/Config";
import { redis } from "../../../utils/redis";
import {
  adminProcedure,
  rootProcedure,
} from "../../middleware/enforceUserAuth";
import { router } from "../trpc";

interface DynamicConfig {
  flags: Partial<Record<RemoteFlag, boolean | null>>;
  numericOptions: Partial<Record<RemoteNumericOption, number | null>>;
}

async function getFlags() {
  const flags =
    (await redis.hmget<Partial<Record<RemoteFlag, boolean>>>(
      "flags",
      ...allRemoteFlags
    )) ?? {};
  return flags;
}

async function getNumericOptions() {
  const numericOptions =
    (await redis.hmget<Partial<Record<RemoteNumericOption, number>>>(
      "numericOptions",
      ...allNumericOptions
    )) ?? {};
  return numericOptions;
}

async function getFlagsAndConfig(): Promise<DynamicConfig> {
  const flags = await getFlags();
  const numericOptions = await getNumericOptions();
  return { flags, numericOptions };
}

export const configRouter = router({
  getAll: adminProcedure.query(async (): Promise<DynamicConfig> => {
    const flags = await getFlagsAndConfig();
    return flags;
  }),
  setFlag: rootProcedure
    .input(z.object({ flag: z.enum(allRemoteFlags), value: z.boolean() }))
    .mutation(async ({ input: { flag, value } }) => {
      await redis.hset("flags", { [flag]: value });
      return { success: true };
    }),
  setNumericOption: adminProcedure
    .input(z.object({ option: z.enum(allNumericOptions), value: z.number() }))
    .mutation(async ({ input: { option, value } }) => {
      await redis.hset("numericOptions", { [option]: value });
      return { success: true };
    }),
});

// Licensed under the Open Software License version 3.0
import { z } from "zod";
import type { EdgeConfig } from "../../types/EdgeConfig";
import { edgeConfigFlags } from "../../types/EdgeConfig";
import { getEdgeConfigValues } from "../../utils/getEdgeConfigValues";
import { userProcedure } from "../middleware/enforceUserAuth";
import { router } from "./trpc";

export const edgeConfigRouter = router({
  get: userProcedure
    .input(
      z
        .array(z.enum(edgeConfigFlags))
        .nonempty()
        .max(edgeConfigFlags.length)
        .default([...edgeConfigFlags])
    )
    .query(async ({ input }): Promise<EdgeConfig> => {
      const flags = await getEdgeConfigValues(input);
      return flags;
    }),
});

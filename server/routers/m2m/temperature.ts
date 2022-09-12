import { createM2MRouter } from "../../createM2MRouter";
import { z } from "zod";

export const temperatureRouter = createM2MRouter().mutation(
  "storeTemperature",
  {
    input: z.any(),
    async resolve({ ctx }) {
      return { sourceId: ctx.sourceId };
    },
  }
);

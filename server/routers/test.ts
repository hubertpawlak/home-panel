import { z } from "zod";
import { createRouter } from "../createRouter";

export const testRouter = createRouter().query("timestamp", {
  input: z.undefined(),
  output: z.number(),
  resolve({}) {
    return Date.now();
  },
});

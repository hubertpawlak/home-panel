import { createRouter } from "../createRouter";
import { testRouter } from "./test";

export const appRouter = createRouter().merge("test.", testRouter);

export type AppRouter = typeof appRouter;

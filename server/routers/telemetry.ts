// Licensed under the Open Software License version 3.0
import { router } from "./trpc";

const LOGTAIL_SOURCE_TOKEN = process.env.LOGTAIL_SOURCE_TOKEN;
if (!LOGTAIL_SOURCE_TOKEN) throw new Error("Missing LOGTAIL_SOURCE_TOKEN");

export const telemetryRouter = router({});

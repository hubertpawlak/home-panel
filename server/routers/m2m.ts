import { temperatureRouter } from "./m2m/temperature";
import { t } from "./trpc";

export const m2mRouter = t.mergeRouters(temperatureRouter);

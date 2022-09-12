import { _createM2MRouter } from "../createM2MRouter";
import { temperatureRouter } from "./m2m/temperature";

export const m2mRouter = _createM2MRouter().merge(temperatureRouter);

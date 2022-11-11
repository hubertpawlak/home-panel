// Licensed under the Open Software License version 3.0
import { sub } from "date-fns";
import supabase from "../../utils/supabase";
import { userProcedure } from "../middleware/enforceUserAuth";
import { router } from "./trpc";

export const sensorsRouter = router({
  getTemperatures: userProcedure.query(async () => {
    // Don't send old readings
    const twoHoursAgo = sub(new Date(), { hours: 2 });
    const { data } = await supabase
      .from("temperature_sensors")
      .select("hwId,temperature,resolution,updated_at,name,updated_by")
      .gte("updated_at", twoHoursAgo.toISOString())
      .order("hwId", { ascending: true });
    return data ?? [];
  }),
});

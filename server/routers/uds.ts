// Licensed under the Open Software License version 3.0
import { sub } from "date-fns";
import supabase from "../../utils/supabase";
import { userProcedure } from "../middleware/enforceUserAuth";
import { router } from "./trpc";

export const udsRouter = router({
  getTemperatureSensors: userProcedure.query(async () => {
    const twoHoursAgo = sub(new Date(), { hours: 2 });
    const { data } = await supabase
      .from("uds_sensors")
      .select("id,name,temperature,resolution,updated_at,updated_by")
      .eq("hardware_type", "TemperatureSensor")
      .gte("updated_at", twoHoursAgo.toISOString())
      .order("id", { ascending: true });
    return data ?? [];
  }),
  getUpses: userProcedure.query(async () => {
    const twoHoursAgo = sub(new Date(), { hours: 2 });
    const { data } = await supabase
      .from("uds_upses")
      // Select all columns except created_at
      .select(
        "battery_charge,battery_charge_low,battery_runtime,battery_runtime_low,id,input_frequency,input_voltage,name,output_frequency,output_frequency_nominal,output_voltage,output_voltage_nominal,source_type,updated_at,updated_by,ups_load,ups_power,ups_power_nominal,ups_realpower,ups_status"
      )
      .eq("hardware_type", "UninterruptiblePowerSupply")
      .gte("updated_at", twoHoursAgo.toISOString())
      .order("id", { ascending: true });
    return data ?? [];
  }),
});

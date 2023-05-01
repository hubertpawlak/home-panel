// Licensed under the Open Software License version 3.0
import type { RequestOptions } from "web-push";
import { z } from "zod";
import { SharedMax } from "../../../types/SharedMax";
import type { Database } from "../../../types/supabase";
import { getEdgeConfigValues } from "../../../utils/getEdgeConfigValues";
import type { NotificationPayload } from "../../../utils/push";
import { autoSendPushToAll } from "../../../utils/push";
import supabase from "../../../utils/supabase";
import { m2mProcedure } from "../../middleware/enforceM2MAuth";
import { router } from "../trpc";

export const WHITELISTED_SENSORS_HARDWARE_TYPES = ["TemperatureSensor"];
export const WHITELISTED_SENSORS_SOURCE_TYPES = ["OneWire"];
export const WHITELISTED_UPSES_HARDWARE_TYPES = ["UninterruptiblePowerSupply"];
export const WHITELISTED_UPSES_SOURCE_TYPES = ["NetworkUpsTools"];
export const WHITELISTED_UPS_VARIABLES = [
  "battery.charge",
  "battery.charge.low",
  "battery.runtime",
  "battery.runtime.low",
  "input.frequency",
  "input.voltage",
  "output.frequency",
  "output.frequency.nominal",
  "output.voltage",
  "output.voltage.nominal",
  "ups.load",
  "ups.power",
  "ups.power.nominal",
  "ups.realpower",
  "ups.status",
];

async function tryToSendPush(
  pushNotifyAbove?: number,
  pushTTLSeconds?: number,
  additionalCheck?: () => Promise<boolean>
) {
  if (pushNotifyAbove === undefined) return;
  if (pushTTLSeconds === undefined) return;
  if (additionalCheck === undefined) return;
  const additionalCheckSucceeded = await additionalCheck();
  if (!additionalCheckSucceeded) return;
  // Prepare payload
  const timestamp = Date.now();
  const payload: NotificationPayload = {
    title: `Temperatura przekroczyła ${pushNotifyAbove}°C `,
    body: `Jeden z czujników zgłosił temperaturę powyżej limitu`,
    timestamp,
    path: "/panel",
  };
  // Prepare options
  const options: RequestOptions = {
    TTL: pushTTLSeconds,
    headers: {
      Urgency: "high",
    },
  };
  // Send push
  autoSendPushToAll(payload, options);
}

export const udsRouter = router({
  // Example input available at https://github.com/hubertpawlak/universal-data-source/blob/main/README.md
  storeUniversalData: m2mProcedure
    .input(
      z
        .object({
          sensors: z
            .array(
              z.object({
                meta: z.object({
                  hw: z.object({
                    id: z.string().min(1).max(SharedMax),
                    hardware_type: z.string().min(1).max(SharedMax),
                  }),
                  source: z.object({
                    source_type: z.string().min(1).max(SharedMax),
                  }),
                }),
                temperature: z.number(),
                resolution: z.number().positive(),
              })
            )
            .max(SharedMax),
          upses: z
            .array(
              z.object({
                meta: z.object({
                  hw: z.object({
                    hardware_type: z.string().min(1).max(SharedMax),
                    id: z.string().min(1).max(SharedMax),
                  }),
                  source: z.object({
                    source_type: z.string().min(1).max(SharedMax),
                  }),
                }),
                variables: z.record(z.string().min(1).max(SharedMax)),
              })
            )
            .max(SharedMax),
        })
        // Silently drop unsupported hardware types (by transforming)
        // as they won't be displayed in the frontend anyway
        .transform((obj) => ({
          sensors: obj.sensors.filter((sensor) =>
            WHITELISTED_SENSORS_HARDWARE_TYPES.includes(
              sensor.meta.hw.hardware_type
            )
          ),
          upses: obj.upses.filter((ups) =>
            WHITELISTED_UPSES_HARDWARE_TYPES.includes(ups.meta.hw.hardware_type)
          ),
        }))
        // Set all whitelisted variables to null
        // to prevent stale data from being displayed as fresh
        .transform((obj) => ({
          ...obj,
          upses: obj.upses.map((ups) => ({
            ...ups,
            variables: {
              ...Object.fromEntries(
                WHITELISTED_UPS_VARIABLES.map((key) => [key, null])
              ),
              ...ups.variables,
            },
          })),
        }))
        // Silently drop unsupported variables
        // and replace "." with "_" in variable names for storage
        .transform((obj) => ({
          ...obj,
          upses: obj.upses.map((ups) => ({
            ...ups,
            variables: Object.fromEntries(
              Object.entries(ups.variables)
                .filter(([key]) => WHITELISTED_UPS_VARIABLES.includes(key))
                .map(([key, value]) => [key.replace(/\./g, "_"), value])
            ),
          })),
        }))
    )
    .mutation(async ({ ctx, input }) => {
      // Prepare device-specific data as object
      // Use asynchronous mapping
      // Process sensors
      const sensors = Promise.all(
        input.sensors.map(async ({ meta, resolution, temperature }) => {
          const sensor: Database["public"]["Tables"]["uds_sensors"]["Insert"] =
            {
              id: meta.hw.id,
              hardware_type: meta.hw.hardware_type,
              source_type: meta.source.source_type,
              temperature,
              resolution,
              updated_by: ctx.sourceId,
            };
          return sensor;
        })
      );
      // Get push notifications config
      const { pushNotifyAbove, pushTTLSeconds } = await getEdgeConfigValues([
        "pushNotifyAbove",
        "pushTTLSeconds",
      ]);
      // Try to send push notifications
      await tryToSendPush(pushNotifyAbove, pushTTLSeconds, async () => {
        if (pushNotifyAbove === undefined) return false;
        return input.sensors.some(
          ({ temperature }) => temperature > pushNotifyAbove
        );
      });
      // Process upses
      const upses = Promise.all(
        input.upses.map(async ({ meta, variables }) => {
          const ups: Database["public"]["Tables"]["uds_upses"]["Insert"] = {
            id: meta.hw.id,
            hardware_type: meta.hw.hardware_type,
            source_type: meta.source.source_type,
            ...variables,
            updated_by: ctx.sourceId,
          };
          return ups;
        })
      );
      // Upsert sensors
      const { error } = await supabase
        .from("uds_sensors")
        .upsert(await sensors, { onConflict: "id" });
      // Upsert upses
      const { error: error2 } = await supabase
        .from("uds_upses")
        .upsert(await upses, { onConflict: "id" });
      // Return failure if any error occurred
      if (error || error2) {
        return { success: false, databaseError: true };
      }
      // Return success
      return { success: true };
    }),
});

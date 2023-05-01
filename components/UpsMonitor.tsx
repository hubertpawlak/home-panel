// Licensed under the Open Software License version 3.0
import { Card, List, Title, Tooltip } from "@mantine/core";
import {
  IconBatteryAutomotive,
  IconBolt,
  IconCalendarTime,
  IconCloudUpload,
  IconGauge,
  IconHourglassEmpty,
  IconPlug,
  IconTransferIn,
  IconTransferOut,
} from "@tabler/icons-react";
import { intlFormat, isToday, parseISO } from "date-fns";
import type { Database } from "../types/supabase";
import { getNiceUpsStatus } from "../utils/getNiceUpsStatus";
import { EasyListItem } from "./EasyListItem";

export type IUps = Omit<
  Database["public"]["Tables"]["uds_upses"]["Row"],
  "hardware_type" | "created_at"
>;

export function UpsMonitor({
  id,
  name,
  battery_charge,
  battery_charge_low,
  battery_runtime,
  battery_runtime_low,
  input_frequency,
  input_voltage,
  output_frequency,
  output_frequency_nominal,
  output_voltage,
  output_voltage_nominal,
  ups_load,
  ups_power,
  ups_power_nominal,
  ups_realpower,
  ups_status,
  updated_at,
  updated_by,
}: IUps) {
  const timestamp = parseISO(updated_at);
  const updatedToday = isToday(timestamp);
  const _updated_at = intlFormat(timestamp, {
    day: updatedToday ? undefined : "2-digit",
    month: updatedToday ? undefined : "2-digit",
    year: updatedToday ? undefined : "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  return (
    <Card>
      {/* ID/Name */}
      <Tooltip
        withArrow
        arrowSize={8}
        openDelay={100}
        color="dark.9"
        position="bottom"
        transitionProps={{
          transition: "slide-up",
        }}
        label={`ID: ${id}`}
      >
        <Title order={2} align="center" mb="xs" truncate>
          {name ?? id}
        </Title>
      </Tooltip>
      <List size="lg" center spacing="xs">
        {/* Status */}
        <EasyListItem
          icon={<IconPlug />}
          values={[
            {
              key: "ups_status",
              value: getNiceUpsStatus(ups_status),
              tooltipLabel: "Stan zasilacza",
            },
          ]}
        />
        {/* Charge */}
        <EasyListItem
          icon={<IconBatteryAutomotive />}
          values={[
            {
              key: "battery_charge",
              value: battery_charge,
              suffix: "%",
              tooltipLabel: "Poziom naładowania baterii",
              warningThresholdBelow: battery_charge_low ?? 30,
              criticalThresholdBelow: battery_charge_low ?? 15,
            },
          ]}
        />
        {/* Runtime */}
        <EasyListItem
          icon={<IconHourglassEmpty />}
          values={[
            {
              key: "battery_runtime",
              value: battery_runtime,
              suffix: " min",
              tooltipLabel: "Czas pracy na baterii",
              warningThresholdBelow: battery_runtime_low ?? 20,
              criticalThresholdBelow: battery_runtime_low ?? 10,
            },
          ]}
        />
        {/* Input */}
        <EasyListItem
          icon={<IconTransferIn />}
          values={[
            {
              key: "input_voltage",
              value: input_voltage,
              suffix: "V",
              tooltipLabel: "Napięcie wejściowe",
            },
            {
              key: "input_frequency",
              value: input_frequency,
              suffix: "Hz",
              tooltipLabel: "Częstotliwość wejściowa",
            },
          ]}
        />
        {/* Output */}
        <EasyListItem
          icon={<IconTransferOut />}
          values={[
            {
              key: "output_voltage",
              value: output_voltage,
              suffix: "V",
              tooltipLabel: `Napięcie wyjściowe${
                output_voltage_nominal
                  ? ` (znamionowe ${output_voltage_nominal}V)`
                  : ""
              }`,
              warningThresholdAbove: output_voltage_nominal
                ? output_voltage_nominal * 1.05
                : undefined,
              warningThresholdBelow: output_voltage_nominal
                ? output_voltage_nominal * 0.95
                : undefined,
              criticalThresholdAbove: output_voltage_nominal
                ? output_voltage_nominal * 1.1
                : undefined,
              criticalThresholdBelow: output_voltage_nominal
                ? output_voltage_nominal * 0.9
                : undefined,
            },
            {
              key: "output_frequency",
              value: output_frequency,
              suffix: "Hz",
              tooltipLabel: `Częstotliwość wyjściowa${
                output_frequency_nominal
                  ? ` (znamionowa ${output_frequency_nominal}Hz)`
                  : ""
              }`,
              warningThresholdAbove: output_frequency_nominal
                ? output_frequency_nominal * 1.01
                : undefined,
              warningThresholdBelow: output_frequency_nominal
                ? output_frequency_nominal * 0.99
                : undefined,
              criticalThresholdAbove: output_frequency_nominal
                ? output_frequency_nominal * 1.02
                : undefined,
              criticalThresholdBelow: output_frequency_nominal
                ? output_frequency_nominal * 0.98
                : undefined,
            },
          ]}
        />
        {/* Load */}
        <EasyListItem
          icon={<IconGauge />}
          values={[
            {
              key: "ups_load",
              value: ups_load,
              suffix: "%",
              tooltipLabel: "Obciążenie",
              warningThresholdAbove: 80,
              criticalThresholdAbove: 90,
            },
          ]}
        />
        {/* Power */}
        <EasyListItem
          icon={<IconBolt />}
          values={[
            {
              key: "ups_realpower",
              value: ups_realpower,
              suffix: "W",
              tooltipLabel: "Moc czynna",
            },
            {
              key: "ups_power",
              value: ups_power,
              suffix: "VA",
              tooltipLabel: `Moc pozorna${
                ups_power_nominal ? ` (znamionowa ${ups_power_nominal}VA)` : ""
              }`,
            },
          ]}
        />
        {/* Updated at */}
        <EasyListItem
          icon={<IconCalendarTime />}
          values={[
            {
              key: "updated_at",
              value: _updated_at,
              tooltipLabel: "Ostatnia aktualizacja",
            },
          ]}
        />
        {/* Updated by */}
        <EasyListItem
          icon={<IconCloudUpload />}
          values={[
            {
              key: "updated_by",
              value: updated_by,
              tooltipLabel: "Źródło danych",
            },
          ]}
        />
      </List>
    </Card>
  );
}

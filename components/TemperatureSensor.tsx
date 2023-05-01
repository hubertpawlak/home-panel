// Licensed under the Open Software License version 3.0
import { Card, Text, Tooltip } from "@mantine/core";
import { intlFormat, isToday, parseISO } from "date-fns";
import { getColorBasedOnThreshold } from "../utils/getColorBasedOnThreshold";
import { trpc } from "../utils/trpc";

export interface ITemperatureSensor {
  id: string;
  temperature?: number | null;
  resolution?: number | null;
  updated_at: string;
  name: string;
  updated_by?: string | null;
}

export function TemperatureSensor({
  id,
  temperature,
  resolution,
  updated_at,
  name,
  updated_by,
}: ITemperatureSensor) {
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

  const { data: edgeConfig } = trpc.edgeConfig.get.useQuery(
    ["pushNotifyAbove"],
    {
      staleTime: 60 * 1000, // 1 min
    }
  );

  if (temperature === undefined || temperature === null) return null;

  return (
    <Card>
      <Tooltip
        withArrow
        arrowSize={8}
        openDelay={500}
        color="dark.9"
        position="bottom"
        transitionProps={{
          transition: "slide-up",
        }}
        label={`ID: ${id}`}
      >
        <Text align="center" size={24}>
          {name}
        </Text>
      </Tooltip>
      <Tooltip
        withArrow
        arrowSize={8}
        openDelay={500}
        color="dark.9"
        position="bottom"
        transitionProps={{
          transition: "slide-up",
        }}
        label={`Rozdzielczość: ${resolution}`}
      >
        <Text
          align="center"
          size={55}
          inline
          weight={900}
          color={getColorBasedOnThreshold({
            value: temperature,
            criticalThresholdAbove: edgeConfig?.pushNotifyAbove,
            warningThresholdAbove: edgeConfig?.pushNotifyAbove
              ? edgeConfig.pushNotifyAbove - 5
              : undefined,
          })}
        >
          {`${temperature.toFixed(1)}°C`}
        </Text>
      </Tooltip>
      <Text align="center" size={20}>
        {_updated_at}
      </Text>
      <Text align="center" size="xs" italic>
        {updated_by}
      </Text>
    </Card>
  );
}

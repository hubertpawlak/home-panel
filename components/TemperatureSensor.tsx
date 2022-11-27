// Licensed under the Open Software License version 3.0
import type { DefaultMantineColor } from "@mantine/core";
import { Card, Text, Tooltip } from "@mantine/core";
import { intlFormat, isWithinInterval, parseISO, set } from "date-fns";
import { useEffect } from "react";
import { HARDCODED_PUSH_NOTIFY_ABOVE } from "../types/Push";
import { trpc } from "../utils/trpc";

export interface ITemperatureSensor {
  hwId: string;
  temperature?: number | null;
  resolution?: number | null;
  updated_at: string;
  name?: string | null;
  updated_by?: string | null;
}

function getColor(temperature: number): DefaultMantineColor {
  if (temperature > HARDCODED_PUSH_NOTIFY_ABOVE) return "red";
  if (temperature > HARDCODED_PUSH_NOTIFY_ABOVE - 5) return "yellow";
  return "dark.0";
}

export function TemperatureSensor({
  hwId,
  temperature,
  resolution,
  updated_at,
  name,
  updated_by,
}: ITemperatureSensor) {
  const timestamp = parseISO(updated_at);
  const now = new Date();
  const todayStart = set(now, {
    hours: 0,
    minutes: 0,
    seconds: 0,
    milliseconds: 0,
  });
  const updatedToday = isWithinInterval(timestamp, {
    start: todayStart,
    end: now,
  });
  const _updated_at = intlFormat(timestamp, {
    day: updatedToday ? undefined : "2-digit",
    month: updatedToday ? undefined : "2-digit",
    year: updatedToday ? undefined : "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  // Telemetry for future UI fix
  const { mutateAsync: reportTimeFormattingProblems } =
    trpc.log.reportTimeFormattingProblems.useMutation();
  useEffect(() => {
    const uiNow = now.getTime();
    if (isNaN(uiNow) || uiNow < 60 * 1000 || !updatedToday)
      reportTimeFormattingProblems({
        uiNow,
        updated_at,
        updatedToday,
        result: _updated_at,
      }).catch(() => {});
  });

  if (temperature === undefined || temperature === null) return null;

  return (
    <Card>
      <Text align="center" size={24}>
        {name ?? hwId}
      </Text>
      <Tooltip
        withArrow
        arrowSize={8}
        openDelay={500}
        color="dark.9"
        position="bottom"
        transition="slide-up"
        label={`Rozdzielczość: ${resolution}`}
      >
        <Text
          align="center"
          size={55}
          inline
          weight={900}
          color={getColor(temperature)}
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

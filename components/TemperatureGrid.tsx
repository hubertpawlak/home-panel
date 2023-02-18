// Licensed under the Open Software License version 3.0
import { SimpleGrid } from "@mantine/core";
import type { ITemperatureSensor } from "./TemperatureSensor";
import { TemperatureSensor } from "./TemperatureSensor";

interface ITemperatureGrid {
  temps?: ITemperatureSensor[] | null;
}

export function TemperatureGrid({ temps }: ITemperatureGrid) {
  if (!temps) return null;

  return (
    <SimpleGrid
      cols={4}
      spacing="lg"
      breakpoints={[
        {
          maxWidth: 980,
          cols: 3,
          spacing: "md",
        },
        {
          maxWidth: 755,
          cols: 2,
          spacing: "sm",
        },
        {
          maxWidth: 600,
          cols: 1,
          spacing: "sm",
        },
      ]}
    >
      {temps.map((t) => (
        <TemperatureSensor key={t.hw_id} {...t} />
      ))}
    </SimpleGrid>
  );
}

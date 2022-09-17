import { ITemperatureSensor, TemperatureSensor } from "./TemperatureSensor";
import { SimpleGrid } from "@mantine/core";

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
        <TemperatureSensor key={t.hwId} {...t} />
      ))}
    </SimpleGrid>
  );
}

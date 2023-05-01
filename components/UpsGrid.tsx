// Licensed under the Open Software License version 3.0
import { SimpleGrid } from "@mantine/core";
import type { IUps } from "./UpsMonitor";
import { UpsMonitor } from "./UpsMonitor";

interface UpsGridProps {
  upses?: IUps[] | null;
}

export function UpsGrid({ upses }: UpsGridProps) {
  if (!upses || upses.length === 0) return null;

  return (
    <SimpleGrid
      cols={4}
      spacing="lg"
      breakpoints={[
        { maxWidth: "95rem", cols: 3, spacing: "md" },
        { maxWidth: "55rem", cols: 2, spacing: "sm" },
        { maxWidth: "37rem", cols: 1, spacing: "sm" },
      ]}
    >
      {upses.map((t) => (
        <UpsMonitor key={t.id} {...t} />
      ))}
    </SimpleGrid>
  );
}

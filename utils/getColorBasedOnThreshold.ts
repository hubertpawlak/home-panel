// Licensed under the Open Software License version 3.0
import type { DefaultMantineColor } from "@mantine/core";

export interface GetColorBasedOnThresholdProps {
  value?: string | number | null;
  criticalThresholdAbove?: number | null;
  criticalThresholdBelow?: number | null;
  warningThresholdAbove?: number | null;
  warningThresholdBelow?: number | null;
}

export const CRITICAL_COLOR: DefaultMantineColor = "red";
export const WARNING_COLOR: DefaultMantineColor = "yellow";

/**
 * Returns color based on value and inclusive thresholds
 * @param value - number to compare with thresholds
 * @param criticalThresholdAbove - if value is above this threshold, color will be red
 * @param criticalThresholdBelow - if value is below this threshold, color will be red
 * @param warningThresholdAbove - if value is above this threshold, color will be yellow
 * @param warningThresholdBelow - if value is below this threshold, color will be yellow
 * @returns color based on value and thresholds, critical thresholds have higher priority than warning, if value is not a number, returns undefined
 * @example
 * getColorBasedOnThreshold({
 *   value: 85,
 *   criticalThresholdAbove: 90,
 *   warningThresholdAbove: 80,
 * }) // yellow
 */
export function getColorBasedOnThreshold({
  value,
  criticalThresholdAbove,
  criticalThresholdBelow,
  warningThresholdAbove,
  warningThresholdBelow,
}: GetColorBasedOnThresholdProps): DefaultMantineColor | undefined {
  // Use default color, value is not a number
  if (typeof value !== "number") return undefined;
  // Above critical
  if (
    typeof criticalThresholdAbove === "number" &&
    value >= criticalThresholdAbove
  )
    return CRITICAL_COLOR;
  // Below critical
  if (
    typeof criticalThresholdBelow === "number" &&
    value <= criticalThresholdBelow
  )
    return CRITICAL_COLOR;
  // Above warning
  if (
    typeof warningThresholdAbove === "number" &&
    value >= warningThresholdAbove
  )
    return WARNING_COLOR;
  // Below warning
  if (
    typeof warningThresholdBelow === "number" &&
    value <= warningThresholdBelow
  )
    return WARNING_COLOR;
  // Use default color, value is within thresholds
  return undefined;
}

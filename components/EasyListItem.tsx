// Licensed under the Open Software License version 3.0
import { List, Text, Tooltip } from "@mantine/core";
import { Fragment } from "react";
import { getColorBasedOnThreshold } from "../utils/getColorBasedOnThreshold";

export interface EasyListItemValue {
  key: string;
  tooltipLabel: string;
  value?: string | number | null;
  suffix?: string | null;
  criticalThresholdAbove?: number | null;
  criticalThresholdBelow?: number | null;
  warningThresholdAbove?: number | null;
  warningThresholdBelow?: number | null;
}

export interface EasyListItemProps {
  icon: JSX.Element;
  values: EasyListItemValue[];
}

export function EasyListItem({ icon, values }: EasyListItemProps) {
  // Check if component has any values to render
  if (values.length === 0) return null;
  // Filter out values that are undefined or null
  const filteredValues = values.filter(
    ({ value }) => value !== undefined && value !== null
  );
  // Check again if component should be rendered
  if (filteredValues.length === 0) return null;

  return (
    <List.Item icon={icon}>
      {filteredValues.map(
        (
          {
            key,
            tooltipLabel,
            value,
            suffix,
            warningThresholdAbove,
            warningThresholdBelow,
            criticalThresholdAbove,
            criticalThresholdBelow,
          },
          index
        ) => {
          return (
            <Fragment key={key}>
              <Tooltip
                withArrow
                arrowSize={8}
                openDelay={100}
                color="dark.9"
                position="bottom"
                transitionProps={{
                  transition: "slide-up",
                }}
                label={tooltipLabel}
              >
                <Text
                  span
                  align="center"
                  color={getColorBasedOnThreshold({
                    value,
                    criticalThresholdAbove,
                    criticalThresholdBelow,
                    warningThresholdAbove,
                    warningThresholdBelow,
                  })}
                >
                  {value}
                  {suffix}
                </Text>
              </Tooltip>
              {/* Display separator if not last value */}
              {index < filteredValues.length - 1 && (
                <Text span color="dimmed">
                  {" "}
                  /{" "}
                </Text>
              )}
            </Fragment>
          );
        }
      )}
    </List.Item>
  );
}

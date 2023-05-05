// Licensed under the Open Software License version 3.0
import type { GetColorBasedOnThresholdProps } from "./getColorBasedOnThreshold";
import {
  CRITICAL_COLOR,
  WARNING_COLOR,
  getColorBasedOnThreshold,
} from "./getColorBasedOnThreshold";

test("CRITICAL_COLOR is red", () => {
  expect(CRITICAL_COLOR).toBe("red");
});

test("WARNING_COLOR is yellow", () => {
  expect(WARNING_COLOR).toBe("yellow");
});

const cases: Array<
  GetColorBasedOnThresholdProps & {
    expected?: ReturnType<typeof getColorBasedOnThreshold>;
  }
> = [
  // Use the following values for all tests:
  // criticalThresholdAbove: 90
  // criticalThresholdBelow: 10
  // warningThresholdAbove: 80
  // warningThresholdBelow: 20
  // No value
  { expected: undefined },
  { value: null, expected: undefined },
  // No thresholds
  { value: 85, expected: undefined },
  // Critical above
  { value: 90, criticalThresholdAbove: 90, expected: CRITICAL_COLOR },
  { value: 91, criticalThresholdAbove: 90, expected: CRITICAL_COLOR },
  // Critical below
  { value: 10, criticalThresholdBelow: 10, expected: CRITICAL_COLOR },
  { value: 9, criticalThresholdBelow: 10, expected: CRITICAL_COLOR },
  // Warning above
  { value: 80, warningThresholdAbove: 80, expected: WARNING_COLOR },
  { value: 81, warningThresholdAbove: 80, expected: WARNING_COLOR },
  // Warning below
  { value: 20, warningThresholdBelow: 20, expected: WARNING_COLOR },
  { value: 19, warningThresholdBelow: 20, expected: WARNING_COLOR },
  // Same critical and warning
  {
    value: 90,
    criticalThresholdAbove: 90,
    warningThresholdAbove: 90,
    expected: CRITICAL_COLOR,
  },
  {
    value: 90,
    criticalThresholdBelow: 90,
    warningThresholdBelow: 90,
    expected: CRITICAL_COLOR,
  },
  // NaN
  { value: NaN, expected: undefined },
  {
    value: NaN,
    criticalThresholdAbove: 90,
    criticalThresholdBelow: 10,
    warningThresholdAbove: 80,
    warningThresholdBelow: 20,
    expected: undefined,
  },
  {
    value: 85,
    criticalThresholdAbove: NaN,
    criticalThresholdBelow: NaN,
    warningThresholdAbove: NaN,
    warningThresholdBelow: NaN,
    expected: undefined,
  },
  // +/-Infinity
  { value: Infinity, expected: undefined },
  { value: -Infinity, expected: undefined },
  {
    value: Infinity,
    criticalThresholdAbove: 90,
    criticalThresholdBelow: 10,
    warningThresholdAbove: 80,
    warningThresholdBelow: 20,
    expected: CRITICAL_COLOR,
  },
  {
    value: -Infinity,
    criticalThresholdAbove: 90,
    criticalThresholdBelow: 10,
    warningThresholdAbove: 80,
    warningThresholdBelow: 20,
    expected: CRITICAL_COLOR,
  },
  // Infinite thresholds
  {
    value: 85,
    criticalThresholdAbove: Infinity,
    criticalThresholdBelow: -Infinity,
    warningThresholdAbove: Infinity,
    warningThresholdBelow: -Infinity,
    expected: undefined,
  },
  {
    value: 85,
    criticalThresholdAbove: Infinity,
    criticalThresholdBelow: -Infinity,
    warningThresholdAbove: 80,
    warningThresholdBelow: 20,
    expected: WARNING_COLOR,
  },
  {
    value: 85,
    criticalThresholdAbove: 90,
    criticalThresholdBelow: 10,
    warningThresholdAbove: Infinity,
    warningThresholdBelow: -Infinity,
    expected: undefined,
  },
  {
    value: 95,
    criticalThresholdAbove: 90,
    criticalThresholdBelow: 10,
    warningThresholdAbove: Infinity,
    warningThresholdBelow: -Infinity,
    expected: CRITICAL_COLOR,
  },
  // String values
  { value: "0", expected: undefined },
  { value: "0", criticalThresholdBelow: 90, expected: undefined },
  // Zero
  { value: 0, expected: undefined },
  { value: 0, criticalThresholdAbove: 90, expected: undefined },
  { value: 0, criticalThresholdBelow: 0, expected: CRITICAL_COLOR },
  // Negative values
  { value: -1, expected: undefined },
  { value: -1, criticalThresholdBelow: 0, expected: CRITICAL_COLOR },
  { value: -1, criticalThresholdAbove: -2, expected: CRITICAL_COLOR },
];

test.each(cases)(
  "getColorBasedOnThreshold(%o)",
  ({
    value,
    criticalThresholdAbove,
    warningThresholdAbove,
    criticalThresholdBelow,
    warningThresholdBelow,
    expected,
  }) => {
    expect(
      getColorBasedOnThreshold({
        value,
        criticalThresholdAbove,
        warningThresholdAbove,
        criticalThresholdBelow,
        warningThresholdBelow,
      })
    ).toBe(expected);
  }
);

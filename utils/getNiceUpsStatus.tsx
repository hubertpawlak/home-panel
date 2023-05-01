// Licensed under the Open Software License version 3.0

export function getNiceUpsStatus(status: string | null) {
  // Based on https://github.com/networkupstools/nut/blob/efbbf4882e0409923534c5352ea4c0e768a9defc/drivers/dummy-ups.h#L55
  switch (status) {
    // Calibration
    case "CAL":
      return "Kalibracja";
    // Trimming
    case "TRIM":
      return "AVR: Trim";
    // Boosting
    case "BOOST":
      return "AVR: Boost";
    // On line
    case "OL":
      return "Zasilanie z sieci";
    // On battery
    case "OB":
      return "Zasilanie z baterii";
    // Overload
    case "OVER":
      return "Przeciążenie";
    // Low battery
    case "LB":
      return "Niski poziom baterii";
    // Replace battery
    case "RB":
      return "Wymień baterię";
    // No battery
    case "BYPASS":
      return "Bypass";
    // Turned off
    case "OFF":
      return "Wyłączony";
    // Charging
    case "CHRG":
      return "Ładowanie baterii";
    // Discharging
    case "DISCHRG":
      return "Rozładowywanie baterii";
    // Unknown status, return as-is
    default:
      return status;
  }
}

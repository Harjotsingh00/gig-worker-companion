export interface FuelShiftInput {
  grossEarnings: number;
  distanceKm: number;
  fuelPricePerLiter: number;
  mileageKmPerLiter: number;
  shiftHours: number;
  otherExpenses?: number;
}

export interface FuelShiftResult {
  grossEarnings: number;
  fuelConsumedLiters: number;
  fuelCost: number;
  otherExpenses: number;
  totalExpenses: number;
  netEarnings: number;
  realHourlyWage: number;
  costPercentage: number;
  profitPerKm: number;
  status: "healthy" | "warning" | "loss";
  summaryText: string;
}

export function calculateShiftProfitability(input: FuelShiftInput): FuelShiftResult {
  const gross = Math.max(0, Number(input.grossEarnings) || 0);
  const distance = Math.max(0, Number(input.distanceKm) || 0);
  const fuelPrice = Math.max(1, Number(input.fuelPricePerLiter) || 100);
  const mileage = Math.max(1, Number(input.mileageKmPerLiter) || 35);
  const hours = Math.max(0.5, Number(input.shiftHours) || 8);
  const other = Math.max(0, Number(input.otherExpenses) || 0);

  const fuelConsumedLiters = distance / mileage;
  const fuelCost = fuelConsumedLiters * fuelPrice;
  const totalExpenses = fuelCost + other;
  const netEarnings = gross - totalExpenses;
  const realHourlyWage = netEarnings / hours;
  const costPercentage = gross > 0 ? (totalExpenses / gross) * 100 : 100;
  const profitPerKm = distance > 0 ? netEarnings / distance : 0;

  let status: "healthy" | "warning" | "loss" = "healthy";
  if (netEarnings <= 0) {
    status = "loss";
  } else if (costPercentage > 40 || realHourlyWage < 75) {
    status = "warning";
  }

  const round = (num: number) => Math.round((num + Number.EPSILON) * 100) / 100;

  return {
    grossEarnings: round(gross),
    fuelConsumedLiters: round(fuelConsumedLiters),
    fuelCost: round(fuelCost),
    otherExpenses: round(other),
    totalExpenses: round(totalExpenses),
    netEarnings: round(netEarnings),
    realHourlyWage: round(realHourlyWage),
    costPercentage: round(costPercentage),
    profitPerKm: round(profitPerKm),
    status,
    summaryText:
      status === "loss"
        ? "Shift ran at a net loss after accounting for fuel and expenses."
        : status === "warning"
        ? "High expense ratio. Fuel and operating costs are consuming over 40% of gross earnings."
        : "Healthy profit margin above standard benchmark running costs.",
  };
}

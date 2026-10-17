export type EarningsSummary = {
  gross: number;
  expenses: number;
  net: number;
};

function roundRupees(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

export function summarizeEarnings(gross: number, expenses: number): EarningsSummary {
  if (!Number.isFinite(gross) || !Number.isFinite(expenses) || gross < 0 || expenses < 0) {
    throw new RangeError("Earnings and expenses must be finite, non-negative numbers.");
  }

  const roundedGross = roundRupees(gross);
  const roundedExpenses = roundRupees(expenses);
  return {
    gross: roundedGross,
    expenses: roundedExpenses,
    net: roundRupees(roundedGross - roundedExpenses),
  };
}

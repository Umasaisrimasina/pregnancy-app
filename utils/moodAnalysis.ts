/**
 * moodAnalysis.ts
 *
 * Utility for computing mood status from mood snapshot data.
 * Extracted from PostPartumDashboard.tsx — pure business logic, no UI dependency.
 */

export const computeMoodStatus = (data: Array<{ day: string; value: number }> | null | undefined): string => {
  if (!data || data.length === 0) return 'Unknown';

  const values = data.map(d => d.value);
  const mean = values.reduce((sum, v) => sum + v, 0) / values.length;
  const variance = values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / values.length;
  const stdDev = Math.sqrt(variance);

  // Check if volatile (high variance)
  if (stdDev > 1.5) return 'Volatile';

  // Check trend: compare recent half vs earlier half
  const midPoint = Math.floor(values.length / 2);

  let recentAvg: number;
  let earlierAvg: number;

  if (values.length <= 1 || midPoint === 0) {
    const val = values.length === 1 ? values[0] : 0;
    recentAvg = val;
    earlierAvg = val;
  } else {
    recentAvg = values.slice(midPoint).reduce((sum, v) => sum + v, 0) / (values.length - midPoint);
    earlierAvg = values.slice(0, midPoint).reduce((sum, v) => sum + v, 0) / midPoint;
  }

  // Determine improving, declining, or stable
  const diff = recentAvg - earlierAvg;
  if (diff > 0.8) return 'Improving';
  if (diff < -0.8) return 'Declining';

  return 'Stable';
};

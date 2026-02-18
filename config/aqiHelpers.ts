/**
 * aqiHelpers.ts
 *
 * AQI (Air Quality Index) types and pure helper functions.
 * Shared across BabyCareDashboard and any future AQI consumers.
 */

// ── Types ────────────────────────────────────────────────────────────────

export interface AQIData {
  aqi: number;
  station: string;
  dominantPollutant: string;
  lastUpdated: string;
}

export interface AQIState {
  data: AQIData | null;
  loading: boolean;
  error: string | null;
}

// ── Helpers ──────────────────────────────────────────────────────────────

export const getAQICategory = (aqi: number): { label: string; color: string; bgColor: string; textColor: string } => {
  if (aqi <= 50) return { label: 'Good', color: 'bg-primary-500', bgColor: 'bg-primary-50', textColor: 'text-primary-700' };
  if (aqi <= 100) return { label: 'Moderate', color: 'bg-yellow-500', bgColor: 'bg-yellow-50', textColor: 'text-yellow-700' };
  if (aqi <= 150) return { label: 'Unhealthy for Sensitive', color: 'bg-orange-500', bgColor: 'bg-orange-50', textColor: 'text-orange-700' };
  if (aqi <= 200) return { label: 'Unhealthy', color: 'bg-red-500', bgColor: 'bg-red-50', textColor: 'text-red-700' };
  if (aqi <= 300) return { label: 'Very Unhealthy', color: 'bg-purple-500', bgColor: 'bg-purple-50', textColor: 'text-purple-700' };
  return { label: 'Hazardous', color: 'bg-[#7E0023]', bgColor: 'bg-[#7E0023]/10', textColor: 'text-[#7E0023]' };
};

export const getBabySafetyGuidance = (aqi: number): { message: string; icon: 'safe' | 'caution' | 'warning' | 'danger' } => {
  if (aqi <= 50) return { message: 'Safe for outdoor activities with baby', icon: 'safe' };
  if (aqi <= 100) return { message: 'Limit prolonged outdoor exposure for baby', icon: 'caution' };
  if (aqi <= 150) return { message: 'Avoid outdoor activity with baby if possible', icon: 'warning' };
  return { message: 'Stay indoors with baby, use mask or air purifier', icon: 'danger' };
};

export const formatPollutant = (pollutant: string): string => {
  const pollutantMap: Record<string, string> = {
    'pm25': 'PM2.5',
    'pm10': 'PM10',
    'o3': 'Ozone (O₃)',
    'no2': 'NO₂',
    'so2': 'SO₂',
    'co': 'CO',
  };
  return pollutantMap[pollutant?.toLowerCase()] || pollutant?.toUpperCase() || 'N/A';
};

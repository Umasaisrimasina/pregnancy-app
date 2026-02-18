/**
 * usePostPartumMood.ts
 *
 * Custom hook for Post-Partum mood & safety-alert computation.
 * Moves render-path calculations out of the UI component.
 */

import { useMemo } from 'react';
import { getCheckIns, detectNegativeStreak, generateDemoCheckIns } from '../services/sentimentService';
import { postPartumMoodData, postPartumSleepData } from '../config/dashboardData.config';
import { currentScreeningStatus } from '../config/epds.config';

export const usePostPartumMood = () => {
  const moodSnapshotData = postPartumMoodData;
  const sleepData = postPartumSleepData;

  const avgSleep = useMemo(
    () => {
      if (!sleepData || sleepData.length === 0) return "0.0";
      return (sleepData.reduce((sum, d) => sum + d.hours, 0) / sleepData.length).toFixed(1);
    },
    [sleepData],
  );

  const { checkIns, safetyAlert } = useMemo(() => {
    const stored = getCheckIns();
    const data = stored.length > 0 ? stored : generateDemoCheckIns();
    return { checkIns: data, safetyAlert: detectNegativeStreak(data, 3) };
  }, []);

  return { 
    moodSnapshotData, 
    sleepData, 
    avgSleep, 
    checkIns, 
    safetyAlert,
    screeningStatus: currentScreeningStatus.status,
    lastScreenedDate: currentScreeningStatus.lastScreenedDate,
  };
};

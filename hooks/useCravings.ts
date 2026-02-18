/**
 * useCravings.ts
 *
 * Custom hook for the Pregnancy Cravings Tracker.
 * Manages CRUD operations for craving items.
 */

import { useState } from 'react';

export interface Craving {
  id: number;
  food: string;
  intensity: 'mild' | 'moderate' | 'strong';
  timestamp: Date;
  satisfied: boolean;
}

export const useCravings = () => {
  const [cravings, setCravings] = useState<Craving[]>([
    { id: 1, food: 'Pickles', intensity: 'strong', timestamp: new Date(Date.now() - 86400000), satisfied: true },
    { id: 2, food: 'Ice Cream', intensity: 'moderate', timestamp: new Date(Date.now() - 172800000), satisfied: true },
    { id: 3, food: 'Spicy Food', intensity: 'mild', timestamp: new Date(Date.now() - 259200000), satisfied: false },
  ]);
  const [newCraving, setNewCraving] = useState('');
  const [newCravingIntensity, setNewCravingIntensity] = useState<'mild' | 'moderate' | 'strong'>('moderate');
  const [showCravingInput, setShowCravingInput] = useState(false);

  const addCraving = () => {
    if (!newCraving.trim()) return;
    setCravings((prev) => [
      { id: Date.now(), food: newCraving.trim(), intensity: newCravingIntensity, timestamp: new Date(), satisfied: false },
      ...prev,
    ]);
    setNewCraving('');
    setShowCravingInput(false);
  };

  const toggleCravingSatisfied = (id: number) => {
    setCravings((prev) => prev.map((c) => (c.id === id ? { ...c, satisfied: !c.satisfied } : c)));
  };

  const deleteCraving = (id: number) => {
    setCravings((prev) => prev.filter((c) => c.id !== id));
  };

  return {
    cravings,
    newCraving,
    setNewCraving,
    newCravingIntensity,
    setNewCravingIntensity,
    showCravingInput,
    setShowCravingInput,
    addCraving,
    toggleCravingSatisfied,
    deleteCraving,
  };
};

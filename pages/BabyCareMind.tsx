/**
 * BabyCareMind.tsx
 *
 * Baby-care phase Mind page — thin config wrapper.
 * All UI is delegated to MindPageShell.
 */

import React from 'react';
import { MindPageShell } from '../components/mind/MindPageShell';
import { babyCareMindConfig } from '../config/mindPage.config';

export const BabyCareMind: React.FC = () => (
  <MindPageShell config={babyCareMindConfig} />
);

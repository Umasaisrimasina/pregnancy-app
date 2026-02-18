/**
 * PregnancyMind.tsx
 *
 * Pregnancy phase Mind page — thin config wrapper.
 * All UI is delegated to MindPageShell.
 */

import React from 'react';
import { MindPageShell } from '../components/mind/MindPageShell';
import { pregnancyMindConfig } from '../config/mindPage.config';

export const PregnancyMind: React.FC = () => (
  <MindPageShell config={pregnancyMindConfig} />
);

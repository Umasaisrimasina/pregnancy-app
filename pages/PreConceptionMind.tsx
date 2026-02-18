/**
 * PreConceptionMind.tsx
 *
 * Pre-conception phase Mind page — thin config wrapper.
 * All UI is delegated to MindPageShell.
 */

import React from 'react';
import { MindPageShell } from '../components/mind/MindPageShell';
import { preConceptionMindConfig } from '../config/mindPage.config';

export const PreConceptionMind: React.FC = () => (
  <MindPageShell config={preConceptionMindConfig} />
);

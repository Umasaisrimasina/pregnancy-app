/**
 * Mind.tsx
 *
 * Generic Mind page (default/fallback) — thin config wrapper.
 * All UI is delegated to MindPageShell.
 */

import React from 'react';
import { MindPageShell } from '../components/mind/MindPageShell';
import { genericMindConfig } from '../config/mindPage.config';
import type { AppPhase } from '../types';

interface PageProps {
  phase: AppPhase;
}

export const Mind: React.FC<PageProps> = () => (
  <MindPageShell config={genericMindConfig} />
);

/**
 * EmergencyRiskCard.tsx
 *
 * Emergency Protocol banner with risk level + QR code.
 * Presentational — risk config + QR data via props.
 */

import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { AlertTriangle, Shield } from 'lucide-react';
import type { RiskLevelConfig } from '../../config/medicalView.config';

interface EmergencyRiskCardProps {
  riskConfig: RiskLevelConfig;
  riskLevel: string;
  patientName: string;
  patientId: string;
  qrUrl: string;
}

export const EmergencyRiskCard: React.FC<EmergencyRiskCardProps> = ({
  riskConfig,
  riskLevel,
  patientName,
  patientId,
  qrUrl,
}) => {
  const qrColor = riskLevel === 'high' ? '#ef4444' : riskLevel === 'moderate' ? '#f59e0b' : '#10b981';

  return (
    <div className={`rounded-[2rem] p-6 md:p-8 border-2 ${riskConfig.borderLight} ${riskConfig.bgLight} relative overflow-hidden`}>
      {/* Pulsing emergency glow */}
      <div className={`absolute top-0 right-0 w-40 h-40 ${riskConfig.bg} rounded-full blur-[100px] opacity-20 animate-pulse pointer-events-none`} />

      <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        {/* Left: Emergency Status */}
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <div className={`w-12 h-12 ${riskConfig.bg} rounded-2xl flex items-center justify-center shadow-lg ${riskConfig.glow}`}>
              <AlertTriangle size={24} className="text-white" aria-hidden="true" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">Emergency Risk Status</p>
              <h3 className={`text-xl font-display font-extrabold ${riskConfig.text}`}>
                {riskConfig.label}
              </h3>
            </div>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-lg">
            Emergency clinical summary for <strong>{patientName}</strong>. Scan QR code for full digital case history access during emergency admission.
          </p>
          <div className="mt-3 flex items-center gap-2">
            <Shield size={14} className="text-blue-500" />
            <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">Secure Access · ID: {patientId}</span>
          </div>
        </div>

        {/* Right: QR Code */}
        <div className="bg-white dark:bg-dm-muted rounded-2xl p-4 border border-slate-200 dark:border-dm-border shadow-sm flex flex-col items-center gap-2 shrink-0">
          <div aria-describedby={`qr-description-${patientId}`}>
            <QRCodeSVG
              value={qrUrl}
              size={120}
              level="H"
              includeMargin={false}
              bgColor="transparent"
              fgColor={qrColor}
            />
          </div>
          <span id={`qr-description-${patientId}`} className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
            Scan for Records
          </span>
          <span className="sr-only">
            QR code provides emergency access to digital case history for patient {patientName}, ID {patientId}
          </span>
        </div>
      </div>
    </div>
  );
};

/**
 * MedicalFilesCard.tsx
 *
 * Medical files/reports list section.
 * Presentational — file data via props.
 */

import React from 'react';
import type { MedicalFile } from '../../config/medicalView.config';

interface MedicalFilesCardProps {
  files: MedicalFile[];
  onFileClick?: (id: number) => void;
}

export const MedicalFilesCard: React.FC<MedicalFilesCardProps> = ({ files, onFileClick }) => {
  return (
    <div className="border-t border-slate-100 dark:border-dm-border pt-8">
      <h3 className="font-bold text-slate-900 dark:text-dm-foreground mb-4">Medical Files &amp; Reports</h3>
      <div className="space-y-3">
        {files.map((file) => (
          <button
            key={file.id}
            type="button"
            onClick={() => onFileClick?.(file.id)}
            aria-label={`Open file: ${file.title}`}
            className="flex items-center gap-4 p-4 border border-slate-100 dark:border-dm-border rounded-xl hover:bg-slate-50 dark:hover:bg-dm-muted transition-colors cursor-pointer group w-full text-left"
          >
            <div className="w-10 h-10 bg-primary-50 dark:bg-primary-800/20 text-primary-400 rounded-lg flex items-center justify-center font-bold text-xs uppercase group-hover:bg-primary-100 dark:group-hover:bg-primary-800/40 transition-colors">
              {file.label}
            </div>
            <div>
              <h4 className="font-bold text-slate-900 dark:text-dm-foreground text-sm">{file.title}</h4>
              <p className="text-xs text-slate-500 dark:text-slate-500">Uploaded {file.uploadedAgo}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

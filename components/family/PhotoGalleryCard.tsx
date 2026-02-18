/**
 * PhotoGalleryCard.tsx
 *
 * Responsive photo grid with hover-zoom effect.
 * Extracted from FamilyDashboard's inline "Latest Shared Photos" block.
 * Presentational — image URLs via props, no internal state.
 */

import React from 'react';

interface PhotoGalleryCardProps {
  title?: string;
  photos: string[];
}

export const PhotoGalleryCard: React.FC<PhotoGalleryCardProps> = ({
  title = 'Latest Shared Photos',
  photos,
}) => {
  if (photos.length === 0) return null;

  return (
    <div className="bg-white dark:bg-dm-card rounded-[2rem] p-8 border border-slate-100 dark:border-dm-border">
      <h3 className="font-bold text-slate-900 dark:text-dm-foreground text-lg mb-6">{title}</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {photos.map((src, i) => (
          <div
            key={i}
            className="aspect-square rounded-2xl overflow-hidden relative group cursor-pointer"
          >
            <img
              src={src}
              alt="Family memory"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        ))}
      </div>
    </div>
  );
};

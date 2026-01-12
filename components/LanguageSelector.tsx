/**
 * LanguageSelector.tsx
 * 
 * Dropdown component for selecting the app language.
 * Displays current language and allows switching between supported languages.
 */

import React, { useState, useRef, useEffect } from 'react';
import { Globe, ChevronDown, Check, Volume2 } from 'lucide-react';
import { useLanguage, SUPPORTED_LANGUAGES, LanguageOption } from '../contexts/LanguageContext';

interface LanguageSelectorProps {
  /** Compact mode for mobile/sidebar */
  compact?: boolean;
  /** Additional className */
  className?: string;
}

/**
 * LanguageSelector Component
 * 
 * A dropdown menu for selecting the app's display language.
 * Shows native language names for better accessibility.
 */
export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  compact = false,
  className = ''
}) => {
  const { currentLanguage, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle language selection
  const handleSelect = (language: LanguageOption) => {
    setLanguage(language);
    setIsOpen(false);
  };

  // Handle keyboard navigation
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      setIsOpen(false);
    } else if (event.key === 'Enter' || event.key === ' ') {
      setIsOpen(!isOpen);
    }
  };

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        className={`
          flex items-center gap-2
          px-3 py-2 rounded-xl
          bg-white/80 backdrop-blur-sm
          border border-slate-200
          hover:border-emerald-300 hover:bg-emerald-50/50
          transition-all duration-200
          focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2
          ${isOpen ? 'border-emerald-400 bg-emerald-50' : ''}
        `}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label="Select language"
      >
        <Globe size={18} className="text-emerald-600" />
        {!compact && (
          <>
            <span className="text-sm font-medium text-slate-700">
              {currentLanguage.nativeName}
            </span>
            <ChevronDown 
              size={16} 
              className={`text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
            />
          </>
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div 
          className="
            absolute top-full mt-2 right-0 z-50
            min-w-[200px] max-h-[400px] overflow-y-auto
            bg-white rounded-2xl shadow-xl
            border border-slate-100
            py-2
            animate-in fade-in slide-in-from-top-2 duration-200
          "
          role="listbox"
          aria-label="Available languages"
        >
          {/* Header */}
          <div className="px-4 py-2 border-b border-slate-100 mb-2">
            <div className="flex items-center gap-2">
              <Volume2 size={14} className="text-emerald-500" />
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Select Language
              </span>
            </div>
          </div>

          {/* Language Options */}
          {SUPPORTED_LANGUAGES.map((language) => (
            <button
              key={language.code}
              onClick={() => handleSelect(language)}
              className={`
                w-full flex items-center justify-between
                px-4 py-3
                text-left
                hover:bg-emerald-50
                transition-colors duration-150
                ${currentLanguage.code === language.code ? 'bg-emerald-50' : ''}
              `}
              role="option"
              aria-selected={currentLanguage.code === language.code}
            >
              <div className="flex flex-col">
                <span className={`
                  text-sm font-medium
                  ${currentLanguage.code === language.code ? 'text-emerald-700' : 'text-slate-700'}
                `}>
                  {language.nativeName}
                </span>
                <span className="text-xs text-slate-400">
                  {language.name}
                </span>
              </div>
              {currentLanguage.code === language.code && (
                <Check size={16} className="text-emerald-600" />
              )}
            </button>
          ))}

          {/* Footer */}
          <div className="px-4 py-2 border-t border-slate-100 mt-2">
            <p className="text-[10px] text-slate-400 text-center">
              Audio will be spoken in selected language
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * Compact Language Selector for sidebar
 */
export const CompactLanguageSelector: React.FC = () => {
  const { currentLanguage, setLanguage } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(
    SUPPORTED_LANGUAGES.findIndex(lang => lang.code === currentLanguage.code)
  );

  // Cycle through languages on click
  const handleClick = () => {
    const nextIndex = (currentIndex + 1) % SUPPORTED_LANGUAGES.length;
    setCurrentIndex(nextIndex);
    setLanguage(SUPPORTED_LANGUAGES[nextIndex]);
  };

  return (
    <button
      onClick={handleClick}
      className="
        flex items-center gap-2
        p-2 rounded-xl
        bg-slate-100 hover:bg-emerald-100
        transition-colors duration-200
        group
      "
      title={`Current: ${currentLanguage.name} - Click to change`}
    >
      <Globe size={18} className="text-slate-500 group-hover:text-emerald-600" />
      <span className="text-xs font-bold text-slate-600 group-hover:text-emerald-700 uppercase">
        {currentLanguage.code}
      </span>
    </button>
  );
};

export default LanguageSelector;

/**
 * LanguageContext.tsx
 * 
 * Global language context for multilingual support.
 * Stores the selected language in app state and localStorage.
 * Supports Indian languages: English, Hindi, Tamil, Telugu, Kannada, Malayalam, Bengali, Marathi, Gujarati
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Supported languages with their Azure TTS voice codes
export interface LanguageOption {
  code: string;           // Language code for translation API
  name: string;           // Display name in English
  nativeName: string;     // Display name in native script
  voiceCode: string;      // Azure TTS voice name
  speechCode: string;     // Azure Speech recognition code
}

// All supported Indian languages
export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { 
    code: 'en', 
    name: 'English', 
    nativeName: 'English',
    voiceCode: 'en-US-JennyNeural',
    speechCode: 'en-US'
  },
  { 
    code: 'hi', 
    name: 'Hindi', 
    nativeName: 'हिन्दी',
    voiceCode: 'hi-IN-SwaraNeural',
    speechCode: 'hi-IN'
  },
  { 
    code: 'ta', 
    name: 'Tamil', 
    nativeName: 'தமிழ்',
    voiceCode: 'ta-IN-PallaviNeural',
    speechCode: 'ta-IN'
  },
  { 
    code: 'te', 
    name: 'Telugu', 
    nativeName: 'తెలుగు',
    voiceCode: 'te-IN-ShrutiNeural',
    speechCode: 'te-IN'
  },
  { 
    code: 'kn', 
    name: 'Kannada', 
    nativeName: 'ಕನ್ನಡ',
    voiceCode: 'kn-IN-SapnaNeural',
    speechCode: 'kn-IN'
  },
  { 
    code: 'ml', 
    name: 'Malayalam', 
    nativeName: 'മലയാളം',
    voiceCode: 'ml-IN-SobhanaNeural',
    speechCode: 'ml-IN'
  },
  { 
    code: 'bn', 
    name: 'Bengali', 
    nativeName: 'বাংলা',
    voiceCode: 'bn-IN-TanishaaNeural',
    speechCode: 'bn-IN'
  },
  { 
    code: 'mr', 
    name: 'Marathi', 
    nativeName: 'मराठी',
    voiceCode: 'mr-IN-AarohiNeural',
    speechCode: 'mr-IN'
  },
  { 
    code: 'gu', 
    name: 'Gujarati', 
    nativeName: 'ગુજરાતી',
    voiceCode: 'gu-IN-DhwaniNeural',
    speechCode: 'gu-IN'
  },
  { 
    code: 'pa', 
    name: 'Punjabi', 
    nativeName: 'ਪੰਜਾਬੀ',
    voiceCode: 'pa-IN-GurpreetNeural',
    speechCode: 'pa-IN'
  },
  { 
    code: 'or', 
    name: 'Odia', 
    nativeName: 'ଓଡ଼ିଆ',
    voiceCode: 'or-IN-SubhasiniNeural',
    speechCode: 'or-IN'
  }
];

// Storage key for localStorage
const LANGUAGE_STORAGE_KEY = 'pregnancy_app_language';

// Context interface
interface LanguageContextType {
  currentLanguage: LanguageOption;
  setLanguage: (language: LanguageOption) => void;
  getLanguageByCode: (code: string) => LanguageOption;
  isLoading: boolean;
}

// Create the context with default values
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Provider props
interface LanguageProviderProps {
  children: ReactNode;
}

/**
 * LanguageProvider Component
 * Wraps the app to provide global language state
 */
export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState<LanguageOption>(SUPPORTED_LANGUAGES[0]);
  const [isLoading, setIsLoading] = useState(true);

  // Load saved language from localStorage on mount
  useEffect(() => {
    try {
      const savedLanguageCode = localStorage.getItem(LANGUAGE_STORAGE_KEY);
      if (savedLanguageCode) {
        const savedLanguage = SUPPORTED_LANGUAGES.find(lang => lang.code === savedLanguageCode);
        if (savedLanguage) {
          setCurrentLanguage(savedLanguage);
        }
      }
    } catch (error) {
      console.error('Error loading language from localStorage:', error);
    }
    setIsLoading(false);
  }, []);

  // Save language to localStorage whenever it changes
  const setLanguage = (language: LanguageOption) => {
    setCurrentLanguage(language);
    try {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, language.code);
    } catch (error) {
      console.error('Error saving language to localStorage:', error);
    }
  };

  // Helper function to get language by code
  const getLanguageByCode = (code: string): LanguageOption => {
    return SUPPORTED_LANGUAGES.find(lang => lang.code === code) || SUPPORTED_LANGUAGES[0];
  };

  const value: LanguageContextType = {
    currentLanguage,
    setLanguage,
    getLanguageByCode,
    isLoading
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

/**
 * Custom hook to use the language context
 * Must be used within a LanguageProvider
 */
export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export default LanguageContext;

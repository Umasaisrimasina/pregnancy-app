import { useLanguage } from '../contexts/LanguageContext';
import { en } from '../locales/en';

// Simple translation registry
const translations: Record<string, any> = {
  en: en,
  // Add other languages here as needed, falling back to English for now
};

export const useTranslation = () => {
  const { currentLanguage } = useLanguage();
  
  // Basic nested key retrieval: "baby_myths.myth1.myth" -> en.baby_myths.myth1.myth
  const t = (key: string): string => {
    const lang = currentLanguage?.code || 'en';
    // Fallback to 'en' if the selected language doesn't have translations yet
    const dictionary = translations[lang] || translations['en'];
    
    const parts = key.split('.');
    let value = dictionary;
    
    for (const part of parts) {
      if (value && typeof value === 'object' && part in value) {
        value = value[part];
      } else {
        // Fallback to English if missing in target language
        if (lang !== 'en') {
          let fallbackValue = translations['en'];
          for (const fallbackPart of parts) {
             if (fallbackValue && typeof fallbackValue === 'object' && fallbackPart in fallbackValue) {
               fallbackValue = fallbackValue[fallbackPart];
             } else {
               return key; // Not found in En either
             }
          }
          return typeof fallbackValue === 'string' ? fallbackValue : key;
        }
        return key;
      }
    }
    
    return typeof value === 'string' ? value : key;
  };

  return { t };
};

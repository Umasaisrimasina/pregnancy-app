/**
 * languageUtils.ts
 * 
 * Helper functions for language and voice mapping.
 * Provides utilities for working with Azure Translation and TTS services.
 */

/**
 * Language configuration interface
 */
export interface LanguageConfig {
  code: string;           // ISO language code
  name: string;           // English name
  nativeName: string;     // Native script name
  translatorCode: string; // Azure Translator language code
  speechLocale: string;   // Azure Speech locale code
  voiceName: string;      // Azure Neural voice name
  voiceGender: 'female' | 'male';
}

/**
 * Complete mapping of supported Indian languages with Azure service codes
 */
export const LANGUAGE_CONFIGS: Record<string, LanguageConfig> = {
  en: {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    translatorCode: 'en',
    speechLocale: 'en-US',
    voiceName: 'en-US-JennyNeural',
    voiceGender: 'female'
  },
  hi: {
    code: 'hi',
    name: 'Hindi',
    nativeName: 'हिन्दी',
    translatorCode: 'hi',
    speechLocale: 'hi-IN',
    voiceName: 'hi-IN-SwaraNeural',
    voiceGender: 'female'
  },
  ta: {
    code: 'ta',
    name: 'Tamil',
    nativeName: 'தமிழ்',
    translatorCode: 'ta',
    speechLocale: 'ta-IN',
    voiceName: 'ta-IN-PallaviNeural',
    voiceGender: 'female'
  },
  te: {
    code: 'te',
    name: 'Telugu',
    nativeName: 'తెలుగు',
    translatorCode: 'te',
    speechLocale: 'te-IN',
    voiceName: 'te-IN-ShrutiNeural',
    voiceGender: 'female'
  },
  kn: {
    code: 'kn',
    name: 'Kannada',
    nativeName: 'ಕನ್ನಡ',
    translatorCode: 'kn',
    speechLocale: 'kn-IN',
    voiceName: 'kn-IN-SapnaNeural',
    voiceGender: 'female'
  },
  ml: {
    code: 'ml',
    name: 'Malayalam',
    nativeName: 'മലയാളം',
    translatorCode: 'ml',
    speechLocale: 'ml-IN',
    voiceName: 'ml-IN-SobhanaNeural',
    voiceGender: 'female'
  },
  bn: {
    code: 'bn',
    name: 'Bengali',
    nativeName: 'বাংলা',
    translatorCode: 'bn',
    speechLocale: 'bn-IN',
    voiceName: 'bn-IN-TanishaaNeural',
    voiceGender: 'female'
  },
  mr: {
    code: 'mr',
    name: 'Marathi',
    nativeName: 'मराठी',
    translatorCode: 'mr',
    speechLocale: 'mr-IN',
    voiceName: 'mr-IN-AarohiNeural',
    voiceGender: 'female'
  },
  gu: {
    code: 'gu',
    name: 'Gujarati',
    nativeName: 'ગુજરાતી',
    translatorCode: 'gu',
    speechLocale: 'gu-IN',
    voiceName: 'gu-IN-DhwaniNeural',
    voiceGender: 'female'
  },
  pa: {
    code: 'pa',
    name: 'Punjabi',
    nativeName: 'ਪੰਜਾਬੀ',
    translatorCode: 'pa',
    speechLocale: 'pa-IN',
    voiceName: 'pa-IN-GurpreetNeural',
    voiceGender: 'female'
  },
  or: {
    code: 'or',
    name: 'Odia',
    nativeName: 'ଓଡ଼ିଆ',
    translatorCode: 'or',
    speechLocale: 'or-IN',
    voiceName: 'or-IN-SubhasiniNeural',
    voiceGender: 'female'
  }
};

/**
 * Get language configuration by code
 * @param code - Language code (e.g., 'hi', 'ta')
 * @returns Language configuration or English as fallback
 */
export const getLanguageConfig = (code: string): LanguageConfig => {
  return LANGUAGE_CONFIGS[code] || LANGUAGE_CONFIGS['en'];
};

/**
 * Get voice name for a language
 * @param languageCode - Language code
 * @returns Azure Neural voice name
 */
export const getVoiceName = (languageCode: string): string => {
  const config = getLanguageConfig(languageCode);
  return config.voiceName;
};

/**
 * Get speech locale for a language
 * @param languageCode - Language code
 * @returns Azure Speech locale code
 */
export const getSpeechLocale = (languageCode: string): string => {
  const config = getLanguageConfig(languageCode);
  return config.speechLocale;
};

/**
 * Get translator code for a language
 * @param languageCode - Language code
 * @returns Azure Translator language code
 */
export const getTranslatorCode = (languageCode: string): string => {
  const config = getLanguageConfig(languageCode);
  return config.translatorCode;
};

/**
 * Get all supported language codes
 * @returns Array of language codes
 */
export const getSupportedLanguageCodes = (): string[] => {
  return Object.keys(LANGUAGE_CONFIGS);
};

/**
 * Get all supported languages as options for dropdown
 * @returns Array of language options
 */
export const getLanguageOptions = (): Array<{ value: string; label: string; nativeLabel: string }> => {
  return Object.values(LANGUAGE_CONFIGS).map(config => ({
    value: config.code,
    label: config.name,
    nativeLabel: config.nativeName
  }));
};

/**
 * Check if a language code is supported
 * @param code - Language code to check
 * @returns boolean
 */
export const isLanguageSupported = (code: string): boolean => {
  return code in LANGUAGE_CONFIGS;
};

/**
 * Build SSML for Azure TTS
 * @param text - Text to speak
 * @param languageCode - Language code
 * @param options - Optional SSML options
 * @returns SSML string
 */
export const buildSSML = (
  text: string,
  languageCode: string,
  options?: {
    rate?: string;    // e.g., '0.9', '1.1'
    pitch?: string;   // e.g., '+5%', '-5%'
    volume?: string;  // e.g., 'soft', 'loud'
  }
): string => {
  const config = getLanguageConfig(languageCode);
  const rate = options?.rate || '0.95';
  const pitch = options?.pitch || '0%';
  const volume = options?.volume || 'default';

  // Escape XML special characters
  const escapedText = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

  return `
<speak version='1.0' xmlns='http://www.w3.org/2001/10/synthesis' xml:lang='${config.speechLocale}'>
  <voice name='${config.voiceName}'>
    <prosody rate='${rate}' pitch='${pitch}' volume='${volume}'>
      ${escapedText}
    </prosody>
  </voice>
</speak>`.trim();
};

export default {
  LANGUAGE_CONFIGS,
  getLanguageConfig,
  getVoiceName,
  getSpeechLocale,
  getTranslatorCode,
  getSupportedLanguageCodes,
  getLanguageOptions,
  isLanguageSupported,
  buildSSML
};

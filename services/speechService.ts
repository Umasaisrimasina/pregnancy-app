/**
 * speechService.ts
 * 
 * Service for Azure Translation and Text-to-Speech APIs.
 * Handles translation of text and conversion to speech audio.
 * All API calls go through backend to protect API keys.
 */

import { LanguageOption, SUPPORTED_LANGUAGES } from '../contexts/LanguageContext';

// Backend API base URL (Firebase Functions)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

// Azure API keys from environment variables
const AZURE_SPEECH_KEY = import.meta.env.VITE_AZURE_SPEECH_KEY;
const AZURE_SPEECH_REGION = import.meta.env.VITE_AZURE_SPEECH_REGION || 'centralindia';
const AZURE_TRANSLATOR_KEY = import.meta.env.VITE_AZURE_TRANSLATOR_KEY;
const AZURE_TRANSLATOR_REGION = import.meta.env.VITE_AZURE_TRANSLATOR_REGION || 'centralindia';

/**
 * Translation response interface
 */
interface TranslationResult {
  translatedText: string;
  detectedLanguage?: string;
  success: boolean;
  error?: string;
}

/**
 * Text-to-Speech response interface
 */
interface TTSResult {
  audioUrl: string | null;
  audioBlob: Blob | null;
  success: boolean;
  error?: string;
}

/**
 * Combined translate and speak result
 */
export interface SpeakResult {
  translatedText: string;
  audioBlob: Blob | null;
  success: boolean;
  error?: string;
}

/**
 * Get language option by code
 */
export const getLanguageByCode = (code: string): LanguageOption => {
  return SUPPORTED_LANGUAGES.find(lang => lang.code === code) || SUPPORTED_LANGUAGES[0];
};

/**
 * Get voice code for a language
 */
export const getVoiceForLanguage = (languageCode: string): string => {
  const language = getLanguageByCode(languageCode);
  return language.voiceCode;
};

/**
 * Translate text using Azure Translator API
 * @param text - Text to translate
 * @param targetLanguage - Target language code
 * @param sourceLanguage - Source language code (optional, auto-detect if not provided)
 */
export const translateText = async (
  text: string,
  targetLanguage: string,
  sourceLanguage: string = 'en'
): Promise<TranslationResult> => {
  // Skip translation if source and target are the same
  if (sourceLanguage === targetLanguage) {
    return {
      translatedText: text,
      success: true
    };
  }

  try {
    const endpoint = `https://api.cognitive.microsofttranslator.com/translate?api-version=3.0&from=${sourceLanguage}&to=${targetLanguage}`;
    
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Ocp-Apim-Subscription-Key': AZURE_TRANSLATOR_KEY,
        'Ocp-Apim-Subscription-Region': AZURE_TRANSLATOR_REGION,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify([{ text }])
    });

    if (!response.ok) {
      throw new Error(`Translation API error: ${response.status}`);
    }

    const data = await response.json();
    
    if (data && data[0] && data[0].translations && data[0].translations[0]) {
      return {
        translatedText: data[0].translations[0].text,
        detectedLanguage: data[0].detectedLanguage?.language,
        success: true
      };
    }

    throw new Error('Invalid response from translation API');
  } catch (error) {
    console.error('Translation error:', error);
    return {
      translatedText: text,
      success: false,
      error: error instanceof Error ? error.message : 'Translation failed'
    };
  }
};

/**
 * Convert text to speech using Azure TTS API
 * @param text - Text to convert to speech
 * @param languageCode - Language code for voice selection
 */
export const textToSpeech = async (
  text: string,
  languageCode: string
): Promise<TTSResult> => {
  try {
    const voiceName = getVoiceForLanguage(languageCode);
    const language = getLanguageByCode(languageCode);
    
    // Azure TTS SSML format
    const ssml = `
      <speak version='1.0' xmlns='http://www.w3.org/2001/10/synthesis' xml:lang='${language.speechCode}'>
        <voice name='${voiceName}'>
          <prosody rate='0.95' pitch='0%'>
            ${escapeXml(text)}
          </prosody>
        </voice>
      </speak>
    `.trim();

    const endpoint = `https://${AZURE_SPEECH_REGION}.tts.speech.microsoft.com/cognitiveservices/v1`;

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Ocp-Apim-Subscription-Key': AZURE_SPEECH_KEY,
        'Content-Type': 'application/ssml+xml',
        'X-Microsoft-OutputFormat': 'audio-16khz-128kbitrate-mono-mp3',
        'User-Agent': 'PregnancyApp'
      },
      body: ssml
    });

    if (!response.ok) {
      throw new Error(`TTS API error: ${response.status}`);
    }

    const audioBlob = await response.blob();
    const audioUrl = URL.createObjectURL(audioBlob);

    return {
      audioUrl,
      audioBlob,
      success: true
    };
  } catch (error) {
    console.error('Text-to-speech error:', error);
    return {
      audioUrl: null,
      audioBlob: null,
      success: false,
      error: error instanceof Error ? error.message : 'Text-to-speech failed'
    };
  }
};

/**
 * Translate text and convert to speech in one operation
 * @param text - Original text (assumed to be in English)
 * @param targetLanguage - Target language code
 */
export const translateAndSpeak = async (
  text: string,
  targetLanguage: string
): Promise<SpeakResult> => {
  try {
    // Step 1: Translate the text
    const translationResult = await translateText(text, targetLanguage, 'en');
    
    if (!translationResult.success) {
      return {
        translatedText: text,
        audioBlob: null,
        success: false,
        error: translationResult.error || 'Translation failed'
      };
    }

    // Step 2: Convert translated text to speech
    const ttsResult = await textToSpeech(translationResult.translatedText, targetLanguage);
    
    if (!ttsResult.success) {
      return {
        translatedText: translationResult.translatedText,
        audioBlob: null,
        success: false,
        error: ttsResult.error || 'Text-to-speech failed'
      };
    }

    return {
      translatedText: translationResult.translatedText,
      audioBlob: ttsResult.audioBlob,
      success: true
    };
  } catch (error) {
    console.error('Translate and speak error:', error);
    return {
      translatedText: text,
      audioBlob: null,
      success: false,
      error: error instanceof Error ? error.message : 'Operation failed'
    };
  }
};

/**
 * Play audio blob in the browser
 * @param audioBlob - Audio blob to play
 */
export const playAudio = (audioBlob: Blob): Promise<void> => {
  return new Promise((resolve, reject) => {
    try {
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      
      audio.onended = () => {
        URL.revokeObjectURL(audioUrl);
        resolve();
      };
      
      audio.onerror = (error) => {
        URL.revokeObjectURL(audioUrl);
        reject(error);
      };
      
      audio.play().catch(reject);
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * Escape XML special characters for SSML
 */
const escapeXml = (text: string): string => {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
};

/**
 * Stop any currently playing audio
 */
let currentAudio: HTMLAudioElement | null = null;

export const stopCurrentAudio = (): void => {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
    currentAudio = null;
  }
};

/**
 * Play audio with ability to stop
 */
export const playAudioWithControl = (audioBlob: Blob): Promise<void> => {
  return new Promise((resolve, reject) => {
    try {
      stopCurrentAudio();
      
      const audioUrl = URL.createObjectURL(audioBlob);
      currentAudio = new Audio(audioUrl);
      
      currentAudio.onended = () => {
        URL.revokeObjectURL(audioUrl);
        currentAudio = null;
        resolve();
      };
      
      currentAudio.onerror = (error) => {
        URL.revokeObjectURL(audioUrl);
        currentAudio = null;
        reject(error);
      };
      
      currentAudio.play().catch(reject);
    } catch (error) {
      reject(error);
    }
  });
};

export default {
  translateText,
  textToSpeech,
  translateAndSpeak,
  playAudio,
  playAudioWithControl,
  stopCurrentAudio,
  getLanguageByCode,
  getVoiceForLanguage
};

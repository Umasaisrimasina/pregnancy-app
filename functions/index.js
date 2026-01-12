/**
 * Firebase Cloud Functions for PreConceive App
 * 
 * Provides secure backend endpoints for:
 * - Text Translation (Azure Translator)
 * - Text-to-Speech (Azure Speech Services)
 * 
 * API keys are stored securely in Firebase environment config
 */

const {setGlobalOptions} = require("firebase-functions");
const {onRequest} = require("firebase-functions/https");
const logger = require("firebase-functions/logger");

// Set global options for cost control
setGlobalOptions({ maxInstances: 10 });

// CORS headers for cross-origin requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

/**
 * Language configuration for supported Indian languages
 */
const LANGUAGE_CONFIG = {
  en: { voiceName: 'en-US-JennyNeural', locale: 'en-US' },
  hi: { voiceName: 'hi-IN-SwaraNeural', locale: 'hi-IN' },
  ta: { voiceName: 'ta-IN-PallaviNeural', locale: 'ta-IN' },
  te: { voiceName: 'te-IN-ShrutiNeural', locale: 'te-IN' },
  kn: { voiceName: 'kn-IN-SapnaNeural', locale: 'kn-IN' },
  ml: { voiceName: 'ml-IN-SobhanaNeural', locale: 'ml-IN' },
  bn: { voiceName: 'bn-IN-TanishaaNeural', locale: 'bn-IN' },
  mr: { voiceName: 'mr-IN-AarohiNeural', locale: 'mr-IN' },
  gu: { voiceName: 'gu-IN-DhwaniNeural', locale: 'gu-IN' },
  pa: { voiceName: 'pa-IN-GurpreetNeural', locale: 'pa-IN' },
  or: { voiceName: 'or-IN-SubhasiniNeural', locale: 'or-IN' },
};

/**
 * Get language config with fallback to English
 */
const getLanguageConfig = (code) => {
  return LANGUAGE_CONFIG[code] || LANGUAGE_CONFIG['en'];
};

/**
 * Escape XML special characters for SSML
 */
const escapeXml = (text) => {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
};

/**
 * Translation API Endpoint
 * 
 * POST /translate
 * Body: { text: string, targetLanguage: string, sourceLanguage?: string }
 * Response: { translatedText: string, success: boolean }
 */
exports.translate = onRequest({ cors: true }, async (request, response) => {
  // Handle CORS preflight
  if (request.method === 'OPTIONS') {
    response.set(corsHeaders);
    response.status(204).send('');
    return;
  }

  try {
    const { text, targetLanguage, sourceLanguage = 'en' } = request.body;

    // Validate input
    if (!text || !targetLanguage) {
      response.status(400).json({
        success: false,
        error: 'Missing required fields: text and targetLanguage'
      });
      return;
    }

    // Skip translation if source and target are the same
    if (sourceLanguage === targetLanguage) {
      response.json({
        translatedText: text,
        success: true
      });
      return;
    }

    // Azure Translator API configuration
    const AZURE_TRANSLATOR_KEY = process.env.AZURE_TRANSLATOR_KEY;
    const AZURE_TRANSLATOR_REGION = process.env.AZURE_TRANSLATOR_REGION || 'centralindia';

    if (!AZURE_TRANSLATOR_KEY) {
      logger.error('Azure Translator key not configured');
      response.status(500).json({
        success: false,
        error: 'Translation service not configured'
      });
      return;
    }

    // Call Azure Translator API
    const endpoint = `https://api.cognitive.microsofttranslator.com/translate?api-version=3.0&from=${sourceLanguage}&to=${targetLanguage}`;

    const translationResponse = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Ocp-Apim-Subscription-Key': AZURE_TRANSLATOR_KEY,
        'Ocp-Apim-Subscription-Region': AZURE_TRANSLATOR_REGION,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify([{ text }])
    });

    if (!translationResponse.ok) {
      throw new Error(`Translation API error: ${translationResponse.status}`);
    }

    const data = await translationResponse.json();

    if (data && data[0] && data[0].translations && data[0].translations[0]) {
      response.json({
        translatedText: data[0].translations[0].text,
        detectedLanguage: data[0].detectedLanguage?.language,
        success: true
      });
    } else {
      throw new Error('Invalid response from translation API');
    }

  } catch (error) {
    logger.error('Translation error:', error);
    response.status(500).json({
      success: false,
      error: error.message || 'Translation failed'
    });
  }
});

/**
 * Text-to-Speech API Endpoint
 * 
 * POST /textToSpeech
 * Body: { text: string, languageCode: string }
 * Response: Audio file (audio/mpeg)
 */
exports.textToSpeech = onRequest({ cors: true }, async (request, response) => {
  // Handle CORS preflight
  if (request.method === 'OPTIONS') {
    response.set(corsHeaders);
    response.status(204).send('');
    return;
  }

  try {
    const { text, languageCode = 'en' } = request.body;

    // Validate input
    if (!text) {
      response.status(400).json({
        success: false,
        error: 'Missing required field: text'
      });
      return;
    }

    // Azure Speech API configuration
    const AZURE_SPEECH_KEY = process.env.AZURE_SPEECH_KEY;
    const AZURE_SPEECH_REGION = process.env.AZURE_SPEECH_REGION || 'centralindia';

    if (!AZURE_SPEECH_KEY) {
      logger.error('Azure Speech key not configured');
      response.status(500).json({
        success: false,
        error: 'Speech service not configured'
      });
      return;
    }

    // Get voice configuration
    const config = getLanguageConfig(languageCode);

    // Build SSML
    const ssml = `
      <speak version='1.0' xmlns='http://www.w3.org/2001/10/synthesis' xml:lang='${config.locale}'>
        <voice name='${config.voiceName}'>
          <prosody rate='0.95' pitch='0%'>
            ${escapeXml(text)}
          </prosody>
        </voice>
      </speak>
    `.trim();

    // Call Azure TTS API
    const endpoint = `https://${AZURE_SPEECH_REGION}.tts.speech.microsoft.com/cognitiveservices/v1`;

    const ttsResponse = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Ocp-Apim-Subscription-Key': AZURE_SPEECH_KEY,
        'Content-Type': 'application/ssml+xml',
        'X-Microsoft-OutputFormat': 'audio-16khz-128kbitrate-mono-mp3',
        'User-Agent': 'PreConceiveApp'
      },
      body: ssml
    });

    if (!ttsResponse.ok) {
      throw new Error(`TTS API error: ${ttsResponse.status}`);
    }

    // Get audio buffer
    const audioBuffer = await ttsResponse.arrayBuffer();

    // Set response headers for audio
    response.set({
      'Content-Type': 'audio/mpeg',
      'Content-Length': audioBuffer.byteLength,
      'Cache-Control': 'public, max-age=3600'
    });

    // Send audio data
    response.send(Buffer.from(audioBuffer));

  } catch (error) {
    logger.error('Text-to-speech error:', error);
    response.status(500).json({
      success: false,
      error: error.message || 'Text-to-speech failed'
    });
  }
});

/**
 * Combined Translate and Speak Endpoint
 * 
 * POST /translateAndSpeak
 * Body: { text: string, targetLanguage: string }
 * Response: Audio file (audio/mpeg)
 */
exports.translateAndSpeak = onRequest({ cors: true }, async (request, response) => {
  // Handle CORS preflight
  if (request.method === 'OPTIONS') {
    response.set(corsHeaders);
    response.status(204).send('');
    return;
  }

  try {
    const { text, targetLanguage = 'en' } = request.body;

    // Validate input
    if (!text) {
      response.status(400).json({
        success: false,
        error: 'Missing required field: text'
      });
      return;
    }

    // Azure API configuration
    const AZURE_TRANSLATOR_KEY = process.env.AZURE_TRANSLATOR_KEY;
    const AZURE_TRANSLATOR_REGION = process.env.AZURE_TRANSLATOR_REGION || 'centralindia';
    const AZURE_SPEECH_KEY = process.env.AZURE_SPEECH_KEY;
    const AZURE_SPEECH_REGION = process.env.AZURE_SPEECH_REGION || 'centralindia';

    if (!AZURE_TRANSLATOR_KEY || !AZURE_SPEECH_KEY) {
      logger.error('Azure API keys not configured');
      response.status(500).json({
        success: false,
        error: 'Services not configured'
      });
      return;
    }

    // Step 1: Translate (if not English)
    let translatedText = text;
    
    if (targetLanguage !== 'en') {
      const translationEndpoint = `https://api.cognitive.microsofttranslator.com/translate?api-version=3.0&from=en&to=${targetLanguage}`;

      const translationResponse = await fetch(translationEndpoint, {
        method: 'POST',
        headers: {
          'Ocp-Apim-Subscription-Key': AZURE_TRANSLATOR_KEY,
          'Ocp-Apim-Subscription-Region': AZURE_TRANSLATOR_REGION,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify([{ text }])
      });

      if (translationResponse.ok) {
        const translationData = await translationResponse.json();
        if (translationData[0]?.translations?.[0]?.text) {
          translatedText = translationData[0].translations[0].text;
        }
      }
    }

    // Step 2: Convert to speech
    const config = getLanguageConfig(targetLanguage);

    const ssml = `
      <speak version='1.0' xmlns='http://www.w3.org/2001/10/synthesis' xml:lang='${config.locale}'>
        <voice name='${config.voiceName}'>
          <prosody rate='0.95' pitch='0%'>
            ${escapeXml(translatedText)}
          </prosody>
        </voice>
      </speak>
    `.trim();

    const ttsEndpoint = `https://${AZURE_SPEECH_REGION}.tts.speech.microsoft.com/cognitiveservices/v1`;

    const ttsResponse = await fetch(ttsEndpoint, {
      method: 'POST',
      headers: {
        'Ocp-Apim-Subscription-Key': AZURE_SPEECH_KEY,
        'Content-Type': 'application/ssml+xml',
        'X-Microsoft-OutputFormat': 'audio-16khz-128kbitrate-mono-mp3',
        'User-Agent': 'PreConceiveApp'
      },
      body: ssml
    });

    if (!ttsResponse.ok) {
      throw new Error(`TTS API error: ${ttsResponse.status}`);
    }

    const audioBuffer = await ttsResponse.arrayBuffer();

    // Set response headers
    response.set({
      'Content-Type': 'audio/mpeg',
      'Content-Length': audioBuffer.byteLength,
      'X-Translated-Text': encodeURIComponent(translatedText),
      'Cache-Control': 'public, max-age=3600'
    });

    response.send(Buffer.from(audioBuffer));

  } catch (error) {
    logger.error('Translate and speak error:', error);
    response.status(500).json({
      success: false,
      error: error.message || 'Operation failed'
    });
  }
});

/**
 * Health check endpoint
 */
exports.healthCheck = onRequest((request, response) => {
  response.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    services: {
      translation: !!process.env.AZURE_TRANSLATOR_KEY,
      speech: !!process.env.AZURE_SPEECH_KEY,
      sentiment: !!process.env.AZURE_LANGUAGE_KEY
    }
  });
});

/**
 * Sentiment Analysis API Endpoint (Azure AI Language)
 * 
 * POST /analyzeSentiment
 * Body: { text: string } or { documents: Array<{id: string, text: string}> }
 * Response: { sentiment: string, confidenceScores: object, success: boolean }
 */
exports.analyzeSentiment = onRequest({ cors: true }, async (request, response) => {
  // Handle CORS preflight
  if (request.method === 'OPTIONS') {
    response.set(corsHeaders);
    response.status(204).send('');
    return;
  }

  try {
    const { text, documents } = request.body;

    // Validate input
    if (!text && !documents) {
      response.status(400).json({
        success: false,
        error: 'Missing required field: text or documents'
      });
      return;
    }

    // Azure AI Language configuration
    const AZURE_LANGUAGE_KEY = process.env.AZURE_LANGUAGE_KEY || '';
    const AZURE_LANGUAGE_ENDPOINT = process.env.AZURE_LANGUAGE_ENDPOINT || 'https://imaginecuppregnancy.cognitiveservices.azure.com';

    // Prepare documents array
    const docs = documents || [{ id: '1', language: 'en', text: text }];

    // Call Azure AI Language Sentiment Analysis API
    const apiUrl = `${AZURE_LANGUAGE_ENDPOINT}/language/:analyze-text?api-version=2023-04-01`;
    
    const requestBody = {
      kind: 'SentimentAnalysis',
      parameters: {
        modelVersion: 'latest'
      },
      analysisInput: {
        documents: docs.map((doc, index) => ({
          id: doc.id || String(index + 1),
          language: doc.language || 'en',
          text: doc.text
        }))
      }
    };

    const azureResponse = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Ocp-Apim-Subscription-Key': AZURE_LANGUAGE_KEY
      },
      body: JSON.stringify(requestBody)
    });

    if (!azureResponse.ok) {
      const errorText = await azureResponse.text();
      logger.error('Azure Language API error:', errorText);
      throw new Error(`Azure API error: ${azureResponse.status}`);
    }

    const result = await azureResponse.json();
    
    // Process results
    const analyzedDocuments = result.results?.documents || [];
    
    if (analyzedDocuments.length === 1 && !documents) {
      // Single text analysis
      const doc = analyzedDocuments[0];
      response.json({
        success: true,
        sentiment: doc.sentiment,
        confidenceScores: doc.confidenceScores,
        sentences: doc.sentences?.map(s => ({
          text: s.text,
          sentiment: s.sentiment,
          confidenceScores: s.confidenceScores
        }))
      });
    } else {
      // Multiple documents analysis
      response.json({
        success: true,
        documents: analyzedDocuments.map(doc => ({
          id: doc.id,
          sentiment: doc.sentiment,
          confidenceScores: doc.confidenceScores
        }))
      });
    }

  } catch (error) {
    logger.error('Sentiment analysis error:', error);
    response.status(500).json({
      success: false,
      error: error.message || 'Sentiment analysis failed'
    });
  }
});

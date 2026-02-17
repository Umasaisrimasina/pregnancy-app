/// <reference types="vite/client" />

interface ImportMetaEnv {
    // AI / Bytez
    readonly VITE_BYTEZ_API_KEY: string;

    // Firebase
    readonly VITE_FIREBASE_API_KEY: string;
    readonly VITE_FIREBASE_AUTH_DOMAIN: string;
    readonly VITE_FIREBASE_PROJECT_ID: string;
    readonly VITE_FIREBASE_STORAGE_BUCKET: string;
    readonly VITE_FIREBASE_MESSAGING_SENDER_ID: string;
    readonly VITE_FIREBASE_APP_ID: string;
    readonly VITE_FIREBASE_MEASUREMENT_ID: string;

    // Azure Speech & Translator
    readonly VITE_AZURE_SPEECH_KEY: string;
    readonly VITE_AZURE_SPEECH_REGION: string;
    readonly VITE_AZURE_TRANSLATOR_KEY: string;
    readonly VITE_AZURE_TRANSLATOR_REGION: string;

    // Azure AI Language (Sentiment)
    readonly VITE_AZURE_LANGUAGE_KEY: string;
    readonly VITE_AZURE_LANGUAGE_ENDPOINT: string;
    readonly VITE_AZURE_LANGUAGE_REGION: string;

    // World Air Quality Index
    readonly VITE_WAQI_API_TOKEN: string;

    // Supabase
    readonly VITE_SUPABASE_URL: string;
    readonly VITE_SUPABASE_ANON_KEY: string;

    // Google OAuth
    readonly VITE_GOOGLE_CLIENT_ID: string;
    readonly VITE_GOOGLE_API_KEY: string;

    // Firebase Functions URL
    readonly VITE_FIREBASE_FUNCTIONS_URL: string;
    readonly VITE_API_BASE_URL: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}

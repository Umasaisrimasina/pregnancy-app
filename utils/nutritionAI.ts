// Nutrition AI Utilities
// Uses Bytez SDK with Gemini 2.5 Flash Lite for food analysis

import Bytez from 'bytez.js';

const BYTEZ_API_KEY = import.meta.env.VITE_BYTEZ_API_KEY || '';

// Initialize Bytez SDK
const sdk = BYTEZ_API_KEY ? new Bytez(BYTEZ_API_KEY) : null;
const model = sdk?.model('google/gemini-2.5-flash-lite');

// Nutrient info structure returned by AI
export interface NutrientInfo {
    iron?: string;
    folate?: string;
    protein?: string;
    calcium?: string;
    vitaminB12?: string;
    fiber?: string;
    calories?: string;
}

export interface FoodAnalysisResult {
    translatedText: string;
    nutrients: NutrientInfo;
    primaryNutrient?: string;
}

/**
 * Extract text from Bytez output (handles different response formats)
 */
function extractTextFromOutput(output: unknown): string {
    if (typeof output === 'string') {
        return output;
    }
    if (Array.isArray(output)) {
        // Handle array response - get first element's content
        const firstItem = output[0];
        if (typeof firstItem === 'string') return firstItem;
        if (firstItem?.content) return String(firstItem.content);
        if (firstItem?.text) return String(firstItem.text);
        if (firstItem?.message?.content) return String(firstItem.message.content);
        return JSON.stringify(output);
    }
    if (output && typeof output === 'object') {
        // Handle object response
        const obj = output as Record<string, unknown>;
        if (obj.content) return String(obj.content);
        if (obj.text) return String(obj.text);
        if (obj.message && typeof obj.message === 'object') {
            const msg = obj.message as Record<string, unknown>;
            if (msg.content) return String(msg.content);
        }
        // Try to get choices[0].message.content (OpenAI-like format)
        if (Array.isArray(obj.choices) && obj.choices[0]) {
            const choice = obj.choices[0] as Record<string, unknown>;
            if (choice.message && typeof choice.message === 'object') {
                const msg = choice.message as Record<string, unknown>;
                if (msg.content) return String(msg.content);
            }
        }
        return JSON.stringify(output);
    }
    return String(output || '');
}

/**
 * Translate text to English using Gemini
 */
export async function translateToEnglish(text: string): Promise<string> {
    if (!model) {
        console.warn('Bytez SDK not initialized. Skipping translation.');
        return text;
    }

    try {
        const { error, output } = await model.run([
            {
                role: 'user',
                content: `Translate the following food item to English. Only return the translated text, nothing else:\n\n"${text}"`
            }
        ]);

        if (error) {
            console.error('Translation error:', error);
            return text;
        }

        const responseText = extractTextFromOutput(output);
        return responseText.trim() || text;
    } catch (error) {
        console.error('Translation error:', error);
        return text;
    }
}

/**
 * Analyze food nutrition using Gemini
 */
export async function analyzeNutrition(foodText: string): Promise<NutrientInfo> {
    if (!model) {
        console.warn('Bytez SDK not initialized. Skipping nutrition analysis.');
        return {};
    }

    const prompt = `Analyze the nutritional content of this food item: "${foodText}"

Return ONLY a JSON object with estimated values per serving. Use these exact keys:
{
  "iron": "value in mg or null",
  "folate": "value in mcg or null",
  "protein": "value in g or null", 
  "calcium": "value in mg or null",
  "vitaminB12": "value in mcg or null",
  "fiber": "value in g or null",
  "calories": "value in kcal or null"
}

Only include nutrients that are significant in this food. Be concise with just the number and unit.
Return ONLY the JSON, no other text.`;

    try {
        const { error, output } = await model.run([
            {
                role: 'user',
                content: prompt
            }
        ]);

        if (error) {
            console.error('Nutrition analysis error:', error);
            return {};
        }

        const responseText = extractTextFromOutput(output);

        // Extract JSON from response (handle markdown code blocks)
        let jsonStr = responseText;
        const jsonMatch = responseText.match(/```(?:json)?\s*([\s\S]*?)```/);
        if (jsonMatch) {
            jsonStr = jsonMatch[1];
        }

        // Try to find JSON object in the string
        const jsonObjectMatch = jsonStr.match(/\{[\s\S]*\}/);
        if (jsonObjectMatch) {
            jsonStr = jsonObjectMatch[0];
        }

        const nutrients = JSON.parse(jsonStr.trim());

        // Clean up null values
        const cleanedNutrients: NutrientInfo = {};
        Object.entries(nutrients).forEach(([key, value]) => {
            if (value && value !== 'null' && value !== null) {
                cleanedNutrients[key as keyof NutrientInfo] = String(value);
            }
        });

        return cleanedNutrients;
    } catch (error) {
        console.error('Nutrition analysis error:', error);
        return {};
    }
}

/**
 * Get primary nutrient label for display
 */
function getPrimaryNutrient(nutrients: NutrientInfo): string | undefined {
    if (nutrients.iron) return 'Iron';
    if (nutrients.protein) return 'Protein';
    if (nutrients.folate) return 'Folate';
    if (nutrients.calcium) return 'Calcium';
    if (nutrients.fiber) return 'Fiber';
    if (nutrients.vitaminB12) return 'Vitamin B12';
    return undefined;
}

/**
 * Full food processing pipeline: Translate → Analyze → Return results
 */
export async function processFood(foodText: string): Promise<FoodAnalysisResult> {
    // Step 1: Translate to English
    const translatedText = await translateToEnglish(foodText);

    // Step 2: Analyze nutrition
    const nutrients = await analyzeNutrition(translatedText);

    // Step 3: Get primary nutrient for tag display
    const primaryNutrient = getPrimaryNutrient(nutrients);

    return {
        translatedText,
        nutrients,
        primaryNutrient
    };
}

/**
 * Check if API key is configured
 */
export function isAIEnabled(): boolean {
    return Boolean(model);
}

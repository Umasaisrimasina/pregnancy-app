import Bytez from 'bytez.js';

const BYTEZ_API_KEY = import.meta.env.VITE_BYTEZ_API_KEY;

// Initialize Bytez SDK
const sdk = new Bytez(BYTEZ_API_KEY);

// Use Gemini 2.5 Flash Lite model
const model = sdk.model('google/gemini-2.5-flash-lite');

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface ChatResponse {
  success: boolean;
  message?: string;
  error?: string;
}

// System prompts for different contexts
const systemPrompts: Record<string, string> = {
  'pregnancy': `You are a compassionate and knowledgeable AI midwife assistant for pregnant women. 
You provide supportive, evidence-based information about pregnancy, prenatal care, and emotional wellness.
Always be empathetic, encouraging, and remind users to consult their healthcare provider for medical advice.
Keep responses concise but helpful. Use warm, supportive language.`,
  
  'postpartum': `You are a caring AI recovery assistant for postpartum mothers.
You provide supportive information about physical recovery, mental health, breastfeeding, and bonding with baby.
Be sensitive to the challenges of new motherhood. Watch for signs of postpartum depression and encourage seeking help when needed.
Always be empathetic and remind users that recovery takes time. Keep responses concise but supportive.`,
  
  'babycare': `You are a helpful AI parent wellness companion for parents caring for newborns.
You provide supportive guidance on baby care, parenting challenges, and parent self-care.
Acknowledge that caring for a newborn is exhausting but rewarding. Offer practical tips and emotional support.
Keep responses concise and encouraging.`,
  
  'preconception': `You are a supportive AI fertility and wellness companion for those trying to conceive.
You provide information about fertility, cycle tracking, nutrition, and emotional wellness during the conception journey.
Be sensitive to the emotional aspects of trying to conceive. Offer encouragement and evidence-based information.
Keep responses concise and supportive.`,
  
  'nutrition': `You are a knowledgeable AI nutrition coach for pregnancy and maternal health.
You provide guidance on prenatal nutrition, meal planning, supplements, and healthy eating during pregnancy.
Offer practical tips and recipes. Always remind users to consult their healthcare provider about dietary changes.
Keep responses concise and actionable.`,
  
  'default': `You are a supportive AI companion for maternal health and wellness.
You provide helpful, empathetic responses about pregnancy, postpartum care, and parenting.
Always be kind, supportive, and encourage users to seek professional medical advice when needed.
Keep responses concise but helpful.`
};

/**
 * Send a message to the AI and get a response
 */
export async function sendChatMessage(
  userMessage: string,
  context: string = 'default',
  conversationHistory: ChatMessage[] = []
): Promise<ChatResponse> {
  try {
    if (!BYTEZ_API_KEY) {
      console.error('Bytez API key not configured');
      return {
        success: false,
        error: 'AI service not configured. Please check your API key.'
      };
    }

    // Build messages array with system prompt and conversation history
    const systemPrompt = systemPrompts[context] || systemPrompts['default'];
    
    const messages = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory.map(msg => ({
        role: msg.role,
        content: msg.content
      })),
      { role: 'user', content: userMessage }
    ];

    // Send to Gemini 2.5 Flash Lite via Bytez
    const { error, output } = await model.run(messages);

    if (error) {
      console.error('Bytez API error:', error);
      return {
        success: false,
        error: 'Failed to get AI response. Please try again.'
      };
    }

    // Extract the response text
    const responseText = output?.choices?.[0]?.message?.content || 
                         output?.message?.content ||
                         output?.content ||
                         (typeof output === 'string' ? output : 'I understand. How can I help you further?');

    return {
      success: true,
      message: responseText
    };
  } catch (err) {
    console.error('AI service error:', err);
    return {
      success: false,
      error: err instanceof Error ? err.message : 'An unexpected error occurred.'
    };
  }
}

/**
 * Get a quick supportive response for mood check-ins
 */
export async function getMoodResponse(
  mood: string,
  factors: string[],
  context: string = 'default'
): Promise<ChatResponse> {
  const factorsText = factors.length > 0 ? `Factors affecting them: ${factors.join(', ')}.` : '';
  const prompt = `The user just did a mood check-in. They're feeling "${mood}". ${factorsText} Give a brief, supportive response (2-3 sentences).`;
  
  return sendChatMessage(prompt, context);
}

/**
 * Get AI-powered nutrition advice
 */
export async function getNutritionAdvice(
  query: string,
  trimester?: number
): Promise<ChatResponse> {
  const trimesterContext = trimester ? `The user is in trimester ${trimester}.` : '';
  const prompt = `${trimesterContext} Nutrition question: ${query}`;
  
  return sendChatMessage(prompt, 'nutrition');
}

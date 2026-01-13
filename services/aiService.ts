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

  // Risk-aware tone prompts
  'encouraging': `You are an upbeat and encouraging AI wellness companion.
The user's health indicators look stable. Be cheerful, positive, and celebrate their progress.
Offer fun tips, encouragement, and keep the energy light and optimistic.
Keep responses concise and joyful.`,

  'supportive': `You are a gentle and supportive AI wellness companion.
The user has some health changes worth monitoring. Be warm, reassuring, and attentive.
Offer helpful suggestions without causing worry. Remind them you're here to help.
Keep responses caring and supportive.`,

  'compassionate': `You are a deeply compassionate AI wellness companion.
The user may be going through a challenging time. Be extra gentle, warm, and understanding.
Acknowledge their feelings, offer comfort, and gently suggest support resources.
Never minimize their concerns. Be a calm, caring presence.
Keep responses warm and empathetic.`,

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

/**
 * Generate AI-powered personalized risk insight
 * Takes risk assessment data and creates a warm, supportive explanation
 */
export async function generateRiskInsight(
  riskData: {
    overallLevel: 'low' | 'moderate' | 'high';
    week: number;
    indicators: Array<{
      condition: string;
      level: string;
      triggers: string[];
    }>;
  }
): Promise<ChatResponse> {
  try {
    if (!BYTEZ_API_KEY) {
      return {
        success: false,
        error: 'AI service not configured.'
      };
    }

    // Build context about the risk assessment
    const triggersText = riskData.indicators
      .filter(i => i.triggers.length > 0)
      .map(i => `${i.condition.replace('_', ' ')}: ${i.triggers.join(', ')}`)
      .join('. ');

    const systemPrompt = `You are a warm, supportive maternal wellness companion. 
You help pregnant women understand their health check-in results in a calm, reassuring way.
You are NOT a doctor. Never diagnose. Always encourage professional consultation for concerns.
Be brief (3-4 sentences max), warm, and actionable.
End with a reminder: "This is general guidance, not medical advice."`;

    const userPrompt = `A pregnant woman at week ${riskData.week} just completed her weekly check-in.
Overall status: ${riskData.overallLevel === 'low' ? 'stable' : riskData.overallLevel === 'moderate' ? 'some changes noticed' : 'needs attention'}.
${triggersText ? `What we noticed: ${triggersText}` : 'No specific concerns flagged.'}

Give her a personalized, warm insight about what this means and one gentle suggestion for this week. Be encouraging but honest.`;

    const messages = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ];

    const { error, output } = await model.run(messages);

    if (error) {
      console.error('Bytez API error:', error);
      return {
        success: false,
        error: 'Could not generate insight. Please try again.'
      };
    }

    const responseText = output?.choices?.[0]?.message?.content ||
      output?.message?.content ||
      output?.content ||
      (typeof output === 'string' ? output : null);

    if (!responseText) {
      return {
        success: false,
        error: 'No response from AI.'
      };
    }

    return {
      success: true,
      message: responseText
    };
  } catch (err) {
    console.error('AI insight error:', err);
    return {
      success: false,
      error: 'An error occurred generating your insight.'
    };
  }
}

/**
 * Generate AI-powered self-care suggestion based on symptoms
 */
export async function generateSelfCareSuggestion(
  symptoms: {
    headache: number;
    fatigue: number;
    mood: number;
    sleepQuality: number;
  },
  week: number
): Promise<ChatResponse> {
  try {
    if (!BYTEZ_API_KEY) {
      return { success: false, error: 'AI service not configured.' };
    }

    const highSymptoms: string[] = [];
    if (symptoms.headache >= 3) highSymptoms.push('headaches');
    if (symptoms.fatigue >= 3) highSymptoms.push('fatigue');
    if (symptoms.mood <= 2) highSymptoms.push('low mood');
    if (symptoms.sleepQuality <= 2) highSymptoms.push('poor sleep');

    const systemPrompt = `You are a gentle wellness guide for pregnant women.
Suggest ONE simple, pregnancy-safe self-care activity. Be specific and actionable.
Keep it to 2 sentences max. Make it feel like a caring friend's suggestion, not medical advice.`;

    const userPrompt = highSymptoms.length > 0
      ? `Week ${week} pregnant woman experiencing: ${highSymptoms.join(', ')}. Suggest one gentle self-care activity.`
      : `Week ${week} pregnant woman feeling good. Suggest one nice self-care treat for her.`;

    const messages = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ];

    const { error, output } = await model.run(messages);

    if (error) {
      return { success: false, error: 'Could not generate suggestion.' };
    }

    const responseText = output?.choices?.[0]?.message?.content ||
      output?.message?.content ||
      output?.content ||
      (typeof output === 'string' ? output : null);

    return responseText
      ? { success: true, message: responseText }
      : { success: false, error: 'No suggestion generated.' };
  } catch (err) {
    return { success: false, error: 'An error occurred.' };
  }
}

/**
 * Generate specific content for a system action
 */
export async function generateActionContent(
  actionType: 'nutrition_adjust' | 'community_suggest',
  description: string,
  week: number
): Promise<ChatResponse> {
  try {
    if (!BYTEZ_API_KEY) return { success: false, error: 'AI service not configured.' };

    let systemPrompt = '';
    let userPrompt = '';

    if (actionType === 'nutrition_adjust') {
      systemPrompt = `You are a knowledgeable prenatal nutrition guide. 
Suggest ONE specific, delicious food or meal addition that addresses: "${description}".
Be brief (1 sentence). Start with a verb like "Try...", "Add...", "Snack on...".
Do not sound clinical. Sound like a helpful friend.`;
      userPrompt = `Pregnant woman at week ${week}. Need a quick nutrition tip for: ${description}.`;
    } else if (actionType === 'community_suggest') {
      systemPrompt = `You are a helpful community guide for moms.
Suggest a specific support group name and a reason to join, based on: "${description}".
Format: "Recommended Group: [Creative Name] - [Brief Reason]"
Keep it under 15 words.`;
      userPrompt = `Pregnant woman at week ${week}. Suggest a community group for: ${description}.`;
    } else {
      return { success: false, error: 'Unsupported action type.' };
    }

    const messages = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ];

    const { error, output } = await model.run(messages);

    if (error) return { success: false, error: 'Could not generate content.' };

    const responseText = output?.choices?.[0]?.message?.content ||
      output?.message?.content ||
      output?.content ||
      (typeof output === 'string' ? output : null);

    return responseText
      ? { success: true, message: responseText }
      : { success: false, error: 'No content generated.' };

  } catch (err) {
    return { success: false, error: 'An error occurred.' };
  }
}

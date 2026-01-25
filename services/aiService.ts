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
/**
 * Send a message to the AI and get a response
 */
export async function sendChatMessage(
  userMessage: string,
  context: string = 'default',
  conversationHistory: ChatMessage[] = []
): Promise<ChatResponse> {
  // 1. Try real API first
  try {
    if (BYTEZ_API_KEY) {
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

      if (!error && output) {
        // Extract the response text
        const responseText = output?.choices?.[0]?.message?.content ||
          output?.message?.content ||
          output?.content ||
          (typeof output === 'string' ? output : null);

        if (responseText) {
          return {
            success: true,
            message: responseText
          };
        }
      }
      console.warn('Bytez API failed or returned empty, switching to fallback:', error);
    }
  } catch (err) {
    console.warn('AI service error, switching to fallback:', err);
  }

  // 2. Fallback to local simulation if API fails/missing
  // Simulate network delay for realism
  await new Promise(resolve => setTimeout(resolve, 1500));

  return {
    success: true,
    message: getFallbackResponse(userMessage, context)
  };
}

/**
 * Generate a context-aware fallback response based on keywords
 */
function getFallbackResponse(message: string, context: string): string {
  const lowerMsg = message.toLowerCase();

  // Universal greetings
  if (lowerMsg.match(/\b(hi|hello|hey|greetings)\b/)) {
    return "Hello! I'm here to support you. How are you feeling today?";
  }

  if (lowerMsg.match(/\b(thank|thanks)\b/)) {
    return "You're very welcome. I'm always here if you need anything else.";
  }

  // Context-specific responses
  switch (context) {
    case 'pregnancy':
      if (lowerMsg.includes('headache')) return "Headaches can be common due to hormonal changes. Try resting in a dark room, staying hydrated, and applying a cool compress. If it's severe or minimal vision changes, please contact your doctor immediately.";
      if (lowerMsg.includes('nausea') || lowerMsg.includes('sickness')) return "Morning sickness is tough. Try eating small, frequent meals, staying hydrated, and ginger tea. If you can't keep fluids down, please consult your doctor.";
      if (lowerMsg.includes('pain') || lowerMsg.includes('cramp')) return "Some mild cramping can be normal as your uterus expands. However, if the pain is severe, persistent, or accompanied by bleeding, please seek medical attention right away.";
      if (lowerMsg.includes('diet') || lowerMsg.includes('food') || lowerMsg.includes('eat')) return "A balanced diet with plenty of protein, iron, and folate is great for you and baby. Make sure to wash vegetables thoroughly and avoid raw meats/fish.";
      if (lowerMsg.includes('sleep') || lowerMsg.includes('tired')) return "Fatigue is your body's way of saying it needs rest. Try to nap when you can and use pillows for support to find a comfortable sleeping position.";
      return "I hear you. Pregnancy brings so many changes. Remember to listen to your body and rest when you need to. Is there a specific symptom bothering you?";

    case 'postpartum':
      if (lowerMsg.includes('sad') || lowerMsg.includes('crying') || lowerMsg.includes('depress')) return "I'm so sorry you're feeling this way. The 'baby blues' are very common, but if these feelings persist or are overwhelming, please reach out to your doctor or a support person. You don't have to do this alone.";
      if (lowerMsg.includes('breastfeed') || lowerMsg.includes('milk') || lowerMsg.includes('latch')) return "Breastfeeding can be challenging at first. Ensure you're hydrated and comfortable. If you're experiencing pain, a lactation consultant can be incredibly helpful to check the latch.";
      if (lowerMsg.includes('sleep')) return "Everything feels harder without sleep. Try to prioritize rest whenever the baby sleeps, even if it's just putting your feet up. It's okay to let other chores slide right now.";
      if (lowerMsg.includes('bleed')) return "Postpartum bleeding (lochia) naturally decreases over weeks. If you notice heavy bleeding (soaking a pad in an hour) or large clots, please call your healthcare provider immediately.";
      if (lowerMsg.includes('stitch') || lowerMsg.includes('c-section')) return "Recovery takes time. Keep the area clean and dry. Watch for signs of infection like redness, swelling, or fever. diverse gentle movement helps, but don't overdo it.";
      return "The fourth trimester is a major transition. Be gentle with yourself. You're recovering while learning a whole new role. How is your physical recovery going?";

    case 'babycare':
      if (lowerMsg.includes('cry') || lowerMsg.includes('colic')) return "It can be distressing when baby cries. Check the basics: hunger, diaper, temperature, or needing a burp. Sometimes they just need to be held. If crying is inconsolable for hours, check with your pediatrician.";
      if (lowerMsg.includes('sleep') || lowerMsg.includes('nap')) return "Newborn sleep patterns are unpredictable. Establishing a simple bedtime routine (bath, book, feed) can help over time. Remember, 'sleeping through the night' isn't expected for a while yet.";
      if (lowerMsg.includes('poop') || lowerMsg.includes('constipat')) return "Baby digestive systems are still learning. Changes in frequency and color are often normal. If poop is hard/pellet-like or there's blood, consult your pediatrician.";
      if (lowerMsg.includes('rash') || lowerMsg.includes('skin')) return "Baby skin is sensitive. Diaper rashes are common—try frequent changes and barrier cream. For other rashes, keep the area clean and dry. If accompanied by fever, see a doctor.";
      if (lowerMsg.includes('feed') || lowerMsg.includes('hungry')) return "Feeding on demand is usually best for newborns. Watch for hunger cues like rooting, sucking hands, or smacking lips rather than waiting for crying.";
      return "You're doing a great job learning your baby's cues. Every baby is different. Trust your instincts, and don't hesitate to call your pediatrician for any concerns.";

    case 'preconception':
      if (lowerMsg.includes('ovulat') || lowerMsg.includes('fertile')) return "Tracking your cycle is key. Look for signs like egg-white cervical mucus or use ovulation predictor kits. The most fertile window is usually the 5 days leading up to ovulation.";
      if (lowerMsg.includes('stress') || lowerMsg.includes('worry')) return "Trying to conceive can be stressful. High stress can sometimes affect your cycle. Finding ways to relax—yoga, meditation, or hobbies—is just as important as the physical tracking.";
      if (lowerMsg.includes('diet') || lowerMsg.includes('vitamin')) return "A preconception vitamin with Folic Acid is highly recommended. A balanced diet rich in antioxidants, whole grains, and healthy fats supports fertility for both partners.";
      return "Preparing your body for pregnancy is a wonderful first step. Focus on a healthy lifestyle and tracking your cycle. Do you have questions about tracking ovulation?";

    case 'nutrition':
      if (lowerMsg.includes('iron') || lowerMsg.includes('anemia')) return "Iron is crucial! Good sources include lean red meat, spinach, lentils, and fortified cereals. Pair them with Vitamin C (like oranges) to help absorption.";
      if (lowerMsg.includes('nausea') || lowerMsg.includes('sick')) return "For nausea, try bland, starchy foods like crackers or toast. Ginger tea can also help. Eat small, frequent meals instead of 3 large ones.";
      if (lowerMsg.includes('calcium')) return "Baby needs calcium for strong bones. Aim for 3-4 servings of dairy or calcium-rich foods like yogurt, cheese, fortified plant milks, or leafy greens daily.";
      if (lowerMsg.includes('fish') || lowerMsg.includes('sushi')) return "Cooked fish is great! Avoid high-mercury fish (shark, swordfish) and raw fish/sushi due to bacteria risk. Salmon and sardines are excellent low-mercury choices.";
      return "Nutrition is the foundation of a healthy pregnancy. Aim for a 'rainbow' on your plate. Do you have a specific food or craving you're wondering about?";

    default:
      return "I understand. That sounds important. Could you tell me a little more about how that's making you feel? I'm here to listen.";
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

    // Extract the response text
    const responseText = output?.choices?.[0]?.message?.content ||
      output?.message?.content ||
      output?.content ||
      (typeof output === 'string' ? output : null);

    if (!responseText) {
      throw new Error('No response from AI');
    }

    return {
      success: true,
      message: responseText
    };
  } catch (err) {
    console.warn('AI insight error, using fallback:', err);
    // Fallback response
    return {
      success: true,
      message: "You're doing great. Monitor your symptoms and stay hydrated. Establishing a routine can help manage stress levels during this phase."
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

    if (!responseText) throw new Error('No suggestion generated');

    return { success: true, message: responseText };
  } catch (err) {
    // Fallback suggestion
    const fallbacks = [
      "Take a 10-minute warm foot bath to relax.",
      "Listen to a calming guided meditation for pregnancy.",
      "Enjoy a quiet cup of herbal tea while reading a book.",
      "Practice gentle prenatal stretching for 15 minutes."
    ];
    return { success: true, message: fallbacks[Math.floor(Math.random() * fallbacks.length)] };
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

    if (!responseText) throw new Error('No content generated');

    return { success: true, message: responseText };

  } catch (err) {
    // Fallback content
    if (actionType === 'nutrition_adjust') {
      return { success: true, message: "Try making a green smoothie with spinach and fruits for an iron boost." };
    } else if (actionType === 'community_suggest') {
      return { success: true, message: "Recommended Group: 2nd Trimester Moms - Support for this phase." };
    }
    return { success: false, error: 'An error occurred.' };
  }
}

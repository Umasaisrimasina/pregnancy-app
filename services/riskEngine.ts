/**
 * riskEngine.ts
 * 
 * Rule-based Maternal Risk Intelligence Engine
 * Detects risk indicators for: Preeclampsia, Gestational Diabetes, Depression
 * 
 * IMPORTANT: This is NOT a diagnostic tool. It surfaces risk indicators only.
 */

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

export interface WeeklyCheckIn {
    id: string;
    week: number;
    date: string; // ISO date

    // Core symptoms (1-5 scale, 1=none, 5=severe)
    headache: number;
    swelling: number;
    sleepQuality: number; // 1=poor, 5=excellent
    fatigue: number;
    mood: number; // 1=very low, 5=great
    dizziness: number;

    // Optional clinical inputs
    bloodPressure?: {
        systolic: number;
        diastolic: number;
    };
    bloodSugar?: number; // mg/dL
    activityLevel?: number; // 1-5 scale
}

export type RiskLevel = 'low' | 'moderate' | 'high';

export interface RiskIndicator {
    condition: 'preeclampsia' | 'gestational_diabetes' | 'depression';
    level: RiskLevel;
    confidence: number; // 0-100
    triggers: string[]; // What caused this risk level
    explanation: string; // Plain language explanation
    recommendation: string; // What to do next
}

export interface RiskAssessment {
    overallLevel: RiskLevel;
    timestamp: string;
    week: number;
    indicators: RiskIndicator[];
    systemActions: SystemAction[];
}

export interface SystemAction {
    type: 'nutrition_adjust' | 'chat_tone' | 'community_suggest' | 'doctor_alert';
    description: string;
    priority: 'low' | 'medium' | 'high';
    // AI generated dynamic content (optional)
    aiContent?: string;
}

export interface RiskTrajectoryPoint {
    week: number;
    date: string;
    overallLevel: RiskLevel;
    preeclampsiaLevel: RiskLevel;
    diabetesLevel: RiskLevel;
    depressionLevel: RiskLevel;
}

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const DISCLAIMER = "Based on general health guidance. Not a medical diagnosis.";

// Risk thresholds
const BP_HIGH_SYSTOLIC = 140;
const BP_HIGH_DIASTOLIC = 90;
const BP_RISE_THRESHOLD = 10; // mmHg
const BLOOD_SUGAR_HIGH = 140; // mg/dL
const SYMPTOM_HIGH_THRESHOLD = 4;
const MOOD_LOW_THRESHOLD = 2;
const WEEKS_FOR_TREND = 2;

// ─────────────────────────────────────────────────────────────────────────────
// RISK CALCULATION FUNCTIONS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Calculate preeclampsia risk indicators
 */
function assessPreeclampsiaRisk(
    current: WeeklyCheckIn,
    history: WeeklyCheckIn[]
): RiskIndicator {
    const triggers: string[] = [];
    let riskScore = 0;

    // Check blood pressure if available
    if (current.bloodPressure) {
        const { systolic, diastolic } = current.bloodPressure;

        if (systolic >= BP_HIGH_SYSTOLIC || diastolic >= BP_HIGH_DIASTOLIC) {
            triggers.push('Elevated blood pressure reading');
            riskScore += 40;
        }

        // Check for BP rise from baseline
        const baselineBP = history.find(h => h.bloodPressure)?.bloodPressure;
        if (baselineBP) {
            const systolicRise = systolic - baselineBP.systolic;
            const diastolicRise = diastolic - baselineBP.diastolic;

            if (systolicRise >= BP_RISE_THRESHOLD || diastolicRise >= BP_RISE_THRESHOLD) {
                triggers.push('Blood pressure showing upward trend');
                riskScore += 25;
            }
        }
    }

    // Check swelling trend
    const recentSwelling = [current, ...history.slice(0, WEEKS_FOR_TREND - 1)]
        .filter(c => c.swelling >= SYMPTOM_HIGH_THRESHOLD);

    if (recentSwelling.length >= WEEKS_FOR_TREND) {
        triggers.push('Persistent swelling noticed');
        riskScore += 20;
    }

    // Check headache + dizziness combo
    if (current.headache + current.dizziness >= 7) {
        triggers.push('Headache and dizziness occurring together');
        riskScore += 15;
    }

    // Determine risk level
    let level: RiskLevel = 'low';
    if (riskScore >= 50) level = 'high';
    else if (riskScore >= 25) level = 'moderate';

    return {
        condition: 'preeclampsia',
        level,
        confidence: Math.min(riskScore, 100),
        triggers,
        explanation: level === 'low'
            ? 'Blood pressure and related symptoms are stable.'
            : level === 'moderate'
                ? 'Some changes in blood pressure or swelling patterns noticed. Worth monitoring.'
                : 'Multiple indicators suggest closer attention needed. Consider speaking with your doctor.',
        recommendation: level === 'high'
            ? 'We recommend discussing these patterns with your healthcare provider soon.'
            : level === 'moderate'
                ? 'Continue monitoring and log your symptoms regularly.'
                : 'Keep up with your regular check-ins!'
    };
}

/**
 * Calculate gestational diabetes risk indicators
 */
function assessDiabetesRisk(
    current: WeeklyCheckIn,
    history: WeeklyCheckIn[]
): RiskIndicator {
    const triggers: string[] = [];
    let riskScore = 0;

    // Check blood sugar if available
    if (current.bloodSugar && current.bloodSugar >= BLOOD_SUGAR_HIGH) {
        triggers.push('Blood sugar reading above typical range');
        riskScore += 40;
    }

    // Check fatigue trend
    const recentFatigue = [current, ...history.slice(0, WEEKS_FOR_TREND - 1)]
        .filter(c => c.fatigue >= SYMPTOM_HIGH_THRESHOLD);

    if (recentFatigue.length >= WEEKS_FOR_TREND) {
        triggers.push('Persistent fatigue over multiple weeks');
        riskScore += 25;
    }

    // Check activity declining while fatigue rising
    if (history.length > 0 && current.activityLevel && history[0].activityLevel) {
        if (current.activityLevel < history[0].activityLevel &&
            current.fatigue > history[0].fatigue) {
            triggers.push('Activity decreasing while fatigue increasing');
            riskScore += 20;
        }
    }

    // Determine risk level
    let level: RiskLevel = 'low';
    if (riskScore >= 50) level = 'high';
    else if (riskScore >= 25) level = 'moderate';

    return {
        condition: 'gestational_diabetes',
        level,
        confidence: Math.min(riskScore, 100),
        triggers,
        explanation: level === 'low'
            ? 'Energy levels and blood sugar patterns look stable.'
            : level === 'moderate'
                ? 'Some fatigue patterns noticed. Nutrition and activity adjustments may help.'
                : 'Multiple energy-related indicators flagged. A glucose check may be helpful.',
        recommendation: level === 'high'
            ? 'Consider discussing a glucose tolerance test with your doctor.'
            : level === 'moderate'
                ? 'Focus on balanced meals and gentle activity. We\'ll adjust your nutrition suggestions.'
                : 'Your energy balance looks good!'
    };
}

/**
 * Calculate depression risk indicators
 */
function assessDepressionRisk(
    current: WeeklyCheckIn,
    history: WeeklyCheckIn[]
): RiskIndicator {
    const triggers: string[] = [];
    let riskScore = 0;

    // Check current mood
    if (current.mood <= MOOD_LOW_THRESHOLD) {
        triggers.push('Mood reported as low');
        riskScore += 30;
    }

    // Check consecutive low mood
    const recentMood = [current, ...history.slice(0, WEEKS_FOR_TREND - 1)]
        .filter(c => c.mood <= MOOD_LOW_THRESHOLD);

    if (recentMood.length >= WEEKS_FOR_TREND) {
        triggers.push('Low mood persisting for multiple weeks');
        riskScore += 30;
    }

    // Check sleep quality decline
    const recentSleepDecline = history.length > 0 &&
        current.sleepQuality < history[0].sleepQuality &&
        current.sleepQuality <= 2;

    if (recentSleepDecline) {
        triggers.push('Sleep quality declining');
        riskScore += 20;
    }

    // Mood + sleep combo
    if (current.mood + current.sleepQuality <= 6) {
        triggers.push('Both mood and sleep affected');
        riskScore += 20;
    }

    // Determine risk level
    let level: RiskLevel = 'low';
    if (riskScore >= 50) level = 'high';
    else if (riskScore >= 25) level = 'moderate';

    return {
        condition: 'depression',
        level,
        confidence: Math.min(riskScore, 100),
        triggers,
        explanation: level === 'low'
            ? 'Emotional wellbeing appears stable.'
            : level === 'moderate'
                ? 'Some mood or sleep changes noticed. This is common during pregnancy.'
                : 'We notice you may be going through a difficult time. Support is available.',
        recommendation: level === 'high'
            ? 'You\'re not alone. Consider speaking with someone who can help. We\'ll connect you with support resources.'
            : level === 'moderate'
                ? 'Our chatbot is here if you want to talk. Community support is also available.'
                : 'Keep nurturing your emotional wellbeing!'
    };
}

/**
 * Determine system actions based on risk assessment
 */
function determineSystemActions(indicators: RiskIndicator[]): SystemAction[] {
    const actions: SystemAction[] = [];

    const overallHigh = indicators.some(i => i.level === 'high');
    const overallModerate = indicators.some(i => i.level === 'moderate');

    // Chat tone adjustment
    if (overallHigh) {
        actions.push({
            type: 'chat_tone',
            description: 'Chatbot will use more compassionate, supportive tone',
            priority: 'high'
        });
    } else if (overallModerate) {
        actions.push({
            type: 'chat_tone',
            description: 'Chatbot will check in more gently',
            priority: 'medium'
        });
    }

    // Nutrition adjustments
    const diabetesRisk = indicators.find(i => i.condition === 'gestational_diabetes');
    if (diabetesRisk && diabetesRisk.level !== 'low') {
        actions.push({
            type: 'nutrition_adjust',
            description: 'Nutrition suggestions prioritizing blood sugar balance',
            priority: diabetesRisk.level === 'high' ? 'high' : 'medium'
        });
    }

    const preeclampsiaRisk = indicators.find(i => i.condition === 'preeclampsia');
    if (preeclampsiaRisk && preeclampsiaRisk.level !== 'low') {
        actions.push({
            type: 'nutrition_adjust',
            description: 'Nutrition suggestions focusing on blood pressure support',
            priority: preeclampsiaRisk.level === 'high' ? 'high' : 'medium'
        });
    }

    // Community suggestions
    const depressionRisk = indicators.find(i => i.condition === 'depression');
    if (depressionRisk && depressionRisk.level !== 'low') {
        actions.push({
            type: 'community_suggest',
            description: 'Showing mental health support groups and similar journeys',
            priority: depressionRisk.level === 'high' ? 'high' : 'medium'
        });
    }

    // Doctor alert for high risk
    if (overallHigh) {
        actions.push({
            type: 'doctor_alert',
            description: 'Doctor-ready summary available for your next visit',
            priority: 'high'
        });
    }

    return actions;
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN EXPORT FUNCTIONS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Perform a full risk assessment based on current check-in and history
 */
export function assessRisk(
    current: WeeklyCheckIn,
    history: WeeklyCheckIn[] = []
): RiskAssessment {
    // Sort history by week descending (most recent first)
    const sortedHistory = [...history].sort((a, b) => b.week - a.week);

    // Assess each condition
    const preeclampsiaIndicator = assessPreeclampsiaRisk(current, sortedHistory);
    const diabetesIndicator = assessDiabetesRisk(current, sortedHistory);
    const depressionIndicator = assessDepressionRisk(current, sortedHistory);

    const indicators = [preeclampsiaIndicator, diabetesIndicator, depressionIndicator];

    // Determine overall level
    let overallLevel: RiskLevel = 'low';
    if (indicators.some(i => i.level === 'high')) {
        overallLevel = 'high';
    } else if (indicators.some(i => i.level === 'moderate')) {
        overallLevel = 'moderate';
    }

    // Determine system actions
    const systemActions = determineSystemActions(indicators);

    return {
        overallLevel,
        timestamp: new Date().toISOString(),
        week: current.week,
        indicators,
        systemActions
    };
}

/**
 * Get risk level display info with warm, pregnancy-friendly colors
 */
export function getRiskLevelDisplay(level: RiskLevel): {
    label: string;
    color: string;
    bgColor: string;
    borderColor: string;
    icon: string;
    message: string;
} {
    switch (level) {
        case 'low':
            return {
                label: 'All signals stable',
                color: 'text-[#2d6a4f]',
                bgColor: 'bg-[#d4f5e6]',
                borderColor: 'border-[#a8e6cf]',
                icon: '🌿',
                message: 'Everything looks good. Keep up with your regular check-ins!'
            };
        case 'moderate':
            return {
                label: 'Some changes noticed',
                color: 'text-[#9c6644]',
                bgColor: 'bg-[#ffe8d9]',
                borderColor: 'border-[#ffd3b6]',
                icon: '🌸',
                message: 'We noticed some changes worth monitoring. We\'re adjusting your support.'
            };
        case 'high':
            return {
                label: 'Support recommended',
                color: 'text-[#a4494a]',
                bgColor: 'bg-[#ffd4d1]',
                borderColor: 'border-[#ffaaa5]',
                icon: '💜',
                message: 'We recommend connecting with your healthcare provider. You\'re not alone.'
            };
    }
}

/**
 * Build risk trajectory from check-in history
 */
export function buildRiskTrajectory(checkIns: WeeklyCheckIn[]): RiskTrajectoryPoint[] {
    const trajectory: RiskTrajectoryPoint[] = [];

    // Sort by week ascending
    const sorted = [...checkIns].sort((a, b) => a.week - b.week);

    for (let i = 0; i < sorted.length; i++) {
        const current = sorted[i];
        const history = sorted.slice(0, i); // All previous check-ins

        const assessment = assessRisk(current, history);

        trajectory.push({
            week: current.week,
            date: current.date,
            overallLevel: assessment.overallLevel,
            preeclampsiaLevel: assessment.indicators.find(i => i.condition === 'preeclampsia')?.level || 'low',
            diabetesLevel: assessment.indicators.find(i => i.condition === 'gestational_diabetes')?.level || 'low',
            depressionLevel: assessment.indicators.find(i => i.condition === 'depression')?.level || 'low'
        });
    }

    return trajectory;
}

/**
 * Generate doctor-ready summary for high-risk situations
 */
export function generateDoctorSummary(
    assessment: RiskAssessment,
    checkIns: WeeklyCheckIn[]
): string {
    const lines: string[] = [
        `📋 MATERNAL HEALTH SUMMARY`,
        `Week: ${assessment.week}`,
        `Generated: ${new Date().toLocaleDateString()}`,
        ``,
        `⚠️ ${DISCLAIMER}`,
        ``,
        `RISK INDICATORS:`
    ];

    assessment.indicators
        .filter(i => i.level !== 'low')
        .forEach(indicator => {
            lines.push(`• ${indicator.condition.replace('_', ' ').toUpperCase()}: ${indicator.level.toUpperCase()}`);
            indicator.triggers.forEach(t => lines.push(`  - ${t}`));
        });

    lines.push(``);
    lines.push(`RECENT CHECK-IN DATA:`);

    checkIns.slice(0, 4).forEach(c => {
        lines.push(`Week ${c.week}:`);
        lines.push(`  Mood: ${c.mood}/5, Sleep: ${c.sleepQuality}/5, Fatigue: ${c.fatigue}/5`);
        if (c.bloodPressure) {
            lines.push(`  BP: ${c.bloodPressure.systolic}/${c.bloodPressure.diastolic}`);
        }
        if (c.bloodSugar) {
            lines.push(`  Blood Sugar: ${c.bloodSugar} mg/dL`);
        }
    });

    return lines.join('\n');
}

export { DISCLAIMER };

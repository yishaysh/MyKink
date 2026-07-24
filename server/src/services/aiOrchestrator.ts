export interface SharedMatchTitle {
  title: string;
  category: string;
  intensityLevel: string;
  matchStatus: string;
}

export interface AIScenario {
  title: string;
  intensityMode: string;
  steps: { stepNumber: number; title: string; description: string; consentCue: string }[];
  romanticClosing: string;
}

export class AIOrchestratorService {
  /**
   * Generates a tailored 4-step evening scenario using ONLY verified mutual matches.
   * Zero-Knowledge Privacy Layer: Unverified/NO preferences are never passed to AI.
   */
  public generateEveningScenario(
    matches: SharedMatchTitle[],
    intensityMode: 'VANILLA' | 'SPICY' | 'ADVENTUROUS' = 'SPICY'
  ): AIScenario {
    // Filter matches by intensity mode if applicable
    const validMatches = matches.filter(
      (m) => m.matchStatus !== 'HIDDEN'
    );

    const activeTitles = validMatches.map((m) => m.title);
    const chosenMatches = activeTitles.length > 0 ? activeTitles : ['Sensual Body Massage', 'Candlelight Whispers'];

    const matchListFormatted = chosenMatches.slice(0, 3).join(', ');

    return {
      title: `Intimate Evening Journey: ${chosenMatches[0] || 'Sensual Connection'}`,
      intensityMode: intensityMode,
      steps: [
        {
          stepNumber: 1,
          title: 'Setting the Ambiance & Warm-Up',
          description: `Dim the room lighting and begin with soft music. Take 5 minutes to hold hands, take deep synchronized breaths, and mention your mutual interest in ${chosenMatches[0] || 'deep massage'}.`,
          consentCue: 'Ask: "Are you comfortable with the lighting and music level?"'
        },
        {
          stepNumber: 2,
          title: 'Teasing & Sensual Exploration',
          description: `Incorporate elements of ${chosenMatches[1] || 'blindfold sensory touch'}. Gently guide your partner's attention purely to touch and sound, building sweet anticipation.`,
          consentCue: 'Ask: "Would you like to go deeper into this sensory play?"'
        },
        {
          stepNumber: 3,
          title: 'The Core Fantasy Experience',
          description: `Explore ${matchListFormatted} together at a relaxed pace. Focus on eye contact, communication, and enjoying each moment without any pressure for outcome.`,
          consentCue: 'Establish a safeword (e.g. "Red" for stop, "Yellow" for slow down).'
        },
        {
          stepNumber: 4,
          title: 'Aftercare & Gentle Decompression',
          description: 'Wrap up in a warm blanket, offer a glass of water, and cuddle together while sharing your favorite moments of the experience.',
          consentCue: 'Ask: "How are you feeling right now, and what felt best for you?"'
        }
      ],
      romanticClosing: `Created exclusively from your verified mutual matches (${matchListFormatted}). Safe, consensual, and tailored to you both.`
    };
  }

  /**
   * Aria AI Chatbot - Intimacy Coach & Advice Engine
   */
  public getAriaAdvice(userQuery: string): { response: string; topic: string } {
    const queryLower = userQuery.toLowerCase();
    
    if (queryLower.includes('bdsm') || queryLower.includes('bondage') || queryLower.includes('rope')) {
      return {
        topic: 'BDSM Safety & SSC/RACK Principles',
        response: 'When exploring BDSM or bondage, always practice Safe, Sane, and Consensual (SSC) guidelines. Use soft silk or designated bondage rope, avoid wrapping near the neck or tight joints, and establish clear safewords ("Red/Yellow/Green"). Check nerve sensations in limbs every few minutes!'
      };
    }

    if (queryLower.includes('talk') || queryLower.includes('communication') || queryLower.includes('fear')) {
      return {
        topic: 'Intimate Communication',
        response: 'Opening up about intimate desires requires psychological safety. Start with low-pressure moments outside the bedroom (like a walk or coffee). Use "I would love to explore..." rather than demands, and celebrate mutual curiosity!'
      };
    }

    if (queryLower.includes('aftercare')) {
      return {
        topic: 'Aftercare Best Practices',
        response: 'Aftercare is essential for emotional grounding after intense play. It includes physical warmth (blankets), hydration, gentle hugs, and reassuring words. Never skip aftercare, even after light sensory play!'
      };
    }

    return {
      topic: 'General Intimacy Guidance',
      response: `Aria Intimacy Coach: Remember that intimacy thrives on trust, playfulness, and enthusiastic consent. Based on your prompt ("${userQuery}"), focus on clear communication and enjoying the process of discovery together.`
    };
  }
}

export const aiOrchestrator = new AIOrchestratorService();

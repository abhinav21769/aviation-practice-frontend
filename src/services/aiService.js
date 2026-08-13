// AI service — handles offline smart mock responses & ready for LLM API integration (OpenAI, Gemini, Anthropic).

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

const AIRLINE_PROMPTS = {
  Emirates: [
    'Why do you specifically want to move to Dubai and work for Emirates?',
    'Emirates represents over 160 nationalities. How do you adapt your communication style in multicultural teams?',
    'Describe a situation where you delivered luxury customer service exceeding customer expectations.',
    'How would you handle a demanding First Class passenger requesting an item that is out of stock?',
  ],
  'Qatar Airways': [
    'Qatar Airways is known for 5-star service. What does 5-star service mean to you in practice?',
    'How do you maintain high energy and immaculate grooming during a 14-hour long-haul flight?',
    'Describe a time you followed strict protocol even when it was inconvenient.',
  ],
  'Singapore Airlines': [
    'Singapore Airlines sets the global benchmark for hospitality. How do you embody warmth and attention to detail?',
    'Give an example of how you handle high-pressure situations with grace and composure.',
  ],
  'Delta Air Lines': [
    'Why Delta? How do your personal values align with Delta\'s culture of safety and service?',
    'Tell me about a time you turned a dissatisfied customer into a loyal advocate.',
  ],
  'British Airways': [
    'How do you embody British Airways\' heritage of premium hospitality and safety standards?',
    'Describe a challenge you faced working with a diverse team and how you resolved it.',
  ],
};

const DYNAMIC_SCENARIOS = [
  {
    title: 'Medical Distress & Anxious Passenger',
    situation: 'During boarding, a passenger in row 14 hyperventilates and states they are having a panic attack, blocking the aisle while other passengers are trying to board.',
    options: [
      { id: 'A', text: 'Ask them to step aside into the galley so you can offer water and calm them without blocking boarding.' },
      { id: 'B', text: 'Tell them to take their seat immediately so boarding can continue on schedule.' },
      { id: 'C', text: 'Call for emergency medical services immediately on the PA system.' },
    ],
    bestAnswer: 'A',
    explanation: 'Stepping the passenger into the galley calms them in a private space while maintaining passenger flow and cabin safety during boarding.',
    keySkills: ['Empathy', 'De-escalation', 'Flow Management'],
    difficulty: 'medium',
    category: 'difficult_passengers',
  },
  {
    title: 'Unruly Passenger & Cabin Safety',
    situation: 'During descent, a passenger insists on standing up to retrieve a laptop from the overhead bin despite the seatbelt sign being illuminated.',
    options: [
      { id: 'A', text: 'Shout at them to sit down immediately.' },
      { id: 'B', text: 'Use a firm, calm, and clear command: "Sir/Madam, for your safety we are landing — please remain seated immediately."' },
      { id: 'C', text: 'Ignore them since descent has already started.' },
    ],
    bestAnswer: 'B',
    explanation: 'Safety requires assertive, clear communication without escalating into aggression. Firm authority protects passengers during critical flight phases.',
    keySkills: ['Safety Priority', 'Assertiveness', 'Composure'],
    difficulty: 'hard',
    category: 'safety_first',
  },
];

const mockFeedbacks = {
  communication: [84, 78, 90, 82, 88, 76, 85],
  confidence: [78, 85, 82, 74, 91, 79, 86],
  grammar: [92, 88, 95, 84, 96, 89, 91],
  structure: [85, 76, 89, 72, 92, 80, 87],
  professionalism: [90, 84, 94, 82, 95, 86, 91],
};

const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

export const aiService = {
  /**
   * Generates dynamic interview questions based on airline or topic.
   */
  async generateDynamicQuestion(category = 'general', airline = null) {
    await delay(700);
    if (airline && AIRLINE_PROMPTS[airline]) {
      const qText = getRandom(AIRLINE_PROMPTS[airline]);
      return {
        id: `ai-q-${Date.now()}`,
        question: qText,
        category: 'airline',
        airline,
        difficulty: 'medium',
        whatTheyLookFor: `Interviewers at ${airline} are looking for alignment with their brand values, cultural adaptability, and structured STAR answers.`,
        framework: 'Use STAR: Situation → Task → Action → Result. Explicitly link your experience to ' + airline + '\'s service standards.',
        exampleAnswer: `I chose ${airline} because of your reputation for excellence. In my previous role, I demonstrated this when I...`,
        starApplicable: true,
        isAiGenerated: true,
      };
    }

    const genericAiQuestions = [
      'Describe a time you had to adapt quickly to an unexpected change in rules or procedures.',
      'How do you build trust with passengers who speak little to no English?',
      'Tell me about a situation where you noticed a safety risk before anyone else did.',
      'How do you manage stress when working long hours in a confined space?',
      'What would you do if a colleague was not carrying out their safety duties correctly?',
    ];

    const qText = getRandom(genericAiQuestions);
    return {
      id: `ai-q-${Date.now()}`,
      question: qText,
      category,
      difficulty: 'hard',
      whatTheyLookFor: 'Self-awareness, safety vigilance, and professional team communication.',
      framework: 'State your core action clearly, describe the outcome, and explain what you learned.',
      exampleAnswer: 'When faced with this situation, my priority was safety and open communication...',
      starApplicable: true,
      isAiGenerated: true,
    };
  },

  /**
   * Generates a fresh AI situational scenario.
   */
  async generateDynamicScenario() {
    await delay(800);
    const sc = getRandom(DYNAMIC_SCENARIOS);
    return {
      ...sc,
      id: `ai-sc-${Date.now()}`,
      isAiGenerated: true,
    };
  },

  /**
   * Evaluates candidate interview response.
   */
  async evaluateInterviewResponse(question, answer) {
    await delay(1200 + Math.random() * 600);

    if (!answer || answer.trim().length < 20) {
      return {
        scores: {
          communication: 48,
          confidence: 42,
          grammar: 52,
          structure: 38,
          professionalism: 50,
        },
        overallScore: 46,
        strengths: ['You initiated an answer to the prompt.'],
        improvements: [
          'Answer is too brief. Aim for 60–90 seconds (100–180 words).',
          'Add a specific real-world example to build credibility.',
          'Use the STAR framework (Situation, Task, Action, Result).',
        ],
        strongerVersion:
          'A stronger answer leads with a clear statement, provides a concrete example of your actions, and connects directly to cabin crew safety & hospitality.',
        tip: 'Focus on quality over length: Situation → Action → Positive Result.',
      };
    }

    const scores = {
      communication: getRandom(mockFeedbacks.communication),
      confidence: getRandom(mockFeedbacks.confidence),
      grammar: getRandom(mockFeedbacks.grammar),
      structure: getRandom(mockFeedbacks.structure),
      professionalism: getRandom(mockFeedbacks.professionalism),
    };
    const overallScore = Math.round(
      Object.values(scores).reduce((a, b) => a + b, 0) / Object.keys(scores).length
    );

    return {
      scores,
      overallScore,
      strengths: [
        'Clear tone with professional vocabulary appropriate for cabin crew.',
        'Good structure linking your experience directly to passenger safety and comfort.',
      ],
      improvements: [
        'Consider emphasizing your personal action ("I did") over general team actions.',
        'Add one specific quantifiable or positive outcome to close your response.',
      ],
      strongerVersion: `For "${question}", lead with your key strength, detail your specific intervention, and close with the positive passenger outcome.`,
      tip: 'Remember: Safety comes first, followed immediately by empathy and clear communication.',
    };
  },

  /**
   * Generates feedback for a written exercise answer.
   */
  async generateAnswerFeedback(original, userAttempt) {
    await delay(800);
    const isSubstantial = userAttempt.trim().length > 25;
    return {
      score: isSubstantial ? Math.floor(78 + Math.random() * 18) : Math.floor(40 + Math.random() * 25),
      feedback: isSubstantial
        ? 'Excellent improvement! You replaced direct commands with polite requests and maintained passenger dignity.'
        : 'Your version can be softened further. Use markers like "Could you please..." or "May I ask you to..." to sound naturally warm.',
      professionalism: isSubstantial ? Math.floor(82 + Math.random() * 15) : Math.floor(45 + Math.random() * 25),
      empathy: isSubstantial ? Math.floor(78 + Math.random() * 18) : Math.floor(40 + Math.random() * 25),
      clarity: isSubstantial ? Math.floor(80 + Math.random() * 16) : Math.floor(50 + Math.random() * 25),
    };
  },

  /**
   * Evaluates a passenger response.
   */
  async evaluatePassengerResponse(passengerStatement, userResponse) {
    await delay(900);
    const isSubstantial = userResponse.trim().split(' ').length >= 15;
    return {
      professionalism: isSubstantial ? Math.floor(80 + Math.random() * 16) : Math.floor(45 + Math.random() * 25),
      empathy: isSubstantial ? Math.floor(78 + Math.random() * 18) : Math.floor(40 + Math.random() * 25),
      clarity: isSubstantial ? Math.floor(82 + Math.random() * 14) : Math.floor(50 + Math.random() * 25),
      grammar: isSubstantial ? Math.floor(85 + Math.random() * 12) : Math.floor(55 + Math.random() * 25),
      tone: isSubstantial ? Math.floor(82 + Math.random() * 15) : Math.floor(42 + Math.random() * 28),
      feedback: isSubstantial
        ? 'Great response! You validated the passenger\'s experience and provided a clear path forward.'
        : 'Ensure your response contains three parts: (1) Acknowledge feelings, (2) Explain constraints calmly, (3) Offer an alternative.',
    };
  },
};

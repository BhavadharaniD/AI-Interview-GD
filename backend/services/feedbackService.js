const axios = require('axios');

/**
 * Analyze session and generate comprehensive feedback
 * @param {object} params - Analysis parameters
 * @returns {object} Feedback analysis
 */
const analyzeSession = async ({ session, scores, transcript, aiResponses }) => {
  const startTime = Date.now();

  try {
    // Generate AI-powered analysis if API is available
    if (process.env.OPENAI_API_KEY) {
      return await generateAIFeedback({ session, scores, transcript, aiResponses, startTime });
    }

    // Fallback to rule-based analysis
    return generateRuleBasedFeedback({ session, scores, transcript, aiResponses, startTime });

  } catch (error) {
    console.error('Feedback analysis error:', error.message);
    return generateRuleBasedFeedback({ session, scores, transcript, aiResponses, startTime });
  }
};

/**
 * Generate AI-powered feedback using OpenAI
 * @param {object} params - Parameters
 * @returns {object} AI feedback
 */
const generateAIFeedback = async ({ session, scores, transcript, aiResponses, startTime }) => {
  try {
    const userText = transcript
      .filter(t => t.speaker === 'user')
      .map(t => t.message)
      .join(' ');

    const prompt = `Analyze this ${session.sessionType} session on "${session.topic}":

User's responses: ${userText.substring(0, 1000)}

Scores:
- Fluency: ${scores.fluency}/100
- Grammar: ${scores.grammar}/100
- Clarity: ${scores.clarity}/100
- Relevance: ${scores.relevance}/100
- Confidence: ${scores.confidence}/100

Provide detailed feedback in JSON format with:
1. strengths (array of {title, description, examples})
2. areasForImprovement (array of {title, description, priority, examples})
3. tips (array of {category, tip, isActionable})
4. overallSummary (string)
5. fluencyAnalysis (object with detailed analysis)
6. clarityAnalysis (string)
7. relevanceAnalysis (string)

Keep responses constructive and encouraging.`;

    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4',
        messages: [
          { role: 'system', content: 'You are an expert communication coach providing detailed, constructive feedback.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        response_format: { type: 'json_object' }
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const aiAnalysis = JSON.parse(response.data.choices[0].message.content);
    const processingTime = Date.now() - startTime;

    return {
      ...aiAnalysis,
      processingTime,
      grammarErrors: detectGrammarErrors(userText),
      vocabularyStats: analyzeVocabulary(userText),
      emotionalAnalysis: analyzeEmotion(userText),
      recommendations: generateRecommendations(scores),
      questionAnalysis: analyzeQuestionResponses(aiResponses)
    };

  } catch (error) {
    console.error('AI feedback generation error:', error.message);
    throw error;
  }
};

/**
 * Generate rule-based feedback
 * @param {object} params - Parameters
 * @returns {object} Rule-based feedback
 */
const generateRuleBasedFeedback = ({ session, scores, transcript, aiResponses, startTime }) => {
  const userText = transcript
    .filter(t => t.speaker === 'user')
    .map(t => t.message)
    .join(' ');

  const strengths = identifyStrengths(scores);
  const areasForImprovement = identifyWeaknesses(scores);
  const tips = generateTips(scores, session.sessionType);
  const overallSummary = generateSummary(scores, session);

  return {
    strengths,
    areasForImprovement,
    tips,
    overallSummary,
    fluencyAnalysis: analyzeFluency(scores.fluency, session.audioMetadata),
    clarityAnalysis: analyzeClarity(scores.clarity),
    relevanceAnalysis: analyzeRelevance(scores.relevance),
    grammarErrors: detectGrammarErrors(userText),
    vocabularyStats: analyzeVocabulary(userText),
    emotionalAnalysis: analyzeEmotion(userText),
    recommendations: generateRecommendations(scores),
    questionAnalysis: analyzeQuestionResponses(aiResponses),
    processingTime: Date.now() - startTime
  };
};

/**
 * Identify strengths based on scores
 * @param {object} scores - Performance scores
 * @returns {array} Strengths
 */
const identifyStrengths = (scores) => {
  const strengths = [];

  if (scores.fluency >= 80) {
    strengths.push({
      title: 'Excellent Fluency',
      description: 'Your speech flows naturally with minimal hesitation.',
      examples: ['Smooth delivery', 'Natural pace', 'Minimal filler words']
    });
  }

  if (scores.grammar >= 80) {
    strengths.push({
      title: 'Strong Grammar',
      description: 'You demonstrate excellent command of grammatical structures.',
      examples: ['Correct sentence formation', 'Proper tense usage']
    });
  }

  if (scores.clarity >= 80) {
    strengths.push({
      title: 'Clear Communication',
      description: 'Your ideas are well-organized and easy to understand.',
      examples: ['Logical structure', 'Clear articulation']
    });
  }

  if (scores.vocabulary >= 80) {
    strengths.push({
      title: 'Rich Vocabulary',
      description: 'You use diverse and appropriate vocabulary.',
      examples: ['Varied word choice', 'Context-appropriate language']
    });
  }

  if (scores.confidence >= 80) {
    strengths.push({
      title: 'Confident Delivery',
      description: 'You speak with assurance and conviction.',
      examples: ['Steady voice', 'Minimal hesitation']
    });
  }

  return strengths.length > 0 ? strengths : [{
    title: 'Good Effort',
    description: 'You completed the session and showed engagement.',
    examples: ['Active participation']
  }];
};

/**
 * Identify areas for improvement
 * @param {object} scores - Performance scores
 * @returns {array} Areas for improvement
 */
const identifyWeaknesses = (scores) => {
  const weaknesses = [];

  if (scores.fluency < 60) {
    weaknesses.push({
      title: 'Improve Fluency',
      description: 'Work on reducing pauses and filler words to speak more smoothly.',
      priority: 'high',
      examples: ['Practice speaking without interruption', 'Reduce "um" and "uh"']
    });
  }

  if (scores.grammar < 60) {
    weaknesses.push({
      title: 'Grammar Enhancement',
      description: 'Focus on improving grammatical accuracy in your responses.',
      priority: 'high',
      examples: ['Review verb tenses', 'Practice sentence structure']
    });
  }

  if (scores.clarity < 60) {
    weaknesses.push({
      title: 'Enhance Clarity',
      description: 'Organize your thoughts better before speaking.',
      priority: 'medium',
      examples: ['Use clear topic sentences', 'Provide examples']
    });
  }

  if (scores.vocabulary < 60) {
    weaknesses.push({
      title: 'Expand Vocabulary',
      description: 'Work on using more varied and precise vocabulary.',
      priority: 'medium',
      examples: ['Learn industry-specific terms', 'Use synonyms']
    });
  }

  if (scores.confidence < 60) {
    weaknesses.push({
      title: 'Build Confidence',
      description: 'Practice more to reduce hesitation and speak with more assurance.',
      priority: 'high',
      examples: ['Practice regularly', 'Record yourself speaking']
    });
  }

  return weaknesses;
};

/**
 * Generate actionable tips
 * @param {object} scores - Performance scores
 * @param {string} sessionType - Type of session
 * @returns {array} Tips
 */
const generateTips = (scores, sessionType) => {
  const tips = [
    {
      category: 'general',
      tip: 'Practice speaking daily for at least 10-15 minutes to build consistency.',
      isActionable: true
    }
  ];

  if (scores.fluency < 70) {
    tips.push({
      category: 'fluency',
      tip: 'Read aloud regularly to improve your speaking rhythm and reduce hesitation.',
      isActionable: true
    });
  }

  if (scores.grammar < 70) {
    tips.push({
      category: 'grammar',
      tip: 'Review common grammar patterns and practice constructing sentences.',
      isActionable: true
    });
  }

  if (scores.clarity < 70) {
    tips.push({
      category: 'content',
      tip: 'Use the STAR method (Situation, Task, Action, Result) to structure your responses.',
      isActionable: true
    });
  }

  if (scores.confidence < 70) {
    tips.push({
      category: 'confidence',
      tip: 'Practice with a mirror or record yourself to become more comfortable speaking.',
      isActionable: true
    });
  }

  if (sessionType === 'interview') {
    tips.push({
      category: 'general',
      tip: 'Research common interview questions and prepare structured answers.',
      isActionable: true
    });
  }

  return tips;
};

/**
 * Generate overall summary
 * @param {object} scores - Performance scores
 * @param {object} session - Session object
 * @returns {string} Summary
 */
const generateSummary = (scores, session) => {
  const avgScore = Math.round(
    (scores.fluency + scores.grammar + scores.clarity + scores.relevance + scores.confidence) / 5
  );

  let performance = 'good';
  if (avgScore >= 80) performance = 'excellent';
  else if (avgScore >= 70) performance = 'very good';
  else if (avgScore < 60) performance = 'needs improvement';

  return `You completed a ${session.sessionType} session on "${session.topic}" with ${performance} performance. 
Your average score was ${avgScore}/100. ${
    avgScore >= 70 
      ? 'Keep up the good work and continue practicing regularly.' 
      : 'Focus on the improvement areas highlighted and practice consistently.'
  }`;
};

/**
 * Analyze fluency in detail
 * @param {number} score - Fluency score
 * @param {object} audioMetadata - Audio metadata
 * @returns {object} Fluency analysis
 */
const analyzeFluency = (score, audioMetadata) => {
  return {
    wordsPerMinute: audioMetadata.wordsPerMinute,
    pauseFrequency: audioMetadata.pauseCount > 10 ? 'high' : audioMetadata.pauseCount > 5 ? 'medium' : 'low',
    fillerWordCount: audioMetadata.fillerWords,
    smoothness: score
  };
};

/**
 * Analyze clarity
 * @param {number} score - Clarity score
 * @returns {string} Clarity analysis
 */
const analyzeClarity = (score) => {
  if (score >= 80) {
    return 'Your communication is clear and well-structured. Ideas flow logically.';
  } else if (score >= 60) {
    return 'Your communication is generally clear but could be more organized.';
  } else {
    return 'Work on organizing your thoughts before speaking to improve clarity.';
  }
};

/**
 * Analyze relevance
 * @param {number} score - Relevance score
 * @returns {string} Relevance analysis
 */
const analyzeRelevance = (score) => {
  if (score >= 80) {
    return 'Your responses were highly relevant and on-topic throughout.';
  } else if (score >= 60) {
    return 'Most of your responses were relevant, but some could be more focused.';
  } else {
    return 'Focus more on staying on topic and addressing the questions directly.';
  }
};

/**
 * Detect grammar errors (simplified)
 * @param {string} text - Text to analyze
 * @returns {array} Grammar errors
 */
const detectGrammarErrors = (text) => {
  // This is a simplified version. In production, use a proper grammar checker API
  const errors = [];

  // Check for common errors (simplified)
  if (text.match(/\bdid\s+went\b/gi)) {
    errors.push({
      type: 'tense',
      original: 'did went',
      correction: 'went',
      explanation: 'Use simple past tense, not past with auxiliary'
    });
  }

  return errors;
};

/**
 * Analyze vocabulary
 * @param {string} text - Text to analyze
 * @returns {object} Vocabulary statistics
 */
const analyzeVocabulary = (text) => {
  const words = text.toLowerCase().split(/\s+/).filter(w => w.length > 3);
  const uniqueWords = new Set(words);

  return {
    uniqueWords: uniqueWords.size,
    complexWordUsage: Math.round((uniqueWords.size / words.length) * 100),
    repetitionRate: Math.round((1 - uniqueWords.size / words.length) * 100)
  };
};

/**
 * Analyze emotional tone
 * @param {string} text - Text to analyze
 * @returns {object} Emotional analysis
 */
const analyzeEmotion = (text) => {
  // Simplified emotion analysis
  const positiveWords = text.match(/\b(excited|happy|great|excellent|wonderful|amazing)\b/gi) || [];
  const negativeWords = text.match(/\b(difficult|challenge|problem|issue|concern)\b/gi) || [];

  let tone = 'neutral';
  if (positiveWords.length > negativeWords.length) tone = 'enthusiastic';
  else if (negativeWords.length > positiveWords.length) tone = 'hesitant';

  return {
    overallTone: tone,
    engagement: Math.min(100, (positiveWords.length + negativeWords.length) * 10 + 50),
    energyLevel: positiveWords.length > 3 ? 'high' : 'moderate'
  };
};

/**
 * Generate recommendations
 * @param {object} scores - Performance scores
 * @returns {object} Recommendations
 */
const generateRecommendations = (scores) => {
  const nextSteps = [];
  const practiceAreas = [];

  if (scores.fluency < 70) practiceAreas.push('fluency');
  if (scores.grammar < 70) practiceAreas.push('grammar');
  if (scores.confidence < 70) practiceAreas.push('confidence');

  nextSteps.push('Schedule regular practice sessions (3-4 times per week)');
  nextSteps.push('Record yourself and review to identify improvement areas');
  nextSteps.push('Practice with different types of questions and scenarios');

  return {
    nextSteps,
    practiceAreas,
    resources: [
      { title: 'Speaking Practice Tips', type: 'article', url: '/resources/speaking-tips' },
      { title: 'Interview Questions Guide', type: 'article', url: '/resources/interview-guide' }
    ]
  };
};

/**
 * Analyze question-response pairs
 * @param {array} aiResponses - AI responses array
 * @returns {array} Question analysis
 */
const analyzeQuestionResponses = (aiResponses) => {
  return aiResponses.slice(0, 5).map((response, index) => ({
    question: response.question,
    userResponse: response.userAnswer.substring(0, 200),
    rating: Math.floor(Math.random() * 2) + 3, // 3-5 rating (simplified)
    feedback: 'Good response with relevant details.',
    suggestedImprovement: 'Consider adding specific examples to strengthen your answer.'
  }));
};

/**
 * Generate improvement suggestions based on recent feedback
 * @param {array} recentFeedbacks - Recent feedback array
 * @returns {array} Improvement suggestions
 */
const generateImprovementSuggestions = async (recentFeedbacks) => {
  // Analyze patterns across recent sessions
  const commonWeaknesses = {};

  recentFeedbacks.forEach(feedback => {
    feedback.areasForImprovement.forEach(area => {
      const key = area.title;
      commonWeaknesses[key] = (commonWeaknesses[key] || 0) + 1;
    });
  });

  const suggestions = [];

  // Get most common weakness
  const sortedWeaknesses = Object.entries(commonWeaknesses)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  sortedWeaknesses.forEach(([weakness, count]) => {
    suggestions.push(`Focus on: ${weakness} (appeared in ${count} recent sessions)`);
  });

  if (suggestions.length === 0) {
    suggestions.push('Keep practicing regularly to maintain your progress');
  }

  return suggestions;
};

module.exports = {
  analyzeSession,
  generateImprovementSuggestions
};
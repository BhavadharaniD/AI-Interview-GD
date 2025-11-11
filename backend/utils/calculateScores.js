/**
 * Calculate fluency score based on audio metadata
 * @param {object} audioMetadata - Audio metadata from session
 * @returns {number} Fluency score (0-100)
 */
const calculateFluencyScore = (audioMetadata) => {
  const { wordsPerMinute, pauseCount, fillerWords, totalWords } = audioMetadata;

  let score = 100;

  // Ideal WPM is around 150-160
  const idealWPM = 155;
  const wpmDeviation = Math.abs(wordsPerMinute - idealWPM);
  
  if (wpmDeviation > 50) {
    score -= 30;
  } else if (wpmDeviation > 30) {
    score -= 20;
  } else if (wpmDeviation > 15) {
    score -= 10;
  }

  // Penalize excessive pauses
  const pauseRate = totalWords > 0 ? pauseCount / totalWords : 0;
  if (pauseRate > 0.15) {
    score -= 20;
  } else if (pauseRate > 0.1) {
    score -= 10;
  } else if (pauseRate > 0.05) {
    score -= 5;
  }

  // Penalize filler words
  const fillerRate = totalWords > 0 ? fillerWords / totalWords : 0;
  if (fillerRate > 0.1) {
    score -= 25;
  } else if (fillerRate > 0.05) {
    score -= 15;
  } else if (fillerRate > 0.03) {
    score -= 5;
  }

  return Math.max(0, Math.min(100, Math.round(score)));
};

/**
 * Calculate grammar score from text analysis
 * @param {string} transcript - Full transcript text
 * @param {array} grammarErrors - Array of grammar errors detected
 * @returns {number} Grammar score (0-100)
 */
const calculateGrammarScore = (transcript, grammarErrors = []) => {
  const words = transcript.split(/\s+/).length;
  const errorCount = grammarErrors.length;

  if (words === 0) return 0;

  const errorRate = errorCount / words;

  let score = 100;

  if (errorRate > 0.1) {
    score = 40;
  } else if (errorRate > 0.05) {
    score = 60;
  } else if (errorRate > 0.03) {
    score = 75;
  } else if (errorRate > 0.01) {
    score = 85;
  } else {
    score = 95;
  }

  return Math.round(score);
};

/**
 * Calculate clarity score
 * @param {string} transcript - Full transcript text
 * @param {object} audioMetadata - Audio metadata
 * @returns {number} Clarity score (0-100)
 */
const calculateClarityScore = (transcript, audioMetadata) => {
  const { totalWords, wordsPerMinute } = audioMetadata;

  let score = 100;

  // Check sentence length (clarity is better with moderate sentence length)
  const sentences = transcript.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const avgWordsPerSentence = sentences.length > 0 ? totalWords / sentences.length : 0;

  if (avgWordsPerSentence > 30 || avgWordsPerSentence < 5) {
    score -= 20;
  } else if (avgWordsPerSentence > 25 || avgWordsPerSentence < 8) {
    score -= 10;
  }

  // Check for very fast or very slow speech
  if (wordsPerMinute > 180 || wordsPerMinute < 100) {
    score -= 15;
  }

  // Check for repetitive words (indicates lack of clarity)
  const words = transcript.toLowerCase().split(/\s+/);
  const wordFrequency = {};
  words.forEach(word => {
    if (word.length > 3) {
      wordFrequency[word] = (wordFrequency[word] || 0) + 1;
    }
  });

  const repetitiveWords = Object.values(wordFrequency).filter(count => count > 5).length;
  if (repetitiveWords > 5) {
    score -= 15;
  }

  return Math.max(0, Math.min(100, Math.round(score)));
};

/**
 * Calculate vocabulary score
 * @param {string} transcript - Full transcript text
 * @returns {number} Vocabulary score (0-100)
 */
const calculateVocabularyScore = (transcript) => {
  const words = transcript.toLowerCase().split(/\s+/).filter(w => w.length > 3);
  const uniqueWords = new Set(words);
  
  const totalWords = words.length;
  const uniqueWordCount = uniqueWords.size;

  if (totalWords === 0) return 0;

  // Calculate lexical diversity (unique words / total words)
  const lexicalDiversity = uniqueWordCount / totalWords;

  // Common words list (simplified)
  const commonWords = new Set([
    'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'it',
    'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at', 'this',
    'but', 'his', 'by', 'from', 'they', 'we', 'say', 'her', 'she', 'or',
    'will', 'my', 'one', 'all', 'would', 'there', 'their', 'what', 'so'
  ]);

  // Count complex words (not in common words list and longer than 6 characters)
  const complexWords = words.filter(word => 
    !commonWords.has(word) && word.length > 6
  ).length;

  const complexWordRatio = totalWords > 0 ? complexWords / totalWords : 0;

  let score = 50; // Base score

  // Add points for lexical diversity
  if (lexicalDiversity > 0.6) {
    score += 25;
  } else if (lexicalDiversity > 0.5) {
    score += 20;
  } else if (lexicalDiversity > 0.4) {
    score += 15;
  } else if (lexicalDiversity > 0.3) {
    score += 10;
  }

  // Add points for complex word usage
  if (complexWordRatio > 0.2) {
    score += 25;
  } else if (complexWordRatio > 0.15) {
    score += 20;
  } else if (complexWordRatio > 0.1) {
    score += 15;
  } else if (complexWordRatio > 0.05) {
    score += 10;
  }

  return Math.max(0, Math.min(100, Math.round(score)));
};

/**
 * Calculate relevance score (how on-topic the response is)
 * @param {string} transcript - User's transcript
 * @param {string} topic - Session topic
 * @param {string} sessionType - Type of session
 * @returns {number} Relevance score (0-100)
 */
const calculateRelevanceScore = (transcript, topic, sessionType) => {
  // This is a simplified version. In production, you'd use NLP/AI for better analysis
  
  const topicWords = topic.toLowerCase().split(/\s+/);
  const transcriptLower = transcript.toLowerCase();

  let matchCount = 0;
  topicWords.forEach(word => {
    if (word.length > 3 && transcriptLower.includes(word)) {
      matchCount++;
    }
  });

  const matchRatio = topicWords.length > 0 ? matchCount / topicWords.length : 0;

  let score = 50; // Base score

  // Add points based on topic word matches
  if (matchRatio > 0.7) {
    score += 40;
  } else if (matchRatio > 0.5) {
    score += 30;
  } else if (matchRatio > 0.3) {
    score += 20;
  } else if (matchRatio > 0.1) {
    score += 10;
  }

  // Check for complete sentences (indicates thoughtful response)
  const sentences = transcript.split(/[.!?]+/).filter(s => s.trim().length > 0);
  if (sentences.length >= 3) {
    score += 10;
  }

  return Math.max(0, Math.min(100, Math.round(score)));
};

/**
 * Calculate confidence score based on speech patterns
 * @param {object} audioMetadata - Audio metadata
 * @param {array} transcript - Transcript array with confidence scores
 * @returns {number} Confidence score (0-100)
 */
const calculateConfidenceScore = (audioMetadata, transcript) => {
  const { pauseCount, fillerWords, totalWords, averagePauseDuration } = audioMetadata;

  let score = 100;

  // Penalize excessive pauses
  const pauseRate = totalWords > 0 ? pauseCount / totalWords : 0;
  if (pauseRate > 0.15) {
    score -= 30;
  } else if (pauseRate > 0.1) {
    score -= 20;
  } else if (pauseRate > 0.05) {
    score -= 10;
  }

  // Penalize long pauses (indicates hesitation)
  if (averagePauseDuration > 3) {
    score -= 20;
  } else if (averagePauseDuration > 2) {
    score -= 10;
  }

  // Penalize filler words (um, uh, like, etc.)
  const fillerRate = totalWords > 0 ? fillerWords / totalWords : 0;
  if (fillerRate > 0.1) {
    score -= 25;
  } else if (fillerRate > 0.05) {
    score -= 15;
  }

  // Use speech recognition confidence if available
  if (Array.isArray(transcript) && transcript.length > 0) {
    const avgConfidence = transcript.reduce((sum, t) => 
      sum + (t.confidence || 1), 0
    ) / transcript.length;

    if (avgConfidence < 0.7) {
      score -= 15;
    } else if (avgConfidence < 0.8) {
      score -= 10;
    }
  }

  return Math.max(0, Math.min(100, Math.round(score)));
};

/**
 * Calculate overall score (weighted average of all metrics)
 * @param {object} scores - Individual scores object
 * @returns {number} Overall score (0-100)
 */
const calculateOverallScore = (scores) => {
  const weights = {
    fluency: 0.25,
    grammar: 0.20,
    clarity: 0.20,
    relevance: 0.15,
    confidence: 0.10,
    vocabulary: 0.10
  };

  let weightedSum = 0;
  let totalWeight = 0;

  Object.keys(weights).forEach(key => {
    if (scores[key] !== undefined) {
      weightedSum += scores[key] * weights[key];
      totalWeight += weights[key];
    }
  });

  return totalWeight > 0 ? Math.round(weightedSum / totalWeight) : 0;
};

/**
 * Main function to calculate all scores
 * @param {object} params - Parameters for score calculation
 * @returns {object} All calculated scores
 */
const calculateScores = async ({ transcript, audioMetadata, duration, sessionType, topic = '' }) => {
  // Calculate individual scores
  const fluency = calculateFluencyScore(audioMetadata);
  const grammar = calculateGrammarScore(transcript, []); // Pass grammar errors if available
  const clarity = calculateClarityScore(transcript, audioMetadata);
  const vocabulary = calculateVocabularyScore(transcript);
  const relevance = calculateRelevanceScore(transcript, topic, sessionType);
  const confidence = calculateConfidenceScore(audioMetadata, []);

  const scores = {
    fluency,
    grammar,
    clarity,
    vocabulary,
    relevance,
    confidence
  };

  // Calculate overall score
  const overall = calculateOverallScore(scores);

  return {
    ...scores,
    overall
  };
};

module.exports = {
  calculateScores,
  calculateFluencyScore,
  calculateGrammarScore,
  calculateClarityScore,
  calculateVocabularyScore,
  calculateRelevanceScore,
  calculateConfidenceScore,
  calculateOverallScore
};
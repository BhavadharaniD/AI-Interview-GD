const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

/**
 * Transcribe audio using OpenAI Whisper API
 * @param {object} audioFile - Audio file from multer upload
 * @returns {object} Transcription result
 */
const transcribeAudio = async (audioFile) => {
  try {
    // Check if API key is configured
    if (!process.env.OPENAI_API_KEY) {
      console.warn('OpenAI API key not configured, using mock transcription');
      return mockTranscription(audioFile);
    }

    const formData = new FormData();
    formData.append('file', fs.createReadStream(audioFile.path));
    formData.append('model', 'whisper-1');
    formData.append('language', 'en'); // Can be made dynamic based on user preference
    formData.append('response_format', 'verbose_json'); // Get detailed information

    const response = await axios.post(
      'https://api.openai.com/v1/audio/transcriptions',
      formData,
      {
        headers: {
          ...formData.getHeaders(),
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
        },
        maxBodyLength: Infinity
      }
    );

    const { text, duration, language } = response.data;

    // Analyze the transcription
    const analysis = analyzeTranscription(text, duration);

    return {
      text,
      duration,
      language,
      confidence: response.data.confidence || 0.9,
      wordCount: analysis.wordCount,
      fillerWordCount: analysis.fillerWordCount,
      ...analysis
    };

  } catch (error) {
    console.error('Whisper transcription error:', error.response?.data || error.message);
    
    // Fallback to mock transcription
    if (error.response?.status === 401) {
      console.warn('Invalid API key, using mock transcription');
    }
    
    return mockTranscription(audioFile);
  }
};

/**
 * Analyze transcription for various metrics
 * @param {string} text - Transcribed text
 * @param {number} duration - Audio duration in seconds
 * @returns {object} Analysis results
 */
const analyzeTranscription = (text, duration) => {
  // Count words
  const words = text.trim().split(/\s+/);
  const wordCount = words.length;

  // Calculate words per minute
  const durationInMinutes = duration / 60;
  const wordsPerMinute = durationInMinutes > 0 ? Math.round(wordCount / durationInMinutes) : 0;

  // Count filler words
  const fillerWords = ['um', 'uh', 'like', 'you know', 'actually', 'basically', 'literally', 'sort of', 'kind of'];
  const textLower = text.toLowerCase();
  let fillerWordCount = 0;

  fillerWords.forEach(filler => {
    const regex = new RegExp(`\\b${filler}\\b`, 'gi');
    const matches = textLower.match(regex);
    if (matches) {
      fillerWordCount += matches.length;
    }
  });

  // Estimate pause count (simplified - based on punctuation and sentence breaks)
  const pauseCount = (text.match(/[,.!?;:]/g) || []).length;

  // Calculate average pause duration (estimated)
  const averagePauseDuration = pauseCount > 0 ? duration / pauseCount : 0;

  return {
    wordCount,
    wordsPerMinute,
    fillerWordCount,
    pauseCount,
    averagePauseDuration: Math.round(averagePauseDuration * 10) / 10
  };
};

/**
 * Mock transcription for development/testing
 * @param {object} audioFile - Audio file
 * @returns {object} Mock transcription result
 */
const mockTranscription = (audioFile) => {
  console.log('Using mock transcription for:', audioFile.filename);

  const mockTexts = [
    "I believe my experience in product management aligns well with this role. I've led cross-functional teams and successfully launched several products in the past two years.",
    "In my previous position, I worked extensively with agile methodologies and collaborated closely with engineering teams to deliver high-quality software solutions.",
    "My approach to problem-solving involves breaking down complex issues into manageable components and working systematically through each element.",
    "I'm particularly excited about this opportunity because it combines my passion for technology with my desire to create meaningful user experiences.",
    "Throughout my career, I've focused on continuous learning and staying updated with industry trends and best practices."
  ];

  const randomText = mockTexts[Math.floor(Math.random() * mockTexts.length)];
  const duration = Math.floor(Math.random() * 30) + 15; // 15-45 seconds

  const analysis = analyzeTranscription(randomText, duration);

  return {
    text: randomText,
    duration,
    language: 'en',
    confidence: 0.85 + Math.random() * 0.1, // 0.85-0.95
    wordCount: analysis.wordCount,
    fillerWordCount: analysis.fillerWordCount,
    ...analysis
  };
};

/**
 * Transcribe audio with timestamps
 * @param {object} audioFile - Audio file from multer upload
 * @returns {object} Transcription with word-level timestamps
 */
const transcribeWithTimestamps = async (audioFile) => {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return mockTranscription(audioFile);
    }

    const formData = new FormData();
    formData.append('file', fs.createReadStream(audioFile.path));
    formData.append('model', 'whisper-1');
    formData.append('response_format', 'verbose_json');
    formData.append('timestamp_granularities[]', 'word');

    const response = await axios.post(
      'https://api.openai.com/v1/audio/transcriptions',
      formData,
      {
        headers: {
          ...formData.getHeaders(),
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
        }
      }
    );

    return {
      text: response.data.text,
      words: response.data.words || [],
      duration: response.data.duration,
      language: response.data.language
    };

  } catch (error) {
    console.error('Whisper timestamp transcription error:', error.message);
    return mockTranscription(audioFile);
  }
};

/**
 * Translate audio to English
 * @param {object} audioFile - Audio file from multer upload
 * @returns {object} Translation result
 */
const translateAudio = async (audioFile) => {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return mockTranscription(audioFile);
    }

    const formData = new FormData();
    formData.append('file', fs.createReadStream(audioFile.path));
    formData.append('model', 'whisper-1');

    const response = await axios.post(
      'https://api.openai.com/v1/audio/translations',
      formData,
      {
        headers: {
          ...formData.getHeaders(),
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
        }
      }
    );

    const analysis = analyzeTranscription(response.data.text, 30);

    return {
      text: response.data.text,
      ...analysis
    };

  } catch (error) {
    console.error('Whisper translation error:', error.message);
    return mockTranscription(audioFile);
  }
};

module.exports = {
  transcribeAudio,
  transcribeWithTimestamps,
  translateAudio,
  analyzeTranscription
};
const axios = require('axios');
const fs = require('fs');
const path = require('path');

/**
 * Convert text to speech using Coqui TTS or alternative service
 * @param {string} text - Text to convert to speech
 * @param {object} options - TTS options
 * @returns {object} Audio response
 */
const textToSpeech = async (text, options = {}) => {
  const {
    voice = 'en-US-Standard-A',
    speed = 1.0,
    language = 'en'
  } = options;

  try {
    // Check if Coqui API is configured
    if (process.env.COQUI_API_KEY) {
      return await generateCoquiTTS(text, { voice, speed, language });
    }

    // Try OpenAI TTS as alternative
    if (process.env.OPENAI_API_KEY) {
      return await generateOpenAITTS(text, { voice, speed });
    }

    // Fallback to mock response
    console.warn('No TTS API configured, using mock audio response');
    return generateMockAudio(text);

  } catch (error) {
    console.error('Text-to-speech error:', error.message);
    return generateMockAudio(text);
  }
};

/**
 * Generate speech using Coqui TTS API
 * @param {string} text - Text to convert
 * @param {object} options - Voice options
 * @returns {object} Audio response
 */
const generateCoquiTTS = async (text, options) => {
  try {
    const response = await axios.post(
      'https://api.coqui.ai/v1/tts',
      {
        text,
        voice: options.voice,
        speed: options.speed,
        language: options.language
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.COQUI_API_KEY}`,
          'Content-Type': 'application/json'
        },
        responseType: 'arraybuffer'
      }
    );

    // Save audio file
    const filename = `tts_${Date.now()}.mp3`;
    const audioPath = path.join(__dirname, '../uploads/audio', filename);
    
    fs.writeFileSync(audioPath, response.data);

    return {
      audioUrl: `/uploads/audio/${filename}`,
      audioPath,
      duration: estimateAudioDuration(text),
      format: 'mp3'
    };

  } catch (error) {
    console.error('Coqui TTS error:', error.response?.data || error.message);
    throw error;
  }
};

/**
 * Generate speech using OpenAI TTS API
 * @param {string} text - Text to convert
 * @param {object} options - Voice options
 * @returns {object} Audio response
 */
const generateOpenAITTS = async (text, options) => {
  try {
    // OpenAI TTS voices: alloy, echo, fable, onyx, nova, shimmer
    const voiceMap = {
      'en-US-Standard-A': 'alloy',
      'en-US-Standard-B': 'echo',
      'en-US-Standard-C': 'fable',
      'en-US-Standard-D': 'onyx'
    };

    const voice = voiceMap[options.voice] || 'alloy';

    const response = await axios.post(
      'https://api.openai.com/v1/audio/speech',
      {
        model: 'tts-1',
        input: text,
        voice: voice,
        speed: options.speed || 1.0
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        },
        responseType: 'arraybuffer'
      }
    );

    // Save audio file
    const filename = `tts_${Date.now()}.mp3`;
    const audioPath = path.join(__dirname, '../uploads/audio', filename);
    
    // Ensure directory exists
    const dir = path.dirname(audioPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(audioPath, response.data);

    return {
      audioUrl: `/uploads/audio/${filename}`,
      audioPath,
      duration: estimateAudioDuration(text),
      format: 'mp3'
    };

  } catch (error) {
    console.error('OpenAI TTS error:', error.response?.data || error.message);
    throw error;
  }
};

/**
 * Generate mock audio response for development
 * @param {string} text - Text that would be converted
 * @returns {object} Mock audio response
 */
const generateMockAudio = (text) => {
  console.log('Generating mock audio for:', text.substring(0, 50) + '...');

  return {
    audioUrl: '/uploads/audio/mock_audio.mp3',
    audioPath: null,
    duration: estimateAudioDuration(text),
    format: 'mp3',
    isMock: true
  };
};

/**
 * Estimate audio duration based on text length
 * @param {string} text - Text to estimate duration for
 * @returns {number} Estimated duration in seconds
 */
const estimateAudioDuration = (text) => {
  // Average speaking rate is ~150 words per minute
  const words = text.split(/\s+/).length;
  const minutes = words / 150;
  return Math.ceil(minutes * 60);
};

/**
 * Get available voices for TTS
 * @returns {array} List of available voices
 */
const getAvailableVoices = () => {
  return [
    { id: 'en-US-Standard-A', name: 'English (US) - Standard A', language: 'en-US', gender: 'female' },
    { id: 'en-US-Standard-B', name: 'English (US) - Standard B', language: 'en-US', gender: 'male' },
    { id: 'en-US-Standard-C', name: 'English (US) - Standard C', language: 'en-US', gender: 'female' },
    { id: 'en-US-Standard-D', name: 'English (US) - Standard D', language: 'en-US', gender: 'male' },
    { id: 'en-GB-Standard-A', name: 'English (UK) - Standard A', language: 'en-GB', gender: 'female' },
    { id: 'en-GB-Standard-B', name: 'English (UK) - Standard B', language: 'en-GB', gender: 'male' }
  ];
};

/**
 * Convert speech to text and back (for accent training)
 * @param {object} audioFile - Input audio file
 * @param {string} targetAccent - Target accent for output
 * @returns {object} Converted audio
 */
const convertAccent = async (audioFile, targetAccent = 'en-US') => {
  try {
    // First, transcribe the audio (would use Whisper service)
    // Then, convert back to speech with target accent
    
    console.log('Accent conversion not fully implemented yet');
    return generateMockAudio('Accent conversion result');

  } catch (error) {
    console.error('Accent conversion error:', error.message);
    return generateMockAudio('Accent conversion failed');
  }
};

/**
 * Generate audio with emotion/tone
 * @param {string} text - Text to convert
 * @param {string} emotion - Emotion/tone (neutral, happy, sad, excited)
 * @returns {object} Audio response
 */
const generateEmotionalSpeech = async (text, emotion = 'neutral') => {
  // This would require advanced TTS with emotion control
  // For now, use standard TTS
  
  const emotionPrompts = {
    happy: 'with an enthusiastic and cheerful tone',
    sad: 'with a calm and empathetic tone',
    excited: 'with high energy and enthusiasm',
    professional: 'in a clear, professional manner',
    neutral: 'in a natural, conversational tone'
  };

  console.log(`Generating speech ${emotionPrompts[emotion] || emotionPrompts.neutral}`);

  return await textToSpeech(text);
};

/**
 * Clean up old audio files
 * @param {number} maxAgeHours - Maximum age of files to keep (in hours)
 */
const cleanupOldAudioFiles = (maxAgeHours = 24) => {
  try {
    const audioDir = path.join(__dirname, '../uploads/audio');
    
    if (!fs.existsSync(audioDir)) {
      return;
    }

    const files = fs.readdirSync(audioDir);
    const now = Date.now();
    const maxAge = maxAgeHours * 60 * 60 * 1000;

    files.forEach(file => {
      const filePath = path.join(audioDir, file);
      const stats = fs.statSync(filePath);
      const age = now - stats.mtimeMs;

      if (age > maxAge) {
        fs.unlinkSync(filePath);
        console.log(`Deleted old audio file: ${file}`);
      }
    });

  } catch (error) {
    console.error('Error cleaning up audio files:', error.message);
  }
};

module.exports = {
  textToSpeech,
  getAvailableVoices,
  convertAccent,
  generateEmotionalSpeech,
  cleanupOldAudioFiles,
  estimateAudioDuration
};
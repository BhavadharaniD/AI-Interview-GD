const axios = require('axios');

/**
 * Generate interview greeting
 * @param {string} topic - Interview topic
 * @param {string} role - Job role
 * @returns {string} AI greeting
 */
const generateInterviewGreeting = async (topic, role) => {
  const prompt = `You are conducting an interview for a ${role} position focused on ${topic}. 
Generate a professional and friendly greeting to start the interview. Keep it concise (2-3 sentences).`;

  try {
    const response = await generateResponse({
      context: [],
      sessionType: 'interview',
      topic,
      userInput: '',
      systemPrompt: prompt
    });

    return response.text;
  } catch (error) {
    return `Hello! Welcome to your ${role} interview. Today we'll be discussing ${topic}. Let's begin with your introduction - please tell me about yourself and your experience.`;
  }
};

/**
 * Generate group discussion greeting
 * @param {string} topic - Discussion topic
 * @returns {string} AI greeting
 */
const generateGDGreeting = async (topic) => {
  const prompt = `You are moderating a group discussion on "${topic}". 
Generate a brief introduction to the topic and invite participants to share their thoughts. Keep it concise (2-3 sentences).`;

  try {
    const response = await generateResponse({
      context: [],
      sessionType: 'group_discussion',
      topic,
      userInput: '',
      systemPrompt: prompt
    });

    return response.text;
  } catch (error) {
    return `Welcome to this group discussion on ${topic}. This is an important topic with various perspectives to consider. Please share your thoughts and insights on this matter.`;
  }
};

/**
 * Generate communication coaching greeting
 * @returns {string} AI greeting
 */
const generateCommunicationGreeting = async () => {
  const greetings = [
    "Hello! I'm here to help you improve your communication skills. Let's start with a simple conversation - tell me about your day.",
    "Welcome to your communication practice session. I'll help you build confidence in speaking. Let's begin - what would you like to talk about today?",
    "Hi there! Ready to practice your speaking skills? Let's have a natural conversation. Tell me about something you're passionate about."
  ];

  return greetings[Math.floor(Math.random() * greetings.length)];
};

/**
 * Generate AI response using OpenAI or Llama
 * @param {object} params - Parameters for response generation
 * @returns {object} AI response
 */
const generateResponse = async ({ context, sessionType, topic, userInput, systemPrompt }) => {
  try {
    // Check if OpenAI API key is available
    if (process.env.OPENAI_API_KEY) {
      return await generateOpenAIResponse({ context, sessionType, topic, userInput, systemPrompt });
    }

    // Fallback to mock response
    console.warn('No AI API configured, using mock responses');
    return generateMockResponse({ context, sessionType, topic, userInput });

  } catch (error) {
    console.error('AI response generation error:', error.message);
    return generateMockResponse({ context, sessionType, topic, userInput });
  }
};

/**
 * Generate response using OpenAI API
 * @param {object} params - Parameters
 * @returns {object} Response
 */
const generateOpenAIResponse = async ({ context, sessionType, topic, userInput, systemPrompt }) => {
  try {
    const systemMessage = systemPrompt || getSystemPrompt(sessionType, topic);

    const messages = [
      { role: 'system', content: systemMessage },
      ...context.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'assistant',
        content: msg.content
      }))
    ];

    if (userInput) {
      messages.push({ role: 'user', content: userInput });
    }

    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4',
        messages,
        temperature: 0.7,
        max_tokens: 500
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return {
      text: response.data.choices[0].message.content,
      model: 'gpt-4',
      tokens: response.data.usage.total_tokens
    };

  } catch (error) {
    console.error('OpenAI API error:', error.response?.data || error.message);
    throw error;
  }
};

/**
 * Get system prompt based on session type
 * @param {string} sessionType - Type of session
 * @param {string} topic - Session topic
 * @returns {string} System prompt
 */
const getSystemPrompt = (sessionType, topic) => {
  const prompts = {
    interview: `You are an experienced interviewer conducting a professional interview about ${topic}. 
Ask relevant, thought-provoking questions. Provide constructive follow-up questions based on responses. 
Be professional yet friendly. Keep responses concise and focused.`,

    group_discussion: `You are facilitating a group discussion on ${topic}. 
Encourage participants to share diverse perspectives. Ask probing questions to deepen the discussion. 
Maintain neutrality and ensure balanced participation. Keep responses brief to allow more participant input.`,

    communication: `You are a communication coach helping someone improve their speaking skills. 
Have a natural, engaging conversation. Ask open-ended questions to encourage elaboration. 
Be supportive and encouraging. Provide gentle guidance on communication improvement.`
  };

  return prompts[sessionType] || prompts.communication;
};

/**
 * Generate mock response for development/testing
 * @param {object} params - Parameters
 * @returns {object} Mock response
 */
const generateMockResponse = ({ context, sessionType, topic, userInput }) => {
  const mockResponses = {
    interview: [
      `That's an interesting perspective. Can you elaborate on how you've applied this approach in your previous projects?`,
      `I see. Tell me about a challenging situation you faced in your role and how you handled it.`,
      `Great! Now, how do you prioritize tasks when working on multiple projects simultaneously?`,
      `Excellent point. What do you think are the key skills needed for success in this role?`,
      `Thank you for sharing that. Can you give me a specific example of when you demonstrated leadership?`
    ],
    group_discussion: [
      `That's a valid point. What do other participants think about this perspective?`,
      `Interesting viewpoint. Can you support this with some examples or data?`,
      `I see where you're coming from. How might this impact different stakeholders?`,
      `Let's explore the other side of this argument. What are some counterpoints to consider?`,
      `Good discussion! Let's delve deeper into the practical implications of this topic.`
    ],
    communication: [
      `That sounds fascinating! Can you tell me more about what makes you passionate about it?`,
      `I understand. How did that experience make you feel?`,
      `That's great! What challenges did you face, and how did you overcome them?`,
      `Interesting! Have you always been interested in this, or is it something new?`,
      `I appreciate you sharing that. What would you like to achieve or learn next?`
    ]
  };

  const responses = mockResponses[sessionType] || mockResponses.communication;
  const randomResponse = responses[Math.floor(Math.random() * responses.length)];

  return {
    text: randomResponse,
    model: 'mock',
    tokens: 0
  };
};

/**
 * Generate follow-up question
 * @param {string} userAnswer - User's previous answer
 * @param {string} sessionType - Type of session
 * @returns {object} Follow-up question
 */
const generateFollowUp = async (userAnswer, sessionType) => {
  const prompt = `Based on this answer: "${userAnswer}"
Generate a relevant follow-up question for a ${sessionType}. Keep it concise and thought-provoking.`;

  try {
    return await generateResponse({
      context: [{ role: 'user', content: userAnswer }],
      sessionType,
      topic: '',
      userInput: '',
      systemPrompt: prompt
    });
  } catch (error) {
    return generateMockResponse({ sessionType, userInput: userAnswer, context: [], topic: '' });
  }
};

/**
 * Generate interview question based on role and topic
 * @param {string} role - Job role
 * @param {string} topic - Interview topic
 * @param {number} difficulty - Difficulty level (1-3)
 * @returns {object} Interview question
 */
const generateInterviewQuestion = async (role, topic, difficulty = 2) => {
  const difficultyLevels = {
    1: 'beginner-level, straightforward',
    2: 'intermediate-level, moderately challenging',
    3: 'advanced-level, complex and thought-provoking'
  };

  const prompt = `Generate a ${difficultyLevels[difficulty]} interview question for a ${role} position, 
focused on ${topic}. The question should be specific, relevant, and encourage detailed responses.`;

  try {
    return await generateResponse({
      context: [],
      sessionType: 'interview',
      topic,
      userInput: '',
      systemPrompt: prompt
    });
  } catch (error) {
    return {
      text: `Tell me about your experience with ${topic} in your role as a ${role}. What challenges have you faced and how did you overcome them?`,
      model: 'mock'
    };
  }
};

module.exports = {
  generateInterviewGreeting,
  generateGDGreeting,
  generateCommunicationGreeting,
  generateResponse,
  generateFollowUp,
  generateInterviewQuestion
};
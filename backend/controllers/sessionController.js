const { Session, User } = require('../models');
const whisperService = require('../services/whisperService');
const llamaService = require('../services/llamaService');
const coquiService = require('../services/coquiService');

/**
 * @desc    Start a new practice session
 * @route   POST /api/sessions/start
 * @access  Private
 */
const startSession = async (req, res) => {
  try {
    const { sessionType, topic, role, difficulty, sessionMode } = req.body;
    const userId = req.user.id;

    // Validate required fields
    if (!sessionType || !topic) {
      return res.status(400).json({
        success: false,
        message: 'Session type and topic are required'
      });
    }

    // Create new session
    const session = await Session.create({
      userId,
      sessionType,
      topic,
      role: role || 'General',
      difficulty: difficulty || 'intermediate',
      sessionMode: sessionMode || 'practice',
      startTime: new Date(),
      status: 'in_progress'
    });

    // Generate initial AI greeting based on session type
    let aiGreeting = '';
    if (sessionType === 'interview') {
      aiGreeting = await llamaService.generateInterviewGreeting(topic, role);
    } else if (sessionType === 'group_discussion') {
      aiGreeting = await llamaService.generateGDGreeting(topic);
    } else if (sessionType === 'communication') {
      aiGreeting = await llamaService.generateCommunicationGreeting();
    }

    // Add AI greeting to transcript
    session.transcript.push({
      speaker: 'ai',
      message: aiGreeting,
      timestamp: new Date()
    });

    await session.save();

    res.status(201).json({
      success: true,
      message: 'Session started successfully',
      data: {
        sessionId: session._id,
        aiGreeting,
        session: {
          id: session._id,
          type: session.sessionType,
          topic: session.topic,
          startTime: session.startTime
        }
      }
    });
  } catch (error) {
    console.error('Start session error:', error);
    res.status(500).json({
      success: false,
      message: 'Error starting session',
      error: error.message
    });
  }
};

/**
 * @desc    Process audio input during session
 * @route   POST /api/sessions/:sessionId/process-audio
 * @access  Private
 */
const processAudio = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const audioFile = req.file; // Assuming multer middleware for file upload

    if (!audioFile) {
      return res.status(400).json({
        success: false,
        message: 'Audio file is required'
      });
    }

    const session = await Session.findById(sessionId);

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }

    // Verify session belongs to user
    if (session.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized access to session'
      });
    }

    // Convert audio to text using Whisper
    const transcription = await whisperService.transcribeAudio(audioFile);

    // Add user's response to transcript
    session.transcript.push({
      speaker: 'user',
      message: transcription.text,
      timestamp: new Date(),
      confidence: transcription.confidence
    });

    // Update audio metadata
    session.audioMetadata.totalWords += transcription.wordCount;
    session.audioMetadata.fillerWords += transcription.fillerWordCount;

    // Generate AI response using Llama
    const conversationContext = session.transcript.slice(-5).map(t => ({
      role: t.speaker === 'user' ? 'user' : 'assistant',
      content: t.message
    }));

    const aiResponse = await llamaService.generateResponse({
      context: conversationContext,
      sessionType: session.sessionType,
      topic: session.topic,
      userInput: transcription.text
    });

    // Add AI response to transcript
    session.transcript.push({
      speaker: 'ai',
      message: aiResponse.text,
      timestamp: new Date()
    });

    // Store in aiResponses array for analysis
    session.aiResponses.push({
      question: session.transcript[session.transcript.length - 3]?.message || '',
      userAnswer: transcription.text,
      aiFollowUp: aiResponse.text,
      timestamp: new Date()
    });

    await session.save();

    // Generate audio response using Coqui TTS (optional)
    let audioResponse = null;
    if (req.body.enableVoiceResponse) {
      audioResponse = await coquiService.textToSpeech(aiResponse.text);
    }

    res.status(200).json({
      success: true,
      data: {
        transcription: transcription.text,
        aiResponse: aiResponse.text,
        audioResponse: audioResponse ? audioResponse.audioUrl : null,
        confidence: transcription.confidence
      }
    });
  } catch (error) {
    console.error('Process audio error:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing audio',
      error: error.message
    });
  }
};

/**
 * @desc    Add text message to session
 * @route   POST /api/sessions/:sessionId/message
 * @access  Private
 */
const addMessage = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        message: 'Message is required'
      });
    }

    const session = await Session.findById(sessionId);

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }

    // Verify session belongs to user
    if (session.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized access to session'
      });
    }

    // Add user message
    await session.addTranscriptEntry('user', message, 1.0);

    // Generate AI response
    const conversationContext = session.transcript.slice(-5).map(t => ({
      role: t.speaker === 'user' ? 'user' : 'assistant',
      content: t.message
    }));

    const aiResponse = await llamaService.generateResponse({
      context: conversationContext,
      sessionType: session.sessionType,
      topic: session.topic,
      userInput: message
    });

    // Add AI response
    await session.addTranscriptEntry('ai', aiResponse.text, 1.0);

    res.status(200).json({
      success: true,
      data: {
        userMessage: message,
        aiResponse: aiResponse.text
      }
    });
  } catch (error) {
    console.error('Add message error:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding message',
      error: error.message
    });
  }
};

/**
 * @desc    End a practice session
 * @route   POST /api/sessions/:sessionId/end
 * @access  Private
 */
const endSession = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { notes } = req.body;

    const session = await Session.findById(sessionId);

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }

    // Verify session belongs to user
    if (session.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized access to session'
      });
    }

    // Check if session is already completed
    if (session.status === 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Session already completed'
      });
    }

    // Complete the session
    session.endTime = new Date();
    session.duration = Math.floor((session.endTime - session.startTime) / 1000);
    session.status = 'completed';
    
    if (notes) {
      session.notes = notes;
    }

    // Calculate words per minute
    if (session.audioMetadata.totalWords > 0) {
      session.calculateWPM();
    }

    await session.save();

    // Update user statistics
    const user = await User.findById(req.user.id);
    if (user) {
      await user.updateStats(Math.floor(session.duration / 60)); // Convert to minutes
    }

    res.status(200).json({
      success: true,
      message: 'Session ended successfully',
      data: {
        sessionId: session._id,
        duration: session.duration,
        totalWords: session.audioMetadata.totalWords,
        wordsPerMinute: session.audioMetadata.wordsPerMinute,
        transcript: session.transcript
      }
    });
  } catch (error) {
    console.error('End session error:', error);
    res.status(500).json({
      success: false,
      message: 'Error ending session',
      error: error.message
    });
  }
};

/**
 * @desc    Get session details
 * @route   GET /api/sessions/:sessionId
 * @access  Private
 */
const getSession = async (req, res) => {
  try {
    const { sessionId } = req.params;

    const session = await Session.findById(sessionId).populate('feedback');

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }

    // Verify session belongs to user
    if (session.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized access to session'
      });
    }

    res.status(200).json({
      success: true,
      data: { session }
    });
  } catch (error) {
    console.error('Get session error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching session',
      error: error.message
    });
  }
};

/**
 * @desc    Get all sessions for current user
 * @route   GET /api/sessions
 * @access  Private
 */
const getUserSessions = async (req, res) => {
  try {
    const { page = 1, limit = 10, sessionType, status } = req.query;
    const userId = req.user.id;

    // Build query
    const query = { userId };
    if (sessionType) query.sessionType = sessionType;
    if (status) query.status = status;

    // Get sessions with pagination
    const sessions = await Session.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('feedback');

    const count = await Session.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        sessions,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
        totalSessions: count
      }
    });
  } catch (error) {
    console.error('Get user sessions error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching sessions',
      error: error.message
    });
  }
};

/**
 * @desc    Get recent sessions
 * @route   GET /api/sessions/recent
 * @access  Private
 */
const getRecentSessions = async (req, res) => {
  try {
    const { limit = 5 } = req.query;
    const userId = req.user.id;

    const sessions = await Session.getRecentSessions(userId, parseInt(limit));

    res.status(200).json({
      success: true,
      data: { sessions }
    });
  } catch (error) {
    console.error('Get recent sessions error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching recent sessions',
      error: error.message
    });
  }
};

/**
 * @desc    Delete a session
 * @route   DELETE /api/sessions/:sessionId
 * @access  Private
 */
const deleteSession = async (req, res) => {
  try {
    const { sessionId } = req.params;

    const session = await Session.findById(sessionId);

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }

    // Verify session belongs to user
    if (session.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized access to session'
      });
    }

    // Soft delete - archive the session
    session.isArchived = true;
    await session.save();

    res.status(200).json({
      success: true,
      message: 'Session deleted successfully'
    });
  } catch (error) {
    console.error('Delete session error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting session',
      error: error.message
    });
  }
};

module.exports = {
  startSession,
  processAudio,
  addMessage,
  endSession,
  getSession,
  getUserSessions,
  getRecentSessions,
  deleteSession
};
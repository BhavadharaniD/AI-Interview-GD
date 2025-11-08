const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true
    },
    sessionType: {
      type: String,
      enum: ['interview', 'group_discussion', 'communication'],
      required: [true, 'Session type is required']
    },
    sessionMode: {
      type: String,
      enum: ['practice', 'mock', 'assessment'],
      default: 'practice'
    },
    topic: {
      type: String,
      required: [true, 'Session topic is required'],
      trim: true
    },
    role: {
      type: String,
      trim: true,
      default: 'General' // e.g., "Product Manager", "Software Engineer"
    },
    difficulty: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      default: 'intermediate'
    },
    duration: {
      type: Number,
      required: true,
      min: 0 // in seconds
    },
    transcript: [
      {
        speaker: {
          type: String,
          enum: ['user', 'ai', 'system'],
          required: true
        },
        message: {
          type: String,
          required: true
        },
        timestamp: {
          type: Date,
          default: Date.now
        },
        confidence: {
          type: Number,
          min: 0,
          max: 1 // Speech recognition confidence
        }
      }
    ],
    aiResponses: [
      {
        question: {
          type: String,
          required: true
        },
        userAnswer: {
          type: String,
          required: true
        },
        aiFollowUp: {
          type: String
        },
        timestamp: {
          type: Date,
          default: Date.now
        }
      }
    ],
    audioMetadata: {
      totalWords: {
        type: Number,
        default: 0
      },
      wordsPerMinute: {
        type: Number,
        default: 0
      },
      pauseCount: {
        type: Number,
        default: 0
      },
      averagePauseDuration: {
        type: Number,
        default: 0 // in seconds
      },
      fillerWords: {
        type: Number,
        default: 0 // count of "um", "uh", "like", etc.
      }
    },
    scores: {
      overall: {
        type: Number,
        min: 0,
        max: 100,
        default: 0
      },
      fluency: {
        type: Number,
        min: 0,
        max: 100,
        default: 0
      },
      clarity: {
        type: Number,
        min: 0,
        max: 100,
        default: 0
      },
      relevance: {
        type: Number,
        min: 0,
        max: 100,
        default: 0
      },
      confidence: {
        type: Number,
        min: 0,
        max: 100,
        default: 0
      },
      grammar: {
        type: Number,
        min: 0,
        max: 100,
        default: 0
      }
    },
    status: {
      type: String,
      enum: ['in_progress', 'completed', 'abandoned', 'error'],
      default: 'in_progress'
    },
    startTime: {
      type: Date,
      default: Date.now
    },
    endTime: {
      type: Date
    },
    notes: {
      type: String,
      maxlength: 1000
    },
    tags: [
      {
        type: String,
        trim: true
      }
    ],
    isArchived: {
      type: Boolean,
      default: false
    },
    // For group discussions
    participants: [
      {
        name: {
          type: String
        },
        role: {
          type: String,
          enum: ['user', 'ai_participant']
        }
      }
    ]
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Indexes for better query performance
sessionSchema.index({ userId: 1, createdAt: -1 });
sessionSchema.index({ sessionType: 1 });
sessionSchema.index({ status: 1 });
sessionSchema.index({ startTime: -1 });

// Virtual field for feedback
sessionSchema.virtual('feedback', {
  ref: 'Feedback',
  localField: '_id',
  foreignField: 'sessionId',
  justOne: true
});

// Calculate duration before saving
sessionSchema.pre('save', function (next) {
  if (this.endTime && this.startTime && !this.duration) {
    this.duration = Math.floor((this.endTime - this.startTime) / 1000);
  }
  next();
});

// Method to complete session
sessionSchema.methods.completeSession = function () {
  this.status = 'completed';
  this.endTime = new Date();
  this.duration = Math.floor((this.endTime - this.startTime) / 1000);
  return this.save();
};

// Method to add transcript entry
sessionSchema.methods.addTranscriptEntry = function (speaker, message, confidence) {
  this.transcript.push({
    speaker,
    message,
    timestamp: new Date(),
    confidence
  });
  return this.save();
};

// Method to calculate words per minute
sessionSchema.methods.calculateWPM = function () {
  const totalWords = this.audioMetadata.totalWords;
  const durationInMinutes = this.duration / 60;
  this.audioMetadata.wordsPerMinute = Math.round(totalWords / durationInMinutes);
  return this.audioMetadata.wordsPerMinute;
};

// Static method to get user's recent sessions
sessionSchema.statics.getRecentSessions = function (userId, limit = 10) {
  return this.find({ userId, status: 'completed' })
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate('feedback');
};

// Static method to get session statistics for a user
sessionSchema.statics.getUserStats = async function (userId) {
  const stats = await this.aggregate([
    { $match: { userId: mongoose.Types.ObjectId(userId), status: 'completed' } },
    {
      $group: {
        _id: null,
        totalSessions: { $sum: 1 },
        totalDuration: { $sum: '$duration' },
        averageScore: { $avg: '$scores.overall' },
        averageFluency: { $avg: '$scores.fluency' },
        totalWords: { $sum: '$audioMetadata.totalWords' }
      }
    }
  ]);

  return stats[0] || {
    totalSessions: 0,
    totalDuration: 0,
    averageScore: 0,
    averageFluency: 0,
    totalWords: 0
  };
};

// Static method to get sessions by type
sessionSchema.statics.getSessionsByType = function (userId, sessionType) {
  return this.find({ userId, sessionType, status: 'completed' })
    .sort({ createdAt: -1 })
    .populate('feedback');
};

const Session = mongoose.model('Session', sessionSchema);

module.exports = Session;
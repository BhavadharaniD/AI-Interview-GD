import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema(
  {
    sessionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Session",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // 🌟 Core performance metrics
    scores: {
      fluency: { type: Number, default: 0 },
      confidence: { type: Number, default: 0 },
      grammar: { type: Number, default: 0 },
      vocabulary: { type: Number, default: 0 },
      speechSpeed: { type: Number, default: 0 }, // words per minute
    },
    // 🌟 Analysis details
    highlights: {
      goodPoints: [String],
      improvementAreas: [String],
    },
    recommendations: {
      nextTopics: [String],
      improvementTips: [String],
    },
    // 🌟 Store full transcript for reference
    transcript: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Feedback", feedbackSchema);

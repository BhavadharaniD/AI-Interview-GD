import { analyzeFeedback } from "../services/feedbackService.js";

export const getFeedbackAnalysis = async (req, res) => {
  try {
    const { transcript } = req.body;

    // Mock call to AI service (replace with real later)
    const analysis = await analyzeFeedback(transcript);

    // Send same structure your frontend expects
    res.json({
      success: true,
      scores: [
        { label: "Fluency", value: analysis.fluency },
        { label: "Confidence", value: analysis.confidence },
        { label: "Grammar", value: analysis.grammar },
        { label: "Vocabulary", value: analysis.vocabulary },
      ],
      transcript: analysis.transcript, // with highlights
      recommendations: analysis.recommendations, // list of tips
      metrics: {
        speechSpeed: analysis.speechSpeed,
        sessionDuration: analysis.sessionDuration,
        fillerWords: analysis.fillerWords,
      },
    });
  } catch (err) {
    console.error("Feedback Analysis Error:", err);
    res.status(500).json({ success: false, message: "Error analyzing feedback" });
  }
};

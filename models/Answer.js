const mongoose = require("mongoose");

const answerSchema = new mongoose.Schema(
  {
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Question',
      required: true
    },
    sessionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Session',
      required: true
    },
    userAnswer: {
      type: String,
      required: true,
      trim: true
    },
    score: {
      type: Number,
      min: 0,
      max: 10
    },
    feedback: {
      type: String,
      trim: true
    },
    weaknessTags: {
      type: [String]
    },
    followUps: [
      {
        question: { type: String, trim: true },
        userResponse: { type: String, trim: true }
      }
    ]
  },
  { timestamps: true }
);

const Answer = mongoose.model("Answer", answerSchema);
module.exports = Answer;
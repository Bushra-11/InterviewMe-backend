const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: true,
      enum: ['general', 'behavioral', 'technical']
    },
    text: {
      type: String,
      required: true,
      trim: true
    },
    difficulty: {
      type: String,
      required: true,
      enum: ['easy', 'moderate', 'hard']
    },
    source: {
      type: String,
      required: true,
      enum: ['seed', 'ai-generated']
    },
    status: {
      type: String,
      required: true,
      enum: ['pending', 'active', 'rejected'],
      default: 'pending'
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    }
  },
  { timestamps: true }
);

const Question = mongoose.model("Question", questionSchema);
module.exports = Question;
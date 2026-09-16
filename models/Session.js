const mongoose = require("mongoose")

const sessionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    category: {
        type: String,
        required: true,
        enum: ['general', 'behavioral', 'technical', 'mixed']
    },
    startedAt: {
        type: Date,
        default: Date.now
    },
    endedAt: {
        type: Date
    },
    overallScore: {
        type: Number,
        min: 0,
        max: 10
    },
    weakAreas: {
        type: [String]
    }

}, { timestamps: true })

const Session = mongoose.model("Session", sessionSchema);
module.exports = Session;
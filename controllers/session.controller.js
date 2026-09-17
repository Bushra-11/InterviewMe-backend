const Session = require('../models/Session')
const Answer = require('../models/Answer')
const Question = require('../models/Question')

async function createSession(req, res) {
    const { category } = req.body
    try {
        if (!category)
            return res.status(400).json({ message: 'Category Is Required' })

        const createdSession = await Session.create({ userId: req.user._id, category })
        res.status(201).json(createdSession)

    } catch (err) {
        if (err.name === "ValidationError") {
            return res.status(400).json({ message: err.message });
        }
        console.log(err)
        res.status(500).json({ message: 'Internal Server Error' })
    }
}

async function listAllSessions(req, res) {
    try {
        const foundSessions = await Session.find({ userId: req.user._id }).sort({ startedAt: -1 })
        res.status(200).json(foundSessions)

    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'Internal Server Error' })
    }
}

async function getOneSession(req, res) {
    try {
        const foundSession = await Session.findById(req.params.id)
        if (!foundSession)
            return res.status(404).json({ message: 'Session Not Found' })
        if (req.user._id !== foundSession.userId.toString() && req.user.role !== "admin")
            return res.status(403).json({ message: 'Not authorized to view this session' })

        const answers = await Answer.find({ sessionId: foundSession._id }).populate("questionId", "text category difficulty")
        res.status(200).json({ session: foundSession, answers })
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'Internal Server Error' })
    }
}

async function getNextQuestion(req, res) {
    try {
        const foundSession = await Session.findById(req.params.id)

        if (!foundSession)
            return res.status(404).json({ message: 'Session Not Found' })

        if (req.user._id !== foundSession.userId.toString())
            return res.status(403).json({ message: 'Not authorized to view this session' })

        const answeredQuestionIds = await Answer.distinct("questionId", { sessionId: foundSession._id });

        const filter = {
            status: "active",
            _id: { $nin: answeredQuestionIds },
        };

        if (foundSession.category !== "mixed") {
            filter.category = foundSession.category;
        }

        const count = await Question.countDocuments(filter);
        if (count === 0) {
            return res.status(404).json({ message: "No more questions available for this session." });
        }

        const randomIndex = Math.floor(Math.random() * count);
        const question = await Question.findOne(filter).skip(randomIndex);
        res.status(200).json(question);


    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'Internal Server Error' })
    }
}

async function endSession(req, res) {
    try {
        const foundSession = await Session.findById(req.params.id)

        if (!foundSession)
            return res.status(404).json({ message: "Session Not Found" })

        if (req.user._id !== foundSession.userId.toString())
            return res.status(403).json({ message: 'Not authorized to view this session' })

        const answers = await Answer.find({ sessionId: foundSession._id })

        if (answers.length === 0)
            return res.status(400).json({ message: 'Cannot end a session with no answers.' })

        const scoredAnswers = answers.filter((oneAnswer) => typeof oneAnswer.score === "number");
        const overallScore = scoredAnswers.length > 0
                ? scoredAnswers.reduce((sum, oneAnswer) => sum + oneAnswer.score, 0) /
                scoredAnswers.length
                : 0;

        const weakAreas = [
            ...new Set(answers.flatMap((a) => a.weaknessTags || [])),
        ];

        foundSession.endedAt = new Date();
        foundSession.overallScore = overallScore;
        foundSession.weakAreas = weakAreas;
        await foundSession.save();

        res.status(200).json(foundSession);

    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'Internal Server Error' })
    }
}

module.exports = {
    createSession,
    listAllSessions,
    getOneSession,
    getNextQuestion,
    endSession
}
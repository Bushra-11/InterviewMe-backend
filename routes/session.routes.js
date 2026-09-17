const router = require("express").Router();
const verifyToken = require("../middleware/verifyToken");
const validateObjectId = require('../middleware/validateObjectId')
const sessionController = require("../controllers/session.controller")

router.post('/',verifyToken ,sessionController.createSession)
router.get('/',verifyToken ,sessionController.listAllSessions)
router.get('/:id', verifyToken, validateObjectId, sessionController.getOneSession)
router.get('/:id/next-question', verifyToken, validateObjectId, sessionController.getNextQuestion)
router.post('/:id/end', verifyToken, validateObjectId, sessionController.endSession)

module.exports = router;

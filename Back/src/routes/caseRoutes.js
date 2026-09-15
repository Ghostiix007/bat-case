const express = require('express')
const router = express.Router()
const { getCases, getCaseById, openCaseController } = require("../controllers/caseController.js")
const authMiddleware = require("../middleware/authMiddleware.js")

router.get("/", getCases)
router.get("/:id", getCaseById)
router.put("/:id/open", authMiddleware, openCaseController)

module.exports = router


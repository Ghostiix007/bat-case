const express = require('express')
const router = express.Router()
const { getCases, getCaseById, openCase, createCase, updateCase, deleteCase, addSkinsToCase } = require("../controllers/caseController.js")
const authMiddleware = require("../middleware/authMiddleware.js")
const adminMiddleware = require("../middleware/adminMiddleware.js")

router.get("/", getCases)
router.get("/:id", getCaseById)
router.post("/:id/open", authMiddleware, openCase)
router.post("/", authMiddleware, adminMiddleware, createCase)
router.put("/:id", authMiddleware, adminMiddleware, updateCase)
router.delete("/:id", authMiddleware, adminMiddleware, deleteCase)
router.post("/:id/skins", authMiddleware, adminMiddleware, addSkinsToCase)

module.exports = router


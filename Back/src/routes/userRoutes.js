const express = require('express')
const router = express.Router()
const authMiddleware = require("../middleware/authMiddleware.js")
const { getUserState } = require("../controllers/userController.js")

router.get("/state", authMiddleware, getUserState)

module.exports = router
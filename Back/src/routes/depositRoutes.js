const express = require("express")
const router = express.Router()
const {makeDeposit} = require("../controllers/depositController.js")
const authMiddleware = require("../middleware/authMiddleware.js")

router.post("/", authMiddleware, makeDeposit)

module.exports = router
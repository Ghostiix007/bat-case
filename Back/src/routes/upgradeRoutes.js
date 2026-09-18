const express = require("express")
const router = express.Router()
const {upgradeItem} = require("../controllers/upgradeController.js")
const authMiddleware = require("../middleware/authMiddleware.js")

router.post("/", authMiddleware, upgradeItem)

module.exports = router
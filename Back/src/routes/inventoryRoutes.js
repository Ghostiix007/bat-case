const express = require("express")
const router = express.Router()
const {sellSkin} = require("../controllers/inventoryController.js")
const authMiddleware = require("../middleware/authMiddleware.js")

router.post("/:inventoryId/sell", authMiddleware, sellSkin)

module.exports = router

const express = require("express")
const router = express.Router()
const {sellSkin, sellAllItems} = require("../controllers/inventoryController.js")
const authMiddleware = require("../middleware/authMiddleware.js")

router.post("/:itemId/sell", authMiddleware, sellSkin)
router.post("/sell-all", authMiddleware, sellAllItems)

module.exports = router

const express = require("express")
const router = express.Router()
const authMiddleware = require("../middleware/authMiddleware.js")


router.get("/", authMiddleware, (req, res) => {
  res.json({ inventory: [] })
})

module.exports = router
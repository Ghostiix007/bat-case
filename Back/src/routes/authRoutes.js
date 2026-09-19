const express = require('express')
const router = express.Router()
const passport = require('passport')
const config = require("../config/env.js")
const {steamCallback, getMe, logOut} = require("../controllers/authController.js")
const authMiddleware = require("../middleware/authMiddleware.js")

router.get("/steam", passport.authenticate("steam", { session: false }))

router.get("/steam/callback", passport.authenticate("steam", { session: false, failureRedirect: `${config.FRONTEND_URL}` }), steamCallback)

router.get("/me", authMiddleware, getMe)

router.post("/logout", logOut)

module.exports = router



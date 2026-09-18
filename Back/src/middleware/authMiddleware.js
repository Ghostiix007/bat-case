const jwt = require('jsonwebtoken')
const config = require('../config/env.js')

const authMiddleware = (req, res, next) => {
    const token = req.cookies?.batcase_steam_session

    if (!token) {
        req.user = null
        return next()
    }

    try{
        req.user = jwt.verify(token, config.JWT_SECRET)
        next()
    } catch(error){
        req.user = null
        return next()
    }
}

module.exports = authMiddleware
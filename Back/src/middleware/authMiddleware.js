const jwt = require('jsonwebtoken')
const config = require('../config/env.js')

const authMiddleware = (req, res, next) => {
    const token = req.cookies?.token

    if (!token) {
        return res.status(401).json({ message: "authorization needed"})
    }

    try{
        req.user = jwt.verify(config.JWT_SECRET)
        next()
    } catch(error){
        return res.status(401).json({ message: "invalid token" })
    }
}

module.exports = authMiddleware
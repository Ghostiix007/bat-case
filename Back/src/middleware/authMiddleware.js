const jwt = require('jsonwebtoken')
const config = require('../config/env.js')

const authMiddleware = (req, res, next) => {
  const token = req.cookies?.batcase_steam_session

  if (!token) {
    req.user = null
    return res.status(401).json({ error: 'Unauthorized' })
  }

  try {
    req.user = jwt.verify(token, config.JWT_SECRET)
    next()
  } catch (error) {
    req.user = null
    return res.status(401).json({ error: 'Unauthorized' })
  }
}

module.exports = authMiddleware
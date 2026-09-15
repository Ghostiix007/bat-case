const express = require('express')
const app = express()

const cors = require('cors')
const cookieParser = require('cookie-parser')

const passport = require('./src/config/passport.js')
const config = require('./src/config/env.js')

const authRoutes = require('./src/routes/authRoutes.js')
const caseRoutes = require('./src/routes/caseRoutes.js')

const PORT = config.PORT

app.use(cors({
    origin: config.FRONTEND_URL,
    credentials: true
}))
app.use(express.json())
app.use(cookieParser())
app.use(passport.initialize())
app.use("/api/auth", authRoutes)
app.use("/api/cases", caseRoutes)

app.listen(PORT, () => {
    console.log(`BatCase Server running on port ${PORT}\nOn address http://localhost:${PORT}`)
})
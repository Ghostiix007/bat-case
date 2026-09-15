const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const passport = require('./src/config/passport.js')
const config = require('./src/config/env.js')
const app = express()
const authRoutes = require('./src/routes/authRoutes.js')


const PORT = config.PORT

app.use(cors({
    origin: config.FRONTEND_URL,
    credentials: true
}))
app.use(express.json())
app.use(cookieParser())
app.use(passport.initialize())
app.use("/api/auth", authRoutes)

app.listen(PORT, () => {
    console.log(`BatCase Server running on port ${PORT}\nOn address http://localhost:${PORT}`)
})
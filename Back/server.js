const express = require('express')
const app = express()

const cors = require('cors')
const cookieParser = require('cookie-parser')

const passport = require('./src/config/passport.js')
const config = require('./src/config/env.js')

const authRoutes = require('./src/routes/authRoutes.js')
const caseRoutes = require('./src/routes/caseRoutes.js')
const skinRoutes = require('./src/routes/skinRoutes.js')
const inventoryRoutes = require('./src/routes/inventoryRoutes.js')
const userRoutes = require('./src/routes/userRoutes.js')
const upgradeRoutes = require('./src/routes/upgradeRoutes.js')
const depositRoutes = require('./src/routes/depositRoutes.js')

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
app.use("/api/inventory", inventoryRoutes)
app.use("/api/user", userRoutes)
app.use("api/skins", skinRoutes)
app.use("api/upgrade", upgradeRoutes)
app.use("api/deposit", depositRoutes)

app.listen(PORT, () => {
    console.log(`BatCase Server running on port ${PORT}\nOn address http://localhost:${PORT}`)
})
const path = require("path")
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") })

module.exports = {
    PORT: process.env.PORT,
    DATABASE_URL: process.env.DATABASE_URL,

    STEAM_API_KEY: process.env.STEAM_API_KEY,

    JWT_SECRET: process.env.JWT_SECRET,

    REALM: process.env.REALM,
    RETURN_URL: process.env.RETURN_URL,
    FRONTEND_URL: process.env.FRONTEND_URL,

    ADMIN_LOGIN: process.env.ADMIN_LOGIN,
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
}
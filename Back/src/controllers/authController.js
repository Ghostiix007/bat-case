const jwt = require("jsonwebtoken")
const prisma = require("../config/db.js")
const config = require("../config/env.js")

const steamCallback = async (req, res) => {
    try{
        if(!req.user){
            return res.redirect(`${config.FRONTEND_URL}?steam=failed`)
        }

        const token = jwt.sign(
            {
                id: req.user.id,
                role: req.user.role,
            },
            config.JWT_SECRET,
            { expiresIn: "7d" }
        )

        res.cookie("batcase_steam_session", token, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        res.redirect(`${config.FRONTEND_URL}/?steam=connected`)
    } catch(error){
        res.redirect(`${config.FRONTEND_URL}?steam=failed`)
    }
}

const getMe = async (req, res) => {
    try{
        const user = await prisma.user.findUnique({
            where: { id: req.user.id }
        })

        if(!user){
            return res.status(404).json({ message: "User not found." })
        }

        res.json({
            profile: {
                id: user.id,
                steamId: user.id,
                nickname: user.username,
                role: user.role,
                balance: Number(user.balance)
            }
        })
    } catch(error){
        res.status(500).json({ message: "Error while getting profile", error: error.message })
    }
}

const logOut = (req, res) => {
    res.clearCookie("batcase_steam_session", {
        path: "/",
        httpOnly: true,
        sameSite: "lax",
    })
    res.json({ ok: true } )
}

module.exports = {
    steamCallback,
    getMe,
    logOut
}


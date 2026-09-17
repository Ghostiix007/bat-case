const jwt = require("jsonwebtoken")
const prisma = require("../config/db.js")
const config = require("../config/env.js")

const steamCallback = async (req, res) => {
    try{
        if(!req.user){
            return res.redirect(`${config.FRONTEND_URL}?error=auth_failed`)
        }

        const token = jwt.sign(
            {
                id: req.user.id,
                role: req.user.role,
            },
            config.JWT_SECRET,
            { expiresIn: "7d" }
        )

        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        res.redirect(`${config.FRONTEND_URL}/profile`)
    } catch(error){
        res.redirect(`${config.FRONTEND_URL}?error=${error.message}`)
    }
}

const getMe = async (req, res) => {
    try{
        const user = prisma.user.findUnique({
            where: { id: req.user.id },
            select: {
                id: true,
                username: true,
                balance: true,
                role: true,
            }
        })

        if(!user){
            return res.status(404).json({ message: "No user found." })
        }

        res.json(user)
    } catch(error){
        res.status(500).json({ message: "Error while getting profile", error: error.message })
    }
}

const logOut = (req, res) => {
    res.clearCookie("token")
    res.json({ message: "successfully logged Out"} )
}

module.exports = {
    steamCallback,
    getMe,
    logOut
}


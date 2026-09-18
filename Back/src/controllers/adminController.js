const jwt = require("jsonwebtoken")
const prisma = require("../config/db.js")
const config = require("../config/env.js")

const adminLogin = async (req, res) => {
    try{
        const {login, password} = req.body
        if(login !== config.ADMIN_LOGIN || password !== config.ADMIN_PASSWORD) {
            return res.status(401).json({ error: "invalid login or password" })
        }

        const token = jwt.sign(
            { id: "admin-root", role: "ADMIN"},
            config.JWT_SECRET,
            { expiresIn: "1d" }
        )

        res.cookie("batcase_steam_session", token, {
            httpOnly: true,
            sameSite: "lax",
            path: "/",
            maxAge: 24 * 60 * 60 * 1000,
        })

        return res.status(200).json({ ok: true })
    } catch(error){
        return res.status(500).json({ error: "Error whole admin authorising" })
    }
}

const getUsers = async (req, res) => {
    try{
        const users = await prisma.user.findMany({
            orderBy: {createdAt: "desc"}
        })

        const formatedUsers = users.map((u) => ({
            id: u.id,
            steamId: u.steamId,
            nickname: u.username,
            balance: Number(u.balance),
            connectedAt: u.createdAt,
        }))

        return res.status(200).json({formatedUsers})
    } catch(error){
        return res.status(500).json({ error: "Error while getting users" })
    }
}

const updateUserBalance = async (req, res) => {
    try {
        const { id } = req.params
        const { balance } = req.body

        if (balance === undefined || isNaN(Number(balance))) {
            return res.status(400).json({ error: "Invalid balance" })
        }

        await prisma.user.update({
            where: { id },
            data: { balance: Number(balance) }
        })

        return res.status(200).json({ ok: true })
    } catch (error) {
        return res.status(500).json({ error: "Error while updating user balance" })
    }
}

const updateCasePrice = async (req, res) => {
    try {
        const { id } = req.params
        const { price } = req.body

        if (price === undefined || isNaN(Number(price))) {
            return res.status(400).json({ error: "Invalid price" })
        }

        await prisma.case.update({
            where: { id },
            data: { price: Number(price) }
        })

        return res.status(200).json({ ok: true })
    } catch (error) {
        return res.status(500).json({ error: "Error while updating case price" })
    }
}

const addDropToCase = async (req, res) => {
    try {
        const { id } = req.params
        const { skinName } = req.body

        const skin = await prisma.skin.findFirst({
            where: { name: skinName }
        })

        if (!skin) {
            return res.status(404).json({ error: "Skin not found" })
        }

        await prisma.caseSkin.create({
            data: {
                caseId: id,
                skinId: skin.id
            }
        })

        return res.status(200).json({ ok: true })
    } catch (error) {
        return res.status(500).json({ error: "Error while adding drop to case" })
    }
}

const removeDropFromCase = async (req, res) => {
    try {
        const { id } = req.params
        const { skinName } = req.body

        const skin = await prisma.skin.findFirst({
            where: { name: skinName }
        })

        if (!skin) {
            return res.status(404).json({ error: "Skin not found" })
        }

        await prisma.caseSkin.deleteMany({
            where: {
                caseId: id,
                skinId: skin.id
            }
        })

        return res.status(200).json({ ok: true })
    } catch (error) {
        return res.status(500).json({ error: "Error while deleting drop from case" })
    }
};

const createSkin = async (req, res) => {
    try {
        const { name, rarity, price, imageUrl, weapon } = req.body

        if (!name || !rarity || price === undefined) {
            return res.status(400).json({ error: "Fill required fields (name, rarity, price)" })
        }

        await prisma.skin.create({
            data: {
                name,
                weapon: weapon,
                rarity,
                price: Number(price),
                imageUrl: imageUrl
            }
        })

        return res.status(200).json({ ok: true })
    } catch (error) {
        return res.status(500).json({ error: "Error while creating skin" });
    }
};

module.exports = {
    adminLogin,
    getUsers,
    updateUserBalance,
    updateCasePrice,
    addDropToCase,
    removeDropFromCase,
    createSkin
};
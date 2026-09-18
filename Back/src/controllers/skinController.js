const prisma = require("../config/db");

const getSkins = async (req, res) => {
    try{
        const { search, sort } = req.query

        const where = search ? {
            OR:[
                {name: {contains: search, mode: "insensitive"}},
                {weapon: {contains: search, mode: "insensitive"}},
            ]
        } : {}

        const skins = await prisma.skin.findMany({
            where
        })

        const formatedSkins = skins.map((skin) => ({
            name: skin.name,
            weapon: skin.weapon,
            rarity: skin.rarity,
            price: Number(skin.price),
            imageUrl: skin.imageUrl
        }))

        res.status(200).json(formatedSkins)
    } catch(error){
        res.status(500).json({ error: "Error while getting skins" })
    }
}

module.exports = getSkins
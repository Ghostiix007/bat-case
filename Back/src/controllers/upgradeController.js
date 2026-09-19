const prisma = require("../config/db.js")
const WEARS = ["Factory new", "Minimal wear", "Field-tested", "Battle-scarred"]

const upgradeItem = async (req, res) => {
    try{
        const { itemId, targetSkinName } = req.body
        const userId = req.user.id
        if(!itemId || !targetSkinName) {
            return res.status(400).json({ error: "Item Id and target skin name is required" })
        }

        const inputItem = await prisma.userInventory.findFirst({
            where: { id: itemId, userId: userId },
            include: { skin: true }
        })
        if (!inputItem) {
            return res.status(400).json({ error: "Item not found" })
        }

        const targetSkin = await prisma.skin.findFirst({
            where: { name: targetSkinName }
        })
        if (!targetSkin) {
            return res.status(404).json({ error: "Skin not found" })
        }

        const inputPrice = Number(inputItem.price)
        const targetPrice = Number(targetSkin.price)
        if(targetPrice <= inputPrice) {
            return res.status(400).json({ error: "Price of target must be higher then price of input item" })
        }

        const rawChance = Math.round((inputPrice / targetPrice) * 100)
        const chance = Math.min(Math.max(rawChance, 1), 95)
        const roll = Number((Math.random() * 100).toFixed(1))
        const won = roll <= chance

        const result = await prisma.$transaction(async (tx) => {
            await tx.userInventory.delete({
                where: {id: itemId}
            })

            let newItem = null

            if(won){
                const randomWear = WEARS[Math.floor(Math.random() * WEARS.length)]
                const createdItem = await tx.userInventory.create({
                    data: {
                        userId,
                        skinId: targetSkin.id,
                        price: targetPrice,
                        wear: randomWear,
                        source: "upgrade"
                    },
                    include: { skin: true }
                })

                newItem = {
                    id: createdItem.id,
                    name: createdItem.skin.name,
                    weapon: createdItem.skin.weapon,
                    rarity: createdItem.skin.rarity,
                    price: Number(createdItem.price),
                    wear: createdItem.wear
                }
            }

            return newItem
        })

        return res.status(200).json({ won, roll, chance, item: result, consumedItemId: itemId })
    } catch (error){
        return res.status(500).json({ error: "Error while upgrading skin" })
    }
}

module.exports = {
    upgradeItem
}


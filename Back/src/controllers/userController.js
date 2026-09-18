const prisma = require("../config/db.js")

const getUserState = async (req, res) => {
    try{
        if(!req.user){
            return res.status(404).json({error: "User is not authorized"})
        }

        const user = await prisma.user.findUnique({
            where: {id: req.user.id},
            include: {
                inventory: {
                    include: {
                        skin : true
                    }
                }
            }
        })

        if(!user){
            return res.status(404).json({error: "User not found"})
        }

        const formatedInventory = user.inventory.map((item) => ({
            id: item.id,
            name: item.skin.name,
            weapon: item.skin.weapon,
            rarity: item.skin.rarity,
            price: Number(item.price),
            wear: item.wear
        }))

        res.status(200).json({
            balance: Number(user.balance),
            freeCaseAvailable: !user.freeCaseUsed,
            inventory: formatedInventory
        })
    } catch(error){
        res.status(500).json({error: "Error while getting user state"})
    }
}

module.exports = {
    getUserState
}

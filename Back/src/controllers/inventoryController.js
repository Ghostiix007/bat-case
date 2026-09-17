const prisma = require("../config//db.js")

const sellSkin = async (req, res) => {
    try{
        const { inventoryId } = req.params
        const userId = req.user.id

        const result = await prisma.$transaction(async (tx) => {
            const item = await tx.userInventory.FindFirst({
                where: { id: inventoryId, userId: userId },
                include: { skin: true }
            })

            if(!item){
                throw new Error("ITEM_NOT_FOUND")
            }

            const skinPrice = parseFloat(item.skin.price)

            await tx.userInventory.delete({
                where: { id: inventoryId }
            })

            const updatedUser = await tx.user.update({
                where: {id: userId},
                data: {
                    balance: { increment: skinPrice }
                }
            })

            await tx.log.create({
                data: {
                    eventType: "SELL_SKIN",
                    userId: userId,
                    payload: {
                        inventoryId: inventoryId,
                        skinId: item.skin.id,
                        skinName: item.skin.name,
                        price: skinPrice
                    }
                }
            })

            return {
                soldSkin: item.skin.name,
                price: skinPrice,
                newBalance: updatedUser.balance,
            }
        })

        return res.status(200).json({ message: "Skin successfully sold", ...result })
    } catch(error) {
        if(error.message === "ITEM_NOT_FOUND"){
            return res.status(404).json({ message: "Skin was not found in inventory" })
        }
        return res.status(500).json({ message: "Error while selling skin", error: error.message })
    }
}

module.exports = sellSkin
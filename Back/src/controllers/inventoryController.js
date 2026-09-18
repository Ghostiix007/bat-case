const prisma = require("../config//db.js")

const sellSkin = async (req, res) => {
    try{
        const {skinId} = req.params
        const userId = req.user.id

        const result = await prisma.$transaction(async (tx) => {
            const item = await tx.userInventory.findFirst({
                where: { id: skinId, userId: userId }
            })

            if(!item){
                throw new Error("ITEM_NOT_FOUND")
            }

            const itemPrice = Number(item.price)

            await tx.userInventory.delete({
                where: {id: skinId}
            })

            const updateUser = await tx.user.update({
                where: {id: userId},
                data: { balance: { increment: itemPrice } }
            })

            return {balance: Number(updatedUser.balance)}
        })

        return res.status(200).json({ balance: result.balance })
    } catch(error) {
        if(error.message === "ITEM_NOT_FOUND"){
            return res.status(404).json({ message: "Skin was not found in inventory" })
        }
        return res.status(500).json({ message: "Error while selling skin", error: error.message })
    }
}

const sellAllItems = async (req, res) => {
    try{
        const userId = req.user.id

        const result = await prisma.$transaction(async (tx) => {
            const userItems = await tx.userInventory.findMany({
                where: { userId: userId }
            })

            if(userItems.length === 0){
                const user = await tx.user.findUnique({ where: { id: userId } })
                return { balance: Number(user ? user.balance : 0), soldCount: 0 }
            }

            const totalAmount = userItems.reduce((sum, item) => sum + Number(item.price), 0)
            const soldCount = userItems.length

            await tx.userInventory.deleteMany({
                where: {id: userId}
            })

            const updatedUser = await tx.user.update({
                where: {id: userId},
                data: { balance: { increment: totalAmount } }
            })

            return {
                balance: Number(updatedUser.balance),
                soldCount: soldCount,
            }
        })

        return res.status(200).json(result)
    } catch(error) {
        return res.status(500).json({ error: "Error while selling all inventory" })
    }
}

module.exports = {
    sellSkin,
    sellAllItems
}
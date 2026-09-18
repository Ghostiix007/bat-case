const prisma = require("../config/db.js")
const crypto = require("crypto")

const makeDeposit = async (req, res) => {
    try{
        const { method, amount } = req.body
        const userId = req.user.id

        const parsedAmount = Number(amount)
        if(isNaN(parsedAmount) || parsedAmount <= 0) {
            return res.status(400).json({ error: "Invalid sum of deposit" })
        }

        const allowedMethods = ["card", "crypto", "paypal", "bank"]
        if(!method || !allowedMethods.includes(method)) {
            return res.status(400).json({ error: "Invalid deposit method" })
        }

        const result = prisma.$transaction(async (tx) => {
            const updatedUser = await tx.user.update({
                where: { id: userId},
                data: { balance: { increment: parsedAmount } }
            })

            const depositId = `dep_${crypto.randomBytes(8).toString()}`

            return { balance: Number(updatedUser.balance), depositId: depositId }
        })

        return res.status(200).json({result})
    } catch(error){
        return res.status(500).json({ error: "Error while creating deposit" })
    }
}

module.exports = makeDeposit
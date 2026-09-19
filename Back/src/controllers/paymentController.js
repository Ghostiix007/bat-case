const prisma = require("../config/db.js")

const createPayment = async (req, res) => {
    try{
        const { amount } = req.body
        const userId = req.user.id

        if (!amount || amount <= 0) {
            return res.status(400).json({ message: "Not enough money" })
        }

        const payUrl = `http://localhost:5000/api/payments/mock-checkout?userId=${userId}&amount=${amount}`

        res.status(200).json({ message: "Payment url generated successfully" })
    } catch(error){
        res.status(500).json({ message: "Error while creating payment", error: error.message })
    }
}


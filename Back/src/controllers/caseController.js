const prisma = require("prisma")
const {getRandomSkin} = require("../utils/randomSkinGeter.js")

const getCases = async (req, res) => {
    try{
        const cases = await prisma.case.findMany({
            where: { isActive: true },
            include: { collection: true }
        })
        res.json(cases)
    } catch (error){
        res.status(500).send({ message: "Error while getting collections", error: error.message })
    }
}

const getCaseById = async (req, res) => {
    try{
        const { id } = req.params
        const caseData = await prisma.case.findUnique({
            where: { id },
            include: {
                collection: true,
                caseSkins : {include: { skin: true } }
            }
        })

        if(!caseData){
            return res.status(404).json({ message: "Case not found" })
        }

        res.json(caseData)
    } catch(error){
        res.status(500).json({ message: "Error while getting case", error: error.message })
    }
}

const openCase = async (req, res) => {
    try{
        const {id: caseId} = req.params
        const userId = req.user.id

        const result = await prisma.$transaction(async (tx) => {
            const caseData = await tx.case.findUnique({
                where: { id: caseId, isActive: true },
                include: { caseSkins : {include: { skin: true } } }
            })

            if(!caseData || caseData.caseSkins.length === 0){
                throw new Error("No case found or it is empty")
            }

            const user = await tx.user.findUnique({ where: { id: userId } })
            if(Number(user.balance) < Number(caseData.price)){
                throw new Error("Not enough money")
            }

            const updateUser = await tx.user.update({
                where: { id: userId },
                data: { balance: { decrement: caseData.price } }
            })

            const selectedCaseSkin = getRandomSkin(caseData.caseSkins)
            const droppedSkin = selectedCaseSkin.skin

            await tx.userInventory.create({
                data: {
                    userId: user.id,
                    skinId: droppedSkin.id
                }
            })

            await tx.log.create({
                data: {
                    eventType: "CASE_OPEN",
                    userId: user.id,
                    payload: {caseId: caseData.id, skinId: droppedSkin.id}
                }
            })

            return {
                droppedSkin,
                newBalance: updateUser.balace
            }
        })

        res.json(result)
    }catch(error){
        res.status(500).json({ message: "Error while opening case", error: error.message })
    }
}

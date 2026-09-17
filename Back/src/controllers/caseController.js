const prisma = require("../config/db")
const {getRandomSkin} = require("../utils/randomSkinGeter.js")
const {error} = require("@mermaid-js/mermaid-cli");

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

//=============================FOR ADMINS=============================
const createCase = async (req, res) => {
    try{
        const { name, price, imageUrl, description, collectionId } = req.body

        if(!name || price === undefined){
            return res.status(400).json({ message: "Name and price are required" })
        }

        const newCase = await prisma.create({
            data: {
                name: name,
                price : parseFloat(price),
                imageUrl : imageUrl,
                description : description,
                collectionId : collectionId,
            }
        })

        res.status(201).json( { message: "Case was added", case: newCase })
    } catch(error){
        res.status(500).json({ message: "Error while creating case", error: error.message })
    }
}

const updateCase = async (req, res) => {
    try{
        const { id } = req.params
        const { name, price, imageUrl, description, isActive } = req.body

        const updatedCase = await prisma.case.update({
            where: { id },
            data: {
                ...(name && { name }),
                ...(price !== undefined && { price: parseFloat(price) }),
                ...(imageUrl && { imageUrl }),
                ...(description !== undefined && { description }),
                ...(isActive !== undefined && { isActive })
            }
        })

        res.status(200).json({ message: "Case was updated", case: updatedCase })
    } catch(error){
        res.status(500).json({ message: "Error while updating case", error: error.message })
    }
}

const deleteCase = async (req, res) => {
    try{
        const {id} = req.params

        await prisma.$transaction([
            prisma.caseSkins.deleteMany({
                where: { caseId: id }
            }),
            prisma.case.delete({
                where: { id }
            })
        ])

        res.status(200).json({ message: "Case was deleted"})
    } catch(error){
        res.status(500).json({ message: "Error while deleting case", error: error.message })
    }
}

const addSkinsToCase = async (req, res) => {
    try{
        const {id: caseId} = req.params
        const {skins} = req.body

        if (skins.length === 0) {
            return res.status(400).json({message: "No skins in case"})
        }

        let totalChance = 0
        skins.forEach((skin) => {
            totalChance += Number(skin.dropChance)
        })

        if (Math.abs(totalChance - 100) > 0.1) {
            return res.status(400).json({message: `Total drop chance must = 100, curren total drop chance = ${totalChance}`})
        }

        await prisma.$transaction(async (tx) => {
            await tx.caseSkins.deleteMany({
                where: {caseId}
            })

            await tx.caseSkins.createMany({
                data: skins.map((cs) => ({
                    caseId,
                    skinId: cs.skinId,
                    dropChance: parseFloat(cs.dropChance),
                }))
            })
        })

        res.status(200).json({ message: "Skins were added successfully" })
    } catch(error){
        res.status(500).json({ message: "Error while adding skins to case", error: error.message })
    }
}


module.exports = {
    getCases,
    getCaseById,
    openCase,
    createCase,
    updateCase,
    deleteCase,
    addSkinsToCase
}
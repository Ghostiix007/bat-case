const prisma = require("../config/db")
const {getRandomSkin} = require("../utils/randomSkinGeter.js")
const WEARS = ["Factory new", "Minimal wear", "Field-tested", "Battle-scarred"]

const getCases = async (req, res) => {
    try{
        const cases = await prisma.case.findMany({
            include: {
                caseSkins: {
                    include: {
                        skin: true
                    }
                }
            }
        })

        const formatedCases = cases.map((c) => ({
            id: c.id,
            name: c.name,
            type: c.type,
            code: c.code,
            price: Number(c.price),
            volatility: c.volatility,
            accent: c.accent,
            drops: c.caseSkins.map((cs) => cs.skin.name)
        }))

        res.status(200).json(formatedCases)
    } catch (error){
        res.status(500).json({ error: "Error while getting collections" })
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
        const {caseId} = req.params
        const count = Math.min(Math.max(parseInt(req.body.count) || 1, 1), 5)
        const userId = req.user.id

        const caseData = await prisma.case.findUnique({
            where: { id: caseId },
            include: {
                caseSkins: {
                    include: { skin: true }
                }
            }
        })

        if(!caseData){
            return res.status(404).json({ error: "Case not found" })
        }

        const user = await prisma.user.findUnique({
            where: { id: userId }
        })

        if(!user){
            return res.status(404).json({ error: "User not found" })
        }

        const isFreeCase = caseData.price === 0 || caseId === "starter-free"

        if(isFreeCase){
            if(user.freeCaseUsed){
                return res.status(403).json({ error: "Free case is already used" })
            }
            if(count > 1){
                return res.status(400).json({ error: "Free case can be opened only one time"})
            }
        }

        const casePrice = Number(caseData.price)
        const totalPrice = casePrice * count

        if(Number(user.balance) < totalPrice){
            return res.status(402).json({ error: "Not enough credits on balance" })
        }

        const result = await prisma.$transaction(async (tx) => {
            const updateUser = await tx.user.update({
                where: {id: userId},
                data: isFreeCase ? {freeCaseUsed: true} : {balance: {decrement: totalPrice}}
            })

            const droppedItems = []

            for (let i = 0; i < count; i++) {
                const wonSkin = getRandomSkin(caseData.caseSkins, casePrice)
                const skinPrice = Number(wonSkin.price)

                let calculatedPrice = Math.max(8, Math.round((skinPrice + casePrice * 0.15) * (0.84 + Math.random() * 0.32)))

                if (isFreeCase && calculatedPrice < 30) {
                    calculatedPrice = 30
                }

                const randomWear = WEARS[Math.floor(Math.random() * WEARS.length)]

                const newItem = await tx.userInventory.create({
                    data: {
                        userId,
                        skinId: wonSkin.id,
                        price: calculatedPrice,
                        wear: randomWear,
                        source: "case"
                    },
                    include: {skin: true}
                })

                droppedItems.push({
                    id: newItem.id,
                    name: newItem.skin.name,
                    weapon: newItem.skin.weapon,
                    rarity: newItem.skin.rarity,
                    price: Number(newItem.price),
                    wear: newItem.wear,
                })
            }

            return {
                items: droppedItems,
                balance: Number(updatedUser.balance),
                freeCaseUsed: updatedUser.freeCaseUsed
            }
        })

        const response = {
            items: result.items,
            balance: result.balance
        }

        if(isFreeCase){
            response.freeCaseUsed = true
        }

        return res.status(200).json(response)
    }catch(error){
        res.status(500).json({ error: "Error while opening case" })
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
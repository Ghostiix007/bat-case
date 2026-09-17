const RARITY_WEIGHTS = {
    consumer: 72,
    industrial: 56,
    milspec: 44,
    restricted: 22,
    classified: 10,
    covert: 3.4,
    mythic: 0.85
}

function calculateSkinWeight(skinPrice, casePrice, rarity){
    const rarityWeight = RARITY_WEIGHTS[rarity?.toLowerCase()]
    const ratio = skinPrice > 0 ? casePrice / skinPrice : 1
    const valuePenalty = Math.min(Math.max(ratio, 0.12), 1)

    let premiumPenalty = 1
    if(casePrice >= 800)
        premiumPenalty = 0.42
    else if(casePrice >= 450)
        premiumPenalty = 0.58
    else if(casePrice >= 250)
        premiumPenalty = 0.776

    return rarityWeight * valuePenalty * premiumPenalty
}

function getRandomSkin(caseSkins, casePrice){
    const preparedSkins = caseSkins.map((item) => {
        const chance = calculateSkinWeight(Number(item.skin.price), Number(casePrice), item.skin.rarity)
        return { ...item.skin, dropChance: chance }
    })

    let totalChance = 0

    preparedSkins.forEach(skin => {
        totalChance += Number(skin.drop_chance)
    })

    let rand = Math.random() * totalChance

    for(const skin of preparedSkins){
        if(rand < Number(skin.drop_chance)){
            return skin
        }
        rand -= Number(skin.drop_chance)
    }
}

module.exports = {getRandomSkin}
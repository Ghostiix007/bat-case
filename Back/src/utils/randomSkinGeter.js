function getRandomSkin(skins){
    let totalChance = 0

    skins.forEach(skin => {
        totalChance += skin.drop_chance
    })

    let rand = Math.random() * totalChance

    for(const skin of skins){
        if(rand < skin.drop_chance){
            return skin
        }
        rand -= skin.drop_chance
    }
}

module.exports = {getRandomSkin}
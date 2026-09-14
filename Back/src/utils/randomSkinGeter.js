function getRandomSkin(skins){
    let totalChance

    skins.forEach(skin => {
        totalChance += skin.drop_chance
    })

    let rand = Math.random() * totalChance

    skins.forEach(skin => {
        if(rand < skin.drop_chance){
            return skin
        }
        rand -= skin.drop_chance
    })

}
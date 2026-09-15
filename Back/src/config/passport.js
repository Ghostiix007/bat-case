const passport = require('passport')
const SteamStrategy = require('passport-steam').Strategy
const prisma = require('./db')
const config = require('./env')

passport.serializeUser((user, done) => {
    done(null, user.id)
})

passport.deserializeUser(async (id, done) => {
    try{
        const user = await prisma.user.findUnique({where: {id}})
        done(null, user)
    } catch(error){
        done(error, null)
    }
})

passport.use(new SteamStrategy(
    {
        returnURL: config.RETURN_URL,
        realm: config.REALM,
        apiKey: config.STEAM_API_KEY,
    },
    async (identifier, profile, done) => {
        try{
            const steamId = profile.id;
            const username = profile.displayName;

            const user = await prisma.user.upsert({
                where: { id: steamId},
                update: {username},
                create: {
                    id: steamId,
                    username: username,
                    balance: 0.0,
                    role: "USER"
                },
            })

            return done(null, user)
        } catch(error){
            return done(error, null)
        }
    }
))

module.exports = passport
const { PrismaClient } = require('@prisma/client')
const config = require('./env.js')

const prisma = new PrismaClient({
    datasources : {
        db: {
            url: config.DATABASE_URL
        }
    }
})

module.exports = prisma
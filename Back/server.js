const express = require('express');
const cors = require('cors');
const prisma = require('./src/config/db');

const app = express();
const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());

app.get('/api/health', async (req, res) => {
    try {
        await prisma.$queryRaw`SELECT 1`;
        res.json({ status: 'ok', message: 'BatCase API is running & DB is connected' });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Database connection failed', error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`BatCase Server running on port ${PORT}\nOn address http://localhost:${PORT}`);
});
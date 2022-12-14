const { MongoClient } = require('mongodb')
const express = require('express');
const app = express()
const cors = require('cors');
app.use(cors())
app.use(express.json())
require('dotenv').config()
const port = process.env.PORT || 5000;
const client = new MongoClient(process.env.DB_CONNECTION_URL);

const run = async () => {
    try {
        await client.connect();
        const information = client.db(`information`).collection('informations');

        app.get('/', async (req, res) => {
            res.send("Hello World")
        })
        app.get('/information', async (req, res) => {
            const query = {};
            const cursor = information.find(query)
            const result = await cursor.toArray()
            res.send(result)
        })
        app.post('/information', async (req, res) => {
            const info = req.body;
            const { id, name } = info;
            const query = {};
            const cursor = information.find(query)
            const result = await cursor.toArray()
            const exist = result.find(r => parseInt(r.id) === parseInt(id))
            if (!exist) {
                const finalResult = information.insertOne(info)
                res.send(finalResult)
            }
            else {
                res.status(404).json({ name })
            }
        })
    }
    finally {

    }
}
run().catch(console.dir)
app.listen(port, () => {
    console.log('Listening from port 5000')
})


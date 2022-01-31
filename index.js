const express = require('express')
const redis = require('redis')
require('./db/mongoose')
const dbRoamLocation = require('./models/db_roam_location')

const app = express()

const port = process.env.PORT || 3000
const redisPort = process.env.PORT || 6379

const client = redis.createClient(redisPort)
client.connect()

client.on('error', (err) => {
    console.log('Connection Error: ' + err);
})
client.on('connect', (err) => {
    console.log('Redis Connection Established.')
})
// console.log('GeoAdd Length: ' + client.geoAdd().length)
const geo = require('georedis').initialize(client)
app.use(express.json())


const KEY = 'ram'
const add = async (entry) => {
    const latitude = parseFloat(entry.latitude)
    const name = entry.name
    console.log(longitude, latitude, name)
    await client.geoAdd(KEY, {
        longitude: longitude,
        latitude: latitude,
        member: name
    })
    console.log("Item added to redis")
}

const search = async (long, lat) => {
    await client.geoSearch(KEY, { longitude: long, latitude: lat }, { radius: 100, unit: 'km' })
    console.log("Search Done!!")
}

app.get('/db', async (req, res) => {
    try {
        const data = await dbRoamLocation.find({})
        data.forEach((entry) => {
            console.log('Inside Loop!!')

            add(entry).then((res) => {
                console.log('Result at Adding: ' + res)
            }).catch((e) => {
                console.log('Error at Adding: ' + e) 
            })
        })
        
        console.log('Geo adding done!')

        const longi = req.body.longitude
        const lati = req.body.latitude
        console.log(longi, lati)
        search(longi, lati).then((res) => {
            console.log('Result at Search: ' + res)
            res.send(res)
        }).catch((e) => {
            console.log('Error at Search: ' + e)
        })
    } catch (e) {
        console.log('Error at last: ' + e)
        res.status(500).send(e)
    }
})

app.listen(port, () => {
    console.log('Server is up on port ' + port)
})
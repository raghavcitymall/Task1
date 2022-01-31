const mongoose = require('mongoose')

const dbRoamLocation = mongoose.model('db_roam_location', {
    name: {
        type: String,
        required: true,
        trim: true
    },
    longitude: {
        type: String,
        required: true
    },
    latitude: {
        type: String,
        required: true
    }
})

module.exports = dbRoamLocation
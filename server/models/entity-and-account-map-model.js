const mongoose = require('mongoose')
const Schema = mongoose.Schema

const EntityAndAccountMap = new Schema(
    {
        map: {
            type: Map,
            of: String,
            default: {}
        },
    },
    { timestamps: true },
)

module.exports = mongoose.model('EntityAndAccountMap', EntityAndAccountMap)
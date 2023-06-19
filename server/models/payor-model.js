const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Address = new Schema(
    {
        line1: { type: String, required: true },
        line2: { type: String },
        city: { type: String, required: true },
        state: { type: String, required: true },
        zip: { type: String }
    }
)

const Payor = new Schema(
    {
        dunkinId: { type: String, required: true },
        abaRouting: { type: String, required: true },
        accountNumber: { type: String, required: true },
        name: { type: String, required: true },
        dba: { type: String, required: true },
        ein: { type: String, required: true },
        address: { type: Address, required: true },
        entityId: { type: String }
    },
    { timestamps: true },
)

module.exports = mongoose.model('Payor', Payor)
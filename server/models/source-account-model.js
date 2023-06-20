const mongoose = require('mongoose')
const Schema = mongoose.Schema

const SourceAccount = new Schema(
    {
        methodId: { type: String, required: true },
        holderId: { type: String, required: true },
        accountNumber: { type: String, required: true },
        routingNumber: { type: String, required: true },
    },
    { timestamps: true },
)

module.exports = mongoose.model('SourceAccount', SourceAccount)
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const DestinationAccount = new Schema(
    {
        methodId: { type: String, required: true },
        holderId: { type: String, required: true },
        plaidId: { type: String, required: true },
        loanAccountNumber: { type: String, required: true },
    },
    { timestamps: true },
)

module.exports = mongoose.model('DestinationAccount', DestinationAccount)
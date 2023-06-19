const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Payee = new Schema(
    {
        plaidId: { type: String, required: true },
        loanAccountNumber: { type: String, required: true },
    },
    { timestamps: true },
)

module.exports = mongoose.model('Payee', Payee)
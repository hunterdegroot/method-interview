const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Payment = new Schema(
    {
        employee: {
            type: mongoose.ObjectId,
            ref: 'Employee', required: true
        },
        payor: {
            type: mongoose.ObjectId,
            ref: 'Payor', required: true
        },
        payee: {
            type: mongoose.ObjectId,
            ref: 'Payee', required: true
        },
        amount: { type: Number, required: true },
        status: { type: String },
        error: { type: String },
        srcAcctId: { type: String },
        destAcctId: { type: String },
    },
    { timestamps: true },
)

module.exports = mongoose.model('Payment', Payment)
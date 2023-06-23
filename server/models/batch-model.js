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

const Payee = new Schema(
    {
        plaidId: { type: String, required: true },
        loanAccountNumber: { type: String, required: true },
    },
    { timestamps: true },
)

const Employee = new Schema(
    {
        dunkinId: { type: String, required: true },
        dunkinBranch: { type: String, required: true },
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        dob: { type: String, required: true },
        phoneNumber: { type: String },
        entityId: { type: String }
    },
    { timestamps: true },
)

const Payment = new Schema(
    {
        employee: {
            type: Employee,
            required: true
        },
        payor: {
            type: Payor,
            required: true
        },
        payee: {
            type: Payee,
            required: true
        },
        amount: { type: Number, required: true },
        status: { type: String },
        error: { type: String },
        srcAcctId: { type: String },
        destAcctId: { type: String },
    },
    { timestamps: true },
)

const Batch = new Schema(
    {
        payments: { type: [Payment], required: true },
        status: { type: String },
        error: { type: String },
    },
    { timestamps: true },
)

module.exports = mongoose.model('Batch', Batch)
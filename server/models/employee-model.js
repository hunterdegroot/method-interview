const mongoose = require('mongoose')
const Schema = mongoose.Schema

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

module.exports = mongoose.model('Employee', Employee)
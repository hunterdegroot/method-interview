const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Batch = new Schema(
    {
        payments: { type: [Schema.Types.ObjectId], required: true },
    },
    { timestamps: true },
)

module.exports = mongoose.model('Batch', Batch)
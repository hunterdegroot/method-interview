const mongoose = require('mongoose')
require('dotenv').config();

const { DB_URL } = process.env;

mongoose
    .connect(DB_URL, { useNewUrlParser: true })
    .catch(e => {
        console.error('Connection error', e.message)
    })

const db = mongoose.connection

module.exports = db
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

const db = require('./db')
const uploadRouter = require('./routes/upload-router')
const reportsRouter = require('./routes/report-router')
const app = express()
const apiPort = 5000


app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())

db.on('error', console.error.bind(console, 'MongoDB connection error:'))

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.use('/api', uploadRouter)
app.use('/api', reportsRouter)

app.listen(apiPort, () => console.log(`Server running on port ${apiPort}`))
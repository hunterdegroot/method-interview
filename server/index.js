const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

const batchService = require('./service/batch-service');
const cron = require('node-cron');

const db = require('./db')
const uploadRouter = require('./routes/upload-router')
const reportsRouter = require('./routes/report-router')
const app = express()
const apiPort = 5000

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())

db.on('error', console.error.bind(console, 'MongoDB connection error:'))

app.use('/api', uploadRouter)
app.use('/api', reportsRouter)

cron.schedule('* * * * *', () => {
    batchService.preProcess();
});

cron.schedule('0 */4 * * *', () => {
    batchService.updateProcessStatus();
});

app.listen(apiPort, () => console.log(`Server running on port ${apiPort}`))
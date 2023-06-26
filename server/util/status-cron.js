const Batch = require('../models/batch-model')
const db = require('../db')
const EntityAndAccountMap = require('../models/entity-and-account-map-model')
const cron = require('node-cron');

async function statusCron() {
    const batches = await Batch.find().sort({ createdAt: -1 }).limit(41);

    let paymentsMap = {}
    let batchMap = {}
    for (const batch of batches) {
        if (batchMap[batch.status]) batchMap[batch.status]++
        else batchMap[batch.status] = 1
        for (const payment of batch.payments) {
            if (paymentsMap[payment.status]) paymentsMap[payment.status]++
            else paymentsMap[payment.status] = 1
        }
    }

    if ((await EntityAndAccountMap.find()).length) {
        const map = (await EntityAndAccountMap.find())[0].map
        console.log(Array.from(map.keys()).length)
    }

    console.log(batchMap)
    console.log(paymentsMap)
};
cron.schedule('* * * * *', () => {
    statusCron();
});

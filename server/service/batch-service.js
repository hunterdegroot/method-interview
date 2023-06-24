const Batch = require('../models/batch-model')
const EntityAndAccountMap = require('../models/entity-and-account-map-model')
const paymentService = require('./payment-service')
const timeout = require('../util/timeout')

async function stage(batchData) {
    const batchIds = [];
    let payments = [];
    let i = 1;
    for (const paymentData of batchData) {
        payments.push(paymentService.create(paymentData))
        i++
        if (i % 500 == 0) {
            const batch = new Batch({ payments })
            batchIds.push(batch._id);
            await batch.save();
            payments = [];
        };
    }

    const batch = new Batch({ payments })
    batchIds.push(batch._id);
    await batch.save();
    return batchIds;
}

async function preProcess() {
    if ((await Batch.find({ status: 'preProcessing' })).length) return;
    const batches = await Batch.find({ status: 'queued' });
    console.log(batches.length)
    await markQueuedBatchesPreProcessing(batches);
    const entityAndAccountMap = await createEntityAndAccountMap(batches);

    console.time()
    const promises = [];
    let i = 0;
    for (const batch of batches) {
        batch.status = 'preProcessed';
        for (const payment of batch.payments) {
            i++;
            if (i % 600 == 0) {
                await timeout(60000);
            };
            if (payment.status == 'preProcessing') promises.push(paymentService.process(payment, entityAndAccountMap));
        }
    }

    Promise.all(promises).then(async () => {
        for (const batch of batches) {
            await updatePreProcessStatus(batch)
        }
        console.timeEnd()
    });
}

async function createEntityAndAccountMap(batches) {
    if (!(await EntityAndAccountMap.find()).length) {
        (await (new EntityAndAccountMap()).save())
    }

    const entityAndAccountMap = (await EntityAndAccountMap.find())[0];
    for (const batch of batches) {
        for (const payment of batch.payments) {
            if (payment.status == 'preProcessing') await paymentService.createEntitiesAndAccounts(payment, entityAndAccountMap);
        }
        await entityAndAccountMap.save();
        await batch.save();
    }

    return entityAndAccountMap;
}

async function markQueuedBatchesPreProcessing(batches) {
    for (const batch of batches) {
        batch.status = 'preProcessing';
        for (const payment of batch.payments) {
            if (payment.status === 'queued') payment.status = 'preProcessing'
        }
        await batch.save();
    }
}

async function que(batchIds) {
    const batches = [];
    for (const batchId of batchIds) {
        batches.push((await Batch.find({ _id: batchId }))[0]);
    }

    for (const batch of batches) {
        const payments = batch.payments;
        for (const payment of payments) {
            paymentService.que(payment);
        }
        batch.status = 'queued';
        await batch.save();
    }
}

async function updatePreProcessStatus(batch) {
    for (const payment of batch.payments) {
        if (payment.status == 'errored') batch.status = 'errored';
        if (payment.status == 'queued') {
            batch.status = 'queued';
            break;
        }
    }
    await batch.save();
}

async function updateProcessStatus() {
    const batches = await Batch.find({ status: 'preProcessed' });
    for (const batch of batches) {
        batch.status = 'sent';
        for (const payment of batch.payments) {
            if (await paymentService.updateProcessStatus(payment) != 'sent') batch.status = 'preProcessed';
        }
    }
    await batch.save();
}

function tableData(batchData) {
    return batchData.map(row => ({
        name: row.Employee.FirstName._text + ' ' + row.Employee.LastName._text,
        account: row.Payor.AccountNumber._text,
        loanNumber: row.Payee.LoanAccountNumber._text,
        amount: row.Amount._text,
    }))
}


module.exports = { stage, que, tableData, preProcess, updateProcessStatus }
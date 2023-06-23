const Batch = require('../models/batch-model')
const EntityAndAccountMap = require('../models/entity-and-account-map-model')
const paymentService = require('./payment-service')

async function stage(batchData) {
    const batchObj = {};
    const payments = [];

    for (const paymentData of batchData) {
        payments.push(paymentService.create(paymentData))
    }

    batchObj.payments = payments;
    const batch = new Batch(batchObj)
    await batch.save();
    return batch;
}

async function preProcess() {
    const batches = await Batch.find({ status: 'queued' });
    console.log(batches.length)
    await markQueuedBatchesPreProcessing(batches);
    const entityAndAccountMap = await createEntityAndAccountMap(batches);

    for (const batch of batches) {
        batch.status = 'preProcessed';
        const promises = [];
        for (const payment of batch.payments) {
            if (payment.status == 'preprocessing') promises.push(paymentService.process(payment, entityAndAccountMap));
        }
        Promise.all(promises).then(async () => {
            updatePreProcessStatus(batch)
        });
    }
}

async function createEntityAndAccountMap(batches) {
    if (!(await EntityAndAccountMap.find()).length) {
        (await (new EntityAndAccountMap()).save())
    }

    const entityAndAccountMap = (await EntityAndAccountMap.find())[0];
    for (const batch of batches) {
        for (const payment of batch.payments) {
            if (payment.status == 'preprocessing') await paymentService.createEntitiesAndAccounts(payment, entityAndAccountMap);
        }
        await entityAndAccountMap.save();
        await batch.save();
    }

    return entityAndAccountMap;
}

async function markQueuedBatchesPreProcessing(batches) {
    for (const batch of batches) {
        batch.status = 'preprocessing';
        await batch.save();
        for (const payment of batch.payments) {
            if (payment.status === 'queued') payment.status = 'preprocessing'
        }
        await batch.save();
    }
}

async function que(batchId) {
    const batch = (await Batch.find({ _id: batchId }))[0];
    const payments = batch.payments;
    for (const payment of payments) {
        paymentService.que(payment);
    }
    batch.status = 'queued';
    await batch.save();
}

async function updatePreProcessStatus(batch) {
    for (const payment of batch.payments) {
        if (payment.status == 'errored') batch.status = 'errored';
        if (payment.status == 'queued') {
            batch.status = 'queued';
            break;
        }
    }
    batch.save();
}

async function updateProcessStatus() {
    const batches = await Batch.find({ status: 'preProcessed' });
    for (const batch of batches) {
        batch.status = 'sent';
        for (const payment of batch.payments) {
            if (await paymentService.updateProcessStatus(payment) != 'sent') batch.status = 'preProcessed';
        }
    }
    batch.save();
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
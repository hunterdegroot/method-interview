const Batch = require('../models/batch-model')
const EntityAndAccountMap = require('../models/entity-and-account-map-model')
const paymentService = require('./payment-service')
const timeout = require('../util/timeout')

// save payments in 600 payment batches and que for preProcessing
async function stage(batchData) {
    const batches = [];
    let payments = [];
    let i = 1;
    for (const paymentData of batchData) {
        payments.push(paymentService.create(paymentData))
        if (i % 600 == 0) {
            batches.push(create(payments));
            payments = [];
        };
        i++
    }

    batches.push(create(payments));
    return batches;
}

function create(payments) {
    const batch = new Batch({ payments })
    batch.status = 'preProcessing';
    batch.save();
    return batch;
}

// create method payments and requeue batch if there's an error *buffer requests 600/min*
async function preProcess(batchData) {
    console.time('staging')
    const batches = await stage(batchData);
    console.timeEnd('staging');

    await timeout(60000)
    console.time('entity creation')
    const entityAndAccountMap = await createEntityAndAccountMap(batches);
    console.timeEnd('entity creation')

    console.time('payment creation')
    for (const batch of batches) {
        const promises = [];
        await timeout(60000)
        batch.status = 'preProcessed';
        for (const payment of batch.payments) {
            promises.push(paymentService.process(payment, entityAndAccountMap));
        }

        try {
            await Promise.all(promises);
        } catch {
            // a pinch of retry for good measure
            const retryPromises = promises.filter(p => p.status === 'errored').map(p => paymentService.process(p.payment, entityAndAccountMap));
            try {
                await Promise.all(retryPromises);
                console.log('Failed payments rerun successfully.');
            } catch (rerunError) {
                batch.status = 'errored'
                promises.forEach(p => {
                    if (p.status === 'errored') {
                        p.payment.status = 'errored';
                    }
                });
            }
        }

        await batch.save();
    }
    console.timeEnd('payment creation')
}

// create method entities and accounts and store their refs in mongo as a map
async function createEntityAndAccountMap(batches) {
    let entityAndAccountMap = await EntityAndAccountMap.findOne();
    if (!entityAndAccountMap) {
        entityAndAccountMap = new EntityAndAccountMap();
        await entityAndAccountMap.save();
    }

    let i = 1;
    for (const batch of batches) {
        for (const payment of batch.payments) {
            // if (i % 150 == 0) {
            //     await timeout(60000);
            // }
            await paymentService.createEntitiesAndAccounts(payment, entityAndAccountMap);
            i++;
        }
        await entityAndAccountMap.save();
        await batch.save();
        promises = [];
    }

    return entityAndAccountMap;
}

// updates payments from method *executed by cron job every 4 hours*
async function updateProcessStatus() {
    if ((await Batch.find({ status: 'preProcessing' })).length) return;
    const batches = await Batch.find({ status: 'preProcessed' });

    console.time('update payments from method')
    for (const batch of batches) {
        await timeout(60000)
        if ((await Batch.find({ status: 'preProcessing' })).length) return;
        const promises = [];
        for (const payment of batch.payments) {
            try {
                promises.push(paymentService.updateProcessStatus(payment))
            } catch (e) {
                console.log(e)
            }
        }
        await Promise.all(promises);
        batch.status = 'sent';
        for (const payment of batch.payments) {
            if (payment.status != 'sent') batch.status = 'preProcessed';
        }
        await batch.save();
    }
    console.timeEnd('update payments from method')
}

function tableData(batchData) {
    return batchData.map(row => ({
        name: row.Employee.FirstName._text + ' ' + row.Employee.LastName._text,
        account: row.Payor.AccountNumber._text,
        loanNumber: row.Payee.LoanAccountNumber._text,
        amount: row.Amount._text,
    }))
}

module.exports = { stage, tableData, preProcess, updateProcessStatus }
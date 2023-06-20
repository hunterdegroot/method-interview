const Batch = require('../models/batch-model')
const Payment = require('../models/payment-model')
const paymentService = require('./payment-service')

async function preProcess(data) {
    const batch = new Batch();
    const payments = [];

    for (let i = 0; i < data.length; i++) {
        try {
            const payment = await paymentService.preProcess(data[i])
            payments.push(payment);
        } catch (e) {
            console.log(e)
        }
    }

    batch.payments = payments;
    await batch.save();
    return batch;
}

async function que(batchId) {
    const batch = (await Batch.find({ _id: batchId }))[0];
    for (const paymentId of batch.payments) {
        const payment = (await Payment.find({ _id: paymentId }))[0]
        await paymentService.que(payment);
    }
}

function tableData(batchData) {
    return batchData.map(row => ({
        name: row.Employee.FirstName._text + ' ' + row.Employee.LastName._text,
        account: row.Payor.AccountNumber._text,
        loanNumber: row.Payee.LoanAccountNumber._text,
        amount: row.Amount._text,

    }))
}

module.exports = { preProcess, que, tableData }
const Batch = require('../models/batch-model')
const paymentService = require('../service/payments-service')

async function process(batchId) {
    const batch = (await Batch.find({ _id: batchId }))[0];
    const payments = [];

    for (let payment of batch.payments) {
        try {
            await paymentService.process(payment);
        } catch (e) {
            console.log(e)
        }
    }

    batch.payments = payments;
    batch.save();
}

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

function tableData(batchData) {
    return batchData.map(row => ({
        name: row.Employee.FirstName._text + ' ' + row.Employee.LastName._text,
        account: row.Payor.AccountNumber._text,
        loanNumber: row.Payee.LoanAccountNumber._text,
        amount: row.Amount._text,

    }))
}

module.exports = { preProcess, process, tableData }
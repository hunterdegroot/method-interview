const employeeService = require('./employee-service')
const payorService = require('./payor-service')
const payeeService = require('./payee-service')
const accountService = require('./account-service');
const Batch = require('../models/batch-model');
const { Method, Environments } = require('method-node');

const method = new Method({
    apiKey: 'sk_thcA7AdE9xce4r9zRRDCmfK3',
    env: Environments.dev,
});

function create(rowData) {
    const employee = employeeService.create(rowData.Employee);
    const payor = payorService.create(rowData.Payor);
    const payee = payeeService.create(rowData.Payee);
    const amount = Number(rowData.Amount._text.replace(/[^0-9.-]+/g, ""))
    const status = 'preProcessing';
    return {
        employee,
        payor,
        payee,
        amount,
        status
    }
}

async function createEntitiesAndAccounts(payment, entityAndAccountMap) {
    try {
        return [
            await employeeService.findOrCreateEntity(payment.employee, entityAndAccountMap),
            await payorService.findOrCreateEntity(payment.payor, entityAndAccountMap),
            await accountService.findOrCreateDestinationAccount(payment, entityAndAccountMap),
            await accountService.findOrCreateSourceAccount(payment, entityAndAccountMap)]
    } catch (e) {
        handleError(payment, e)
        return [];
    }
}

async function process(payment) {
    const methodPayment = await method.payments.create({
        amount: parseInt(payment.amount * 100),
        source: payment.srcAcctId,
        destination: payment.destAcctId,
        description: 'Loan Pmt',
    });
    payment.methodPaymentId = methodPayment.id;
    payment.status = methodPayment.status
}

function handleError(payment, e) {
    payment.status = 'errored'
    console.log(e)
}

async function get() {
    const batches = await Batch.find();
    let payments = [];
    for (batch of batches) {
        payments = payments.concat(batch.payments);
    }
    return payments;
}

async function getOrdered() {
    const batches = await Batch.find().sort({ createdAt: -1 })
    let payments = [];
    for (batch of batches) {
        payments = payments.concat(batch.payments);
    }
    return payments;
}

async function updateProcessStatus(payment) {
    const status = (await method.payments.get(payment.methodPaymentId)).status;
    payment.status = status;
}

module.exports = { create, process, createEntitiesAndAccounts, get, updateProcessStatus, getOrdered }
const Payment = require('../models/payment-model')
const Employee = require('../models/employee-model')
const Payor = require('../models/payor-model')
const Payee = require('../models/payee-model')
const employeeService = require('./employee-service')
const payorService = require('./payor-service')
const payeeService = require('./payee-service')
const accountService = require('./account-service');

const { Method, Environments } = require('method-node');

const method = new Method({
    apiKey: 'sk_thcA7AdE9xce4r9zRRDCmfK3',
    env: Environments.dev,
});

async function create(rowData) {
    const payment = new Payment();

    const employee = await employeeService.getEmployee(rowData.Employee);
    const payor = await payorService.getPayor(rowData.Payor);
    const payee = await payeeService.getPayee(rowData.Payee);

    payment.employee = employee;
    payment.payor = payor;
    payment.payee = payee;
    payment.amount = Number(rowData.Amount._text.replace(/[^0-9.-]+/g, ""));

    return await payment.save();
}

async function preProcess(data) {
    const payment = new Payment();

    payment.employee = await employeeService.findOrcreate(data.Employee);
    payment.payor = await payorService.findOrCreate(data.Payor);
    payment.payee = await payeeService.findOrCreate(data.Payee);
    payment.amount = Number(data.Amount._text.replace(/[^0-9.-]+/g, ""));
    payment.status = 'preProcess'

    return await payment.save();
}

async function process(payment) {
    try {
        const employee = (await Employee.find({ _id: payment.employee }))[0]
        await employeeService.addEntity(employee);

        const payor = (await Payor.find({ _id: payment.payor }))[0]
        await payorService.addEntity(payor);

        const payee = (await Payee.find({ _id: payment.payee }))[0]

        payment.destAcctId = (await accountService.createOrFindDestinationAccount(
            employee.entityId,
            payee.plaidId,
            payee.loanAccountNumber)).methodId;

        payment.srcAcctId = (await accountService.createOrFindSourceAccount(
            payor.entityId,
            payor.accountNumber,
            payor.abaRouting)).methodId;

        payment.status = 'processed'
        payment.save();
    } catch (e) {
        console.log(e)
        payment.status = 'errored'
        payment.error = e;
        payment.save();
    }
    // async function createPayment(srcAcct, destAcct, amount) {
    //     const payment = await method.payments.create({
    //       amount: parseInt(amount * 100),
    //       source: srcAcct.id,
    //       destination: destAcct.id,
    //       description: 'Loan Pmt',
    //     });
    //   }
}

async function que(payment) {
    payment.status = 'processing'
    payment.save();
}

module.exports = { create, preProcess, process, que }
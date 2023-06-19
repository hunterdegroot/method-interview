const Payment = require('../models/payment-model')
const employeeService = require('../service/employee-service')
const payorService = require('../service/payor-service')
const payeeService = require('../service/payee-service')

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
    await employeeService.addEntity(payment.employee);
    await payorService.addEntity(payment.payor);

    payment.destAcctId = (await accountService.createDestination(
        payment.employee.entityId,
        payment.payee.plaidId,
        payment.payee.loanAccountNumber)).id;

    payment.srcAcctId = (await accountService.createSource(
        payment.payor.entityId,
        payment.payor.accountNumber,
        payment.payor.abaRouting)).id;


    // const methodPayment = await methodService.createPayment(
    //     srcAcct,
    //     destAcct,
    //     payment.amount)
}

// async function createPayment(srcAcct, destAcct, amount) {
//     const payment = await method.payments.create({
//       amount: parseInt(amount * 100),
//       source: srcAcct.id,
//       destination: destAcct.id,
//       description: 'Loan Pmt',
//     });
//   }


module.exports = { create, preProcess, process }
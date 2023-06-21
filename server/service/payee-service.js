const Payee = require('../models/payee-model')

async function findOrCreate(payeeData) {
    const payees = await Payee.find({ plaidId: payeeData.PlaidId._text, loanAccountNumber: payeeData.LoanAccountNumber._text });
    let payee = payees && payees.length > 0 ? payees[0] : null;
    if (!payee) payee = await create(payeeData);
    return payee;
}

async function create(payeeData) {
    const payee = new Payee();
    payee.plaidId = payeeData.PlaidId._text;
    payee.loanAccountNumber = payeeData.LoanAccountNumber._text

    await payee.save();
    return payee;
}

module.exports = { findOrCreate }

// create method entity
const Payee = require('../models/payee-model')

async function findOrCreate(payeeData) {
    let payee;
    await Payee.find({ plaidId: payeeData.PlaidId._text, loanAccountNumber: payeeData.LoanAccountNumber._text },
        (err, payees) => {
            payee = payees[0]
        }
    );
    if (!payee) payee = create(payeeData);
    return payee;
}

async function create(payeeData) {
    const payee = new Payee();
    payee.plaidId = payeeData.PlaidId._text;
    payee.loanAccountNumber = payeeData.LoanAccountNumber._text

    payee.save();
    return payee;
}

module.exports = { findOrCreate }

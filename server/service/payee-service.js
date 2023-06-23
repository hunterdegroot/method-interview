function create(payeeData) {
    return {
        plaidId: payeeData.PlaidId._text,
        loanAccountNumber: payeeData.LoanAccountNumber._text
    }
}

module.exports = { create }

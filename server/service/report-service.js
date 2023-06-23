var { Parser } = require('json2csv')
const paymentService = require('../service/payment-service')

async function accountReport() {
    const fields = [{
        label: 'Account',
        value: 'accountNumber'
    }, {
        label: 'Total',
        value: 'total'
    }]

    const json2csv = new Parser({ fields: fields })
    const payments = await paymentService.get();
    const accountTotalMap = {};
    for (const payment of payments) {
        const accountNumber = payment.payor.accountNumber;
        const amount = payment.amount;

        if (!accountTotalMap[accountNumber])
            accountTotalMap[accountNumber] = amount
        else accountTotalMap[accountNumber] += amount
    }

    const jsonData = [];
    for (const accountNumber of Object.keys(accountTotalMap)) {
        jsonData.push({
            accountNumber,
            total: accountTotalMap[accountNumber]
        })
    }

    return json2csv.parse(jsonData);
}

async function branchReport() {
    const fields = [{
        label: 'Branch',
        value: 'dunkinId'
    }, {
        label: 'Total',
        value: 'total'
    }]

    const json2csv = new Parser({ fields: fields })
    const payments = await paymentService.get();
    const accountTotalMap = {};
    for (const payment of payments) {
        const dunkinId = payment.payor.dunkinId;
        const amount = payment.amount;

        if (!accountTotalMap[dunkinId])
            accountTotalMap[dunkinId] = amount
        else accountTotalMap[dunkinId] += amount
    }

    const jsonData = [];
    for (const dunkinId of Object.keys(accountTotalMap)) {
        jsonData.push({
            dunkinId,
            total: accountTotalMap[dunkinId]
        })
    }

    return json2csv.parse(jsonData);
}

async function paymentReport() {
    const payments = await paymentService.get();
    const fields = [{
        label: 'Account',
        value: 'accountNumber'
    }, {
        label: 'Branch',
        value: 'dunkinId'
    }, {
        label: 'Amount',
        value: 'amount'
    },
    {
        label: 'Status',
        value: 'status'
    },
    {
        label: 'Error',
        value: 'error'
    }]

    const json2csv = new Parser({ fields: fields })
    const jsonData = [];

    for (const payment of payments) {
        const payor = payment.payor
        const accountNumber = payor.accountNumber;
        const dunkinId = payor.dunkinId;
        const amount = payment.amount;
        const status = payment.status;
        const error = payment.error;

        jsonData.push({
            accountNumber,
            dunkinId,
            amount,
            status,
            error
        })
    }

    return json2csv.parse(jsonData);
}

module.exports = {
    accountReport,
    branchReport,
    paymentReport
}
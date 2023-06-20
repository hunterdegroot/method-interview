const reportService = require('../service/report-service');

accountReport = async (req, res) => {
    res.attachment('accounts-report.csv');
    res.status(200).send(await reportService.accountReport());
}

branchReport = async (req, res) => {
    res.attachment('branch-report.csv');
    res.status(200).send(await reportService.branchReport());
}

paymentReport = async (req, res) => {
    res.attachment('payment-report.csv');
    res.status(200).send(await reportService.paymentReport());
}

module.exports = {
    accountReport,
    branchReport,
    paymentReport
}
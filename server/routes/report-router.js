const express = require('express')

const ReportsCtrl = require('../controllers/report-ctrl.js')

const router = express.Router()

router.get('/report/account', ReportsCtrl.accountReport)
router.get('/report/branch', ReportsCtrl.branchReport)
router.get('/report/payment', ReportsCtrl.paymentReport)

module.exports = router
const express = require('express')

const ReportsCtrl = require('../controllers/report-ctrl.js')

const router = express.Router()

router.get('/report', ReportsCtrl.report)

module.exports = router
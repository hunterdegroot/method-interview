const express = require('express')

const UploadCtrl = require('../controllers/upload-ctrl.js')

const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const router = express.Router()

router.post('/batch/preProcess', upload.single('file'), UploadCtrl.preProcessBatch)
router.post('/batch/process', UploadCtrl.processBatch)

module.exports = router
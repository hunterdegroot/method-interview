const express = require('express')

const UploadCtrl = require('../controllers/upload-ctrl.js')

const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const router = express.Router()

router.post('/batch/parse', upload.single('file'), UploadCtrl.parseBatch)
router.post('/batch/que', upload.single('file'), UploadCtrl.queBatch)

module.exports = router
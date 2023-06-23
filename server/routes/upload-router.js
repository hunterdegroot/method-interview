const express = require('express')

const UploadCtrl = require('../controllers/upload-ctrl.js')

const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const router = express.Router()

router.post('/batch/stage', upload.single('file'), UploadCtrl.stageBatch)
router.post('/batch/que', UploadCtrl.queBatch)

module.exports = router
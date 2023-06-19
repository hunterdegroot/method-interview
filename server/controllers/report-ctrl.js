// const batchService = require('../service/batch-service');
const path = require('path');

report = async (req, res) => {
    console.log()
    res.sendFile(path.join(__dirname, '../uploads', 'a.csv'));

    // return res.status(200).json({
    //     success: true,
    // })
}

module.exports = {
    report,
}
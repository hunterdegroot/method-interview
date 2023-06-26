var fs = require('fs')
var convert = require('xml-js');
const batchService = require('../service/batch-service');

parseBatch = async (req, res) => {
    const file = req.file;
    const xml = fs.readFileSync(file.path, 'utf8');
    var result = convert.xml2json(xml, { compact: true, spaces: 4 });

    try {
        fs.unlink(file.path, function (err) {
            if (err) {
                console.log("unlink failed", err);
            }
        });
    } catch (error) {
        console.log(error);
    }

    return res.status(200).json({
        success: true,
        data: batchService.tableData(JSON.parse(result).root.row)
    })
}

queBatch = async (req, res) => {
    const file = req.file;
    const xml = fs.readFileSync(file.path, 'utf8');
    var result = convert.xml2json(xml, { compact: true, spaces: 4 });
    const batchData = JSON.parse(result);
    batchService.preProcess(batchData.root.row);

    try {
        fs.unlink(file.path, function (err) {
            if (err) {
                console.log("unlink failed", err);
            }
        });
    } catch (error) {
        console.log(error);
    }

    return res.status(200).json({
        success: true,
    })
}

module.exports = {
    queBatch,
    parseBatch,
}
var fs = require('fs')
var convert = require('xml-js');
const batchService = require('../service/batch-service');

preProcessBatch = async (req, res) => {
    const file = req.file;
    const xml = fs.readFileSync(file.path, 'utf8');
    var result = convert.xml2json(xml, { compact: true, spaces: 4 });
    const batchData = JSON.parse(result);
    const batchId = (await batchService.preProcess(batchData.root.row)).id;
    console.log(batchService.tableData(JSON.parse(result).root.row))
    return res.status(200).json({
        success: true,
        data: batchService.tableData(JSON.parse(result).root.row),
        batchId
    })
}

processBatch = async (req, res) => {
    batchService.process(req.params.batchId);
    return res.status(200).json({
        success: true,
        fileName: file.path
    })
}

module.exports = {
    preProcessBatch,
    processBatch,
}
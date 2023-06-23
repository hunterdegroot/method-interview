var fs = require('fs')
var convert = require('xml-js');
const batchService = require('../service/batch-service');

stageBatch = async (req, res) => {
    const file = req.file;
    const xml = fs.readFileSync(file.path, 'utf8');
    var result = convert.xml2json(xml, { compact: true, spaces: 4 });
    const batchData = JSON.parse(result);

    const batches = await batchService.stage(batchData.root.row);
    const batchIds = [];
    for (const batch of batches) {
        batchIds.push(batch._id);
    }

    return res.status(200).json({
        success: true,
        data: batchService.tableData(JSON.parse(result).root.row),
        batchIds
    })
}

queBatch = async (req, res) => {
    await batchService.que(req.body.batchIds);
    return res.status(200).json({
        success: true,
    })
}

module.exports = {
    queBatch,
    stageBatch,
}
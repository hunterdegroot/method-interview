const Payor = require('../models/payor-model')
const { Method, Environments } = require('method-node');

const method = new Method({
    apiKey: 'sk_thcA7AdE9xce4r9zRRDCmfK3',
    env: Environments.dev,
});

async function findOrCreate(payorData) {
    const payors = await Payor.find({ dunkinId: payorData.DunkinId._text, accountNumber: payorData.AccountNumber._text });
    let payor = payors && payors.length > 0 ? payors[0] : null;
    if (!payor) payor = await create(payorData);
    return payor;
}

async function create(payorData) {
    const payor = new Payor();
    payor.dunkinId = payorData.DunkinId._text;
    payor.abaRouting = payorData.ABARouting._text
    payor.accountNumber = payorData.AccountNumber._text;
    payor.name = payorData.Name._text
    payor.dba = payorData.DBA._text;
    payor.ein = payorData.EIN._text
    const address = {
        line1: payorData.Address.Line1._text,
        line2: payorData.Address.Line2 ? payorData.Address.Line2._text : undefined,
        city: payorData.Address.City._text,
        state: payorData.Address.State._text,
        zip: payorData.Address.Zip._text,
    }
    payor.address = address;

    await payor.save();
    return payor;
}

async function addEntity(payor) {
    const entity = await method.entities.create({
        type: 'c_corporation',
        corporation: {
            name: payor.name,
            dba: payor.dba,
            ein: payor.ein,
            owners: [],
        },
        address: {
            line1: payor.address.line1,
            line2: payor.address.line2 ? payor.line2 : null,
            city: payor.address.city,
            state: payor.address.state,
            zip: payor.address.zip,
        },
    });

    payor.entityId = entity.id;
    await payor.save();
    return entity;
}

module.exports = { findOrCreate, addEntity }

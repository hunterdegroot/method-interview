const { Method, Environments } = require('method-node');

const method = new Method({
    apiKey: 'sk_thcA7AdE9xce4r9zRRDCmfK3',
    env: Environments.dev,
});

async function findOrCreateEntity(payor, entityAndAccountMap) {
    if (!payor.entityId) {
        if (!entityAndAccountMap.map.get(payor.dunkinId)) {
            const entityId = (await createEntity(payor)).id;
            payor.entityId = entityId;
            entityAndAccountMap.map.set(payor.dunkinId, entityId)
        } else {
            payor.entityId = entityAndAccountMap.map.get(payor.dunkinId)
        }
    }
}

function create(payorData) {
    return {
        dunkinId: payorData.DunkinId._text,
        abaRouting: payorData.ABARouting._text,
        accountNumber: payorData.AccountNumber._text,
        name: payorData.Name._text,
        dba: payorData.DBA._text,
        ein: payorData.EIN._text,
        address: {
            line1: payorData.Address.Line1._text,
            line2: payorData.Address.Line2 ? payorData.Address.Line2._text : undefined,
            city: payorData.Address.City._text,
            state: payorData.Address.State._text,
            zip: payorData.Address.Zip._text,
        }
    }
}

async function createEntity(payor) {
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

    return entity;
}

module.exports = { findOrCreateEntity, create }

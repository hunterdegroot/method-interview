const { Method, Environments } = require('method-node');

const method = new Method({
    apiKey: 'sk_thcA7AdE9xce4r9zRRDCmfK3',
    env: Environments.dev,
});

function create(employeeData) {
    return {
        dunkinId: employeeData.DunkinId._text,
        dunkinBranch: employeeData.DunkinBranch._text,
        firstName: employeeData.FirstName._text,
        lastName: employeeData.LastName._text,
        dob: employeeData.DOB._text,
        phoneNumber: '15121231111'
    }
}

async function findOrCreateEntity(employee, entityAndAccountMap) {
    if (!employee.entityId) {
        if (!entityAndAccountMap.map.get(employee.dunkinId)) {
            const entityId = (await createEntity(employee)).id;
            employee.entityId = entityId;
            entityAndAccountMap.map.set(employee.dunkinId, entityId)
        } else {
            employee.entityId = entityAndAccountMap.map.get(employee.dunkinId)
        }
    }
}

async function createEntity(employee) {
    const entity = await method.entities.create({
        type: 'individual',
        individual: {
            first_name: employee.firstName,
            last_name: employee.lastName,
            phone: '15121231111',
            email: employee.email ? employee.email : 'kevin.doyle@gmail.com',
            dob: employee.dob.replace(/(..).(..).(....)/, "$3-$1-$2"),
        }
    });

    return entity;
}

module.exports = { create, findOrCreateEntity };

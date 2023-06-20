const Employee = require('../models/employee-model')
const { Method, Environments } = require('method-node');

const method = new Method({
    apiKey: 'sk_thcA7AdE9xce4r9zRRDCmfK3',
    env: Environments.dev,
});

async function findOrcreate(employeeData) {
    let employee;
    const employees = await Employee.find({ dunkinId: employeeData.DunkinId._text });
    employee = employees && employees.length > 0 ? employees[0] : null;
    if (!employee) employee = await create(employeeData);
    return employee;
}

async function create(employeeData) {
    const employee = new Employee();
    employee.dunkinId = employeeData.DunkinId._text;
    employee.dunkinBranch = employeeData.DunkinBranch._text
    employee.firstName = employeeData.FirstName._text;
    employee.lastName = employeeData.LastName._text
    employee.dob = employeeData.DOB._text;
    employee.phoneNumber = employeeData.PhoneNumber._text

    await employee.save();
    return employee;
}

async function addEntity(employee) {
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

    employee.entityId = entity.id;
    await employee.save();
    return entity;
}

module.exports = { findOrcreate, addEntity };

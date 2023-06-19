const Employee = require('../models/employee-model')

async function findOrcreate(employeeData) {
    let employee;
    await Employee.find({ dunkinId: employeeData.DunkinId._text },
        (err, employees) => {
            employee = employees && employees.length > 0 ? employees[0] : null;
        }
    );
    if (!employee) employee = create(employeeData);
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

    employee.save();
    return employee;
}

async function addEntity(employee) {
    const entity = await method.entities.create({
        type: 'individual',
        individual: {
            first_name: employee.firstName,
            last_name: employee.lastName,
            phone: employee.phoneNumber,
            email: employee.email ? employee.email : 'kevin.doyle@gmail.com',
            dob: employee.dob.replace(/(..).(..).(....)/, "$3-$1-$2"),
        },
        address: {
            line1: '3300 N Interstate 35',
            line2: null,
            city: 'Austin',
            state: 'TX',
            zip: '78705',
        },
    });

    employee.entityId = entity.id;
    entity.save();

    return entity;
}

module.exports = { findOrcreate, addEntity };

const batch = {
    payments: [
        {
            status: 'unchanged',
            employee: {
                id: 2
            }
        }
    ]
}

for (let payment of batch.payments) {
    payment.status = 'changed';
    payment.employee.id = 1;
}

function(paymnet)

console.log(batch)
console.log(batch.payments[0])
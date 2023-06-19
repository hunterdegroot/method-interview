const { Method, Environments } = require('method-node');

const method = new Method({
  apiKey: 'sk_thcA7AdE9xce4r9zRRDCmfK3',
  env: Environments.dev,
});

async function createDestinationAccount(holderId, plaidId, loanAccountNumber) {
  console.log(plaidId)
  const merchantId = (await method.merchants.list({
    'provider_id.plaid': plaidId
  }))[0].mch_id;
  const account = await method.accounts.create({
    holder_id: holderId,
    liability: {
      mch_id: merchantId,
      number: loanAccountNumber
    }
  })
  console.log(account)
  return account;
}

async function createSourceAccount(holderId, accountNumber, routingNumber) {
  const account = await method.accounts.create({
    holder_id: holderId,
    ach: {
      routing: routingNumber,
      number: accountNumber,
      type: 'checking',
    },
  })
  console.log(account)
  return account;
}



module.exports = {
  createEmployeeEntity,
  createPayorEntity,
  createPayeeEntity,
  createDestinationAccount,
  createSourceAccount,
  createPayment
}
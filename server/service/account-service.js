const { Method, Environments } = require('method-node');

const method = new Method({
  apiKey: 'sk_thcA7AdE9xce4r9zRRDCmfK3',
  env: Environments.dev,
});

async function findOrCreateDestinationAccount(payment, entityAndAccountMap) {
  if (!payment.destAcctId) {
    if (!entityAndAccountMap.map.get(payment.employee.entityId + payment.payee.plaidId + payment.payee.loanAccountNumber)) {
      const destAcctId = (await createDestinationAccount(
        payment.employee.entityId,
        payment.payee.plaidId,
        payment.payee.loanAccountNumber)).id;
      payment.destAcctId = destAcctId;
      entityAndAccountMap.map.set(payment.employee.entityId + payment.payee.plaidId + payment.payee.loanAccountNumber, destAcctId)
    } else {
      payment.destAcctId = entityAndAccountMap.map.get(payment.employee.entityId + payment.payee.plaidId + payment.payee.loanAccountNumber)
    }
  }
}

async function findOrCreateSourceAccount(payment, entityAndAccountMap) {
  if (!payment.srcAcctId) {
    if (!entityAndAccountMap.map.get(payment.payor.entityId + payment.payor.accountNumber + payment.payor.abaRouting)) {
      const srcAcctId = (await createSourceAccount(
        payment.payor.entityId,
        payment.payor.accountNumber,
        payment.payor.abaRouting)).id;
      payment.srcAcctId = srcAcctId;
      entityAndAccountMap.map.set(payment.payor.entityId + payment.payor.accountNumber + payment.payor.abaRouting, srcAcctId)
    } else {
      payment.srcAcctId = entityAndAccountMap.map.get(payment.payor.entityId + payment.payor.accountNumber + payment.payor.abaRouting)
    }
  }
}

async function createDestinationAccount(holderId, plaidId, loanAccountNumber) {
  const merchantId = (await method.merchants.list({
    'provider_id.plaid': plaidId
  }))[0].mch_id;
  const methodAccount = await method.accounts.create({
    holder_id: holderId,
    liability: {
      mch_id: merchantId,
      number: loanAccountNumber
    }
  })

  return methodAccount;
}

async function createSourceAccount(holderId, accountNumber, routingNumber) {
  const methodAccount = await method.accounts.create({
    holder_id: holderId,
    ach: {
      routing: routingNumber,
      number: accountNumber,
      type: 'checking',
    },
  })

  return methodAccount;
}

module.exports = {
  findOrCreateDestinationAccount,
  findOrCreateSourceAccount,
}
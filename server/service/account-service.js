const { Method, Environments } = require('method-node');
const DestinationAccount = require('../models/destination-account-model.js');
const SourceAccount = require('../models/source-account-model.js');

const method = new Method({
  apiKey: 'sk_thcA7AdE9xce4r9zRRDCmfK3',
  env: Environments.dev,
});

async function createOrFindDestinationAccount(holderId, plaidId, loanAccountNumber) {
  let account;
  await DestinationAccount.find({ holderId, plaidId, loanAccountNumber },
    (err, accounts) => {
      account = accounts && accounts.length > 0 ? accounts[0] : null;
    }
  );
  if (!account) account = createDestinationAccount(holderId, plaidId, loanAccountNumber);
  return account;
}

async function createDestinationAccount(holderId, plaidId, loanAccountNumber) {
  const account = new DestinationAccount({
    holderId, plaidId, loanAccountNumber
  })
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

  account.methodId = methodAccount.id;
  account.save();
  return account;
}

async function createOrFindSourceAccount(holderId, accountNumber, routingNumber) {
  let account;
  await SourceAccount.find({ holderId, accountNumber, routingNumber },
    (err, accounts) => {
      account = accounts && accounts.length > 0 ? accounts[0] : null;
    }
  );
  if (!account) account = createSourceAccount(holderId, accountNumber, routingNumber);
  return account;
}

async function createSourceAccount(holderId, accountNumber, routingNumber) {
  const account = new SourceAccount({
    holderId, accountNumber, routingNumber
  })
  const methodAccount = await method.accounts.create({
    holder_id: holderId,
    ach: {
      routing: routingNumber,
      number: accountNumber,
      type: 'checking',
    },
  })

  account.methodId = methodAccount.id;
  account.save();
  return account;
}

module.exports = {
  createOrFindDestinationAccount,
  createOrFindSourceAccount,
}
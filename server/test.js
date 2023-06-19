
const { Method, Environments } = require('method-node');

const method = new Method({
    apiKey: 'sk_thcA7AdE9xce4r9zRRDCmfK3',
    env: Environments.dev,
});

async function a() {
    try {
        const response = await method.merchants.list({
            'provider_id.plaid': 'ins_116947'
        });
        // console.log(response)
        const merchantId = response[0].mch_id;
        // const account = await method.accounts.create({
        //     liability: {
        //         mch_id: merchantId,
        //         number: '91400799'
        //     }
        // })
        // const ent = await method.entities.get('mch_307378')
        console.log(merchantId)
    } catch (error) {
        console.log(error)
    }
}
a()

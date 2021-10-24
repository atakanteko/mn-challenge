const { Verifier } = require('@pact-foundation/pact');
const packageJson = require('../package.json');

let opts = {
    providerBaseUrl: 'http://localhost:3001',
    provider: 'todo-provider',
    pactUrls: ["C:/Users/atakanteko/Desktop/cdc-test/pacts/todo-consumer-todo-provider.json"],

    publishVerificationResult: true,
    providerVersion: packageJson.version,
    providerStatesSetupUrl: 'http://localhost:3001/api/cdc/provider-state'
};

new Verifier().verifyProvider(opts).then(function () {
    console.log("Pacts successfully verified!");
});
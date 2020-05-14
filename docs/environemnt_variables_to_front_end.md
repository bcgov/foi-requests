# Environment variables

To serve the public environment variables to angular application , the API exposes /v1/vonfig endpoint.
It can be accessed in different environment as https://foi-requests-dev.pathfinder.gov.bc.ca/api/v1/configs.

#### API changes for serving a new variable


In the [index.js](/api/index.js) ,add the new variable to the object .For example mynewVar:

~~~~
 server.get('/api/v1/configs', function (req, res, next) {
      const kcConfigs = {
        realm:process.env.FOI_KC_REALM,
        url:process.env.FOI_KC_URL,
        clientId:process.env.FOI_KC_CLIENTID,
        credentials:process.env.FOI_KC_CREDENTIALS,
        secret:process.env.FOI_KC_SECRET,
        sslRequired:process.env.FOI_KC_SSL_REQUIRED,
        publicClient:process.env.FOI_KC_PUBLIC_CLIENT
        mynewVar:process.env.MY_NEW_VAR

      }
      
~~~~

Also add the same variable to openshift deployment configuration.

`NO PRIVATE/SECRET/CONFIDENTIAL should be exposed to frontend since frontend cant securely store them.This API is designed only for public information.
`

#### Angular related changes
Angular on the start up is designed to invoke this API and get the variables

The [app config service](/src/app/services/app-config.service.ts) handles this.Add the new variables to the Config Interface in this class


the config endpoint in local is designed to point to DEV API to enable local developmet. The changes can be overwritten in the [proxy.conf.json](/src/proxy.conf.json)

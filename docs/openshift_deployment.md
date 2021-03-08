# Info on Openshift Process


### Project Details

the openshift projects are named starting with **6ni3xg**- .The project has a DEV/TEST/PROD/TOOLS namespaces .

![screenshot](/docs/images/oc_project.png)



### Branching significance

The project relies on github branching to build different images and build the applicaiton.

|Environment|GITHUB BRANCH|APPLICATION URL
|---|---|---|
|DEV| Built from https://github.com/bcgov/foi-requests/tree/dev| https://foi-requests-dev.pathfinder.gov.bc.ca/
|TEST| Built from https://github.com/bcgov/foi-requests/tree/test| https://foi-requests-test.pathfinder.gov.bc.ca/
|PROD| Built from https://github.com/bcgov/foi-requests/tree/master| https://foi-request-form.pathfinder.gov.bc.ca/


Code should be merged to appropriate environments only. The bulds can sometimes be set to autotrigger mode so that if there is a code commit in Master , it will roll into production as well.
Generally ,Work on DEV branch during development cycle. Commit the code to TEST branch for QA verification. Commit the code to MASTER for production release. 


### Build Details

###### Contrary to the Pathfinder openshift configurations , the build is done in each projects. Ideally this should be done in the tools project.

The following action should be performed in each of the environments.
If the build has to be done for the DEV , the openshift project selected should be DEV before performing the following actions.

1.Build NGINX image If Needed [nginx-runtime-foi-request-base]

`Build the image only if there is any change in nginx configurations.Doesnt happen often.Happens only when server configurations change.Skip this step normally
`

Nginx Docker Configruation can be updated in https://github.com/bcgov/foi-requests/blob/master/openshift/templates/nginx-runtime/Dockerfile

Build can be done using ![screenshot](/docs/images/nginx-build.png)

2.Build the  Source [foi-requests-build]

foi-requests-build can be done using the below build.This step is needed to build the source code.

![screenshot](/docs/images/source-build.png)

3.final image build [foi-requests-on-nginx-build]


`This step is configured to auto trigger when step 1 or step 2 is invoked .So no need to invoke this manually`

The final image with source and nginx can be done using the following build. This will be autotriggered from the second step.

![screenshot](/docs/images/final_build.png)


Building the final image will auto trigger a deployment.



####  Deployment Details


Go to 6ni3xg-dev --> Applications --> Deployments

The deployment are generally autotriggered. So no manual intervention needed.

If needed at all , to deploy manually ;Click the DEPLOY button in the deployments tab as below.
![screenshot](/docs/images/dc.png)


The deployment needs a few secrets in order for the backend to work.
The following secrets need to be in place

* RealIpFrom

* AdditionalRealIpFromRules

* IpFilterRules

* AdditionalRealIpFromRules

Port on which API is running
* FOI_REQUEST_API_PORT

Email/SMPT configs
* FOI_REQUEST_SMTP
* FOI_REQUEST_SMTP_PORT
* FOI_REQUEST_SMTP_SECURE
* FOI_REQUEST_INBOX
* FOI_REQUEST_SENDER

* LOG_PATH

Propertries for the keycloak client [newly added properties for KC implementation]
* FOI_KC_REALM
* FOI_KC_URL
* FOI_KC_CLIENTID
* FOI_KC_SECRET
* FOI_KC_SSL_REQUIRED
* FOI_KC_PUBLIC_CLIENT
* JWKS_URI



# Info on Openshift Process



## Build/Deplyoment process


### Branching significance

The project relies on github branching to build different images and build the applicaiton.

|Environment|GITHUB BRANCH|APPLICATION URL
|---|---|---|
|DEV| Built from https://github.com/bcgov/foi-requests/tree/dev| https://foi-requests-dev.pathfinder.gov.bc.ca/
|TEST| Built from https://github.com/bcgov/foi-requests/tree/test| https://foi-requests-test.pathfinder.gov.bc.ca/
|PROD| Built from https://github.com/bcgov/foi-requests/tree/master| https://foi-request-form.pathfinder.gov.bc.ca/



### Build Details

###### Contrary to the Pathfinder openshift configurations , the build is done in each projects. Ideally this should be done in the tools project.

#### Build NGINX image If Needed:** 

_build the image only if there is any change in nginx configurations_

Nginx Docker Configruation can be updated in https://github.com/bcgov/foi-requests/blob/master/openshift/templates/nginx-runtime/Dockerfile

Build can be done using ![screenshot](/docs/images/nginx-build.png)

####  Build the  Source

foi-requests-build can be done using the below build

![screenshot](/docs/images/source-build.png)

#### final image build

The final image with source and nginx can be done using the following build

![screenshot](/docs/images/final_build.png)


####  Deployment Details

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



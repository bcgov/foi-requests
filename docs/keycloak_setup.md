# Keycloak Setup for FOI App

#### Keycloak Overview
Keycloak is an open source identity and access management platform. FOI uses Keycloak as an identity broker platform to delegate authentication to other identity providers. 

#### Keycloak Base URL
|Environment|URL|
|---|---|
|DEV| https://sso-dev.pathfinder.gov.bc.ca/auth/admin/5k8dbl4h/console/|
|TEST| https://sso-test.pathfinder.gov.bc.ca/auth/admin/5k8dbl4h/console/|
|PROD|  https://sso.pathfinder.gov.bc.ca/auth/admin/5k8dbl4h/console/|


#### Identity Providers
|IDP|Users|
|---|---|
|BC Services Card| Citizens using BC Services Card to verify their identity|
|IDIR| Internal staff users to manage keycloak|
|GITHUB|  Internal staff users to manage keycloak|

#### Keycloak Configuration for BC Services Card
BC Services card is configured as an Identity Provider in Keycloak realm. Below are the steps to create BC Services Card as an identity provider.

##### Step 1) Create a custom authentication flow
Keycloak by default needs email as part of the user profile and asks the user to fill it in if the profile doesn't have it. For our application there will be users who doesn't have verified email address linked with their BC Services Card.
To prevent Keycloak asking the user to fill out email if the profile doesn't have email address, create a custom authentication flow to bypass this page.

1. Login to Keycloak as a realm administrator
2. Navigate to 'Authentication' tab
3. Select First Broker Login
4. Click on 'Copy' button on the right and name it as 'BCSC first broker login'
5. Select 'Actions' link against 'Review Profile' and click on 'Config'
6. Select 'off' for the value 'Update Profile on First Login'
7. Save. 

![screenshot](/docs/images/keycloak_realm_config.png)


##### Step  2) Configure BC Services Card Identity Provider (Using Import)
To import the BC Services Card configuration,
1. Login to Keycloak as a realm administrator
2. Click on 'Import' Link
3. Select the file [keycloak config](https://github.com/bcgov/foi-requests/blob/dev/config/keycloak_realm_config.jpeg) for 'Exported json file'
4. Select 'Skip' for 'If a resource exists'
5. Import

##### Step 3) Change client id and secret for BC Services Card
1. Login to Keycloak as a realm administrator
2. Navigate to 'Identity Providers'
3. Select 'BC Services Card'
4. Scroll down to 'Client ID' and 'Client Secret' and paste the value received from IDIM team
5. Save 

##### Step 4) Add mappers for the attributes from BC Services Card
1. Login to Keycloak as a realm administrator
2. Navigate to 'Identity Providers'
3. Select 'BC Services Card'
4. Select 'Mappers' and create the mappers with the values from below table


|Name|Mapper Type|Claim|User Attribute Name|
|---|---|---|---|
|firstName|Attribute Importer|given_names|firstName|
|lastName|Attribute Importer|family_name|lastName|
|email|Attribute Importer|email|email|
|username|Username Template Importer|\${ALIAS}/\${CLAIM.sub}|

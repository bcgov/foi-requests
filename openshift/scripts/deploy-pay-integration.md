# Manual Deployment Scripts

Do NOT deploy this as-is entirely as a script.   Copy and paste the relevant commands to only deploy what is necessary.

```bash
# Build and tag pay-integration
oc project 04d1a3-tools
# First, set build branch

# Pre-emptively set output tag
# Two stage web-build
oc patch bc/web-artifact-build -p '{"spec":{"source":{"git":{"ref":"dev-payment-integration"}}}}'
oc start-build web-artifact-build --wait
oc patch bc/web-image-build -p '{"spec":{"output":{"to":{"name":"web:pay-integration"}}}}'
oc start-build web-image-build --wait

# Pre-emptively set output tag
oc patch bc/api-master-build -p '{"spec":{"output":{"to":{"name":"api:pay-integration"}}}}'
# Single stage API build
oc patch bc/api-master-build -p '{"spec":{"source":{"git":{"ref":"dev-payment-integration"}}}}'
oc start-build api-master-build --wait


# oc tag web:latest web:pay-integration
# oc tag api:latest api:pay-integration

# Last, revert build branch to `dev-deploy-integration`

oc patch bc/web-artifact-build -p '{"spec":{"source":{"git":{"ref":"dev-deploy-integration"}}}}'
oc patch bc/api-master-build -p '{"spec":{"source":{"git":{"ref":"dev-deploy-integration"}}}}'
# Revert tagging
oc patch bc/web-image-build -p '{"spec":{"output":{"to":{"name":"web:latest"}}}}'
oc patch bc/api-master-build -p '{"spec":{"output":{"to":{"name":"api:latest"}}}}'

## And deploy the request-management-api

oc project d7abee-tools
oc patch bc/request-management-api-build -p '{"spec":{"source":{"git":{"ref":"dev-foi-payment"}}}}'
oc start-build request-management-api-build --wait
oc tag request-management-api:latest request-management-api:pay-integration


## Run the deploy integration file
# oc process -f deploy-pay-integration.yaml --param-file ../pay-integration.properties  -o yaml | oc apply -f - --dry-run
# oc process -f deploy-pay-integration.yaml --param-file ../pay-integration.properties  -o yaml | oc apply -f - 



## Update secrets like email - this assumes test-screts.properties is on your local.
# oc process -f secrets.yaml --param-file ../test-secrets.properties  -o yaml | oc apply -f - 
```
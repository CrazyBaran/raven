Environments
================

[← Local Setup](LocalSetup.md) | [ToC ↑](../README.md) | [Application Architecture →](ApplicationArchitecture.md)

## Available environments

The application is deployed to the following environments so far:

### Development

The development environment is used for development purposes. It is set up to use a dev database and cache instances, which can be used locally as well.

The development environment has its own Entra ID auth app registration. The Sharepoint instance integration is also located in the same organisation in Azure as Entra ID.

The Affinity instance set for the development environment is a dev instance and it points to its own list.

The deployment is done each time a new commit is pushed to the `main` branch. 


Links:
* [Client](https://raven-static.test.mubadalacapital.ae/)
* [API](https://raven.test.mubadalacapital.ae/swagger)
* [BullMQ Dashboard](https://raven.test.mubadalacapital.ae/bg)
* [Azure Resource Group](https://portal.azure.com/#@testonemubadala.onmicrosoft.com/resource/subscriptions/34fa07c2-8084-4baf-bb39-359547158d5e/resourcegroups/Raven_DEV/overview)
* [Web App logs](https://login.microsoftonline.com/organizations/oauth2/v2.0/authorize?redirect_uri=https%3A%2F%2Fportal.azure.com%2Fsignin%2Findex%2F&response_type=code%20id_token&scope=https%3A%2F%2Fmanagement.core.windows.net%2F%2Fuser_impersonation%20openid%20email%20profile&state=OpenIdConnect.AuthenticationProperties%3D3JnbHAN2eeDNDO27XgP-Ze7Gi1OcNa_IDeYNbmGn-yI-62ryXTFQKE-GVnW6XTwJESECzEZPuDNYsKktjBJd0Xa1IdgYPSI26eYG1ixlJASdyT20VCquo3l1TfRLMThjQReqADkVJ1vQMLU4PZIoPv1EYYRWyCtrHFKaPrjlW4Y7TAIGzTFUoNgumghkCksMaU_mP_5FUuFe7u7YMPIMKRzvmRYSDpbjMJuiUoNR5HDLyNiDt8SyKdah8M7razIi_kCvLgbseTQaXd888-FIQflWHMvqDyVsJCLaWun63dxO5BVjRbVkEOEMSzcisBiOeEHAb8zjCKJDujqeU9-bIM1zXWQaWKGa3e8mSmdPlinGSmFLAFDxaomYZIPVx2FgHDg4dJE2h12IyT_ofoTES77VhHhXaaTgx7C96gQQFiEBaKdYvktUfJCyUxoKmwMmv0moAKI3ECwutpimY8BnzdA8HWEyfPVdNbY2-EU5fGxUiwcA01rEvCGj947kgSbBkk4zZHmyg0A7xlQo0tDlGZxpPLY6Sx21mhUn5MNiGvgyhNpvezRqpJeoSRmuGV-8VTYvIwn04z1wGoCLF--cHw&response_mode=form_post&nonce=638483446926773168.MDVhYzZiNGEtN2FmNS00OTY1LTkwZGYtN2Y4MzZmY2FkODhmYTQ4MWU3OGUtOGIwZC00MmNiLThmODYtZjZlZmZmZjViNDcz&client_id=c44b4083-3bb0-49c1-b47d-974e53cbdf3c&site_id=501430&client-request-id=202dba2c-f8d4-4c08-a01a-323e8da6fdfc&x-client-SKU=ID_NET472&x-client-ver=7.2.0.0)


### Staging

The staging environment is used for testing purposes. It is set up to use a staging database and cache instances. Both can be accessed locally, but bear in mind that the Entra ID is not configured to be used locally, which means that trying to run the staging enviromnent locally will not be fully possible.

The creation of that environment is done by the Bicep definition to a degree - the configuration of the webapp still had to be done manually.

The staging environment has its own Entra ID auth app registration, and it's a production organisation in Azure (the same that will be used for production). The Sharepoint instance integration is also located in the same organisation in Azure as Entra ID, so it can access actual user files.

The Affinity instance set for the staging environment is a dev instance and it points to its own list.

The deployment is done manually when it is considered stable - it requires running backend and frontend pipelines.

Links:
* [Client](https://raven-staging.mubadalacapital.ae/)
* [API](https://raven-staging-api.mubadalacapital.ae/swagger)
* [BullMQ Dashboard](https://raven-staging-api.mubadalacapital.ae/bg)
* [Azure Resource Group](https://portal.azure.com/#@mubadalacapital.ae/resource/subscriptions/abe94066-828a-44ca-aceb-ba23fb86495f/resourceGroups/Raven_Staging/overview)
* [Web App logs](https://portal.azure.com/#view/WebsitesExtension/SCIFrameBlade/id/%2Fsubscriptions%2Fabe94066-828a-44ca-aceb-ba23fb86495f%2FresourceGroups%2Fraven_staging%2Fproviders%2FMicrosoft.Web%2Fsites%2Fapp-raven-prod-uks/categoryId/AvailabilityAndPerformanceLinux/optionalParameters~/%5B%7B%22key%22%3A%22categoryId%22%2C%22value%22%3A%22AvailabilityAndPerformanceLinux%22%7D%2C%7B%22key%22%3A%22detectorId%22%2C%22value%22%3A%22LinuxLogViewer%22%7D%2C%7B%22key%22%3A%22detectorType%22%2C%22value%22%3A%22Detector%22%7D%2C%7B%22key%22%3A%22startTime%22%7D%2C%7B%22key%22%3A%22endTime%22%7D%2C%7B%22key%22%3A%22diagnoseAndSolveWorkflowId%22%2C%22value%22%3A%224669c4ae-9c6b-4e39-8b15-e7b3e7212cd5%22%7D%5D)

### Production

This environment is not yet set up. It should follow the same Bicep definition as the staging environment, but with different configuration values.

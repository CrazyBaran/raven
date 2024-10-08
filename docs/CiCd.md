CI/CD
================

[← Release Process](ReleaseProcess.md) | [ToC ↑](../README.md) | [Database & Cache →](DatabaseCache.md)

## Overview

The CI/CD pipelines for every environment are based on the same set of templates with different configurations. The templates can be found `ops/api/tpl` and `ops/client/tpl` directories, for backend and frontend respectively. The actual pipelines are targeting their pipeline definition files stored in the `ops/api` and `ops/client` directories.

The pipelines can be accessed in the [Azure DevOps page](https://dev.azure.com/mubadalacapital/Raven/_build).

### New DEV and new PRODUCTION v2

YAML Templates for new dev and production environments are set up on branches:
- `dev-iac` for new DEV
- `prod-iac` for PROD v2

## Setup

The backend pipeline setup requires the creation of the underlying infrastructure & identities in Azure. We need to have the service principal connection that will be used as RESOURCE_MANAGER_CONN variable. We need the app service for the backend and a container registry that will store the images.

For the frontend, on top of the resource manager connection we established already, we need the storage account and a CDN profile*.

'*' - `dev-iac` and `prod-iac` environments do not use CDN anymore - we switched to use Azure Static Web App instead of CDN.

[new DEV pipelines](https://dev.azure.com/mubadalacapital/Raven/_build?definitionScope=%5CDEV%20v2%20(Raven_IaC)%20in%20TestOneMubadala)
[new PROD pipielines](https://dev.azure.com/mubadalacapital/Raven/_build?definitionScope=%5CPROD%20v2%20(Raven_Prod_v2)%20in%20OneMubadala)
## Templates

The templates have a set of steps that make it possible to build, test, and deploy the application. The templates have the ability to skip the deployment for the PR build run purposes by avoiding the deployment from a branch that is not `main`.

## Backend pipeline 

There are several variables that are required to be set for that pipeline. Those are:

* `NPM_TASKFORCESH_TOKEN__SECRET`
  * This is the secret that is used to authenticate with the npm registry. It is stored as a secret in the Azure DevOps.
* A set of variables required for the migration to take place:
  * `TYPEORM_DATABASE`
    * This is the database name that is used for the connection. It is stored in the Azure DevOps as accessible value.
  * `TYPEORM_HOST`
    * This is the host that is used for the connection. It is stored in the Azure DevOps as accessible value.
  * `TYPEORM_PASSWORD__SECRET`
    * This is the password that is used for the connection. It is stored in the Azure DevOps as secret.
  * `TYPEORM_USERNAME`
    * This is the username that is used for the connection. It is stored in the Azure DevOps as accessible value.


## Frontend pipeline

There are several variables that are required to be set for that pipeline. Those are:

* `NPM_TASKFORCESH_TOKEN__SECRET`
  * This is the secret that is used to authenticate with the npm registry. It is stored as a secret in the Azure DevOps.
* `KENDO_UI_LICENSE`
  * This is the license key for the Kendo UI library. It is stored as a secret in the Azure DevOps.
* `FRONT_CONFIGURATION`
  * This is the configuration that is used to build the frontend. It is set to `production` for the staging build and `development` for the dev build.



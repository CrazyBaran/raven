Release Process
==========

[← Application Architecture](ApplicationArchitecture.md) | [ToC ↑](../README.md) | [CI/CD →](CiCd.md)

## Overview

The release process is a crucial part of the development lifecycle. It ensures that the application is deployed in a controlled and predictable manner. This document outlines the steps involved in the release process for the Raven application.

## Branching Strategy

The application uses a feature branch workflow. This means that each feature or bug fix is developed in a separate branch. Once the feature is complete, a pull request is created and reviewed by other team members. Once the pull request is approved by at least one team member, the changes are merged into the `main` branch.

## Versioning

The application does not use a versioning system at the moment. We roughly refer to the application as being in v1.0 state, but this is not reflected in the codebase.

## Deployment

We are using Azure DevOps for CI/CD. The deployment process is automated and triggered by a push to the `main` branch. The deployment pipeline builds the application, runs tests, and deploys the application to the development environment. Once the application is deployed to the development environment, it is manually promoted to the staging environment by running the backend and frontend pipelines.

Please note that we are not having a separate branch for the staging environment. The staging environment is a manual promotion of the development environment once the changes are considered stable.

## Process, step-by-step

The checklist is available on [Notion page](https://www.notion.so/curvestone/Checklist-for-Staging-updates-4ed637add51d4c6cbc3b86dcaa35758c?pvs=4), but let's outline the steps here as well.

1. Green light for the release
    * Make sure that the changes are approved by the dev team - no one has anything to add or change.
    * Make sure that the changes are tested and working as expected - QA team has tested the changes and approved them.
    * Make sure that the client is aware of the release to be conducted and has no objections (any operations that might be impacted by the release, internal meetings, etc.).
2. Go to the Azure DevOps and check the pipelines
    * Make sure that the pipelines are green and that the latest commit is the one that you want to release.
3. [Optional] Make configuration changes to the staging environment
    * If there are any configuration changes that need to be made, make them now (unless they require the new backend version to be deployed first).
    * this includes any env variables to be set to the webapp - it is advised to change them after stopping the service.
4. If the feature flags are used, make sure that they are set correctly
    * Check whether `environment.prod.ts` file for the client has the correct feature flags set.
5. Run the Staging pipelines
    * Run the backend pipeline first, then the frontend pipeline.
    * Make sure that the pipelines are green.
    * There is no need for manual migrations as it is a part of the pipeline.
6. Check the health of staging environment
    * Make sure that the staging environment is working as expected (access Swagger page, check the frontend, etc.).
7. [Optional] Make static data migrations for pipelines
   * use `GET /static-data/pipelines` on DEV to gather the tree of pipelines
   * use `PATCH /static-data/pipelines` on STAGING with the body consisting of the response from the request above to get the list of differences between environments
     * please note that you will likely get at least one difference, and it will be in the `PipelineDefinitionEntity` due to pointing to a different list. **Remember to ignore it while applying changes!**
   * when in doubt, send the list of differences to the QA team to confirm the changes
   * use `POST /static-data/pipelines` on STAGING with the body consisting of the list of changes acquired above to apply the changes
   * if there are any changes that were applied by that process, please record them as a config change in a `docs/static-data/config-changes` folder and `docs/static-data` folder. See the description of that below.
8. [Optional] Make static data migrations for templates
  * Do the same as above, just with the `/static-data/templates` endpoint.
9. [Optional] If needed, apply any other special requests that are not covered by the `static-data` endpoints, like tags.
10. Refresh the cache
    * Use the `GET /dwh/regenerate-cache` endpoint to queue a job that would regenerate the Data Warehouse related cache (Redis and the proxy tables used for filtering purposes).
    * Make sure that the job is queued and completed successfully (use Bull Dashboard for that purpose, `/bg`).
12. Make the QA team aware that the deployment is done and let them smoke test the environment.

### Recording changes

When making changes to the configuration, static data, or any other part of the application that is not code-related, it is important to record those changes in the `docs/static-data/config-changes` folder.

1. Create a new json file corresponding to the modifications done in the static data in the following convention: `YYYY-MM-DD-pipelines.json`.
2. Update the `pipelines.json` or `templates.json` file in the `docs/static-data` folder with the changes made.

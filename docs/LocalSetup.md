Local Setup
==========

[ToC ↑](../README.md) | [Environments →](Environments.md)

## Preparation

1. Clone the repository from GitHub using your tool of choice.
2. Install dependencies using `npm install`. This assumes you have Node.js installed on your machine (version 18 or higher).
    * the project uses [BullMQ Pro](https://bullmq.io/#bullmq-pro) which requires a license key. The license key is used in the form of an environment variable, which you have to set up in your environment as given below. You can request a license key from one of our developers.
   ```bash
   export NPM_TASKFORCESH_TOKEN="your-token"
    ```
3. Acquire the necessary credentials for the system. They are to be stored in the `.env` file in the root directory of the project.
    * the up-to-date `.env` file is shared with the team via LastPass's shared folder - please ask other developer to access it.
    * The structure of the .env file is given in the section below.
4. You might need to install `nx` globally for the nx command to be accessible in terminal.

### .env file structure

The application has a set of default values for some of the environment variables, but some should be explicitly provided. The ones that are recommended to be a part of the `.env` are:

```bash
NODE_ENV=development

REDIS_HOST=
REDIS_PORT= # if different than 6380
REDIS_PASSWORD=
REDIS_DB_INDEX=
TYPEORM_HOST= 
TYPEORM_PORT= # if different than 1433
TYPEORM_DATABASE=
TYPEORM_USERNAME=
TYPEORM_PASSWORD=
AD_TENANT_ID=
AD_CLIENT_ID=
AD_CLIENT_SECRET=
AD_AUDIENCE=
AD_REDIRECT_URI=
SCOPES_API_ACCESS=

AFFINITY_ENABLED_ON_INIT=false # by default true
AFFINITY_DATA_WATCHDOG_ENABLED=false # by default true
AFFINITY_API_KEY=
AFFINITY_URL=
AZURE_STORAGE_ACCOUNT_NAME=
AZURE_STORAGE_ACCOUNT_CONNECTION_STRING=
SHAREPOINT_DRIVE_ID=
SHAREPOINT_SITE_ID=
SHAREPOINT_ROOT_DIRECTORY_ID=

DWH_AUTH_TYPE=default # if logging in by user/password, you can skip it if you use managed identity
DWH_USERNAME=
DWH_PASSWORD=
DWH_HOST=
DWH_PORT= # if different than 1433
DWH_DATABASE=
DWH_ENABLE_PROXY_REGENERATION=false # enables quite an expensive operation which should be done by dev instance only
```

### Running the application

You can run API, client or both at the same time:

```bash
npm run start
npm run start:api
npm run start:client
```

Application is accessible at http://localhost:4200 by default, with API being exposed as Swagger at http://localhost:3333/api.


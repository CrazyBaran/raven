Integrations
================

[← Features](Features.md) | [ToC ↑](../README.md)

## Affinity

Affinity is a venture capital platform that was used for the purpose of tracking opportunities and companies. We have integrated with it by using their API, which is a RESTful API that is documented [here](https://api-docs.affinity.co/#introduction). 

The main purpose of the integration is to get the data related to client interactions, and to sync the pipeline stage between ours and Affinity's list. This is done twofold - to avoid constant trips to the API, we have a cache in Redis that stores the data that is used to supply the data when requested. The data is kept in sync by calling API when anything changes on our side, as well as having a webhook registered in Affinity that triggers a call to our API whenever a change is made in the pipeline stage.

Alongside that, we have a direct fetching for client interactions as we considered that data not worth caching due to its nature.

## Data Warehouse

The Data Warehouse is basically a set of database views that expose data gathered from different sources in a manner that's digestible by external systems, like ours. There is a set of multiple different views that we use, and some of them are mirrored on our side as proxy tables (prefixed `rvn_dwh_v1_`) so that we can keep the data in one place and query it easily.

The structure of the data is prebuilt and kept in cache in Redis, so that we can use it to enrich the response in organisation-related endpoints. For some stuff, like news, contacts, funding round details and employee KPIs, we have a direct fetch from the DWH, as it's not worth caching due to its nature. Those data are also not used for any kind of filtering purposes, so they are not mirrored in our database.

### Connection

The database is available under the credentials given in an `.env` file, you can use user/password combination from there to access it. Bear in mind that it’s configured to be accessible only via our Curvestone’s VPN this way.
You can also access it by using managed identity - to do that, you have to set it up locally:

```
az login
# Get list of available subscriptions
az account list
az account set --subscription "<Mubadala's subscription ID>"
```

The managed identity is already used on DEV environment, as you can see [here](https://github.com/mubadalacapital/raven/blob/7f547b09453d4b7ab3918d27c94329eaa8d3f9b9/apps/raven-api/src/environments/environment.ts#L219). SQL Driver (Tedious) accepts few different credential strategies, one of them being `default`, which is configured to use login/password, another being `azure-active-directory-default` that attempts using managed identity method. The logic for setting that up is in the module init [here](https://github.com/mubadalacapital/raven/blob/7f547b09453d4b7ab3918d27c94329eaa8d3f9b9/apps/raven-api/src/app/api/rvn-data-warehouse/data-warehouse.module.ts#L156).
The login/password strategy is still in use both locally and on staging, as staging connects to dev data warehouse (which makes it impossible to have a managed identity login from another environment).

## SharePoint

SharePoint is integrated mainly on the frontend by using a [Graph API](https://developer.microsoft.com/en-us/graph/graph-explorer) and Sharepoint API via [File Picker](https://learn.microsoft.com/en-us/onedrive/developer/controls/file-pickers/?view=odsp-graph-online). We do have a backend integration for the purpose of creating a directory structure in SharePoint, but all of other fetching and uploading is done on the frontend side. We reuse the access token we acquire during the login process to access the APIs.

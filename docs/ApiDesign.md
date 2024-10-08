API Design
================

[← Database & Cache](DatabaseCache.md) | [ToC ↑](../README.md) | [Features →](Features.md)

## Overview

The overall design of the API follows the general principles laid out in the [NestJS documentation](https://docs.nestjs.com/). The API is built using a modular structure, with each module containing its own controllers, services, and data access objects. This allows for easy separation of concerns and scalability.

There are several modules that have been developed before the business implementation of the app, which were a part of the bundle that Curvestone provided as a basis for the application. That part consisted of mechanisms like authentication (Azure AD SSO) and authorisation (role-based Azure AD and internal Ability), user handling, basic system integrations like Redis, message queues and TypeORM setup.

Most of those modules are not externalised into the library, as there was no reason to do so. The only bits we moved outside into shared libraries were the interfaces and data transfer objects (DTOs) that were shared between the front-end and back-end.

## Background jobs

Some of the long-running tasks were made into background jobs. They way they are triggered depends on what they do, but usually they are consumed as soon as possible. The jobs are managed by BullMQ Pro, which is a library that allows for easy management of queues and background jobs.

1. `DataWarehouseQueue-Regenerate`
   * regenerates Redis cache related to DWH and triggers an event that ensures that DWH organisations are synced with Raven. Also, regenerates investors and industries tables in the database (effectively doing the RegenerateStatic stuff). Fund managers regeneration is also triggered at the end of this job.
2. `DataWarehouseQueue-RegenerateStatic`
   * regenerates just the industries,  investors and fund managers in our database based on the data from DWH.
3. `DataWarehouseQueue-RegenerateProxy`
   * for each of our companies, adds/regenerates a record in the proxy tables so that we can easily sort/query/search by single data source.
4. `AffinityQueue-Regenerate`
   * regenerates Affinity cache. also triggers an event that ensures that affinity organisations are synced with Raven.
5. `AffinityQueue-HandleWebhook`
   * logic for reacting to an Affinity webhook event.
6. `AffinityQueue-SetupWebhook`
   * logic for registering webhook (possibly already done so not ran too often).
7. `AffinityDataWatchdogJob`
   * ran automatically every minute to check whether Affinity cache is filled, if not, regenerates it.
8. `OrganisationQueue-EnsureAllAffinityEntriesAsOrganisations`
   * triggered after Affinity cache regeneration. Checks whether all companies are in our database, and if not, adds them.
9. `OrganisationQueue-EnsureAllDataWarehouseEntriesAsOrganisations`
   * triggered after DWH cache regeneration. Checks whether all companies are in our database, and if not, adds them. triggers proxy regeneration after.

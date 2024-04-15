Application Architecture
================

[← Environments](Environments.md) | [ToC ↑](../README.md) | [Release Process →](ReleaseProcess.md)

## Overview

The application is built using the NestJS framework, which is a Node.js framework that is heavily inspired by Angular. It is a modular framework that allows for easy separation of concerns and scalability. The application is built using a monorepo structure, which allows for easy sharing of code between the frontend and backend.

The frontend is built using Angular, which is a popular frontend framework that is built and maintained by Google. It is a component-based framework that allows for easy reusability of code and scalability.

The repo is managed by Nx, which is a tool that allows for easy management of monorepos. It allows for easy sharing of code between the frontend and backend, and also allows for easy management of dependencies.

The infrastructure ecosystem is Microsoft Azure, which is a cloud computing service that is built and maintained by Microsoft. It gives the ability to run any kind of required services in the cloud, such as web apps, databases, and storage.

## Client

The client is written in Angular and built into a browser-side single page application (SPA). The client is responsible for rendering the user interface and handling user interactions. The client communicates with the server via RESTful API calls. It is deployed as a static website on Azure Blob Storage, and then served via Azure Front Door CDN.

## API

The API is written in NestJS and attempts to utilise as much of NestJS's built-in features as possible. The API is responsible for handling all business logic, but also for handling certain background jobs that are required for the application to function. Those include caching data from integrated services, keeping data in sync, and handling scheduled tasks.

## Infrastructure

The application is deployed on Microsoft Azure. The resources that are used, among those mentioned for frontend and backend, are:
* Azure Blob Storage - for storing static files (attachments)
  * it's a different instance than the one that is used as a static website server for the client
* Redis Cache - for caching data and BullMQ queues
* Azure SQL Database - for storing application data
* Azure Key Vault - for storing secrets and keys
* Azure Insights - for monitoring the application
* Container Registry - for storing Docker images

## Library naming convention
The convention enlisted here is deprecated and, at least for the client side, we are trying to simply nest things in their respective directories (`shared` or `client` etc.). 

Before that, we used to follow the following convention:


- `rvnb-[name]` - Back-End (API) libraries
- `rvnc-[name]` - Front-End libraries
- `rvns-[name]` - Shared libraries


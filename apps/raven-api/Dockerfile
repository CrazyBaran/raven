FROM node:18-slim

# set main directory for the app
WORKDIR /app

# copy built app
COPY ./dist/apps/raven-api .
COPY ./.npmrc .

# install development tools to build native addons and libs
RUN apt update && apt install build-essential -y

# update npm and pip (to fix known vulnerabilities)
RUN npm install -g npm@latest

# expose private repo token as env var for the build process
ARG NPM_TASKFORCESH_TOKEN

# install dependencies from the generated package
RUN npm install --omit=dev

#!/bin/sh
set -e
service ssh start
exec node /app/main.js

#!/usr/bin/env bash
# exit when any command fails
set -e

# Go to project dir
SOURCE=${BASH_SOURCE[0]}
while [ -L "$SOURCE" ]; do # resolve $SOURCE until the file is no longer a symlink
  DIR=$( cd -P "$( dirname "$SOURCE" )" >/dev/null 2>&1 && pwd )
  SOURCE=$(readlink "$SOURCE")
  [[ $SOURCE != /* ]] && SOURCE=$DIR/$SOURCE # if $SOURCE was a relative symlink, we need to resolve it relative to the path where the symlink file was located
done
DIR=$( cd -P "$( dirname "$SOURCE" )" >/dev/null 2>&1 && pwd )
cd "$DIR/.."

LIBS_TO_UPDATE=(
"latest" "@nestjs/bull" "@nestjs/config" "@nestjs/microservices" "@nestjs/websockets" "@nestjs/typeorm"
"@nestjs/platform-socket.io" "@nestjs/passport" "@nestjs/event-emitter" "@nestjs/jwt" "typeorm" "typeorm-naming-strategies"
)

for lib in ${LIBS_TO_UPDATE[@]}; do
  echo "-->> Upgrading: $lib"
  echo "--->>> nx migrate $lib"
  npx nx migrate "$lib"
  echo "--->>> npm i --force"
  npm i --force
  echo "--->>> nx migrate --run-migrations=migrations.json"
  npx nx migrate --run-migrations=migrations.json
done

#!/usr/bin/env bash
# exit when any command fails
set -e

LICENSES_TO_FAIL="GPL; AGPL"

LICENSES_TO_IGNORE=(
"MIT" "MIT OR X11" "Unlicense"
"BSD" "ISC" "Apache" "Apache-2.0" "CC0-1.0" "Python-2.0"
"Public Domain" "CC-BY-3.0" "CC-BY-4.0" "Zlib"
)

# Go to project dir
SOURCE=${BASH_SOURCE[0]}
while [ -L "$SOURCE" ]; do # resolve $SOURCE until the file is no longer a symlink
  DIR=$(cd -P "$(dirname "$SOURCE")" >/dev/null 2>&1 && pwd)
  SOURCE=$(readlink "$SOURCE")
  [[ $SOURCE != /* ]] && SOURCE=$DIR/$SOURCE # if $SOURCE was a relative symlink, we need to resolve it relative to the path where the symlink file was located
done
DIR=$(cd -P "$(dirname "$SOURCE")" >/dev/null 2>&1 && pwd)
cd "$DIR/.."

function join_by() {
  local d=${1-} f=${2-}
  if shift 2; then
    printf %s "$f" "${@/#/$d}"
  fi
}

IGNORE_STRING=$(join_by "," "${LICENSES_TO_IGNORE[@]}")

license-checker --failOn "$LICENSES_TO_FAIL" --exclude "$IGNORE_STRING" --excludePrivatePackages "$@"

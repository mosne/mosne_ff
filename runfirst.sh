#!/bin/bash
LOCALDIR="$(cd "$(dirname "$1")"; pwd)/$(basename "$1")"
NODEMODULE="node_modules"

if [ -d "${NODEMODULE}" ]
then
    echo "Directory node_modules exists."
else
    mkdir "${NODEMODULE}"
    echo "Directory node_modules created."
fi

echo "Directory node_modules abspath: ${LOCALDIR}${NODEMODULE}"
xattr -w com.dropbox.ignored 1 "${LOCALDIR}${NODEMODULE}"
echo "Directory excluded from dropbox."
nvm use
pnpm install
pnpm run build

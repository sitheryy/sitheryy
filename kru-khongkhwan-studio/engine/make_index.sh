#!/bin/bash
# run inside a project folder: builds site/index.html, copies engine files + fonts, links images
set -e; E=$(cd "$(dirname "$0")" && pwd)
mkdir -p site/img site/fonts; cp "$E/lib.js" "$E/base.js" site/; cp "$E"/fonts/*.ttf site/fonts/; cp "$E/render.mjs" .
cp -n assets/* site/img/ 2>/dev/null || true
EXT=$(ls site/img | awk -F. '{printf "\"%s\":\"%s\",",$1,$2}')
sed "s#__EXT__#$EXT#" "$E/index.template.html" > site/index.html; echo "site/index.html ready ($(ls site/img | wc -l) images)"

#!/bin/bash

echo "Checking for folders and clearing them..."

rm -r ./built/
mkdir -p ./built/js/

echo "Copying assets and data to build dir...";

cp -r ./assets/ ./built/assets
cp -r ./data/ ./built/data
cp ./manifest.json ./built/

echo "Combining and compressing CSS...";

cat css/style.css \
    css/overpass.css \
    | java -jar bin/yuicompressor-2.4.8.jar --type=css \
    > ./built/assets/built.css;

echo "Combining and compressing game JS...";

cat js/game.js \
    js/service-worker-handler.js \
    | java -jar bin/yuicompressor-2.4.8.jar --type=js \
    > ./built/assets/built.js;

echo "Combining and compressing service worker JS...";

cat js/service-worker.js \
    | java -jar bin/yuicompressor-2.4.8.jar --type=js \
    > ./built/js/service-worker.js;

echo "Generating unique build HTML...";

cat build_template.html \
    > ./built/index.html;

echo "Updating and compressing service worker JS..."

csssum="$(tar -cf - css | md5sum | cut -c -5)"
jssum="$(tar -cf - js | md5sum | cut -c -5)"
assetssum="$(tar -cf - assets | md5sum | cut -c -5)"
indexsum="$(md5sum built/index.html | cut -c -5)"

cat \
    js/service-worker.js \
    | sed "s/my-site-cache-v1/${contentsum}-${assetssum}-${indexsum}/" \
    | java -jar bin/yuicompressor-2.4.8.jar --type=js \
    > ./built/js/service-worker.js

echo "Build complete!";

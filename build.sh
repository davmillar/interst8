#!/bin/bash

echo "Combining stylesheets...";

cat css/style.css \
  > ./built/css/built.css;

STYLE_SUM=`shasum ./built/css/built.css | awk '{print $1}'`;

echo "Combining JavaScript...";

cat js/jquery.js \
  js/scripts.js \
  > ./built/js/built.js;

SCRIPT_SUM=`shasum ./built/js/built.js | awk '{print $1}'`;

echo "Generating unique build HTML...";

cat build_template.html \
  | sed -e "s#{{SCRIPT_HASH}}#$SCRIPT_SUM#g" \
  | sed -e "s#{{STYLE_HASH}}#$STYLE_SUM#g" \
  > ./built/index.html;

echo "Build complete!";
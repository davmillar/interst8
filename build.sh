#! /bin/bash

echo "Combining stylesheets...";

cat css/style.css \
  > ./built/css/built.css;

echo "Combining JavaScript...";

cat js/jquery.js \
  js/scripts.js \
  > ./built/js/built.js;

echo "Build complete!";
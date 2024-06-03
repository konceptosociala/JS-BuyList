echo 'Cleaning folders...'
rm -rf docs
mkdir docs

echo 'Minifying CSS...'
yui-compressor main.css > docs/main.min.css

echo 'Minifying JS...'
yui-compressor main.js > docs/main.min.js

echo 'Bundling...'
cp index.html docs/index.html
touch docs/.nojekyll

echo 'Finished.'
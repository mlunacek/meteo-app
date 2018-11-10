#!/bin/bash

cd app; npm run build; cd ..;
cp app/index.html docs
cp -r app/dist docs
git add -u .
git commit -m'updating app'
git push

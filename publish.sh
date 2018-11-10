#!/bin/bash

cd app; npm run build; cd ..;
cp app/index.html docs
cp -r app/dist docs
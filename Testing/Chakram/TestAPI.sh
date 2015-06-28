#!/bin/sh

current_time=$(date "+%m.%d-%H.%M.%S")
fileName=TestResults-$current_time.txt
mocha ./PublicAPI.js > $fileName
mocha ./AdminAPI.js >> $fileName
#!/bin/sh

current_time=$(date "+%m.%d-%H.%M.%S")
fileName=TestResults-$current_time.log
touch $fileName

echo "Running Chakram and logging tests to $fileName"
mocha ./PublicAPI.js ./AdminAPI.js | tee $fileName
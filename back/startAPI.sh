#!/bin/bash
while ! nc -z neo4j 7474; do sleep 3; done
export HOSTAPI=`curl ifconfig.co`
python iloveapi.py 

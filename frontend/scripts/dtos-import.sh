#!/bin/sh
mkdir -p ../src/app/dtos
rm -rf ../src/app/dtos/*
find /Users/bogdangheboianu/WebstormProjects/altamira-app/src -name '*.dto.ts' -exec cp -prv '{}' '../src/app/dtos/' ';'

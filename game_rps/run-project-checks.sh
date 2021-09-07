#!/usr/bin/env bash

cd client
npm run lint

if [ $? -eq 0 ]
then
	echo "Client linter passed - proceeding..."
else
	echo "Client linter failed - fix before proceeding!"
	exit 1
fi

cd ../server

npm run lint

if [ $? -eq 0 ]
then
	echo "Server linter passed - proceeding..."
else
	echo "Server linter failed - fix before proceeding!"
	exit 1
fi

npm run test

if [ $? -eq 0 ]
then
	echo "Server tests passed - proceeding..."
else
	echo "Server tests failed - fix before proceeding!"
	exit 1
fi

cd ..
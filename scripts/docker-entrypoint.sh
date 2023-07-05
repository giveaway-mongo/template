#!/bin/sh

set -e

cd /app

echo "RUN: ""$RUN"
echo "Database: ""$DATABASE_URL"

ls -la


# shellcheck disable=SC2039
if [[ $RUN == "production" ]]; then
  echo -e "\nRun app"

  touch .env
  echo "DATABASE_URL=$DATABASE_URL" >> ./.env

  export NODE_ENV='production'
  ls -la
  npm run p:db-push-production

  pm2-runtime ecosystem.config.js
fi

# shellcheck disable=SC2039
if [[ $RUN == "test" ]]; then
  echo -e "\nRun tests"
  export NODE_ENV='test'

  printf  "\nDATABASE_URL=%s" "$DATABASE_URL" >> ./env/.env.docker-test

  npm run test:docker-e2e
  exit
fi


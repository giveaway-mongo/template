#!/bin/sh

set -e

cd "$PROJECT_PATH"
# shellcheck disable=SC2039
echo -e "Project config"
echo WORKING_DIRECTORY:"$PROJECT_PATH"

# shellcheck disable=SC2039
if [[ $RUN == "production" ]]; then
  echo -e "\nRun app"

  export NODE_ENV='production'

  npx prisma migrate deploy

  pm2-runtime
fi

# shellcheck disable=SC2039
if [[ $RUN == "test" ]]; then
  echo -e "\nRun tests"
  export NODE_ENV='test'

  npm run test:e2e
  exit
fi

# shellcheck disable=SC2039
echo -e "\nRun app"

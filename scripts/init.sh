#!/bin/bash
set -x
set -eo pipefail

SKIP_DOCKER=$1

DATABASE_USER="${POSTGRES_USER:=asap}"
DATABASE_PASSWORD="${POSTGRES_PASSWORD:=password}"
DATABASE_NAME="${POSTGRES_NAME:=asapdb}"
DATABASE_PORT="${POSTGRES_PORT:=5432}"

if [[ -z "${SKIP_DOCKER}" ]]
then
  docker run --rm -d --name postgresql \
    -p ${DATABASE_PORT}:5432 \
    -e POSTGRES_DB=${DATABASE_NAME} \
    -e POSTGRES_PASSWORD=${DATABASE_PASSWORD} \
    -e POSTGRES_USER=${DATABASE_USER} \
    postgres:15.2
fi

export PGPASSWORD="${DATABASE_PASSWORD}"
until docker exec -it postgresql psql -U "${DATABASE_USER}" "${DATABASE_NAME}" -c '\q'; do
  >&2 echo "Postgres is still unavailable - sleeping"
  sleep 3
done

>&2 echo "Postgres is up and running on port ${DATABASE_PORT}"

export DATABASE_URL=postgres://${DATABASE_USER}:${DATABASE_PASSWORD}@localhost:${DATABASE_PORT}/${DATABASE_NAME}

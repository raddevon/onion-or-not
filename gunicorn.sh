#!/bin/bash
set -e
LOGFILE=/vagrant/onionornot/logs/guni.log
LOGDIR=$(dirname $LOGFILE)
NUM_WORKERS=3
DJANGO_SETTINGS=/vagrant/onionornot/onionornot/settings/local.py
# user/group to run as
USER=vagrant
GROUP=vagrant
ADDRESS=localhost:8000
test -d $LOGDIR || mkdir -p $LOGDIR
exec gunicorn_django -w $NUM_WORKERS --bind=$ADDRESS \
  --user=$USER --group=$GROUP --log-level=debug \
  --log-file=$LOGFILE 2>>$LOGFILE DJANGO_SETTINGS
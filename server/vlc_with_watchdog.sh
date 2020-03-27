#! /bin/bash

source .env


trap ctrl_c INT

function ctrl_c() {
  echo "** Trapped CTRL-C"
  pkill -P $$
  exit 0
}

pid="none" 

function run_vlc() {
  date
  if ( [ $pid != "none" ] ) then
    kill $pid
    sleep 5
  fi
  vlc --fullscreen --intf=http --http-password=$passwd --http-host=$host --http-port=$port &
  pid=$!
}

function hour() {
  date | sed -e 's/.*\([0-9][0-9][\.:][0-9][0-9][\.:][0-9][0-9]\).*/\1/' | sed -e 's/\(..\)....../\1/'
}


passwd=$VLC_PASSWORD
host=${VLC_HOST:-localhost}
port=${VLC_PORT:-8080}


run_vlc

prev_hour=$( hour )
while ( [ 1 == 1 ] ) do

  hour=$( hour )
  #echo $hour

  sleep 60

  if ( [ $hour -ne $prev_hour -a $hour -eq 0 ] ) then
    run_vlc
  fi

  prev_hour=$hour
done;


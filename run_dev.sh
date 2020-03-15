trap ctrl_c INT

function ctrl_c() {
    echo "** Trapped CTRL-C"
    pkill -P $$
    exit 0
}



vlc --fullscreen --intf=http --http-password=ciao --http-host=localhost &

( cd server && npm run start:dev )  &

( cd client && npm run start )  &

while ( [ 1 = 1 ] ) ; do
    sleep 1
done

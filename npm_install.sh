rm -rf server/node_modules
( cd server && npm install && npm run post_npm_install )

rm -rf client/node_modules
( cd client && npm install )

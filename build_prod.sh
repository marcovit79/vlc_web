( cd client && npm run build )
( cd server && npm run build )

cp -r client/dist/VlcWeb server/dist 
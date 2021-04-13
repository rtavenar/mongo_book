#!/usr/bin/env bash

# 0. clean databases
echo "0. Clean databases"
mongo --nodb --quiet --eval "var port='${MONGODB_PORT}'" clean.js

# 1. `mongoimport` databases
echo "1. mongoimport databases"
mongoimport --db food --jsonArray --collection NYfood --file NYfood.json --host localhost:${MONGODB_PORT}
mongoimport --db elections2007 --jsonArray --collection discours --file discours.json --host localhost:${MONGODB_PORT}
mongoimport --db etudiants --collection notes --file etudiants.json --host localhost:${MONGODB_PORT}
# mongo --nodb --quiet --eval "var port='${MONGODB_PORT}'" large_db.js
# mongodump --archive --db=large_db --host localhost:${MONGODB_PORT} | mongorestore --archive  --nsFrom='large_db.*' --nsTo='large_db_with_index.*' --host localhost:${MONGODB_PORT}



# 2. set indexes
echo "2. set indexes"
mongo --nodb --quiet --eval "var port='${MONGODB_PORT}'" set_indexes.js

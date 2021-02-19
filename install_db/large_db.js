conn = new Mongo("localhost:" + port);

db = conn.getDB("large_db");
n = 10000
for (i=0; i<n; i++) {
    db.users.insert({"i": i, "name": "user"+i,
                     "age": Math.floor(Math.random()*120),
                     "created" : new Date()})
}

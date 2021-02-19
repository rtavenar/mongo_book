conn = new Mongo("localhost:" + port);

db = conn.getDB("large_db_with_index");
db.dropDatabase()

db = conn.getDB("large_db");
db.dropDatabase()

db = conn.getDB("food");
db.dropDatabase()

db = conn.getDB("elections2007");
db.dropDatabase()

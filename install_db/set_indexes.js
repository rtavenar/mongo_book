conn = new Mongo("localhost:" + port);

// db = conn.getDB("large_db_with_index");
// db.users.createIndex({"name" :1})
// db.users.createIndex({"age": 1, "name" :1})

db = conn.getDB("food");
db.NYfood.createIndex({"address.loc": "2dsphere"})
db.NYfood.createIndex({"$**": "text"})
// db.NYfood.createIndex({"borough": 1})
// db.NYfood.createIndex({"cuisine": 1})

db = conn.getDB("elections2007");
db.discours.createIndex(
    { content: "text" },
    { default_language: "french" }
)

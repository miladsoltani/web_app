var db = new Dexie("frontCast");
let dbVersion = 1;
db.version(dbVersion).stores({
    users : 'id'
});
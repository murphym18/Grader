var Engine = require('tingodb')();
var db = new Engine.Db('data', {
   nativeObjectID: true,
   searchInArray: true
});
db.isTingo = true;
module.exports = db;

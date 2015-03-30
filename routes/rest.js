var assert = require('assert');

function sendAll(db, type, res) {
   db.collection(type).find({}).toArray(function(err, data) {
      assert.equal(null, err);
      res.json(data);
   });
}

function sendOne(db, type, id, res) {
   db.collection(type).find({ "_id": id }, {}).toArray(function(err, result){
      assert.equal(null, err);
      if (result.length > 0)
         res.json(result[0]);

      res.end();
   });
}

module.exports = [
   {
      path: '/:type/:id',
      functionFactory: function(app) {
         function result(req, res) {
            var id = app.mkId(req.params.id);
            sendOne(app.db, req.params.type + 's', id, res);
         }
         return result;
      }
   },
   {
      path: '/:type',
      functionFactory: function(app) {
         function result(req, res) {
            sendAll(app.db, req.params.type, res);
         }
         return result;
      }
   }
];
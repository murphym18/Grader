var router = require('express').Router();
var admin = require('../model/admin');
router.get('/', function(req, res) {
   res.render('admin/index');
});

router.get('/create-user', function(req, res) {
   res.render('admin/create-user');
});

router.post('/create-user', function(req, res, next) {
   var username = req.body.username;
   var pass = passHash(req.body.password);
   var identity =  new admin.LocalIdentity(username, pass);
   var query = {
      "identities": identity
   };

   function checkLogin(err, res){
      if (res.length > 0)
         next(new Error("Username Taken"));
      else {
         admin.createUser(req.body.first, req.body.last, function (err, result) {
            var query = { _id: result.ops[0]._id };
            var change = { $push: {"identities": identity}};
            global.db.collection('users').update(query, change, function(err, result){
               console.log(result);
            });
         });
      }
   }
   global.db.collection("users").find(query, {}).toArray(checkLogin);


   res.redirect('/')
});

module.exports = router;
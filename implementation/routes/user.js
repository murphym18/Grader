var router = require('express').Router();
var passport = require('passport');

router.get('/:id', function(req, res) {
   console.log(req.params.id);
   db.findById('users', db.createId(req.params.id), function(err, user){
      console.log(user);
      res.render('user', {user: user});
   })

});






module.exports = router;

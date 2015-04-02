var router = require('express').Router();
var passport = require('passport');

router.get('/login', function(req, res) {
   console.log(req.user);
   res.render('login', {
      "user": req.user,
      "goto": req.goto,
      "message": req.query.message
   });
});

var options = {
   failureRedirect: '/login?message=' + encodeURIComponent("Invalid Username or Password.")
}

router.post('/login', passport.authenticate('local', options), function(req, res) {
   var goto = req.session.goto;
   if(goto)
      delete req.session.goto;
   else
      goto = '/';

   res.redirect(goto);
});

router.get('/logout', function(req, res) {
   req.logout();
   res.redirect('/login');
});

module.exports = router;

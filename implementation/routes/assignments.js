/** @author Michael Murphy */
var router = require('express').Router();
var co = require('co');
var Q = require('q');
var mongoose = require('mongoose');
var AssignmentCategory = require.main.require('./model/course/assignment/category');
var errorResponse = require.main.require('./app/errors')["500"];
var _ = require('underscore');

router.get('/Assignments/:id', function(req, res, next) {
   co(function *() {
      try{
         var root = yield AssignmentCategory.findOne({id: mongoose.Schema.Type.ObjectId(req.params.id)}).exec();
         if (!root) {
            return res.json([]);
         }
         var tree = yield Q.nfinvoke(root, 'getChildrenTree');
         res.json(tree);
      }
      catch(err) {
         errorResponse(err, req, res, next);
      }
   });
});

module.exports = router;

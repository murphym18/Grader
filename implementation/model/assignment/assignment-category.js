/** @author Michael Murphy */
var mongoose = require('mongoose');
var tree = require('mongoose-tree2');
var AssignmentSchema = require('./assignment');

var categorySchema = mongoose.Schema({
   name : {
      type: String,
      trim: true
   },
   weight: {
      type: Number,
      min: 0,
      max: 1,
      default: 1
   },
   assignments: [AssignmentSchema],
   parentCategory: {
      type: Number,
      min: 0,
      set: function(p) {
         this.parentCategory = p.path
      }
   },
   path: [{type: Number, min: 0}]
});
categorySchema
module.exports = mongoose.model('AssignmentCategory',categorySchema);
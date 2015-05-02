/** @author Michael Murphy */
var mongoose = require('mongoose');
var GradedItem = require('./graded-item');
var categorySchema = mongoose.Schema({
   name: {
      type: String,
      trim: true
   },
   weight: {
      type: Number,
      min: 0,
      max: 1,
      default: 1
   },
   path: {
      type:  String,
      index: {
         unique: true
      },
      required: false,
      select: true
   },
   assignments: [GradedItem]
});


module.exports = categorySchema;
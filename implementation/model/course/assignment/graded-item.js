/** @author Michael Murphy */
var mongoose = require('mongoose')

var GradedItem = mongoose.Schema({
   dueDate: {
      type: Date
   },
   name: {
      type: String,
      required: true
   },
   rawPoints: {
      type: Number,
      min: 0,
      required: true,
      default: 100
   }
}, {save: {w: 1}});

module.exports = GradedItem;
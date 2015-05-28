/** @author Michael Murphy */

var _ = require('underscore');
var userFields = require.main.require('./model/admin/user-fields');
var mongoose = require('mongoose');

function limitOne(val) {
   return val.length <= 1;
}

var studentRecordSchema = mongoose.Schema({
   user: {
      type:[{
         type:  mongoose.Schema.Types.ObjectId,
         ref: 'User',
         required: false
      }],
      validate: [limitOne, '{PATH} can only have 1 member']
   },
   comment: String,
   extra: {},
   grades: [{
      assignment: {
         'type': mongoose.Schema.Types.ObjectId,
         'ref': 'Course.Category.assignments',
         'required': true
      },
      assignmentSubmission: {
         'type': mongoose.Schema.Types.ObjectId,
         'ref': 'Submission',
         'required': false
      },
      rawScore: {
         type: Number,
         min: 0
      }
   }]
}, { _id : true });

userFields.username.required = false;
studentRecordSchema.add(userFields)
module.exports = studentRecordSchema;
/** @author Michael Murphy */

var _ = require('underscore');
var userFields = require.main.require('./model/admin/user-fields');
var mongoose = require('mongoose');

var studentRecordSchema = mongoose.Schema({
   user: {
      type:  mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false
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
});

userFields.username.required = false;
studentRecordSchema.add(userFields)
module.exports = studentRecordSchema;
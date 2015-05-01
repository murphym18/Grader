/** @author Michael Murphy */
var _ = require('underscore');
var mongoose = require('mongoose');
var userFields = require.main.require('./model/admin/user-fields');
var config = require.main.require('./app/config');

var assignmentSubmissionSchema = mongoose.Schema({
   user: {
      type:  mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
   },
   data: {
      type: Buffer,
      select: false,
      required: true
   },
   timestamp: {
      type: Date,
      default: function() {
         return new Date();
      },
      required: true
   },
   mime: {
      type: String,
      required: true
   },
   filename: {
      type: String,
      maxlength: 255,
      trim: true
   }
}, {capped: config.maxAllowedFileSubmissionData});

assignmentSubmissionSchema.pre('save', function preSaveAssignmentSubmission(next) {
   if (!this.mime) {
      if (this.filename) {
         var dot = this.filename.lastIndexOf('.');
         if (dot != -1) {
            this.mime = s.substr(s.lastIndexOf('.')+1)
         }
      }
      else {
         this.mime = "bin";
      }
   }
});

module.exports = mongoose.model('AssignmentSubmission', assignmentSubmissionSchema);
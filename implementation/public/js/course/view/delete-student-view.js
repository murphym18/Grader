define(function (require) {
    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('util/backbone-helper');
    var Hbs = require('handlebars');
    var Mn = require('backbone.marionette');
    var Q = require('q');
    var Radio = require('backbone.radio');
    var pageChannel = Radio.channel('page');
    var courseChannel = Radio.channel('course');
    var template = require('text!templates/deleteStudentView.hbs');
    var alertTemplate = require('text!templates/alert-block.hbs');

    var Course = require('course/course');

    return Mn.ItemView.extend({
        tagName: 'div',
        className: 'gradeScheme modal-dialog  modal-lg',
        template: Hbs.compile(template),

        ui: {
            'backButton' : '.backButton',
            'deleteButton' : '.deleteButton'
        },

        events: {
            'click @ui.backButton' :  'backToSelect',
            'click @ui.deleteButton': 'onSaveCourse'
        },
        onShow: function() {
            var ui = this.ui;
            var self = this;
            var reqStudentPath = this.student;

            var students = this.model.get('students');
            var student = students.findWhere({"path" : reqStudentPath});
        },

        initialize: function(options) {
            console.log(options);
            this.model = courseChannel.request('current:course');
            this.student = options.student;

        }

    });
});
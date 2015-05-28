define(function (require) {
    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('util/backbone-helper');
    var Hbs = require('handlebars');
    var Mn = require('backbone.marionette');
    var Q = require('q');
    var userChannel = require('user/module');
    var Radio = require('backbone.radio');
    var courseChannel = Radio.channel('course');
    var pageChannel = Radio.channel('page');
    var template = require('text!templates/headerStudentDropdownView.hbs');
    var AddNewStudentView = require('app/addNewStudent');

    return Mn.ItemView.extend({
        tagName: 'li',
        template: Hbs.compile(template),

        ui: {
            newStudent: ".newStudent",
            manageStudent: ".manageStudent",
            deleteStudent: ".deleteStudent",
            groupStudents: ".groupStudents"
        },



        events: {
            "click @ui.newStudent": "showNewStudent",
            "click @ui.manageStudent": "showManageStudent",
            "click @ui.deleteStudent": "showDeleteStudent",
            "click @ui.groupStudents": "showGroupStudents"
        },

        initialize: function(options) {
            //this.model = userChannel.request('session');
        },

        showNewStudent: function(domEvent) {
            //courseChannel.command('showAllCourses');
            userChannel.request('user').then(function(user) {
                var modalRegion = pageChannel.request('modalRegion');
                modalRegion.show(new AddNewStudentView);


            })
        },

        showManageStudent: function(domEvent) {
            //courseChannel.command('showUserCourses');
        },

        showDeleteStudent: function(domEvent) {
            //courseChannel.command('showUserCourses');


        },

        showGroupStudents: function(domEvent) {
            //courseChannel.command('showUserCourses');
        }

    });
});


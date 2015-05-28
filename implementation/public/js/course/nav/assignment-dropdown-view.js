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
    var template = require('text!templates/headerAssignmentDropdownView.hbs');
    var modifyCategory = require('app/modifyCategory');
    //var AddAssignmentView = require('app/addNewAssinment')

    return Mn.ItemView.extend({
        tagName: 'li',
        template: Hbs.compile(template),

        ui: {
            newAssignment: ".newAssignment",
            newCategory: ".newCategory",
            modifyCategory: ".modifyCategory"
        },

        events: {
            "click @ui.newAssignment": "showNewAssignment",
            "click @ui.newCategory": "showNewCategory",
            "click @ui.modifyCategory": "showModifyCategory"
        },

        initialize: function(options) {
            //this.model = userChannel.request('session');
        },

        showNewAssignment: function(domEvent) {
            //courseChannel.command('showAllCourses');
            //userChannel.request('user').then(function(user) {
            //    var modalRegion = pageChannel.request('modalRegion');
            //    modalRegion.show(new AddAssignmentView);
            //
            //
            //})
        },

        showNewCategory: function(domEvent) {
            //courseChannel.command('showUserCourses');
        },

        showModifyCategory: function(domEvent) {
<<<<<<< HEAD
            courseChannel.request('select:category').then(function(selectedCategory) {
                var modalRegion = pageChannel.request('modalRegion');
                modalRegion.show(new modifyCategory({
                    'category': selectedCategory
                }));
            }).done();
=======
            //courseChannel.command('showUserCourses');
            userChannel.request('user').then(function(user) {
                var modalRegion = pageChannel.request('modalRegion');
                modalRegion.show(new modifyCategory);


            })


>>>>>>> origin/master
        }
    });
});


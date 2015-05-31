define(function (require) {
    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('util/backbone-helper');
    var Hbs = require('handlebars');
    var Mn = require('backbone.marionette');
    var Q = require('q');
    var Radio = require('backbone.radio');
    var ModalHelpers = require('util/modal-helpers');
    var courseChannel = Radio.channel('course');
    var pageChannel = Radio.channel('page');
    var userChannel = Radio.channel('user');
    
    var modifyCategory = require('app/modifyCategory');
    var selectCategory = require('app/selectCategory');
    var NewAssignmentView = require('course/view/new-assignment-view');
    
    var template = require('text!ctemplates/headerAssignmentDropdownView.hbs');

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
            ModalHelpers.apply(this);
        },

        showNewAssignment: function(domEvent) {
            this.showModal(new NewAssignmentView());
        },

        showNewCategory: function(domEvent) {
            //courseChannel.command('showUserCourses');
        },

        showModifyCategory: function(domEvent) {
            var self = this;
            courseChannel.request('select:category').then(function(selectedCategory) {
                self.showModal(new modifyCategory({
                    'category': selectedCategory
                }));
            }).done();
        }
    });
});


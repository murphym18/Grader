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
    var template = require('text!templates/selectCategory.hbs');
    var alertTemplate = require('text!templates/alert-block.hbs');
    
    var Course = require('course/course');

    var SelectCategory = Mn.ItemView.extend({
        tagName: 'div',
        className: 'modifyCategory modal-dialog modal-lg',
        template: Hbs.compile(template),
        ui: {
            'category' : '.categorySelected',
            'ok' : '.ok',
            'cancel' : '.error'
        },

        initialize: function(options) {
            this.optionTemplate = Hbs.compile("<option value='{{path}}'>{{path}}</option>");
            this.model = courseChannel.request('current:course');
            this.alertTemplate = Hbs.compile(alertTemplate);
        },

        /**
         * Hide the modify category dialog on initial load. Also,
         * create a dropdown menu for testing purposes that allows
         * the user to select which category to modify.
         *
         * @author Matt Bleifer
         */
        onBeforeShow : function(){
            var ui = this.ui;

            var categories = this.model.get('categories');
            var self = this;

            categories.each(function(category) {
                ui.category.append(self.optionTemplate(category.attributes));
            });
        },
        events : {
            'click @ui.ok' :  'closeSelectCategory',
            'click @ui.cancel' :  'closeModifyCategory'
        },
        triggers : {
            'click @ui.ok' :  'success'
        },
        /**
         * Gather the new values from the modify category dialog and
         * save them to the database.
         *
         * @author Matt Bleifer
         */
        getSelectedCategory : function() {
            return $('#category-selected').val();
        },
        /**
         * Hide the modify category dialog. Bring the user back to the
         * screen to select which dialog to modify, and re-fetch
         * the newly updated data.
         *
         * @author Matt Bleifer
         */
        closeSelectCategory : function() {
            var modalRegion = pageChannel.request('modalRegion');
            _.defer(function() {
                modalRegion.empty();
            });
        },
    })

    courseChannel.reply('select:category', function promptCourse() {
        var defered = Q.defer();
        var view = new SelectCategory();
        var modalRegion = pageChannel.request('modalRegion');
        modalRegion.show(view);
        view.on('success', function() {
            defered.resolve(view.getSelectedCategory());
        });
        view.on('destroy', function() {
            defered.reject();
        });
        return defered.promise;
    })
});
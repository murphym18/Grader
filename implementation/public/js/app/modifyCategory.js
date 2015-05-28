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
    var template = require('text!templates/modifyCategory.hbs');
    var alertTemplate = require('text!templates/alert-block.hbs');
    
    var Course = require('course/course');

    return Mn.ItemView.extend({
        tagName: 'div',
        className: 'modifyCategory modal-dialog modal-lg',
        template: Hbs.compile(template),
        ui: {
            'categoryName' : '.categoryName',
            'categoryWeight' : '.categoryWeight',
            'parentCategory' : '.categoryParent',
            'ok' : '.save',
            'cancel' : '.error'
        },

        initialize: function(options) {
            this.model = courseChannel.request('current:course');
            this.category = options.category;
            this.alertTemplate = Hbs.compile(alertTemplate);
            console.log(this.model);
        },

        /**
         * Hide the modify category dialog on initial load. Also,
         * create a dropdown menu for testing purposes that allows
         * the user to select which category to modify.
         *
         * @author Matt Bleifer
         */
        onShow : function(){
            var ui = this.ui;

            var reqCatName = this.category;

            var categories = this.model.get('categories');
            var category = $.grep(categories, function(e){ return e.name == reqCatName; })[0];

            var catValues = [];
            catValues.push('');
            _.forEach(categories, function(category) {
                catValues.push(category.name);
            });

            $.each(catValues, function(key, value) {
                if (value != category.name) {
                    ui.parentCategory
                     .append($("<option></option>")
                     .text(value)); 
                }
            });

            var path = category.path.split('#');
            ui.parentCategory.val(path[path.length - 2]).attr("selected");

            ui.categoryName.val(category.name);
            ui.categoryWeight.val(category.weight);
        },
        events : {
            'click @ui.ok' :  'saveModifyCategory',
            'click @ui.cancel' :  'closeModifyCategory'
        },
        /**
         * Gather the new values from the modify category dialog and
         * save them to the database.
         *
         * @author Matt Bleifer
         */
        saveModifyCategory : function() {
            var ui = this.ui;
            var self = this;

            var reqCatName = this.category;

            var categories = this.model.get('categories');
            var category = $.grep(categories, function(e){ return e.name == reqCatName; })[0];

            category.name = ui.categoryName.val();
            category.weight = ui.categoryWeight.val();

            var newParent = $.grep(categories, function(e){ return e.name == ui.parentCategory.val(); })[0];

            category.path = newParent ? newParent.path + "#" + category.name : "#" + category.name;

            Backbone.emulateHTTP = true;
            this.model.set("categories", categories);
            this.model.save().then(function() {
                self.closeModifyCategory();
            });
        },
        /**
         * Hide the modify category dialog. Bring the user back to the
         * screen to select which dialog to modify, and re-fetch
         * the newly updated data.
         *
         * @author Matt Bleifer
         */
        closeModifyCategory : function() {
            var self = this;
            Q(this.model.save()).then(function(res) {
                console.dir(['modify category save result:', res]);
                var modalRegion = pageChannel.request('modalRegion');
                modalRegion.hideModal();
                courseChannel.command('updateCourses');
            },
            function(err) {
                self.ui.error.html(self.alertTemplate({message: err.responseText}));
                self.ui.saveButton.button('reset');
            }).done();
        },
    })
});
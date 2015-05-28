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
            this.optionTemplate = Hbs.compile("<option value='{{path}}'>{{path}}</option>");
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
            var self = this;

            var reqCatPath = this.category;

            var categories = this.model.get('categories');
            var category = categories.findWhere({"path" : reqCatPath});

            ui.parentCategory.append(self.optionTemplate());
            categories.each(function(catListItem) {
                if (catListItem.get("path").indexOf(category.get("path")) !== 0)
                    ui.parentCategory.append(self.optionTemplate(catListItem.attributes));
            });

            var path = category.get("path").split('#');
            path.pop();
            path = path.join("#");

            ui.parentCategory.val(path).attr("selected");

            ui.categoryName.val(category.get("name"));
            ui.categoryWeight.val(category.get("weight"));
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

            var reqCatPath = this.category;

            var categories = this.model.get('categories');
            var category = categories.findWhere({"path" : reqCatPath});
            console.log(category);
            console.log(categories);

            categories.each(function(catListItem) {
                if (catListItem.get("path").indexOf(category.get("path")) === 0)
                    catListItem.set("path", ui.parentCategory.val() + catListItem.get("path"));
            });

            category.set({
                name : ui.categoryName.val(),
                weight : ui.categoryWeight.val()
            });

            self.closeModifyCategory();
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
            Backbone.emulateHTTP = true;
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
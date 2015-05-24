define(function (require) {
    var $ = require('jquery');
    var _ = require('underscore');
    var App = require('app/app');
    var Backbone = require('util/backbone-helper');
    var Hbs = require('handlebars');
    var Mn = require('backbone.marionette');
    var Q = require('q');
    var Radio = require('backbone.radio');
    
    var courseListItemTemplate = require('text!templates/courseListing.hbs');
    
    return Mn.ItemView.extend({
        tagName: "li",
        className: "course-list-item",
        template: App.Handlebars.compile(courseListItemTemplate),
        modelEvents: {
            "change": "render"
        },
        events: {
            'click a': "openGradebook"
        },
        openGradebook: function loadGradebookPage(domEvent) {
            App.go('/Courses/'+this.model.get('colloquialUrl'));
            domEvent.preventDefault();
        }
   });
});
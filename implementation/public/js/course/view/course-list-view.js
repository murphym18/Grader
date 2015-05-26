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
    
    CourseListItemView = Mn.ItemView.extend({
        tagName: "div",
        className: "col-md-4",
        template: App.Handlebars.compile(courseListItemTemplate),
        
        modelEvents: {
            "change": "render"
        },
        
        events: {
            'click a': "openGradebook"
        },
        
        openGradebook: function loadGradebookPage(domEvent) {
            App.go('/courses/'+this.model.get('colloquialUrl'));
            domEvent.preventDefault();
        }
    });

    var EmptyCourseListView = Mn.ItemView.extend({
        template: Hbs.compile("")
    });
    
    return Mn.CollectionView.extend({
        className: "row",
        childView: CourseListItemView,
        emptyView: EmptyCourseListView,
    });
});
define(function (require) {
    var $ = require('jquery');
    var _ = require('underscore');
    var App = require('app/app');
    var Backbone = require('util/backbone-helper');
    var Hbs = require('handlebars');
    var Mn = require('backbone.marionette');
    var Q = require('q');
    var Radio = require('backbone.radio');

    var CourseListItemView = require('course/course-list-item-view');
    var EmptyCourseListView = require('course/empty-course-list-view');
    
    return Mn.CollectionView.extend({
        className: "coursesList",
        childView: CourseListItemView,
        emptyView: EmptyCourseListView,
    });
});
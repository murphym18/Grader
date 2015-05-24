define(function (require) {
    var $ = require('jquery');
    var _ = require('underscore');
    var App = require('app/app');
    var Backbone = require('util/backbone-helper');
    var Hbs = require('handlebars');
    var Mn = require('backbone.marionette');
    var Q = require('q');
    var Radio = require('backbone.radio');
    
    var Course = require('course/course');
    
    return Backbone.Collection.extend({
        tagName: 'ul',
        className: 'courseList',
        model: Course,
        url: '/api/Courses',
        
        comparator: function(item) {
            return [
                item.get("start"),
                item.get("classCode"),
                item.get("classNumber")
            ];
        },
        
        clear: function() {
            this.reset([]);
        }
   });
});
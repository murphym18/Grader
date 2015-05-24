define(function (require) {
    var $ = require('jquery');
    var _ = require('underscore');
    var App = require('app/app');
    var Backbone = require('util/backbone-helper');
    var Hbs = require('handlebars');
    var Mn = require('backbone.marionette');
    var Q = require('q');
    var Radio = require('backbone.radio');
    
    
    
    return Backbone.Model.extend({
        idAttribute: "colloquialUrl",
        
        findGraphArray: function(data) {
        
        },
        
        initialize : function (){
            this.updateUrl();
        },
        
        updateUrl: function updateUserCourses() {
            this.url = '/api/Courses/' + this.get("colloquialUrl");
        }
    });
});
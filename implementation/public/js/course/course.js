define(function (require) {
    var $ = require('jquery');
    var _ = require('underscore');
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
            var colloquialUrl = this.get("colloquialUrl");
            if (colloquialUrl) {
                this.url = '/api/Courses/' + this.get("colloquialUrl");
            }
            else {
                this.url = '/api/Courses'
            }
        },
        
        createColloquialUrl: function() {
            var fields = [
                'classCode',
                'classNumber',
                'section',
                'term',
                
            ];
            var self = this;
            var data = _.map(fields, function(field) {
                return self.get(field) || false;
            });
            var year = this.get('year');
            var reg = /^\d{4}$/;
            if (!_.some(data, false) && _.isString(year) && year.match(reg)) {
                return data.join('-') + year;
            }
            return false;
        },
        
        isValidTerm: function(term) {
            var validTerms = [
                'Winter',
                'Spring',
                'Summer',
                'Fall'
            ];
            return _.contains(validTerms, term);
        },
        
        findTermDates: function(term, year) {
            function date(m1, d1, m2, d2) {
                return {
                    start: new Date(year, m1, d1),
                    end: new Date(year, m2, d2)
                }
            }
            return {
                'Winter': date(0, 5, 2, 20),
                'Spring': date(2, 30, 5, 12),
                'Summer': date(5, 19, 7, 29),
                'Fall': date(8, 22, 11, 12)
            }[term];
        }
    });
});
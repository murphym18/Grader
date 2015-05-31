define(function (require) {
    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('util/backbone-helper');
    var Hbs = require('handlebars');
    var Mn = require('backbone.marionette');
    var Q = require('q');
    var Radio = require('backbone.radio');
    var proxy = require('util/prop-proxy');
    var DocCollection = require('util/doc-collection');
    var DocModel = require('util/doc-model');

    var StudentRecord = Backbone.Model.extend({
        idProperty: '_id',
        urlRoot: '/api/students',
        
        initialize: function(options) {
            this.url = this.urlRoot + '/' + this.get('_id');
        },
        
        getGrade: function(aId) {
            var map = this.getGradeMap();
            return map[aId] || 0;
        },
        
        setGrade: function(aId, rawScore) {
            var map = this.getGradeMap();
            map[aId] = rawScore;
            var str = '';
            
            for(aId in map) {
                str = str + ',' + aId +':'+ map[aId];
            }
            if (str.charAt(0) == ',')
                str = str.substring(1);
            console.log('setting grades: ' + str)
            window.s = this;
            var self = this;
            this.save({grades: str},{silent: true}).then(function(){
                return self.fetch();
            });
        },
        
        getGradeMap: function() {
            var map = {};
            var grades = this.get('grades') || '';
            var gradeArray = grades.split(',');
            gradeArray.forEach(function(gradeData) {
                var parts = gradeData.split(':');
                if (parts.length > 1){
                    map[parts[0]] = parts[1];
                }
            });
            return map;
        }
    })
    
    return StudentRecord;
})
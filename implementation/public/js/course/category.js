define(function (require) {
    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('util/backbone-helper');
    var Hbs = require('handlebars');
    var Mn = require('backbone.marionette');
    var Q = require('q');
    var Radio = require('backbone.radio');
    var proxy = require('util/prop-proxy');
    require('query-engine');
    require('backbone-documentmodel');
    
    var QueryCollection = window.queryEngine.QueryCollection;
    var DocModel = Backbone.DocumentModel;
    var DocCollection = Backbone.DocumentCollection;

    var Category = DocModel.extend({
        idAttribute: '_id',
        initialize: function(options) {
            var self = this;
            this.subcategories = this.collection.query.findAllLive()
             .setFilter("path starts with filter", function(model, str) {
                var regex = new RegExp('^'+self.get('path')+'#[^#]+$')
                return regex.test(model.get('path'));
            });
            
            Object.defineProperty(self, 'allAssignments', {
                configurable: true,
                get: function() {
                    var assignments = self.get('assignments').models;
                    var subcats = self.subcategories;
                    return toAssignmentArray(subcats).concat(assignments);
                }
            });
            
            _.each(['findAll', 'findAllLive', 'findOne'], bindSubcatFunc, this);
        }
    });
    
    return DocCollection.extend({
        model: Category,
        initialize: function(models, options) {
            var self = this;
            this.query = new QueryCollection(models, {
                parentCollection: self,
                live: true
            });
            
            this.tree = this.query.findAllLive({path: /^#[^#]+$/});
            
            _.each(['findAll', 'findAllLive', 'findOne'], bindQueryFunc, this);
            
            Object.defineProperty(self, 'allAssignments', {
                configurable: true,
                get: function() {
                    return toAssignmentArray(self.findAll());
                }
            });
        },
        findAssignments: findAssignments
    }, {
        toAssignmentArray: toAssignmentArray
    });
    
    function bindSubcatFunc(name) {
        this[name] = _.bind(this.subcategories[name], this.query);
    }
    
    function bindQueryFunc(name) {
        this[name] = _.bind(this.query[name], this.query);
    }
    
    function toAssignmentArray(categoryList) {
        var listOfAssignmentLists = categoryList.pluck('assignments');
        var arrs = _.map(listOfAssignmentLists, _.property('models'));
        return _.flatten(arrs);
    }
    
    function findAssignments(pathRegEx) {
        if (_.isString(pathRegEx)) {
            pathRegEx =  new RegExp(pathRegEx)
        }
        return toAssignmentArray(this.findAll({path: pathRegEx}));
    }
    
})
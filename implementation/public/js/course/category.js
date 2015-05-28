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
    var DocCollection = require('util/doc-collection');
    var DocModel = require('util/doc-model');
    var QueryCollection = window.queryEngine.QueryCollection;
    var courseChannel = Radio.channel('course');
    
    var Assignments = DocCollection.extend({
        constructor: function AssignmentCollection() {
             DocCollection.apply(this, arguments);
        },
        model: DocModel.extend({
            idAttribute: 'id',
            constructor: function Assignment() {
                 DocModel.apply(this, arguments);
            },
        })
    });

    var Category = DocModel.extend({
        idAttribute: '_id',
        queryProperty: 'tree',
        filterName: "path starts with filter",
        
        filterFunc: function(model, str) {
            var regex = new RegExp('^'+this.get('path')+'#[^#]+$')
            return regex.test(model.get('path'));
        },
        
        initializeQueryCollection: function() {
            var name = this.filterName;
            var func = this.filterFunc.bind(this);
            return this.collection.query.findAllLive().setFilter(name, func);
        },
        
        constructor: function Category() {
            DocModel.apply(this, arguments);
        },
        
        initialize: function(options) {
            DocCollection.mixinQueryFunctions(this, null, {});
            Object.defineProperty(self, 'allAssignments', {
                configurable: true,
                get: function() {
                    var assignments = self.get('assignments').models;
                    var subcats = self.categories;
                    return toAssignmentArray(subcats).concat(assignments);
                }
            });
        },
        
        getNestedCollection: function (nestedKey, nestedValue, nestedOptions) {
            switch (nestedKey) {
                case 'assignments':
                    return new Assignments(nestedValue, nestedOptions);
                default:
                    return new DocCollection(nestedValue, nestedOptions);
            }
        }
    });
    
    return DocCollection.extend({
        model: Category,
        
        onQueryCollection: function() {
            var self = this;
            this.tree = this.query.findAllLive({path: /^#[^#]+$/});
            Object.defineProperty(self, 'allAssignments', {
                configurable: true,
                get: function() {
                    return toAssignmentArray(self.findAll());
                }
            });
        },
        
        findColSpans: function() {
            _.each(this.tree, colSpan)
            function colSpan(elm) {
                _.reduce(_.map((elm.pluck('assignments'), function(e)
            }
        },
        
        constructor: function CategoiesCollection() {
            DocCollection.apply(this, arguments);
        },
        
        findAssignments: findAssignments,
        initialize: function() {
            
        }
    });
    
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
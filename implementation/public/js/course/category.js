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
        
        treeFilterFunc: function(model) {
            var regex = new RegExp('^'+this.get('path')+'#[^#]+$')
            return regex.test(model.get('path'));
        },
        
        initializeQueryCollection: function() {
            var name = this.filterName;
            var func = this.filterFunc.bind(this);
            console.log('here');
            return this.collection.query.findAllLive().setFilter(name, func);
        },
        
        constructor: function Category() {
            DocModel.apply(this, arguments);
        },
        
        initialize: function(options) {
            mixinTreeProxy(this)
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
        
        // onQueryCollection: function() {
        //     var self = this;
            
        //     Object.defineProperty(self, 'allAssignments', {
        //         configurable: true,
        //         get: function() {
        //             return toAssignmentArray(self.findAll());
        //         }
        //     });
        //     this.each(function(e) {
        //         DocCollection.mixinQueryFunctions(e, null, {});
        //     })
        // },
        
        treeFilterFunc: function(model) {
            return /^#[^#]+$/.test(model.get('path'));
        },
        
        findColSpans: function() {
            var result = {}
            
            function sum(runningTotal, next){
                return runningTotal + next;
            }
            
            function colSpan(elm) {
                var sub = _.map(elm.tree, colSpan)
                var num = _.reduce(sub, sum, 0) | 0;
                
                if (elm.has && elm.has('assignments'))
                    num += elm.get('assignments').size();
                
                if (elm.cid)
                    result[elm.cid] = num;
                    
                return num;
            }
            _.each(this.tree, colSpan);
            
            return result;
        },
        
        groupByRow: function() {
            var arr = [];
            function depth(elm) {
                return elm.get('path').split('#').length - 1;
            }
            var groups = this.groupBy(depth);
            var keys = _.keys(groups).sort();
            
            _.map(keys, function(k) {
                arr.push(groups[k]);
            })
            return arr;
        },
        
        calculateTableHeaderLayout: function() {
            var rowCats = this.groupByRow();
            var colCats = this.findColSpans();
            var rows = [];
            for (var i = 0; i < rowCats.length; ++i) {
                if (rows.length <= i) {
                    rows.push([]);
                }
                _.each(rowCats[i], function(cat) {
                    if (colCats[cat.cid] > 0) {
                        rows[i].push({
                            name: cat.get('name'),
                            style: "category",
                            colSpan: colCats[cat.cid],
                            rowSpan: 1,
                            cid: cat.cid
                        })
                        if (cat.has('assignments')) {
                            if (rows.length <= i + 1) {
                                rows.push([]);
                            }
                            var assignments = cat.get('assignments').models;
                            _.map(assignments, function(a) {
                                return {
                                    name: a.get('name'),
                                    style: "assignment",
                                    colSpan: 1,
                                    cid: cat.cid
                                }
                            }).forEach(function(a) {
                                rows[i + 1].push(a);
                            });
                        }
                    }
                })
            }
            
            var height = rows.length;
            for (var i = 1; i < rows.length; ++i) {
                height -= 1;
                rows[i].filter(function(e) {
                    return e.style === "assignment";
                }).forEach(function (a) {
                    a.rowSpan = height;
                });
            }
            return rows;
        },
        
        constructor: function CategoriesCollection() {
            DocCollection.apply(this, arguments);
        },
        
        findAssignments: findAssignments,
        initialize: function() {
            mixinTreeProxy(this);
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
    
    function mixinTreeProxy(self) {
        
        
        Object.defineProperty(self, 'tree', {
            get: function() {
                var subTreeOnly = self.treeFilterFunc.bind(self);
                var arr = self.models ? self.models : self.collection.models
                return arr.filter(subTreeOnly);
            }
        });
        
        Object.defineProperty(self, 'allAssignments', {
            get: function() {
                var assignments = self.get('assignments');
                var models = _.toArray(assignments.models);
                var subcats = self.tree;
                return toAssignmentArray(subcats).concat(models);
            }
        });
    }
    
})
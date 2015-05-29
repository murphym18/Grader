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
        
        treeFilterFunc: function(model) {
            return /^#[^#]+$/.test(model.get('path'));
        },
        
        findColSpans: function() {
            var result = {}
            _.each(this.tree, colSpan);
            return result;
            
            function colSpan(elm) {
                var sub = _.map(elm.tree, colSpan)
                var num = _.reduce(sub, sum, 0) | 0;
                if (elm.has && elm.has('assignments'))
                    num += elm.get('assignments').size()
                if (elm.cid)
                    result[elm.cid] = num;
                return num;
            }
        },
        
        findHeight: function() {
            return _.reduce(this.map(_.partial(depth)), max, 0)
        },
        
        findRowSpans: function(colspan) {
            var result = {}
            var treeHeight = 1 + this.findHeight();
            _.each(this.tree, _.partial(registerAll, _, treeHeight))
            return result;
            
            function registerAll(cat, h) {
                registerResult(cat, h);
                cat.get('assignments').map(_.partial(registerResult, _, h - 1));
                _.map(cat.tree, _.partial(registerAll, _, h - 1));
            }
            function registerResult(a, h) {
                if (a && a.cid) {
                    result[a.cid] = h;
                }
            }
        },
        
        groupByRow: function() {
            var arr = [];
            var groups = this.groupBy(depth);
            var keys = _.keys(groups).sort();
            
            _.map(keys, function(k) {
                arr.push(groups[k]);
            });
            return arr;
        },
        
        calculateTableHeaderLayout: function() {
            var rowCats = this.groupByRow();
            var colspan = _.partial(lookup, this.findColSpans())
            var rowspan = _.partial(lookup, this.findRowSpans())
            var result = [];
            var height = 1 + this.findHeight();
            // appendColumnToRow(result, 0, {
            //     rowspan: height,
            //     colspan: 1,
            //     style: "corner"
            // });
            this.tree.forEach(_.partial(render, _, result, 0));
            return result;
            
            function lookup(table, item) {
                return table[item.cid];
            }
            
            function assignmentColumn(a) {
                return {
                    name: a.get('name'),
                    style: "assignment",
                    colspan: 1,
                    rowspan: rowspan(a),
                    cid: a.cid,
                }
            }
            
            function categoryColumn(cat) {
                return {
                    name: cat.get('name'),
                    style: "category",
                    colspan: colspan(cat),
                    rowspan: 1,
                    cid: cat.cid
                }
            }
            
            function appendColumnToRow(rows, rowNum, column) {
                while (rows.length <= rowNum) {
                    rows.push([]);
                }
                rows[rowNum].push(column);
            }

            function render(cat, rows, rowNum) {
                var addBelow = _.partial(appendColumnToRow, rows, rowNum + 1);
                var renderChild = _.partial(render, _, rows, rowNum + 1);
                if (cat.has('assignments')) {
                    var mkLeaf = _.compose(addBelow, assignmentColumn);
                    cat.get('assignments').map(mkLeaf);
                }
                
                _.each(cat.tree, renderChild);
                appendColumnToRow(rows, rowNum, categoryColumn(cat));
                return rows;
            }
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
    
    function max(a, b) {
        return Math.max(a, b);
    }
    
    function depth(elm) {
        return elm.get('path').split('#').length - 1;
    }
    
    function sum(runningTotal, next){
        return runningTotal + next;
    }    
})
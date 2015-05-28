define(function (require) {
    var $ = require('jquery');
    var _ = require('underscore');
    var Q = require('q');
    var Backbone = require('util/backbone-helper');
    var Mn = require('backbone.marionette');
    require('radio.shim');
    require('backbone.radio');
    require('backbone-relational');
    require('query-engine')
    require('backbone-documentmodel');
    require('query-engine');
    var DocModel = require('util/doc-model');
    var DocCollection = Backbone.DocumentCollection;
    var QueryCollection = window.queryEngine.QueryCollection;
    
    var defaultMethodNames = ['findAll', 'findAllLive', 'findOne'];
    
    function mixinQueryFunctions(self, models, optionsArg) {
        var options = optionsArg || {};
        var result = _.partial(paramLookup, options, self);
        var query = result('queryProperty', 'query');
        var funcNames = result('queryMethods', defaultMethodNames);
        
        var collection;
        if (_.isFunction(options.initializeQueryCollection))
            collection = options.initializeQueryCollection(models, options);
        else if (_.isFunction(self.initializeQueryCollection))
            collection = self.initializeQueryCollection(models, options);
        else 
            collection = initQueryCollection.call(self, models, options);
            
        var bindToSelf = _.bind(bindQueryFunc, self, query);
        self[query] = collection;
        _.each(funcNames, bindToSelf);
        return self;
    }
    
    return DocCollection.extend({
        queryProperty: 'query',
        queryMethods: defaultMethodNames,
        initializeQueryCollection: initQueryCollection,
        onQueryCollection: _.noop,
        model: DocModel,
        
        constructor: function DocCollection(models, options) {
            Backbone.DocumentCollection.apply(this, arguments);
            mixinQueryFunctions(this, models, options);
            this.onQueryCollection();
            this.trigger('query:collection:ready');
        }
    }, {
        mixinQueryFunctions: mixinQueryFunctions
    })
    
    function initQueryCollection(models) {
        var self = this;
        return new QueryCollection(models, {
            parentCollection: self,
            live: true
        })
    }
    
    function bindQueryFunc(queryPropKey, name) {
        this[name] = _.bind(this[queryPropKey][name], this[queryPropKey]);
    }
    
    function paramLookup(options, self, propName, defaultVal) {
        return _.result(options, propName, function() {
            return _.result(self, propName, defaultVal);
        });
    }
    
})
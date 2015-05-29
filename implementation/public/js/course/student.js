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

    var StudentRecord = DocModel.extend({
        defaults: {
            'extra': {},
            'grades': []
        },

        setupProxyAccessors: function() {
            // proxyUser(this);
            // _.each(['grades', 'extra'], _.bind(proxy.proxyGet, proxy, this))
            // _.each(['comment'], _.bind(proxy.proxyGetAndSet, proxy, this))
        },
        
        initialize: function(options) {
            // var mutators = this.mutators = {}

            // mutators.user = {
            //     get: function() {
            //         var result = Mutator.prototype.oldGet.call(this, 'user');
            //         return result.find(_.identity);
            //     },
                
            //     set: function(key, value, options, set) {
            //         set({
            //             'user': [value]
            //         }, options);
            //     }
            // }
        }
    })
    
    return DocCollection.extend({
        model: StudentRecord
    });
    
})
define(function (require) {
    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('util/backbone-helper');
    var Hbs = require('handlebars');
    var Mn = require('backbone.marionette');
    var Q = require('q');
    var Radio = require('backbone.radio');
    require('query-engine');
    QueryCollection = window.queryEngine.QueryCollection;
    
    require('backbone-documentmodel');
    var DocModel = Backbone.DocumentModel;
    var DocCollection = Backbone.DocumentCollection;
    
    return DocCollection.extend({
        initialize: function(models, options) {
            var self = this;
            this.query = new QueryCollection(models, {
                parentCollection: self,
                live: true
            });
        }
    });
    
})
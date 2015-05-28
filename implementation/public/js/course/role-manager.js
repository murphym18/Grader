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
    var DocCollection = require('util/doc-collection');
    var DocModel = require('util/doc-model');
    var Role = DocModel.extend({
        constructor: function Role() {
            DocModel.apply(this, arguments);
        }
    })
    return DocCollection.extend({
        model: Role,
        initialize: function(models, options) {
            var self = this;
            this.query = new QueryCollection(models, {
                parentCollection: self,
                live: true
            });
        },
        constructor: function RoleManager() {
            DocCollection.apply(this, arguments);
        }
    });
    
})
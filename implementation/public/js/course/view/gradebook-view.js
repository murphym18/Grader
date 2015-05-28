/**
 * The boilerplate for an AMD module.
 * @author Michael Murphy
 */
define(function (require) {
    var $ = require('jquery');
    var _ = require('underscore');
    var App = require('app/app');
    var Backbone = require('util/backbone-helper');
    var Hbs = require('handlebars');
    var Mn = require('backbone.marionette');
    var Q = require('q');
    var Radio = require('backbone.radio');
    var webix = require('webix');
    var textTemplate = require('text!templates/#.hbs');
    var ViewState = Backbone.Model.extend({
        initialize: function() {
            
        }
    });
    
    return Mn.ItemView.extend({
        modelEvents: {
            "change:name": "nameChanged" // equivalent to view.listenTo(view.model, "change:name", view.nameChanged, view)
        },
        initialize: function(options) {
            this.viewState = new ViewState();
        }
    });
});
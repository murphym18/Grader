define(function (require) {
    var $ = require('jquery');
    var _ = require('underscore');
    var App = require('app/app');
    var Backbone = require('util/backbone-helper');
    var Hbs = require('handlebars');
    var Mn = require('backbone.marionette');
    var Q = require('q');
    var Radio = require('backbone.radio');
    var SessionView = require('user/header-menu-session-view');
    var HeaderSubMenu = require('util/header-sub-menu-view');
    
    
    // var TableView = Backbone.Marionette.CompositeView.extend({
    //     childView: RowView,
        
    //     // specify a jQuery selector to put the `childView` instances into
    //     childViewContainer: "tbody",
        
    //     template: "#table-template"
    // });
    
    
    
    return Mn.CollectionView.extend({
        childView: HeaderSubMenu,
        onShow: function() {
            
        }
    
    });
});


define(function (require) {
    var $ = require('jquery');
    var _ = require('underscore');
    var App = require('app/app');
    var Backbone = require('util/backbone-helper');
    var Hbs = require('handlebars');
    var Mn = require('backbone.marionette');
    var Q = require('q');
    var Radio = require('backbone.radio');
    
    var headerSubMenuTemplate = require('text!templates/headerSubMenu.hbs');
    
    return Mn.LayoutView.extend({
        tagName: 'div',
        className: 'headerSubMenu',
        template: Hbs.compile(headerSubMenuTemplate),
        childViewContainer: 'div.items',
        childView: Mn.ItemView
    });
});



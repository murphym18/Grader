define(function (require) {
    var $ = require('jquery');
    var _ = require('underscore');
    var App = require('app/app');
    var Backbone = require('util/backbone-helper');
    var Hbs = require('handlebars');
    var Mn = require('backbone.marionette');
    var Q = require('q');
    var Radio = require('backbone.radio');
    var SessionView = require('util/header-menu-session-view');
    var templateSrc = require('text!templates/topMenu.hbs');
    
    return Mn.LayoutView.extend({
        template: Hbs.compile(templateSrc),
        
        regions: function(options) {
            return {
                menu: ".menu",
                session: ".session"
            }
        },
        
        onShow: function() {
            this.getRegion("session").show(new SessionView());
        }
    
    });
});


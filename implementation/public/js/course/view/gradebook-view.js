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
    var template = require('text!templates/gradeBookView.hbs');
    var theadTemplate = require('text!templates/gradeBookHeader.hbs');
    var tbodyTemplate = require('text!templates/gradeBookBody.hbs');
    var tfooterTemplate = require('text!templates/gradeBookFooter.hbs');
    var ChartView = require('app/chart');
    //var gradebookTemplate = require()


    var ViewState = Backbone.Model.extend({
        initialize: function() {
            
        }
    });
    
    var HeaderView = Mn.ItemView.extend({

        template: Hbs.compile(theadTemplate),
        initialize: function() {
            this.model = Backbone.model
        }

        
    });

    var BodyView = Mn.ItemView.extend({

        template: Hbs.compile(tbodyTemplate),
        initialize: function() {
            this.model = Backbone.model
        }


    });

    var FooterView = Mn.ItemView.extend({

        template: Hbs.compile(tfooterTemplate),
        initialize: function() {
            this.model = Backbone.model
        }


    });


    
    return Mn.LayoutView.extend({
        template: Hbs.compile(template),
        
        regions: {
            thead: ".gradebook thead",
            tbody: ".gradebook tbody",
            tfoot: ".gradebook tfoot",
            charts: ".charts"
        },
        
        initialize: function(options) {
            this.model = Backbone.model;
            this.viewState = new ViewState();

        },
        onShow: function() {
            this.showChildView('charts', new ChartView());
        },
        
        /* 
        This is faster than rendering in onShow
        http://marionettejs.com/docs/v2.4.1/marionette.layoutview.html#efficient-nested-view-structures
        */
        onBeforeShow: function() {
            console.log('here')
            this.showChildView('thead', new HeaderView());
            this.showChildView('tbody', new BodyView());
            this.showChildView('tfoot', new FooterView());
        }
    });
});
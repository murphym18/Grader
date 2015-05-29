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
    var template = require('text!templates/gradebookView.hbs');
    // var theadTemplate = require('text!templates/gradeBookHeader.hbs');
    // var tbodyTemplate = require('text!templates/gradeBookBody.hbs');
    // var tfooterTemplate = require('text!templates/gradeBookFooter.hbs');
    //var ChartView = require('app/chart');
    //var gradebookTemplate = require()


    var ViewState = Backbone.Model.extend({
        initialize: function() {

        }
    });
    
    return Mn.ItemView.extend({
        template: Hbs.compile(template),
        
        ui: {
            thead: "thead",
            tbody: "tbody",
            tfoot: "tfoot",
            charts: ".charts",
        },
        
        modelEvents: {
            'all': 'onShow'
        },

        initialize: function(options) {
            console.log('here');
            this.model = Radio.channel('course').request('current:course');
            
            console.log(this.model == window.x, this.model)
            this.viewState = new ViewState();
            


        },
        
        onShow: function() {
            var ui = this.ui;
            console.log(ui);
            ui.tbody.empty()
            
            ui.tbody.get(0).appendChild(this.createHead());
            console.log('here');
        },
        
        createHead: function() {
            var docfrag = window.document.createDocumentFragment();
            var layout = this.model.categories.calculateTableHeaderLayout();
            _.each(layout, function(row) {
                var tr = window.document.createElement("tr");
                _.each(row, function(cell) {
                    var td = window.document.createElement("td");
                    
                    td.setAttribute("colspan", cell.colspan);
                    td.setAttribute("rowspan", cell.rowspan);
                    td.setAttribute("class", cell.style);
                    td.setAttribute("data-cid", cell.cid);
                    td.appendChild(document.createTextNode(cell.name));
             
                    tr.appendChild(td);
                });
                
                docfrag.appendChild(tr);
            });
            return docfrag;
        }
    });
});
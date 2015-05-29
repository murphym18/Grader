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
            thead: "table.gradebook > thead",
            tbody: "table.gradebook > tbody",
            tfoot: "table.gradebook > tfoot",
            charts: ".charts",
            shead: "table.gradebook-students > thead",
            sbody: "table.gradebook-students > tbody",
            sfoot: "table.gradebook-students > tfoot",
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
            var layout = this.model.categories.calculateTableHeaderLayout();
            var headerHeight = layout.length;

            var students = this.model.students.map(function(student) {
                var last = student.get('last') || student.get('user.0.last');
                var first = student.get('last') || student.get('user.0.last');
                var name = last+', '+first;
                var id = student.id || student.cid;
                var grades = student.has('grades') ? student.get('grades') : [];
                return {
                    name: name,
                    id: id,
                    grades: grades
                }
            });
            console.log(students)
            var assignments;
            var header = createHeader();
            var body = createBody();
            var tableRowHeaders = createRowHeaders();
            console.log(ui);
            ui.thead.empty()
            ui.shead.empty()
            ui.tbody.empty()
            ui.sbody.empty()
            
            ui.thead.get(0).appendChild(header);
            ui.tbody.get(0).appendChild(body);
            ui.shead.get(0).appendChild(createRowHeadersColHeader())
            ui.sbody.get(0).appendChild(createRowHeaders());
            
            console.log(assignments);
            
            function createHeader() {
                assignments = [];
                var docfrag = window.document.createDocumentFragment();
                _.each(layout, function(row) {
                    var tr = window.document.createElement("tr");
                    _.each(row, function(cell) {
                        var td = window.document.createElement("th");
                        
                        if (cell.style === "assignment") {
                            assignments.push(cell.cid);
                        }
                        
                        if (cell.style === "blank") {
                            td = window.document.createElement("td");
                        }
                        else {
                            td.appendChild(document.createTextNode(cell.name));
                        }
                        td.setAttribute("colspan", cell.colspan);
                        td.setAttribute("rowspan", cell.rowspan);
                        var styles = [""]
                        td.setAttribute("class", cell.style + " text-nowrap col-md-" + cell.colspan);
                        
                        
                 
                        tr.appendChild(td);
                    });
                    
                    docfrag.appendChild(tr);
                });
                return docfrag;
            }
            function createBody() {
                var docfrag = window.document.createDocumentFragment();
                var arr = assignments.map(function(cid){
                    return window.regestery._byId[cid];
                });
                var studentRows = _.map(students, function(student) {
                    var grades = arr.map(function(a) {
                        var grade = _.find(student.grades, {assignment: a.id});
                        return {
                            colspan: 1,
                            rowspan: 1,
                            style: "grade",
                            value: grade || "0",
                            gradeEmpty: !(grade ? true : false)
                        }
                    });
                    
                    //grades.unshift(studentCell);
                    return grades;
                })
                _.each(studentRows,function(row) {
                    var tr = window.document.createElement("tr");
                    _.each(row, function(cell) {
                        var td = window.document.createElement("td");
                        
                        if (cell.style == "grade") {
                            var text = document.createTextNode(cell.value);
                            if(cell.gradeEmpty) {
                                var s = window.document.createElement("span");
                                s.appendChild(text);
                                td.appendChild(s);
                            }
                            else {
                                td.appendChild(text);
                                
                            }
                            td.setAttribute("class", cell.style);    
                            
                        }
                        else {
                            return
                            td = window.document.createElement("th");
                            td.appendChild(document.createTextNode(cell.name));
                            td.setAttribute("class", cell.style + " ");
                        }
                        td.setAttribute("colspan", cell.colspan);
                        td.setAttribute("rowspan", cell.rowspan);
                        
                 
                        tr.appendChild(td);
                    });
                    
                    docfrag.appendChild(tr);
                })
                console.log("here in making a ")
                return docfrag;
            }
            
            function createRowHeadersColHeader() {
                var docfrag = window.document.createDocumentFragment();
                console.log(headerHeight)
                var row = {
                    rowspan: 1,
                    colspan: 1,
                    style: "blank",
                    name:"_"
                }
                var tr = window.document.createElement("tr");
                var th = window.document.createElement("th");
                th.appendChild(document.createTextNode(row.name));
                th.setAttribute("class", row.style);
                th.setAttribute("colspan", row.colspan);
                th.setAttribute("rowspan", row.rowspan);
                tr.appendChild(th);
                docfrag.appendChild(tr);
                while(--headerHeight) {
                    var tr = window.document.createElement("tr");
                    var th = window.document.createElement("th");
                    if (headerHeight === 1) {
                        th.setAttribute("style", "border-bottom: 2px solid #ddd");
                    }
                    th.setAttribute("class", row.style);
                    th.appendChild(document.createTextNode(row.name));
                    tr.appendChild(th);
                    
                    docfrag.appendChild(tr);
                }
                return docfrag;
            }
            function createRowHeaders() {    
                var docfrag = window.document.createDocumentFragment();
                var arr = assignments.map(function(cid){
                    return window.regestery._byId[cid];
                });
                var studentRows = _.map(students, function(student) {
                    return studentCell = {
                        name: student.name || "",
                        rowspan: 1,
                        colspan: 1,
                        style: "studentRowHeader"
                    }
                })
                _.each(studentRows,function(row) {
                    var tr = window.document.createElement("tr");
                    var td = window.document.createElement("th");
                    td.appendChild(document.createTextNode(row.name));
                    td.setAttribute("class", row.style + " ");
                    td.setAttribute("colspan", 1);
                    td.setAttribute("rowspan", row.rowspan);
                    tr.appendChild(td);
                    docfrag.appendChild(tr);
                    console.log(name)
                });
                return docfrag;
            }
                
        },
        
        
    });
});
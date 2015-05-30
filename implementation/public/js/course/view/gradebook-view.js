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

    var ViewState = Backbone.Model.extend({
        initialize: function() {

        }
    });
    
    return Mn.ItemView.extend({
        template: Hbs.compile(template),
        
        events: {
            "click td.grade": "editGrade"
        },
        
        ui: {
            thead: "table.gradebook > thead",
            tbody: "table.gradebook > tbody",
            tfoot: "table.gradebook > tfoot",
            shead: "table.gradebook-students > thead",
            sbody: "table.gradebook-students > tbody",
            sfoot: "table.gradebook-students > tfoot",
        },
        
        modelEvents: {

        },
        
        editGrade: function(e) {
            e.preventDefault();
            if (this.input) {
                this.saveRawScoreInput();
                this.input = null;
            }
            else {
                this.input = e.currentTarget;
                var elm = $(e.currentTarget);
                var aId = elm.attr('data-aId');
                var sId = elm.attr('data-sId');

                this.getCurrentRawScore(aId, sId).then(function(val) {
                    elm.empty();
                    console.log('got promise val', val);
                    elm.html("<input type='number' value='"+val+"'/>");
                    elm.attr('data-aId', aId);
                    elm.attr('data-sId', sId);
                    elm.find('input').focus();
                    elm.find('input').select();
                }).done()
                
            }
        },
        
        saveRawScoreInput: function() {
            var deferred = Q.defer();
            var self = this;
            var elm = $(this.input);
            var rawScore = elm.find('input').val() || "0";
            var aId = elm.attr('data-aId');
            var sId = elm.attr('data-sId');
            var model = this.model;
            var value = {
                rawScore: rawScore,
                assignment: aId
            }
            setTimeout(function() {
                doRender()
                try {
                    var students = self.model.get('students')
                    console.log('logging student collection')
                    console.log(students);
                    var student = students.findWhere({_id: sId})
                    console.log('logging current student', sId);
                    console.log(student);
                    var grades = student.get('grades');
                    console.log('logging grades collection')
                    console.log(grades)
                    var item = grades.findWhere({assignment: aId});
                    
                    if (item) {
                        item.model.once('change', doSave);
                        item.set(value)
                        item.off('change', doSave);
                        deferred.resolve(true);
                    }
                    else {
                        grades.add(value);
                        doSave();
                    }

                    function doSave() {
                        elm.html("<span>"+rawScore+"</span>");
                        deferred.resolve(self.model.save().then(function(data) {
                            console.log(data);
                            return doRender();
                            deferred.resolve(true);
                        }));
                    }
                    
                }
                catch(e) {
                    deferred.reject(e);
                }
            }, 1);
            
            function doRender() {
                elm.empty();
                elm.html(rawScore);
                elm.attr('data-aId', aId);
                elm.attr('data-sId', sId);
            }
            
            return deferred.promise;
        },
        
        getCurrentRawScore: function (aId, sId) {
            var deferred = Q.defer();
            var self = this;
            setTimeout(function() {
                try {
                    var students = self.model.get('students')
                    console.log('logging student collection')
                    console.log(students);
                    var student = students.findWhere({_id: sId})
                    console.log('logging current student', sId);
                    console.log(student);
                    var grades = student.get('grades');
                    console.log('logging grades collection')
                    console.log(grades)
                    var item = grades.findWhere({assignment: aId});
                    console.log('logging assignment grade')
                    console.log(item)
                    var value = item.get('rawScore') || "0"
                    console.log('logging value of raw score');
                    console.log(value);
                    console.log('resolving promise');
                    deferred.resolve(value);
                }
                catch(e) {
                    deferred.resolve("0");
                }
            }, 1);
            
            return deferred.promise;
        },

        initialize: function(options) {
            console.log('here');
            this.model = Radio.channel('course').request('current:course');
            
            console.log(this.model == window.x, this.model)
            this.viewState = new ViewState();

        },
        
        onShow: function() {
            var self = this;
            var ui = this.ui;
            var layout = this.model.get('categories').calculateTableHeaderLayout();
            var headerHeight = layout.length;
            var allStudents = this.model.get('students');
            console.log(allStudents);
            var students = allStudents.map(function(student) {
                var user = student.get('user').find(_.identity);
                var last = user.get('last');
                var first = user.get('first');

                var name = last+', '+first;
                console.log('found name', name);
                var id = student.id;
                var grades = student.get('grades');
                return {
                    name: name,
                    id: id,
                    grades: grades
                }
            });

            console.log(students)
            var assignments = this.model.get('categories').allAssignments();
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
                var docfrag = window.document.createDocumentFragment();
                _.each(layout, function(row) {
                    var tr = window.document.createElement("tr");
                    _.each(row, function(cell) {
                        var td = window.document.createElement("th");
                        
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
                var studentRows = _.map(students, function(student) {
                    var grades = [];
                    for(var i = 0; i < assignments.length; ++i) {
                    
                        var grade = _.first(student.grades.filter(function(e) {
                            return assignments[i].id === e.get('assignment');
                        }))
                        
                        if (grade)
                            console.log(grade);
                            
                        grades.push({
                            colspan: 1,
                            rowspan: 1,
                            style: "grade",
                            value: !!grade ? grade.get('rawScore') : "0",
                            gradeEmpty: !grade,
                            aId: assignments[i].id,
                            sId: student.id
                        });
                    }
                    console.log("%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%")
                    return grades;
                });
                
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
                            td.setAttribute("data-aId", cell.aId);
                            td.setAttribute("data-sId", cell.sId);
                            
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
/**
 * The boilerplate for an AMD module.
 * @author Michael Murphy
 */
define(function(require) {
    var $ = require('jquery');
    var _ = require('underscore');
    var Q = require('q');
    var Backbone = require('util/backbone-helper');
    var Radio = require('backbone.radio');
    var Mn = require('backbone.marionette');
    var Hbs = require('handlebars');
    var template = require('text!course/view/gradebook/gradebookView.hbs');
    var adapter = require('course/view/gradebook/gradebook-adapter');
    var courseRadioChannel = Radio.channel('course');

    function mkGradeSorter(aId) {
        return function gradeSort(student) {
            return student.getGrade(aId);
        }
    }

    var GradebookView = Mn.ItemView.extend({
        template: Hbs.compile(template),

        events: {
            "click td.grade": "editGrade",
            "click th": "setSortColumn"
        },

        ui: {
            shead: "table.gradebook-students > thead",
            sbody: "table.gradebook-students > tbody",
            sfoot: "table.gradebook-students > tfoot",

            thead: "table.gradebook > thead",
            tbody: "table.gradebook > tbody",
            tfoot: "table.gradebook > tfoot",

            ehead: "table.gradebook-summary > thead",
            ebody: "table.gradebook-summary > tbody",
            efoot: "table.gradebook-summary > tfoot",
        },

        modelEvents: {
            'sort': 'onShow',
            'change': 'onShow',
            'open': 'onOpen',
            'sync': 'onShow',
            'change:students.grades': 'onShow'
        },

        initialize: function() {
            this.listenTo(this.model.students, 'add remove update reset sort sync', this.onShow.bind(this));
            this.listenTo(this.model.assignments, 'add remove update reset sort sync', this.onShow.bind(this));
            this.listenTo(this.model.categories, 'add remove update reset sort sync', this.onShow.bind(this));
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
                    elm.html("<input type='number' value='" + val + "'/>");
                    elm.attr('data-aId', aId);
                    elm.attr('data-sId', sId);
                    elm.find('input').focus();
                    elm.find('input').select();
                }).done()

            }
        },

        setSortColumn: function(e) {
            e.preventDefault();
            var elm = $(e.currentTarget);
            var self = this
            if (elm.attr('data-aid')) {
                var aId = elm.attr('data-aid');
                self.model.students.comparator = mkGradeSorter(aId);
                self.model.students.sort();
            }


        },

        saveRawScoreInput: function() {
            var deferred = Q.defer();
            var self = this;
            var elm = $(this.input);
            var rawScore = elm.find('input').val() || "0";
            var aId = elm.attr('data-aId');
            var sId = elm.attr('data-sId');
            console.log(rawScore)
            var model = this.model;
            setTimeout(function() {
                doRender()
                try {
                    var studentCollection = self.model.students;
                    var student = studentCollection.get(sId)
                    console.log('logging current student', sId);
                    console.log(student);
                    student.setGrade(aId, rawScore);
                    student.save();
                    console.log('savinging student');
                    // var grades = student.get('grades');
                    // console.log('logging grades collection')
                    // console.log(grades)
                    // var item = grades.findWhere({assignment: aId});

                    // item.model.once('change', doSave);
                    // item.setGrade(aId, rawScore);
                    // item.off('change', doSave);
                    deferred.resolve(true);

                    function doSave() {
                        console.log('here');
                        elm.html("<span>" + rawScore + "</span>");
                        deferred.resolve(self.model.save().then(function(data) {
                            console.log(data);
                            return doRender();
                            deferred.resolve(true);
                        }));
                    }

                }
                catch (e) {
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

        getCurrentRawScore: function(aId, sId) {
            var deferred = Q.defer();
            var self = this;
            setTimeout(function() {
                try {
                    var students = self.model.students;
                    console.log('logging student collection')
                    console.log(students);
                    var student = students.get(sId)
                        // console.log('logging current student', sId);
                        // console.log(student);
                        // var grades = student.get('grades');
                        // console.log('logging grades collection')
                        // console.log(grades)
                        // var item = student.getGrade(aId);
                        // console.log('logging assignment grade')
                        // console.log(item)
                        // var value = item.get('rawScore') || "0"
                        // console.log('logging value of raw score');
                        // console.log(value);
                    console.log('resolving promise');
                    deferred.resolve(student.getGrade(aId));
                }
                catch (e) {
                    deferred.resolve("0");
                }
            }, 1);

            return deferred.promise;
        },

        onOpen: function() {
            console.log('course opened', this.model.cid);
            this.onShow();
        },

        onShow: function() {
            var self = this;
            var ui = this.ui;
            var categoriesCollection = this.model.categories;
            var layout = adapter.calculateTableHeaderLayout();
            var headerHeight = layout.length;
            var studentCollection = this.model.students;
            var students = studentCollection.map(function(student) {
                //var user = student.get('user').find(_.identity);
                var last = student.get('last');
                var first = student.get('first');
                var name = last + ', ' + first;
                var id = student.id;
                return {
                    name: name,
                    id: id,
                    student: student
                }
            });

            var assignmentOrder = [];
            var assignments = this.model.assignments;
            var header = createHeader();
            //console.log('assignment order: ', assignmentOrder);
            var body = createBody();
            var tableRowHeaders = createRowHeaders();

            ui.shead.empty();
            ui.thead.empty();
            ui.ehead.empty();

            ui.sbody.empty();
            ui.tbody.empty();
            ui.ebody.empty();

            ui.thead.get(0).appendChild(header);
            ui.tbody.get(0).appendChild(body);
            ui.shead.get(0).appendChild(createRowHeadersColHeader());
            ui.sbody.get(0).appendChild(createRowHeaders());
            var headerHeight = layout.length;
            ui.ehead.get(0).appendChild(createRowHeadersColHeader());
            ui.ebody.get(0).appendChild(createRowSummaries());

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
                        if (cell.style === "assignment") {
                            assignmentOrder.push(cell.id);
                            td.setAttribute('data-aid', cell.id);

                        }
                        if (cell.id) {
                            td.setAttribute('data-cat-id', cell.id);
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
                    for (var i = 0; i < assignmentOrder.length; ++i) {

                        var grade = student.student.getGrade(assignmentOrder[i]);
                        grades.push({
                            colspan: 1,
                            rowspan: 1,
                            style: "grade",
                            value: grade,
                            gradeEmpty: !_.isFinite(grade),
                            aId: assignmentOrder[i],
                            sId: student.student.id
                        });
                    }

                    return grades;
                });

                _.each(studentRows, function(row) {
                    var tr = window.document.createElement("tr");
                    _.each(row, function(cell) {
                        var td = window.document.createElement("td");

                        if (cell.style == "grade") {

                            var text = document.createTextNode(cell.value);
                            if (cell.gradeEmpty) {
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

                return docfrag;
            }

            function createRowHeadersColHeader() {
                var docfrag = window.document.createDocumentFragment();
                var row = {
                    rowspan: 1,
                    colspan: 1,
                    style: "blank",
                    name: "_"
                }
                var tr = window.document.createElement("tr");
                var th = window.document.createElement("th");
                th.appendChild(document.createTextNode(row.name));
                th.setAttribute("class", row.style);
                th.setAttribute("colspan", row.colspan);
                th.setAttribute("rowspan", row.rowspan);
                tr.appendChild(th);
                docfrag.appendChild(tr);
                while (--headerHeight) {
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
                var arr = assignments.map(function(cid) {
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
                _.each(studentRows, function(row) {
                    var tr = window.document.createElement("tr");
                    var td = window.document.createElement("th");
                    td.appendChild(document.createTextNode(row.name));
                    td.setAttribute("class", row.style + " ");
                    td.setAttribute("colspan", 1);
                    td.setAttribute("rowspan", row.rowspan);
                    tr.appendChild(td);
                    docfrag.appendChild(tr);
                });
                return docfrag;
            }

            function createRowSummaries() {
                var students = studentCollection;
                var docfrag = window.document.createDocumentFragment();
                for (var i = 0; i < students.size(); ++i) {
                    console.log('hello...')
                    var student = students.at(i);

                    // console.log(self.model);
                    var totalGrade = self.model.calculateGrade(student);
                    // console.log(totalGrade);
                    totalGrade = Math.round(totalGrade * 100) / 100
                    var tr = window.document.createElement("tr");
                    var td = window.document.createElement("th");
                    td.appendChild(document.createTextNode(totalGrade));
                    td.setAttribute("class", "total");
                    td.setAttribute("colspan", 1);
                    td.setAttribute("rowspan", 1);
                    tr.appendChild(td);
                    docfrag.appendChild(tr);
                }
                return docfrag;
            }

        }
    });

    courseRadioChannel.reply('view:gradebook', function(course) {
        if (!course) {
            course = courseRadioChannel.request('current:course');
        }
        return new GradebookView({
            model: course
        });
    });


});
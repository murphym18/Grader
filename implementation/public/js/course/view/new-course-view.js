/**
 * Event handler for the add new class view.
 * @author Mike Ryu
 */
 
define(function (require) {
    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('util/backbone-helper');
    var Hbs = require('handlebars');
    var Mn = require('backbone.marionette');
    var Q = require('q');
    var Radio = require('backbone.radio');
    var pageChannel = Radio.channel('page');
    var courseChannel = Radio.channel('course');
    var template = require('text!templates/addNewClassView.hbs');
    var alertTemplate = require('text!templates/alert-block.hbs');
    
    var Course = require('course/course');

    return Mn.ItemView.extend({
        tagName: 'div',
        className: 'newClass modal-dialog  modal-lg',
        template: Hbs.compile(template),
        
        ui: {
            classCode: '.classCode',
            classNumber: '.classNumber',
            classSection: '.classSection',
            winter: '.winter',
            spring: '.spring',
            summer: '.summer',
            fall: '.fall',
            year: '.classYear',
            saveButton: '.save',
            error: '.error'
        },
        
        events: {
            'change @ui.classCode': "updateClassCode",
            'change @ui.classNumber': "updateClassNumber",
            'change @ui.classSection': "updateClassSection",
            'click @ui.winter': 'onSelectWinter',
            'click @ui.spring': 'onSelectSpring',
            'click @ui.summer': 'onSelectSummer',
            'click @ui.fall': 'onSelectFall',
            'change @ui.year': "onUpdateYear",
            'click @ui.saveButton': 'onSaveCourse',
        },
        
        initialize: function(options) {
            this.model = new Course
            this.model.get('roles').push({
                "name":"INSTRUCTOR",
                "users":[options.user],
                "permissions":[]
            });
            this.onSelectWinter = _.bind(this.setTerm, this, 'Winter');
            this.onSelectSpring = _.bind(this.setTerm, this, 'Spring');
            this.onSelectSummer = _.bind(this.setTerm, this, 'Summer');
            this.onSelectFall = _.bind(this.setTerm, this, 'Fall');
            this.alertTemplate = Hbs.compile(alertTemplate);
        },
        
        onShownModal: function() {
            this.ui.classCode.focus();
        },
        
        updateClassCode: function() {
            var value = this.ui.classCode.val().toString();
            this.model.set({
                classCode: value
            });
        },
        
        updateClassNumber: function() {
            var value = this.ui.classNumber.val().toString();
            this.model.set({
                classNumber: value
            });
        },
        
        updateClassSection: function() {
            var value = this.ui.classSection.val().toString();
            this.model.set({
                section: value
            });
        },
        
        setTerm: function(term) {
            this.model.set({
                term: term,
            });
            this.ui[term.toLowerCase()].se
        },
        
        onUpdateYear: function() {
            var year = this.ui.year.val().toString();
            this.model.set({
                year: year
            });
            
        },
        
        updateCourseDates: function() {
            var term = this.model.get('term')
            var year = this.model.get('year')
            if (Course.isValidTerm(term) && Course.isValidYear(year)) {
                this.model.set(Course.findTermDates(term, year));
            }
        },
        
        onSaveCourse: function() {
            var self = this;
            this.updateCourseDates.call(this);
            var urlPath = Course.createColloquialUrl(this.model);
            if (urlPath) {
                this.model.set({
                    colloquialUrl: urlPath
                });
            }
            var self = this;
            Q(this.model.save()).then(function(res) {
                console.dir(['new class save result:', res]);
                var modalRegion = pageChannel.request('modalRegion');
                modalRegion.hideModal();
                courseChannel.command('updateCourses');
            },
            function(err) {
                self.ui.error.html(self.alertTemplate({message: err.responseText}));
                self.ui.saveButton.button('reset');
            }).done();
        }
    });
});

        // /**
        // * Hides the dialog on initial load.
        // */
        // onShow: function onShow () {
        //     this.ui.addNewClassButton.show();
        //     this.ui.dialog.hide();
        // },
        
        /**
        * Adds a new class as entered by user,
        * and saves changes to the database.
        */
        
        
        
        // saveNewClass: function saveNewClass () {
        //     if ((this.ui.classCode.val() + '').length === 0 ||
        //         (this.ui.classNumber.val() + '').length === 0) {
        //         alert("Please enter BOTH class code and number.");
        //         console.log("ERROR");
        //     }
        //     else {
        //         var code = this.ui.classCode.val();
        //         var number = this.ui.classNumber.val();
            
        //         //this.model.add([{
        //         //    classCode: code,
        //         //    classNumber: number,
        //         //    section: '0',
        //         //    start: Date,
        //         //    end: Date,
        //         //    year: '2015',
        //         //    term: 'Spring',
        //         //    colloquialUrl: code + '-' + number + '-0'
        //         //}
        //         //]);
            
        //         var Course = Backbone.Model.extend({
        //             // Needs proper ID attribute and root url
        //             idAttribute: "_id",
        //             urlRoot: "/api/Courses"
        //         });
            
        //         var course = new Course();
        //         course.set(defaultClass);
        //         course.set({
        //             classCode: code,
        //             classNumber: number,
        //             section: '0',
        //             start: new Date(),
        //             end: new Date(),
        //             year: '2015',
        //             term: 'Spring',
        //             colloquialUrl: code + '-' + number + '-0'
        //         });
            
        //         this.ui.dialog.hide();
        //         this.ui.addNewClassButton.show();
            
        //         // Backbone.emulateHTTP = true;
        //         course.save();
        //         //this.model.save();
        //     }
        // },
        
        // /**
        // * Shows the Add New Class dialog on click.
        // */
        // showAddNewClass: function showDialog() {
        //     this.ui.dialog.show();
        //     this.ui.addNewClassButton.hide();
        // },
        
        // /**
        // * Closes the Add New Class dialog.
        // */
        // closeAddNewClass: function () {
        //     this.ui.dialog.hide();
        //     this.ui.addNewClassButton.show();
        // }
// define(['app/app', 'text!templates/addNewClassView.hbs' ], function(App, template) {
    
//     var AddNewClassView = 
// /*
//     App.Router.route("addNewClass", "home", function() {
//         App.UserCourses.fetch().then(function() {
//             App.$.ajax({
//                 url: '/api/Users/admin'
//             }).done(function(data) {
//                 defaultClass.roles.users.push(data);
//                 var course = App.UserCourses.at(0);
//                 //var course = App.UserCourses;
//                 var addNewClassView = new AddNewClassView({
//                     model: course
//                 });
//             App.PopupRegion.show(addNewClassView);
//             })
            
//         });
//     });
// */
// });
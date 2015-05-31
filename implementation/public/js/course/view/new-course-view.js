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
    var template = require('text!ctemplates/addNewClassView.hbs');
    var alertTemplate = require('text!ctemplates/alert-block.hbs');
    
    var Course = require('course/model/course');

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

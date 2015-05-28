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
    var template = require('text!templates/modifyCourseView.hbs');
    var alertTemplate = require('text!templates/alert-block.hbs');

    var Course = require('course/course');

    return Mn.ItemView.extend({
        tagName: 'div',
        className: 'modifyCourse modal-dialog  modal-lg',
        template: Hbs.compile(template),

        ui: {
            courseCode: '.courseCode',
            courseNumber: '.courseNumber',
            courseSection: '.courseSection',
            winter: '.winter',
            spring: '.spring',
            summer: '.summer',
            fall: '.fall',
            year: '.courseYear',
            saveButton: '.save',
            error: '.error'
        },

        events: {
            'change @ui.courseCode': "updateCourseCode",
            'change @ui.courseNumber': "updateCourseNumber",
            'change @ui.courseSection': "updateCourseSection",
            'click @ui.winter': 'onSelectWinter',
            'click @ui.spring': 'onSelectSpring',
            'click @ui.summer': 'onSelectSummer',
            'click @ui.fall': 'onSelectFall',
            'change @ui.year': "onUpdateYear",
            'click @ui.saveButton': 'onSaveCourse'
        },

        initialize: function(options) {


            this.model =  new Course; // courseChannel.request('current:course');
            console.log('modify course working');
            this.alertTemplate = Hbs.compile(alertTemplate);
            //console.log(this.model);
            //this.ui.courseSection.val(model.get('section'));
            //// TODO: Select Term
            //this.ui.year.val(model.get('year'));

            this.onSelectWinter = _.bind(this.setTerm, this, 'Winter');
            this.onSelectSpring = _.bind(this.setTerm, this, 'Spring');
            this.onSelectSummer = _.bind(this.setTerm, this, 'Summer');
            this.onSelectFall = _.bind(this.setTerm, this, 'Fall');

        },

        onShownModal: function() {
            this.ui.courseCode.focus();
            this.ui.courseCode.val('CPE'/* TODO: model.get('courseCode') */);
            this.ui.courseNumber.val('101'/* TODO: model.get('courseNumber')*/);
            this.ui.courseSection.val('1'/* TODO: model.get('section') */);

            /* TODO: Read term and select button */
            this.ui.fall.button('toggle');

            this.ui.year.val('2015' /* TODO: model.get('year') */);
        },

        updateCourseCode: function() {
            var value = this.ui.courseCode.val().toString();
            this.model.set({
                courseCode: value
            });
        },

        updateCourseNumber: function() {
            var value = this.ui.courseNumber.val().toString();
            this.model.set({
                courseNumber: value
            });
        },

        updateCourseSection: function() {
            var value = this.ui.courseSection.val().toString();
            this.model.set({
                section: value
            });
        },

        setTerm: function(term) {
            this.model.set({
                term: term,
            });
           //Errorrrrrrr
            //this.ui[term.toLowerCase()].se
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
            self = this;
            Q(this.model.save()).then(function(res) {
                    console.dir(['new course save result:', res]);
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
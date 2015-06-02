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
    var template = require('text!ctemplates/gradeSchemeView.hbs');
    var alertTemplate = require('text!ctemplates/alert-block.hbs');

    var Course = require('course/model/course');

    return Mn.ItemView.extend({
        tagName: 'div',
        className: 'gradeScheme modal-dialog  modal-lg',
        template: Hbs.compile(template),

        ui: {
            'saveButton' : '.save',
            'aMin' : '#grade-scheme-min-a',
            'bMin' : '#grade-scheme-min-b',
            'cMin' : '#grade-scheme-min-c',
            'dMin' : '#grade-scheme-min-d',
            'passMin' : '#grade-scheme-min-pass',
            'buttonGraded' : '#grade-scheme-graded',
            'buttonPassFail' : '#grade-scheme-pass-fail'
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
            'click @ui.saveButton': 'onSaveGradeScheme'
        },

        initialize: function(options) {
            this.model = new Course;

        },
        onShow : function() {

            //this.model = this.model.course;
            console.log(this.model.get('minA'));


            var ui = this.ui;
            var course = this.model;
            console.log(course);

            ui.aMin.val(course.get('minA'));
            ui.bMin.val(course.get('minB'));
            ui.cMin.val(course.get('minC'));
            ui.dMin.val(course.get('minD'));
            ui.passMin.val(course.get('minCredit'));
        },
        setNewMinimums : function () {

        },

        onSaveGradeScheme : function () {
            this.setNewMinimums();

            $('.cancel').click();
        }

    });
});
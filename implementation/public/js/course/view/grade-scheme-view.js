define(function (require) {
    var $ = require('jquery');
    var _ = require('underscore');
    var App = require('app/app');
    var Backbone = require('util/backbone-helper');
    var Hbs = require('handlebars');
    var Mn = require('backbone.marionette');
    var Q = require('q');
    var Radio = require('backbone.radio');
    var pageChannel = Radio.channel('page');
    //var courseChannelRadio = Radio.channel('course');
    var courseRadioChannel = Radio.channel('course');
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
            'click @ui.saveButton': 'onSaveGradeScheme',
            'change @ui.aMin' : 'updateMinimumA',
            'change @ui.bMin' : 'updateMinimumB',
            'change @ui.cMin' : 'updateMinimumC',
            'change @ui.dMin' : 'updateMinimumD'
        },

        initialize: function(options) {
            this.model = courseRadioChannel.request('current:course');
            //this.model = courseChannel.request('current:course');
            //console.log(this.model);

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

        updateMinimumA : function () {
            var newAMin = this.ui.aMin.val();
            var self = this;
            if(newAMin <= this.ui.bMin.val()) {
                console.log('A Minimum cannot be lower than B Minimum')
                this.ui.aMin.val(this.model.get('minA'))
                return;
            }

            this.model.set('minA', parseInt(newAMin))
            //self.model.save()
            //self.updatePieChart();
            //this.model.set('minA', newAMin).then(this.model.save());
            this.ui.aMin.val(newAMin);
            //this.model.save();
        },
        updateMinimumB : function () {
            var newBMin = this.ui.bMin.val();
            var self = this;
            if(newBMin <= this.ui.cMin.val()) {
                console.log('B Minimum cannot be lower than C Minimum')
                this.ui.bMin.val(this.model.get('minB'))
                return;
            }
            if(newBMin >= this.ui.aMin.val()) {
                console.log('B Minimum cannot be higher than A Minimum')
                this.ui.bMin.val(this.model.get('minB'))
                return;
            }

            this.model.set('minB', parseInt(newBMin))
            //self.model.save();
            //self.updatePieChart();
            //this.model.set('minB', newBMin).then(this.model.save());
            this.ui.bMin.val(newBMin);
            //this.model.save();
        },
        updateMinimumC : function () {
            var newCMin = this.ui.cMin.val();
            var self = this;
            if(newCMin <= this.ui.dMin.val()) {
                console.log('C Minimum cannot be lower than D Minimum')
                this.ui.cMin.val(this.model.get('minC'))
                return;
            }
            if(newCMin >= this.ui.bMin.val()) {
                console.log('C Minimum cannot be higher than B Minimum')
                this.ui.cMin.val(this.model.get('minC'))
                return;
            }

            this.model.set('minC', parseInt(newCMin))
            //self.model.save();
            //self.updatePieChart();
            //this.model.set('minC', newCMin).then(this.model.save());
            this.ui.cMin.val(newCMin);

        },
        updateMinimumD : function () {
            var newDMin = this.ui.dMin.val();
            var self = this;
            if(newDMin >= this.ui.cMin.val()) {
                console.log('D Minimum cannot be higher than C Minimum')
                this.ui.dMin.val(this.model.get('minD'))
                return;
            }

            this.model.set('minD', parseInt(newDMin))
            //self.model.save();


            this.ui.dMin.val(newDMin);

            //this.model.save();
        },

        onSaveGradeScheme : function () {
            //this.setNewMinimums();

            var modalRegion = pageChannel.request('modalRegion');
            this.model.save().then(modalRegion.hideModal())
            var gradebook = courseRadioChannel.request('view:gradebook');
            pageChannel.request('mainRegion').show(gradebook);
            //var gradeBookRegion = pageChannel.request('mainRegion');
            //gradeBookRegion.show();




            //$('.cancel').click();
        }

    });
});
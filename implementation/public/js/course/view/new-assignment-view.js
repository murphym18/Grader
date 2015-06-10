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
    var template = require('text!ctemplates/addNewAssignmentView.hbs');
    var alertTemplate = require('text!ctemplates/alert-block.hbs');
    var Assignment = require('course/model/assignment');

    var Course = require('course/model/course');
    //var currentAssignment;

    var NewAssignmentView = Mn.ItemView.extend({
        tagName: 'div',
        className: 'new-assignment modal-dialog  modal-lg',
        template: Hbs.compile(template),
        ui: {
            //'newAssignmentButton' : '.newAssignmentButton',
            'save' : '.save',
            'cancel' : '.cancel',
            'name' : '.name',
            'weight' : '.weight',
            'totalScore' : '.total-score',
            'category' : '.category',
            'error': '.error'
        },
        /**
         * Hides the dialog on initial load
         */

        events : {
            'click @ui.save' :  'saveNewAssignment',
            'click @ui.cancel' :  'closeNewAssignment'
        },
        traverseCat : function(indent, o) {

            for (i in o) {
                if (o[i] &&
                    typeof o[i].tree === 'function'
                    && typeof(o[i].tree()) == "object") {
                    this.categoryList.push({
                        name: indent + " " + o[i].get('name'),
                        cid: o[i].cid
                    });
                    this.traverseCat(indent + "---", o[i].tree());
                }
            }

        },

        initialize : function() {
            this.model = courseChannel.request('current:course');
            this.alertTemplate = Hbs.compile(alertTemplate);
        },
        onShow : function() {
            var categories = this.model.categories;
            var categoryTree = categories.tree();
            this.categoryList = [];
            var self = this;

            self.traverseCat("", categoryTree);

            var optionString;
            this.categoryList.forEach(function(c) {
                optionString = '<option value="' + c.cid +'" >'+ c.name + '</option>';
                $('#new-assignment-category').append(optionString);
            });
        },
        saveNewAssignment : function() {
            var self = this;
            var ui = this.ui;
            var newAssignment = [];

            if(ui.name.val() == null || ui.name.val().length === 0) {
                self.ui.error.html(self.alertTemplate({
                        message: "Invalid assignment name"
                    }));
                    
                return;
            }
            else {
                newAssignment.name = ui.name.val();
            }

            if(ui.weight.val() == null || ui.weight.val().length === 0 || isNaN(ui.weight.val())) {
                self.ui.error.html(self.alertTemplate({
                    message: "Weight must be a number"
                }));
                    
                return;
            }
            else {
                newAssignment.weight = ui.weight.val();
            }

            /*

            ADDING THESE LINES CAUSES ERROR IN CONSOLE, EITHER CANNOT READ PROPERTY OR IS NOT A FUNCTION

            if(ui.totalScore.val() == null || isNaN(ui.totalScore.val())) {
                self.ui.error.html(self.alertTemplate({
                    message: "Total score must be a number"
                }));
            else {
                newAssignment.totalScore = ui.totalScore.val();
            }

            if(ui.category.val() == null || !isNaN(ui.categor.val())) {
                self.ui.error.html(self.alertTemplate({
                    message: "Category must be a valid category"
                }));
            else {
                newAssignment.category = ui.category.val();
            }
            */

            if(ui.totalScore.val() == null)
                console.log('error');
            else
                newAssignment.totalScore = ui.totalScore.val();

            if(ui.category.val() == null)
                console.log('error');
            else
                newAssignment.category = ui.category.val();


            console.log(newAssignment);

            //TODO Input value checking above!!
            //TODO Please save this to DB
            var assg = new Assignment(newAssignment);
            assg.save();
            this.model.assignments.push(assg);

            $('.cancel').click()
        }


        /**
         * Shows the new Assignment dialog on click.
         */
        //showNewAssignment : function() {
        //    //this.ui.dialog.show();
        //    //this.ui.newAssignmentButton.hide();
        //    ////this.ui.assignmentName.val(this.model.get('categories')[1].assignments[0].name);
        //    ////this.ui.assignmentWeight.val(this.model.get('categories')[1].assignments[0].weight);
        //    ////this.ui.assignmentTotalScore.val(this.model.get('categories')[1].assignments[0].rawPoints);
        //    //App.UserCourses.fetch().then( function() {
        //    //    var course = App.UserCourses.at(0);
        //    //
        //    //    var categories = course.get('categories');
        //    //
        //    //    var catValues = [];
        //    //    catValues.push('');
        //    //    App._.forEach(categories, function(category) {
        //    //        catValues.push(category.name);
        //    //    });
        //    //
        //    //    $.each(catValues, function(key, value) {
        //    //        ui.category
        //    //            .append($("<option></option>")
        //    //                .text(value));
        //    //    });
        //    //
        //    //});
        //},
        /**
         * Updates the assignment information as entered by user,
         * and saves changes to the database.
         */
        //saveNewAssignment : function() {
        //
        //    //App.UserCourses.fetch().then( function() {
        //    //    var reqAssignName = currentAssignment;
        //    //
        //    //    var course = App.UserCourses.at(0);
        //    //
        //    //    var categories = course.get('categories');
        //    //    var temp_assignment = {
        //    //        dueDate : new Date(2015, 4, 19),
        //    //        name : ui.assignmentName.val(),
        //    //        rawPoints : ui.assignmentTotalScore.val()
        //    //    };
        //    //    categories[1].assignments.push(temp_assignment);
        //    //    //categories[1].assignments[0].name = ui.assignmentName.val();
        //    //    //categories[1].assignments[0].rawPoints = ui.assignmentTotalScore.val();
        //    //    Backbone.emulateHTTP = true;
        //    //    course.save();
        //    //});
        //    //this.closeNewAssignment();
        //},
        /**
         * Closes the new Assignment dialog.
         */
        //closeNewAssignment : function() {
        //    //this.ui.dialog.hide();
        //    //this.ui.newAssignmentButton.show();
        //}

    });

    return NewAssignmentView;
});

//OLD CODE


//define(['app/app', 'text!templates/newAssignmentView.hbs', ], function(App, template) {
//    var currentAssignment;
//
//    var newAssignmentView = App.Mn.ItemView.extend({
//        model: App.Assignment,
//        template: App.Handlebars.compile(template),
//        ui: {
//            'newAssignmentButton' : '.newAssignmentButton',
//            'ok' : '.ok',
//            'cancel' : '.cancel',
//            'dialog' : '.popup-dialog',
//            'assignmentName' : '.assignmentName',
//            'assignmentWeight' : '.assignmentWeight',
//            'assignmentTotalScore' : '.assignmentTotalScore',
//            'category' : '.category'
//        },
//        /**
//         * Hides the dialog on initial load
//         */
//        onShow : function(){
//            this.ui.dialog.hide();
//        },
//        events : {
//           'click @ui.newAssignmentButton' :  'showNewAssignment',
//            'click @ui.ok' :  'saveNewAssignment',
//            'click @ui.cancel' :  'closeNewAssignment'
//
//        },
//        /**
//         * Shows the new Assignment dialog on click.
//         */
//        showNewAssignment : function() {
//            var ui = this.ui;
//            this.ui.dialog.show();
//            this.ui.newAssignmentButton.hide();
//            //this.ui.assignmentName.val(this.model.get('categories')[1].assignments[0].name);
//            //this.ui.assignmentWeight.val(this.model.get('categories')[1].assignments[0].weight);
//            //this.ui.assignmentTotalScore.val(this.model.get('categories')[1].assignments[0].rawPoints);
//            App.UserCourses.fetch().then( function() {
//                var course = App.UserCourses.at(0);
//
//                var categories = course.get('categories');
//
//                var catValues = [];
//                catValues.push('');
//                App._.forEach(categories, function(category) {
//                    catValues.push(category.name);
//                });
//
//                $.each(catValues, function(key, value) {
//                     ui.category
//                         .append($("<option></option>")
//                         .text(value));
//                });
//
//            });
//        },
//        /**
//         * Updates the assignment information as entered by user,
//         * and saves changes to the database.
//         */
//        saveNewAssignment : function() {
//            var ui = this.ui;
//
//            App.UserCourses.fetch().then( function() {
//                var reqAssignName = currentAssignment;
//
//                var course = App.UserCourses.at(0);
//
//                var categories = course.get('categories');
//                var temp_assignment = {
//                    dueDate : new Date(2015, 4, 19),
//                    name : ui.assignmentName.val(),
//                    rawPoints : ui.assignmentTotalScore.val()
//                };
//                categories[1].assignments.push(temp_assignment);
//                //categories[1].assignments[0].name = ui.assignmentName.val();
//                //categories[1].assignments[0].rawPoints = ui.assignmentTotalScore.val();
//                Backbone.emulateHTTP = true;
//                course.save();
//            });
//            this.closeNewAssignment();
//        },
//        /**
//         * Closes the new Assignment dialog.
//         */
//        closeNewAssignment : function() {
//            this.ui.dialog.hide();
//            this.ui.newAssignmentButton.show();
//        }
//
//    })
//
//    App.Router.route("newAssignment", "home", function() {
//        App.$.ajax({
//            url: '/api/Courses'
//        }).done(function (data) {
//            var props = data[0];
//            props.url = '/api/Courses/' + props.colloquialUrl;
//            var course = new App.Backbone.Model(props);
//            console.dir(course);
//            var newView = new newAssignmentView({
//                model: course
//            });
//            App.PopupRegion.show(newView);
//        });
//    });
//});
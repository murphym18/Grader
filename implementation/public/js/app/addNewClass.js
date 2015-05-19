/**
 * Event handler for the add new class view.
 * @author Mike Ryu
 */
define(['app/app', 'text!templates/modifyClassView.hbs' ], function(App, template) {

    var AddNewClassView = App.Mn.ItemView.extend({
        model: App.UserCourses,
        template: App.Handlebars.compile(template),
        ui: {
            'addNewClassButton': '.addNewClassButton',
            'ok': '.ok',
            'cancel': '.cancel',
            'dialog': '.popup-dialog',
            classCode: 'input.classCode',
            classNumber: 'input.classNumber'
        },
        events: {
            'click @ui.addNewClassButton': 'showAddNewClass',
            'click @ui.ok': 'addNewClass',
            'click @ui.cancel': 'closeAddNewClass'
        },

        /**
         * Hides the dialog on initial load.
         */
        onShow: function onShow () {
            this.ui.dialog.hide();
        },

        /**
         * Adds a new class as entered by user,
         * and saves changes to the database.
         */
        addNewClass: function addNewClass () {
            var code = this.ui.classCode.val();
            var number = this.ui.classNumber.val();
            var studentRecord = require('./student');
            var category = require('./assignment/category');

            //this.model.add([{
            //    classCode: code,
            //    classNumber: number,
            //    section: '0',
            //    students: studentRecord,
            //    categories: category
            //}
            //]);

            var Course = Backbone.Model.extend({
                // Needs proper ID attribute and root url
                idAttribute: "_id",
                urlRoot: "/api/Courses"
            });

            var course = new Course();
            course.set({
                classCode: code,
                classNumber: number,
                section: '0',
                start: Date,
                end: Date,
                year: '2015',
                term: 'Spring',
                colloquialUrl: code + '-' + number + '-0',
                categories: category,
                students: studentRecord
            });

            course.save();

            this.ui.dialog.hide();
            this.ui.modifyClassButton.show();
            Backbone.emulateHTTP = true;
            this.model.save();
        },

        /**
         * Shows the Add New Class dialog on click.
         */
        showAddNewClass: function showDialog() {
            this.ui.dialog.show();
            this.ui.classCode.val(this.model.get('classCode'));
            this.ui.classNumber.val(this.model.get('classNumber'));
            this.ui.addNewClassButton.hide();
        },

        /**
         * Closes the Add New Class dialog.
         */
        closeAddNewClass: function () {
            this.ui.dialog.hide();
            this.ui.addNewClassButton.show();
        }
    });

    App.Router.route("addNewClass", "home", function() {
        App.UserCourses.fetch().then(function() {
            var coursesList = App.UserCourses;
            var addNewClassView = new AddNewClassView({
                model: coursesList
            });
            App.PopupRegion.show(addNewClassView);
        });
    });
});
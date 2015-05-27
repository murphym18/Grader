/**
 * Event handler for the add new student view.
 * @author Grant Plaster
 */

define(['app/app', 'text!templates/addNewStudentView.hbs', ], function(App, template) {

    var AddStudentView = App.Mn.ItemView.extend({
        model: App.Course,
        template: App.Handlebars.compile(template),
        ui: {
            'addStudentButton' : '.addStudentButton',
            'ok' : '.ok',
            'cancel' : '.cancel',
            'dialog' : '.popup-dialog',
            'studentFirstName' : '.studentFirstName',
            'studentLastName' : '.studentLastName',
            'studentID' : '.studentID',
            'studentNickname' : '.studentNickname',
            'studentGroup' : '.studentGroup',
            'studentEmail' : '.studentEmail',
            'studentPhone' : '.studentPhone'

        },

        /**
         * Hides the dialog on initial load
         *
         * @this {AddStudentView}
         */
        onShow : function(){
            this.ui.dialog.hide();
        },
        events : {
           'click @ui.addStudentButton' :  'showAddStudent',
            'click @ui.ok' :  'addStudentInfo',
            'click @ui.cancel' :  'closeAddStudent'
        },

        /**
         * Hides the pop-up button to display fields for adding student data.
         *
         * @this {AddStudentView}
         */
        showAddStudent : function() {
            this.ui.dialog.show();
            this.ui.addStudentButton.hide();

            //this.ui.studentFirstName.val(this.model.get('first'));
            //this.ui.studentLastName.val(this.model.get('last'));
            //this.ui.studentID.val(this.model.get('emplId'));
            //this.ui.studentEmail.val(this.model.get('email'));
            //this.ui.studentPhone.val(this.model.get('phone'));
        },

        /**
         * Saves new student data in the database.
         *
         * @this {AddStudentView}
         */
        addStudentInfo : function () {

            //var firstName = this.ui.studentFirstName.val();
            //var lastName = this.ui.studentLastName.val();
            //var id = this.ui.studentID.val();
            //var nickname = this.ui.studentNickname;
            //var group = this.ui.studentGroup;
            //var email = this.ui.studentEmail.val();
            //var phone = this.ui.studentPhone;

            var newStudent = {};

            if (this.ui.studentFirstName.val())
                newStudent.first = this.ui.studentFirstName.val();

            if (this.ui.studentLastName.val())
                newStudent.last = this.ui.studentLastName.val();

            if (this.ui.studentID.val())
                newStudent.emplId = this.ui.studentID.val();

            if (this.ui.studentNickname.val())
                newStudent.nickname = this.ui.studentNickname.val();

            if (this.ui.studentGroup.val())
                newStudent.group = this.ui.studentGroup.val();

            if (this.ui.studentEmail.val())
                newStudent.email = this.ui.studentEmail.val();

            if (this.ui.studentPhone.val())
                newStudent.phone = this.ui.studentPhone.val();

            this.model.get('students').push(newStudent);

            this.ui.dialog.hide();
            Backbone.emulateHTTP = true;
            var self = this;
            this.model.save().then(function(){
                self.ui.addStudentButton.show();
            });
        },

        /**
         * Closes the add student dialog without any changes to information.
         *
         * @this {AddStudentView}
         */

        closeModifyStudent : function() {
            this.ui.dialog.hide();
            this.ui.addStudentButton.show();
        },
    })

    App.Router.route("addStudent", "home", function() {
        App.UserCourses.fetch().then(function () {
            var course = App.UserCourses.at(0);
            var students = course.get('students');
            var promises = [];
            students.forEach(function(student){
                var url = '/api/Users?_id=' + student.user;
                var p = App.$.ajax({
                    url: url
                });
                promises.push(p);
            });
            App.Q.all(promises).then(function(arr) {
                arr = App._.flatten(arr);
                for(var i = 0; i < arr.length; ++i) {
                    students[i].user = arr[i];
                }
                var addView = new AddStudentView({
                    model: course
                });
                App.PopupRegion.show(addView);
            })
        });
    });
});
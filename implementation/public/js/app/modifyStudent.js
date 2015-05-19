/**
 * Event handler for the modify class view.
 * @author Grant Plaster
 */

define(['app/app', 'text!templates/modifyStudentView.hbs', ], function(App, template) {

    var ModifyStudentView = App.Mn.ItemView.extend({
        model: App.Course,
        template: App.Handlebars.compile(template),
        ui: {
            'modifyStudentButton' : '.modifyStudentButton',
            'ok' : '.ok',
            'cancel' : '.cancel',
            'dialog' : '.popup-dialog',
            'studentFirstName' : '.studentFirstName',
            'studentLastName' : '.studentLastName',
            'studentID' : '.studentID',
            //'studentNickname' : '.studentNickname',
            //'studentGroup' : '.studentGroup',
            'studentEmail' : '.studentEmail',
            //'studentPhone' : '.studentPhone'

        },

        /**
         * Hides the dialog on initial load
         *
         * @this {ModifyStudentView}
         */
        onShow : function(){
            this.ui.dialog.hide();
        },
        events : {
           'click @ui.modifyStudentButton' :  'showModifyStudent',
            'click @ui.ok' :  'updateStudentInfo',
            'click @ui.cancel' :  'closeModifyStudent'
        },

        /**
         * Hides the pop-up button to display fields for modifying student data.
         * Fields are automatically filled with existing student data for the selected student.
         *
         * @this {ModifyStudentView}
         */
        showModifyStudent : function() {
            this.ui.dialog.show();
            this.ui.modifyStudentButton.hide();

            if (this.model.get('students')[1].first)
                this.ui.studentFirstName.val(this.model.get('students')[1].first);
            else
                this.ui.studentFirstName.val(this.model.get('students')[1].user.first);

            this.ui.studentLastName.val(this.model.get('students')[1].first);
            this.ui.studentID.val(this.model.get('students').emplId);
            this.ui.studentEmail.val(this.model.get('students').email);

            //this.ui.studentFirstName.val(this.model.get('first'));
            //this.ui.studentLastName.val(this.model.get('last'));
            //this.ui.studentID.val(this.model.get('emplId'));
            //this.ui.studentEmail.val(this.model.get('email'));
            //this.ui.studentPhone.val(this.model.get('phone'));
        },

        /**
         * Saves any changes to the selected student data in the database.
         *
         * @this {ModifyStudentView}
         */
        updateStudentInfo : function () {

            var firstName = this.ui.studentFirstName.val();
            var lastName = this.ui.studentLastName.val();
            var id = this.ui.studentID.val();
            //var nickname = this.ui.studentNickname;
            //var group = this.ui.studentGroup;
            var email = this.ui.studentEmail.val();
            //var phone = this.ui.studentPhone;

            this.model.set({"first": firstName});
            this.model.set({"last": lastName});
            this.model.set({"emplId": id});
            //this.model.set({"studentNickname": nickname});
            //this.model.set({"studentGroup": group});
            this.model.set({"email": email});
            //this.model.set({"studentPhone": phone});
            this.ui.dialog.hide();
            this.ui.modifyStudentButton.show();

            Backbone.emulateHTTP = true;
            this.model.save();
        },

        /**
         * Closes the modify student dialog without any changes to information.
         *
         * @this {ModifyStudentView}
         */

        closeModifyStudent : function() {
            this.ui.dialog.hide();
            this.ui.modifyStudentButton.show();
        },
    })

    App.Router.route("modifyStudent", "home", function() {
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
                var modifyView = new ModifyStudentView({
                    model: course
                });
                App.PopupRegion.show(modifyView);
            })
        });
    });
});
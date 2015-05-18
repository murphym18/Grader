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
        onShow : function(){
            this.ui.dialog.hide();
        },
        events : {
           'click @ui.modifyStudentButton' :  'showModifyStudent',
            'click @ui.ok' :  'updateStudentInfo',
            'click @ui.cancel' :  'closeModifyStudent'
        },
        showModifyStudent : function() {
            this.ui.dialog.show();
            this.ui.modifyStudentButton.hide();

            this.ui.studentFirstName.val(this.model.get('first'));
            this.ui.studentLastName.val(this.model.get('last'));
            this.ui.studentID.val(this.model.get('emplId'));
            this.ui.studentEmail.val(this.model.get('email'));
            //this.ui.studentPhone.val(this.model.get('phone'));

        },
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
        },

        closeModifyStudent : function() {
            this.ui.dialog.hide();
            this.ui.modifyStudentButton.show();
        },
    })

    App.Router.route("modifyStudent", "home", function() {
        App.$.ajax({
            url: '/api/Users'
        }).done(function(data) {
            var props = data[0];
            props.url = '/api/Users/' + props.colloquialUrl;
            var course = new App.Backbone.Model(props);
            console.dir(course);
            var modifyView = new ModifyStudentView({
                model: course
            });
            App.PopupRegion.show(modifyView);
            
        });
        
        //    layout = App.show(new App.StandardLayoutView());
        //var mainView = new App.Marionette.ItemView({
        //    template: App.Handlebars.compile(template)
        //});
        //layout.getRegion('main').show(mainView);
        //layout.getRegion('header').show(new TopNavView);
    });
});


//<script>
//// TODO: change from canned data to real data
//var fillIn = function (graderClass) {
//    $("#classCode").val(graderClass.classCode);
//    $("#classNumber").val(graderClass.classNumber);
//};
//
//$(document).ready(function () {
//    var exampleClass = {};
//    exampleClass.classCode = "CPE";
//    exampleClass.classNumber = "101";
//
//    fillIn(exampleClass);
//});
//</script>
//
//<script type="text/javascript">
//(function() {
//    // Get the page and dialog layout
//    var dialog = document.getElementById('popup-dialog');
//
//    // Show the Modal dialog when the button is clicked
//    document.getElementById('addClass').onclick = function() {
//        dialog.show();
//    };
//
//
//    // Event handler for the OK button on the dialog
//    document.getElementById('ok').onclick = function() {
//        console.log('OK Button Clicked!');
//
//        var className = document.getElementById('classCode').value
//            + " " + document.getElementById('classNumber').value;
//
//        // Simple input validation (empty class code or number disallowed)
//        if (document.getElementById('classCode').value === '' ||
//            document.getElementById('classNumber').value === '') {
//            window.alert('Please enter class code AND number.');
//        }
//        else {
//            // Close the Modal dialog and show class name entered
//            dialog.close();
//            window.alert('The following change has been made:\n' +
//            'Modified class Name: [' + className + ']');
//        }
//    };
//
//    // Event handler for the Cancel button
//    document.getElementById('cancel').onclick = function() {
//        dialog.close();
//    };
//})();
//
//</script>
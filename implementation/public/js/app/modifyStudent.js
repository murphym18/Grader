define(['app/app', 'text!templates/modifyStudentView.hbs', ], function(App, template) {

    var ModifyStudentView = App.Mn.ItemView.extend({
        model: App.Course,
        template: App.Handlebars.compile(template),
        ui: {
            'modifyStudentButton' : '.modifyStudentButton',
            'ok' : '.ok',
            'cancel' : '.cancel',
            'dialog' : '.popup-dialog'
        },
        onShow : function(){
            this.ui.dialog.hide();
        },
        events : {
           'click @ui.modifyStudentButton' :  'showModifyStudent',
            'click @ui.ok' :  'closeModifyStudent',
            'click @ui.cancel' :  'closeModifyStudent'

        },
        showModifyStudent : function() {
            this.ui.dialog.show();
            this.ui.modifyClassButton.hide();
        },
        closeModifyStudent : function() {
            this.ui.dialog.hide();
            this.ui.modifyClassButton.show();
        }

        //onShow : {
        //    //this.ui.modifyClassButton.on("click", fun)
        //}
    })

    App.Router.route("modifyStudent", "home", function() {
        var modifyView = new ModifyStudentView();
        App.show(modifyView);
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
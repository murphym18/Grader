define(['app/app', 'text!templates/modifyAssignmentView.hbs', ], function(App, template) {

    var ModifyAssignmentView = App.Mn.ItemView.extend({
        model: App.Assignment,
        template: App.Handlebars.compile(template),
        ui: {
            'modifyAssignmentButton' : '.modifyAssignmentButton',
            'ok' : '.ok',
            'cancel' : '.cancel',
            'dialog' : '.popup-dialog',
            'assignmentName' : '.assignmentName',
            'assignmentWeight' : '.assignmentWeight',
            'assignmentTotalScore' : '.assignmentTotalScore',
            'category' : '.category'
        },
        onShow : function(){
            this.ui.dialog.hide();
        },
        events : {
           'click @ui.modifyAssignmentButton' :  'showModifyAssignment',
            'click @ui.ok' :  'closeModifyAssignment',
            'click @ui.cancel' :  'closeModifyAssignment'

        },
        updateAssignmentInfo : function() {

        },
        showModifyAssignment : function() {
            this.ui.dialog.show();
            this.ui.modifyAssignmentButton.hide();
            this.ui.assignmentName.val(this.model.get('categories')[1].assignments[0].name);
            //this.ui.assignmentWeight.val(this.model.get('categories')[1].assignments[0].weight);
            this.ui.assignmentTotalScore.val(this.model.get('categories')[1].assignments[0].rawPoints);
            //this.ui.category.val();
        },
        closeModifyAssignment : function() {
            this.ui.dialog.hide();
            this.ui.modifyAssignmentButton.show();
        }

        //onShow : {
        //    //this.ui.modifyClassButton.on("click", fun)
        //}
    })

    App.Router.route("modifyAssingment", "home", function() {
        App.$.ajax({
            url: '/api/Courses'
        }).done(function (data) {
            var props = data[0];
            props.url = '/api/Courses/' + props.colloquialUrl;
            var course = new App.Backbone.Model(props);
            console.dir(course);
            var modifyView = new ModifyAssignmentView({
                model: course
            });
            App.PopupRegion.show(modifyView);
        });
    });
});
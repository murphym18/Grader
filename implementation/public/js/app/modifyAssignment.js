define(['app/app', 'text!templates/modifyAssignmentView.hbs', ], function(App, template) {

    var ModifyAssingmentView = App.Mn.ItemView.extend({
        model: App.Assignment,
        template: App.Handlebars.compile(template),
        ui: {
            'modifyAssignmentButton' : '.modifyAssignmentButton',
            'ok' : '.ok',
            'cancel' : '.cancel',
            'dialog' : '.popup-dialog'
        },
        onShow : function(){
            this.ui.dialog.hide();
        },
        events : {
           'click @ui.modifyClassButton' :  'showModifyAssignment',
            'click @ui.ok' :  'closeModifyAssignment',
            'click @ui.cancel' :  'closeModifyAssignment'

        },
        showModifyAssignment : function() {
            this.ui.dialog.show();
            this.ui.modifyAssignmentButton.hide();
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
        var modifyView = new ModifyAssignmentView();
        App.show(modifyView);
        //    layout = App.show(new App.StandardLayoutView());
        //var mainView = new App.Marionette.ItemView({
        //    template: App.Handlebars.compile(template)
        //});
        //layout.getRegion('main').show(mainView);
        //layout.getRegion('header').show(new TopNavView);
    });
});
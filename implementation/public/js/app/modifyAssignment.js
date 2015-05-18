define(['app/app', 'text!templates/modifyAssignmentView.hbs', ], function(App, template) {
    var currentAssignment;

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
            'click @ui.ok' :  'saveModifyAssignment',
            'click @ui.cancel' :  'closeModifyAssignment'

        },
        showModifyAssignment : function() {
            var ui = this.ui;
            this.ui.dialog.show();
            this.ui.modifyAssignmentButton.hide();
            //this.ui.assignmentName.val(this.model.get('categories')[1].assignments[0].name);
            //this.ui.assignmentWeight.val(this.model.get('categories')[1].assignments[0].weight);
            //this.ui.assignmentTotalScore.val(this.model.get('categories')[1].assignments[0].rawPoints);
            App.UserCourses.fetch().then( function() {
                var course = App.UserCourses.at(0);

                var categories = course.get('categories');

                var catValues = [];
                catValues.push('');
                App._.forEach(categories, function(category) {
                    catValues.push(category.name);
                });

                $.each(catValues, function(key, value) {   
                     ui.category
                         .append($("<option></option>")
                         .text(value)); 
                });
                currentAssignment = categories[1].assignments[0].name;
                ui.assignmentName.val(categories[1].assignments[0].name);
                ui.assignmentTotalScore.val(categories[1].assignments[0].rawPoints);
            });
        },
        saveModifyAssignment : function() {
            var ui = this.ui;

            App.UserCourses.fetch().then( function() {
                var reqAssignName = currentAssignment;

                var course = App.UserCourses.at(0);

                var categories = course.get('categories');
            
                var assignment = $.grep(categories.assignments, function(e){ return e.name == reqAssignName; })[0];

                assignment.name = ui.assignmentName.val();
                category.rawPoints = ui.assignmentTotalScore.val();

                course.set("categories", categories);
                course.save();
            });
            this.closeModifyAssignment();
        },
        closeModifyAssignment : function() {
            this.ui.dialog.hide();
            this.ui.modifyAssignmentButton.show();
        }

        //onShow : {
        //    //this.ui.modifyClassButton.on("click", fun)
        //}
    })

    App.Router.route("modifyAssignment", "home", function() {
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
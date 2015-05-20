define(['app/app', 'text!templates/newAssignmentView.hbs', ], function(App, template) {
    var currentAssignment;

    var newAssignmentView = App.Mn.ItemView.extend({
        model: App.Assignment,
        template: App.Handlebars.compile(template),
        ui: {
            'newAssignmentButton' : '.newAssignmentButton',
            'ok' : '.ok',
            'cancel' : '.cancel',
            'dialog' : '.popup-dialog',
            'assignmentName' : '.assignmentName',
            'assignmentWeight' : '.assignmentWeight',
            'assignmentTotalScore' : '.assignmentTotalScore',
            'category' : '.category'
        },
        /**
         * Hides the dialog on initial load
         */
        onShow : function(){
            this.ui.dialog.hide();
        },
        events : {
           'click @ui.newAssignmentButton' :  'showNewAssignment',
            'click @ui.ok' :  'saveNewAssignment',
            'click @ui.cancel' :  'closeNewAssignment'

        },
        /**
         * Shows the new Assignment dialog on click.
         */
        showNewAssignment : function() {
            var ui = this.ui;
            this.ui.dialog.show();
            this.ui.newAssignmentButton.hide();
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
                
            });
        },
        /**
         * Updates the assignment information as entered by user,
         * and saves changes to the database.
         */
        saveNewAssignment : function() {
            var ui = this.ui;

            App.UserCourses.fetch().then( function() {
                var reqAssignName = currentAssignment;

                var course = App.UserCourses.at(0);

                var categories = course.get('categories');
                var temp_assignment = {
                    dueDate : new Date(2015, 4, 19),
                    name : ui.assignmentName.val(),
                    rawPoints : ui.assignmentTotalScore.val()
                };
                categories[1].assignments.push(temp_assignment);
                //categories[1].assignments[0].name = ui.assignmentName.val();
                //categories[1].assignments[0].rawPoints = ui.assignmentTotalScore.val();
                Backbone.emulateHTTP = true;
                course.save();
            });
            this.closeNewAssignment();
        },
        /**
         * Closes the new Assignment dialog.
         */
        closeNewAssignment : function() {
            this.ui.dialog.hide();
            this.ui.newAssignmentButton.show();
        }

    })

    App.Router.route("newAssignment", "home", function() {
        App.$.ajax({
            url: '/api/Courses'
        }).done(function (data) {
            var props = data[0];
            props.url = '/api/Courses/' + props.colloquialUrl;
            var course = new App.Backbone.Model(props);
            console.dir(course);
            var newView = new newAssignmentView({
                model: course
            });
            App.PopupRegion.show(newView);
        });
    });
});
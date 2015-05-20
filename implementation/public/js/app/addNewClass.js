/**
 * Event handler for the add new class view.
 * @author Mike Ryu
 */
define(['app/app', 'text!templates/addNewClassView.hbs' ], function(App, template) {
    var defaultClass = {
        "_id": ObjectID("555bf556790f01832ac30fe4"),
        "classCode": "ART",
        "classNumber": "388",
        "section": "9",
        "start": ISODate("2016-03-30T07:00:00.000Z"),
        "end": ISODate("2016-06-12T07:00:00.000Z"),
        "colloquialUrl": "ART-388-9-Spring2016",
        "minCredit": 60,
        "fColor": [
            "rgba(255,0,0,0.8)",
            "rgba(255,0,0,0.8)",
            "rgba(255,0,0,0.9)",
            "rgba(220,220,220,1)"
        ],
        "dColor": [
            "rgba(255,0,0,0.5)",
            "rgba(255,0,0,0.6)",
            "rgba(255,0,0,0.7)",
            "rgba(220,220,220,0.7)"
        ],
        "cColor": [
            "rgba(255, 165, 0, 0.5)",
            "rgba(255, 165, 0, 0.8)",
            "rgba(255, 165, 0, 0.75)",
            "rgba(255, 165, 0, 1)"
        ],
        "bColor": [
            "rgba(255, 255, 0,0.5)",
            "rgba(255, 255, 0,0.8)",
            "rgba(255, 255, 0,0.75)",
            "rgba(255, 255, 0,1)"
        ],
        "aColor": [
            "rgba(0,255,0,0.5)",
            "rgba(0,255,0,0.8)",
            "rgba(0,255,0,0.75)",
            "rgba(0,255,0,1)"
        ],
        "minD": 60,
        "minC": 70,
        "minB": 80,
        "minA": 90,
        "roles":[
            {
                "name":"NONE",
                "_id":"555bf557790f01832ac31a5e",
                "users":[],
                "permissions":[]
                
            }
        ],
        "students": [],
        "categories": [],
        "__v": 0
    };
    var AddNewClassView = App.Mn.ItemView.extend({
        model: App.Course,
        //model: App.UserCourses,
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
            this.ui.addNewClassButton.show();
            this.ui.dialog.hide();
        },

        /**
         * Adds a new class as entered by user,
         * and saves changes to the database.
         */
        addNewClass: function addNewClass () {
            if ((this.ui.classCode.val() + '').length === 0 ||
                (this.ui.classNumber.val() + '').length === 0) {
                alert("Please enter BOTH class code and number.");
                console.log("ERROR");
            }
            else {
                var code = this.ui.classCode.val();
                var number = this.ui.classNumber.val();

                //this.model.add([{
                //    classCode: code,
                //    classNumber: number,
                //    section: '0',
                //    start: Date,
                //    end: Date,
                //    year: '2015',
                //    term: 'Spring',
                //    colloquialUrl: code + '-' + number + '-0'
                //}
                //]);

                var Course = Backbone.Model.extend({
                    // Needs proper ID attribute and root url
                    idAttribute: "_id",
                    urlRoot: "/api/Courses"
                });

                var course = new Course();
                course.set(defaultClass);
                course.set({
                    classCode: code,
                    classNumber: number,
                    section: '0',
                    start: new Date(),
                    end: new Date(),
                    year: '2015',
                    term: 'Spring',
                    colloquialUrl: code + '-' + number + '-0'
                });

                this.ui.dialog.hide();
                this.ui.addNewClassButton.show();

                // Backbone.emulateHTTP = true;
                course.save();
                //this.model.save();
            }
        },

        /**
         * Shows the Add New Class dialog on click.
         */
        showAddNewClass: function showDialog() {
            this.ui.dialog.show();
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
            App.$.ajax({
                url: '/api/Users/admin'
            }).done(function(data) {
                defaultClass.roles.users.push(data);
                var course = App.UserCourses.at(0);
                //var course = App.UserCourses;
                var addNewClassView = new AddNewClassView({
                    model: course
                });
            App.PopupRegion.show(addNewClassView);
            })
            
        });
    });
});
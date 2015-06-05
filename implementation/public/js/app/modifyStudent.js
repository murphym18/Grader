/**
 * Event handler for the modify student view.
 * @author Grant Plaster
 */



define(function (require) {
    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('util/backbone-helper');
    var Hbs = require('handlebars');
    var Mn = require('backbone.marionette');
    var Q = require('q');
    var Radio = require('backbone.radio');
    var pageChannel = Radio.channel('page');
    var courseChannel = Radio.channel('course');
    var template = require('text!templates/modifyStudentView.hbs');
    var alertTemplate = require('text!ctemplates/alert-block.hbs');

    var Course = require('course/model/course');

    return Mn.ItemView.extend({
        tagName: 'div',
        className: 'modifyStudent modal-dialog  modal-lg',
        model:  Backbone.model,
        template: Hbs.compile(template),
        ui: {
            'modifyStudentButton': '.modifyStudentButton',
            'save': '.save',
            'cancel': '.cancel',
            'dialog': '.popup-dialog',
            'studentFirstName': '.studentFirstName',
            'studentLastName': '.studentLastName',
            'studentID': '.studentID',
            'studentNickname': '.studentNickname',
            'studentGroup': '.studentGroup',
            'studentEmail': '.studentEmail',
            'studentPhone': '.studentPhone'

        },

        events: {
            'click @ui.save': 'saveAndClose',
            'change @ui.studentFirstName': 'updateStudentFirstName',
            'change @ui.studentLastName': 'updateStudentLastName',
            'change @ui.studentID': 'updateStudentID',
            'change @ui.studentNickname': 'updateStudentNickname',
            'change @ui.studentGroup': 'updateStudentGroup',
            'change @ui.studentEmail': 'updateStudentEmail',
            'change @ui.studentPhone': 'updateStudentPhone'
        },

        // Grant Campanelli Added
        initialize: function(options) {
            this.model = courseChannel.request('current:course');
            this.student = options.student;
            console.log(this.student);
        },
        // Grant Campanelli Added
        render: function() {
            var students = this.model.students;
            var self = this;
            this.studentToModify = [];
            students.each(function(s){
                if(self.options.student == s.get('emplId')) {
                    self.studentToModify = s;
                }
            });

            if(!this.studentToModify) {
                console.log("error, student wasnt found for delete");
                return;
            }

            var first = this.studentToModify.get('first')
            var last = this.studentToModify.get('last')
            var id = this.studentToModify.get('emplId')
            var nickname = this.studentToModify.get('nickname')
            var group = this.studentToModify.get('group')
            var email = this.studentToModify.get('email')
            var phone  = this.studentToModify.get('phone')


            this.$el.html(this.template({
                first: first,
                last: last,
                id : id,
                nickname : nickname,
                group : group,
                email : email,
                phone : phone
            }));

            return this;
        },

        setStudentValue : function (attribute, value) {
            var students = this.model.students;
            var self = this;

            students.each(function(s){
                if(self.studentToModify.get('emplId') == s.get('emplId')) {
                    console.log('emplID', self.studentToModify.get('emplId'))
                    s.set(attribute, value);
                    s.save();
                    return;
                }
            });
        },

        //updateStudentInfo : function() {},
        updateStudentFirstName : function() {
            newValue = $('.studentFirstName').val();
            this.setStudentValue('first', newValue);
            //this.model.save();
            console.log("Saved New Name", newValue)
            //console.log($('.studentFirstName').val())
        },
        updateStudentLastName : function() {
            if (this.ui.studentLastName.val())
                this.model.get('students')[1].last = this.ui.studentLastName.val();
        },
        updateStudentID  : function() {
            if (this.ui.studentID.val())
                this.model.get('students')[1].emplId = this.ui.studentID.val();
        },
        updateStudentNickname : function() {
            if (this.ui.studentNickname.val())
                this.model.get('students')[1].nickname = this.ui.studentNickname.val();
        },
        updateStudentGroup : function() {
            if (this.ui.studentGroup.val())
                this.model.get('students')[1].group = this.ui.studentGroup.val();
        },
        updateStudentEmail : function() {
            if (this.ui.studentEmail.val())
                this.model.get('students')[1].email = this.ui.studentEmail.val();
        },
        updateStudentPhone : function() {
            if (this.ui.studentPhone.val())
                this.model.get('students')[1].phone = this.ui.studentPhone.val();
        },

        /**
         * Saves any changes to the selected student data in the database.
         *
         * @this {ModifyStudentView}
         */
        //updateStudentInfo: function () {
        //
        //    var firstName = this.ui.studentFirstName.val();
        //    var lastName = this.ui.studentLastName.val();
        //    var id = this.ui.studentID.val();
        //    var nickname = this.ui.studentNickname;
        //    var group = this.ui.studentGroup;
        //    var email = this.ui.studentEmail.val();
        //    var phone = this.ui.studentPhone;
        //
        //    if (this.ui.studentFirstName.val())
        //        this.model.get('students')[1].first = this.ui.studentFirstName.val();
        //
        //    if (this.ui.studentLastName.val())
        //        this.model.get('students')[1].last = this.ui.studentLastName.val();
        //
        //    if (this.ui.studentID.val())
        //        this.model.get('students')[1].emplId = this.ui.studentID.val();
        //
        //    if (this.ui.studentNickname.val())
        //        this.model.get('students')[1].nickname = this.ui.studentNickname.val();
        //
        //    if (this.ui.studentGroup.val())
        //        this.model.get('students')[1].group = this.ui.studentGroup.val();
        //
        //    if (this.ui.studentEmail.val())
        //        this.model.get('students')[1].email = this.ui.studentEmail.val();
        //
        //    if (this.ui.studentPhone.val())
        //        this.model.get('students')[1].phone = this.ui.studentPhone.val();
        //
        //    //this.ui.dialog.hide();
        //    //Backbone.emulateHTTP = true;
        //    var self = this;
        //    this.model.save().then(function () {
        //        self.ui.modifyStudentButton.close();
        //    });
        //    this.closeModifyStudent();
        //},

        /**
         * Closes the modify student dialog without any changes to information.
         *
         * @this {ModifyStudentView}
         */

        saveAndClose : function() {
            this.closeModifyStudent()
            //this.closeModifyStudent();
        },


        closeModifyStudent: function () {
            //this.ui.dialog.hide();
           // this.ui.modifyStudentButton.show();

            var modalRegion = pageChannel.request('modalRegion');
            this.model.save().then(modalRegion.hideModal())
            var gradebook = courseChannel.request('view:gradebook');
            pageChannel.request('mainRegion').show(gradebook);
            //$('.cancel').click();
        }
    })
});

    //return Mn.ItemView.extend({
    //    tagName: 'div',
    //    className: 'modifyCategory modal-dialog modal-lg',
    //    template: Hbs.compile(template),
    //    ui: {
    //        'categoryName' : '.categoryName',
    //        'categoryWeight' : '.categoryWeight',
    //        'parentCategory' : '.categoryParent',
    //        'ok' : '.save',
    //        'error': '.error'
    //    },
    //
    //    initialize: function(options) {
    //        this.model = courseChannel.request('current:course');
    //        this.category = options.category;
    //        this.alertTemplate = Hbs.compile(alertTemplate);
    //        this.optionTemplate = Hbs.compile("<option value='{{path}}'>{{path}}</option>");
    //    },
    //
    //    /**
    //     * Hide the modify category dialog on initial load. Also,
    //     * create a dropdown menu for testing purposes that allows
    //     * the user to select which category to modify.
    //     *
    //     * @author Matt Bleifer
    //     */
    //    onShow : function(){
    //        var ui = this.ui;
    //        var self = this;
    //
    //        var reqCatPath = this.category;
    //
    //        var categories = this.model.get('categories');
    //        var category = categories.findWhere({"path" : reqCatPath});
    //
    //        categories.comparator = function(a, b) {
    //            a = a.get("path");
    //            b = b.get("path");
    //            return a > b ?  1
    //                : a < b ? -1
    //                :          0;
    //        }
    //
    //        ui.parentCategory.append(self.optionTemplate());
    //        categories.sort().each(function(catListItem) {
    //            if (catListItem.get("path").indexOf(category.get("path")) !== 0)
    //                ui.parentCategory.append(self.optionTemplate(catListItem.attributes));
    //        });
    //
    //        var path = category.get("path").split('#');
    //        path.pop();
    //        path = path.join("#");
    //
    //        ui.parentCategory.val(path).attr("selected");
    //
    //        ui.categoryName.val(category.get("name"));
    //        ui.categoryWeight.val(category.get("weight"));
    //    },
    //    events : {
    //        'click @ui.ok' :  'saveModifyCategory',
    //        'click @ui.cancel' :  'closeModifyCategory'
    //    },
    //    /**
    //     * Gather the new values from the modify category dialog and
    //     * save them to the database.
    //     *
    //     * @author Matt Bleifer
    //     */
    //    saveModifyCategory : function() {
    //        var ui = this.ui;
    //        var self = this;
    //
    //        if (ui.categoryName.val().length === 0) {
    //            self.ui.error.html(self.alertTemplate({
    //                message: "Category name can not be empty"
    //            }));
    //            return;
    //        }
    //
    //        if (ui.categoryName.val().indexOf("#") !== -1) {
    //            self.ui.error.html(self.alertTemplate({
    //                message: "Category name can not contain a '#' sign"
    //            }));
    //            return;
    //        }
    //
    //        if (isNaN(ui.categoryWeight.val()) || ui.categoryWeight.val() < 0 || ui.categoryWeight.val() > 1) {
    //            self.ui.error.html(self.alertTemplate({
    //                message: "Category weight must be a number between 0 and 1"
    //            }));
    //            return;
    //        }
    //
    //        var reqCatPath = this.category;
    //
    //        var categories = this.model.get('categories');
    //        var category = categories.findWhere({"path" : reqCatPath});
    //        catPath = category.get("path");
    //
    //        var splitCatPath = catPath.split("#");
    //        splitCatPath.pop();
    //
    //        var splitCatListItem, newSplitPath, finalPath;
    //
    //        categories.each(function(catListItem) {
    //            splitCatListItem = catListItem.get("path").split("#");
    //            newSplitPath = _.difference(splitCatListItem, splitCatPath);
    //            finalPath = newSplitPath.join("#");
    //
    //            if (catListItem.get("path").indexOf(catPath) === 0) {
    //                if (newSplitPath.length === 0)
    //                    catListItem.set("path", ui.parentCategory.val());
    //                else
    //                    catListItem.set("path", ui.parentCategory.val() + "#" + finalPath);
    //            }
    //        });
    //
    //        category.set({
    //            name : ui.categoryName.val(),
    //            weight : ui.categoryWeight.val()
    //        });
    //        self.closeModifyCategory();
    //    },
    //    /**
    //     * Hide the modify category dialog. Bring the user back to the
    //     * screen to select which dialog to modify, and re-fetch
    //     * the newly updated data.
    //     *
    //     * @author Matt Bleifer
    //     */
    //    closeModifyCategory : function() {
    //        var self = this;
    //        Backbone.emulateHTTP = true;
    //        Q(this.model.save()).then(function(res) {
    //                var modalRegion = pageChannel.request('modalRegion');
    //                modalRegion.hideModal();
    //                //self.trigger("close");
    //                courseChannel.command('updateCourses');
    //            },
    //            function(err) {
    //                self.ui.error.html(self.alertTemplate({message: err.responseText}));
    //                self.ui.saveButton.button('reset');
    //            }).done();
    //    },
    //})


//define(['app/app', 'text!templates/modifyStudentView.hbs', ], function(App, template) {
//
//    var ModifyStudentView = App.Mn.ItemView.extend({
//        model: App.Course,
//        template: App.Handlebars.compile(template),
//        ui: {
//            'modifyStudentButton' : '.modifyStudentButton',
//            'ok' : '.ok',
//            'cancel' : '.cancel',
//            'dialog' : '.popup-dialog',
//            'studentFirstName' : '.studentFirstName',
//            'studentLastName' : '.studentLastName',
//            'studentID' : '.studentID',
//            'studentNickname' : '.studentNickname',
//            'studentGroup' : '.studentGroup',
//            'studentEmail' : '.studentEmail',
//            'studentPhone' : '.studentPhone'
//
//        },
//
//        /**
//         * Hides the dialog on initial load
//         *
//         * @this {ModifyStudentView}
//         */
//        onShow : function(){
//            this.ui.dialog.hide();
//        },
//        events : {
//           'click @ui.modifyStudentButton' :  'showModifyStudent',
//            'click @ui.ok' :  'updateStudentInfo',
//            'click @ui.cancel' :  'closeModifyStudent'
//        },
//
//        /**
//         * Hides the pop-up button to display fields for modifying student data.
//         * Fields are automatically filled with existing student data for the selected student.
//         *
//         * @this {ModifyStudentView}
//         */
//        showModifyStudent : function() {
//            this.ui.dialog.show();
//            this.ui.modifyStudentButton.hide();
//
//            if (this.model.get('students')[1].first)
//                this.ui.studentFirstName.val(this.model.get('students')[1].first);
//            else
//                this.ui.studentFirstName.val(this.model.get('students')[1].user.first);
//
//
//            if (this.model.get('students')[1].last)
//                this.ui.studentLastName.val(this.model.get('students')[1].last);
//            else
//                this.ui.studentLastName.val(this.model.get('students')[1].user.last);
//
//
//            if (this.model.get('students')[1].emplId)
//                this.ui.studentID.val(this.model.get('students')[1].emplId);
//            else
//                this.ui.studentID.val(this.model.get('students')[1].user.emplId);
//
//            if (this.model.get('students')[1].nickname)
//                this.ui.studentNickname.val(this.model.get('students')[1].nickname);
//            else
//                this.ui.studentNickname.val(this.model.get('students')[1].user.nickname);
//
//
//            if (this.model.get('students')[1].group)
//                this.ui.studentGroup.val(this.model.get('students')[1].group);
//            else
//                this.ui.studentGroup.val(this.model.get('students')[1].user.group);
//
//
//            if (this.model.get('students')[1].email)
//                this.ui.studentEmail.val(this.model.get('students')[1].email);
//            else
//                this.ui.studentEmail.val(this.model.get('students')[1].user.email);
//
//
//            if (this.model.get('students')[1].phone)
//                this.ui.studentPhone.val(this.model.get('students')[1].phone);
//            else
//                this.ui.studentPhone.val(this.model.get('students')[1].user.phone);
//
//
//
//            //this.ui.studentFirstName.val(this.model.get('first'));
//            //this.ui.studentLastName.val(this.model.get('last'));
//            //this.ui.studentID.val(this.model.get('emplId'));
//            //this.ui.studentEmail.val(this.model.get('email'));
//            //this.ui.studentPhone.val(this.model.get('phone'));
//        },
//
//        /**
//         * Saves any changes to the selected student data in the database.
//         *
//         * @this {ModifyStudentView}
//         */
//        updateStudentInfo : function () {
//
//            //var firstName = this.ui.studentFirstName.val();
//            //var lastName = this.ui.studentLastName.val();
//            //var id = this.ui.studentID.val();
//            //var nickname = this.ui.studentNickname;
//            //var group = this.ui.studentGroup;
//            //var email = this.ui.studentEmail.val();
//            //var phone = this.ui.studentPhone;
//
//            if (this.ui.studentFirstName.val())
//                this.model.get('students')[1].first = this.ui.studentFirstName.val();
//
//            if (this.ui.studentLastName.val())
//                this.model.get('students')[1].last = this.ui.studentLastName.val();
//
//            if (this.ui.studentID.val())
//                this.model.get('students')[1].emplId = this.ui.studentID.val();
//
//            if (this.ui.studentNickname.val())
//                this.model.get('students')[1].nickname = this.ui.studentNickname.val();
//
//            if (this.ui.studentGroup.val())
//                this.model.get('students')[1].group = this.ui.studentGroup.val();
//
//            if (this.ui.studentEmail.val())
//                this.model.get('students')[1].email = this.ui.studentEmail.val();
//
//            if (this.ui.studentPhone.val())
//                this.model.get('students')[1].phone = this.ui.studentPhone.val();
//
//            this.ui.dialog.hide();
//            Backbone.emulateHTTP = true;
//            var self = this;
//            this.model.save().then(function(){
//                self.ui.modifyStudentButton.show();
//            });
//        },
//
//        /**
//         * Closes the modify student dialog without any changes to information.
//         *
//         * @this {ModifyStudentView}
//         */
//
//        closeModifyStudent : function() {
//            this.ui.dialog.hide();
//            this.ui.modifyStudentButton.show();
//        },
//    })
//
//    App.Router.route("modifyStudent", "home", function() {
//        App.UserCourses.fetch().then(function () {
//            var course = App.UserCourses.at(0);
//            var students = course.get('students');
//            var promises = [];
//            students.forEach(function(student){
//                var url = '/api/Users?_id=' + student.user;
//                var p = App.$.ajax({
//                    url: url
//                });
//                promises.push(p);
//            });
//            App.Q.all(promises).then(function(arr) {
//                arr = App._.flatten(arr);
//                for(var i = 0; i < arr.length; ++i) {
//                    students[i].user = arr[i];
//                }
//                var modifyView = new ModifyStudentView({
//                    model: course
//                });
//                App.PopupRegion.show(modifyView);
//            })
//        });
//    });
//});
define(['app/app', 'text!templates/modifyCategory.hbs', ], function(App, template) {

    var ModifyCategoryView = App.Mn.ItemView.extend({
        model: App.Course,
        template: App.Handlebars.compile(template),
        ui: {
            'modifyCategoryButton' : '.modifyCategoryButton',
            'ok' : '.ok',
            'cancel' : '.cancel',
            'dialog' : '.popup-dialog',
            'categoryName' : '.categoryName',
            'categoryWeight' : '.categoryWeight',
            'parentCategory' : '.parentCategory',
            'category' : '.category',
            'catSelector' : '.cat-selector'
        },
        onShow : function(){
            var ui = this.ui;

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
            this.ui.dialog.hide();
        },
        events : {
            'click @ui.modifyCategoryButton' :  'showModifyCategory',
            'click @ui.ok' :  'saveModifyCategory',
            'click @ui.cancel' :  'closeModifyCategory'
        },
        showModifyCategory : function() {
            var ui = this.ui;

            var reqCatName = ui.category.val();

            App.UserCourses.fetch().then( function() {
                var course = App.UserCourses.at(0);

                var categories = course.get('categories');
                var category = $.grep(categories, function(e){ return e.name == reqCatName; })[0];

                var catValues = [];
                catValues.push('');
                App._.forEach(categories, function(category) {
                    catValues.push(category.name);
                });

                $.each(catValues, function(key, value) {   
                     ui.parentCategory
                         .append($("<option></option>")
                         .text(value)); 
                });

                var path = category.path.split('#');
                ui.parentCategory.val(path[path.length - 2]).attr("selected");

                ui.categoryName.val(category.name);
                ui.categoryWeight.val(category.weight);
            }).then( function() {
                ui.dialog.show();
                ui.modifyCategoryButton.hide();
                ui.catSelector.hide();
            });
        },
        saveModifyCategory : function() {
            var ui = this.ui;

            App.UserCourses.fetch().then( function() {
                var reqCatName = ui.category.val();

                var course = App.UserCourses.at(0);

                var categories = course.get('categories');
                var category = $.grep(categories, function(e){ return e.name == reqCatName; })[0];

                category.name = ui.categoryName.val();
                category.weight = ui.categoryWeight.val();

                course.set("categories", categories);
                course.save();
            });
            this.closeModifyCategory();
        },
        closeModifyCategory : function() {
            this.ui.dialog.hide();
            this.ui.modifyCategoryButton.hide();
            this.ui.catSelector.hide();
        },
    })

    App.Router.route("modifyCategory", "home", function() {
        App.$.ajax({
            url: '/api/Courses'
        }).done(function(data) {
            var props = data[0];
            props.url = '/api/Courses/' + props.colloquialUrl;
            var course = new App.Backbone.Model(props);
            var modifyCatView = new ModifyCategoryView({
                model: course
            });
            App.PopupRegion.show(modifyCatView);
            
        });
    });
});
define(['app/app', 'text!templates/modifyCategory.hbs', ], function(App, template) {

    var ModifyCategoryView = App.Mn.ItemView.extend({
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

            var categories = this.model.get('categories');

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

            var categories = this.model.get('categories');
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

            ui.dialog.show();
            ui.modifyCategoryButton.hide();
            ui.catSelector.hide();
        },
        saveModifyCategory : function() {
            var ui = this.ui;
            var self = this;

            var reqCatName = ui.category.val();

            var categories = this.model.get('categories');
            var category = $.grep(categories, function(e){ return e.name == reqCatName; })[0];

            category.name = ui.categoryName.val();
            category.weight = ui.categoryWeight.val();

            this.model.set("categories", categories);
            this.model.save().then(function() {
                self.closeModifyCategory();
            });
        },
        closeModifyCategory : function() {
            var self = this;

            this.ui.dialog.hide();
            this.ui.category.empty();
            this.ui.parentCategory.empty();

            App.UserCourses.fetch().then(function() {
                self.onShow();
                self.ui.modifyCategoryButton.show();
                self.ui.catSelector.show();
            });
        },
    })

    App.Router.route("modifyCategory", "home", function() {
        App.UserCourses.fetch().then(function() {
            var course = App.UserCourses.at(0);
            var modifyCatView = new ModifyCategoryView({
                model: course
            });
            App.PopupRegion.show(modifyCatView);
        });
    });
});
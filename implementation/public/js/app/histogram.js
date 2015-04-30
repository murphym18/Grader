define(['app/app', 'text!templates/histogram.hbs', 'chart'], function(App, template, chart) {
    var GradeSchema = App.Backbone.Model;//.extend({
        //defaults: {
        //    aMin: 90,
        //    bMin: 80,
        //    cMin: 70,
        //    dMin: 60
        //}
    //});
    var GradeSchemaView = App.Mn.ItemView.extend({
        model: GradeSchema,
        template : App.Handlebars.compile(template),
        ui: {
            "aMin" : '#aMinInput',
            "bMin" : '#bMinInput',
            "cMin" : '#cMinInput',
            "dMin" : '#dMinInput'
        },
        modelEvents: {
            "change" : "onShow"
        },
        onShow: function() {
            this.ui.aMin.val(this.model.get('aMin'));
            this.ui.bMin.val(this.model.get('bMin'));
            this.ui.cMin.val(this.model.get('cMin'));
            this.ui.dMin.val(this.model.get('dMin'));
        },
        events: {
            "change @ui.aMin" : "updateAMin",
            "change @ui.bMin" : "updateBMin",
            "change @ui.cMin" : "updateCMin",
            "change @ui.dMin" : "updateDMin"
        },
        updateModel : function(modelString, selector, domEvent) {
            var arg = {};
            arg[modelString] = this.ui[selector];
            this.model.set(arg);
        },
        initalize: function() {
            this.updateAMin =  App._.partial(this.updateModel, "aMin");
            this.updateBMin =  App._.partial(this.updateModel, "bMin");
            this.updateCMin =  App._.partial(this.updateModel, "cMin");
            this.updateDMin =  App._.partial(this.updateModel, "dMin");

        }
    });




    App.Router.route(("charts"), "histogram", function() {
        //var layout = App.show(new App.StandardLayoutView());

        App.show(new GradeSchemaView({
            model : new GradeSchema(
                {
                    aMin: 90,
                    bMin: 80,
                    cMin: 70,
                    dMin: 60
                }
            )
        }));
        //layout.getRegion('main').show(new App.Marionette.ItemView({
        //    template: template,
        //    updatePieChart: function() {
        //
        //    }
        //}))
    })
});
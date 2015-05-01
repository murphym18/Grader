
define(['app/app', 'text!templates/charts.hbs', 'text!templates/histogram.hbs', 'chart'], function(App, template1, template2, chart) {
    var GradeSchema = App.Backbone.Model;//.extend({
    //defaults: {
    //    aMin: 90,
    //    bMin: 80,
    //    cMin: 70,
    //    dMin: 60
    //}
    //});
    //var GraphArray = findGraphArray();
    var LetterGradeGraphView = App.Mn.ItemView.extend({
        model : App.Course,
        template : App.Handlebars.compile(template),
        modelEvents : {
            "change" : "onShow"
        },
        onShow : function () {
            var gradeArray = this.model.findGraphArray();

            //console.log(this.model.get("aColor"));
        }
    });

    var model = new App.Backbone.Model({
        findGraphArray : function() {
            return [[50, 55, 60, 65, 68, 70, 71, 75, 78, 79, 80, 83, 88, 89, 90, 91, 94], [1, 2, 3, 1, 2, 1, 1, 2, 3, 4, 1, 2, 3, 4, 1, 3, 4]];
        },
        lightred :  ["rgba(255,0,0,0.5)", "rgba(255,0,0,0.6)", "rgba(255,0,0,0.7)", "rgba(220,220,220,0.7)"],
        darkred :  ["rgba(255,0,0,0.8)", "rgba(255,0,0,0.8)", "rgba(255,0,0,0.9)", "rgba(220,220,220,1)"],
        orange : ["rgba(255, 165, 0, 0.5)", "rgba(255, 165, 0, 0.8)", "rgba(255, 165, 0, 0.75)", "rgba(255, 165, 0, 1)"],
        yellow :  ["rgba(255, 255, 0,0.5)", "rgba(255, 255, 0,0.8)", "rgba(255, 255, 0,0.75)", "rgba(255, 255, 0,1)"],
        green : ["rgba(0,255,0,0.5)", "rgba(0,255,0,0.8)", "rgba(0,255,0,0.75)", "rgba(0,255,0,1)"],
        aMin: 90,
        bMin: 80,
        cMin: 70,
        dMin: 60
    });
        //= new App.Backbone.Collecti
    //})
    var GradeSchemaView = App.Mn.ItemView.extend({
        model: GradeSchema,
        template : App.Handlebars.compile(template),
        ui: {
            "aMin" : '#aMinInput',
            "bMin" : '#bMinInput',
            "cMin" : '#cMinInput',
            "dMin" : '#dMinInput',
            "aOut" : '#aMinOutput',
            "bOut" : '#bMinOutput',
            "cOut" : '#cMinOutput',
            "dOut" : '#dMinOutput'

        },
        modelEvents: {
            "change" : "onShow"
        },
        onShow: function() {
            this.ui.aMin.val(this.model.get('aMin'));
            this.ui.bMin.val(this.model.get('bMin'));
            this.ui.cMin.val(this.model.get('cMin'));
            this.ui.dMin.val(this.model.get('dMin'));
            //this.ui.aOut.html(this.model.get('aMin'));
            //this.ui.bOut.html(this.model.get('bMin'));
            //this.ui.cOut.html(this.model.get('cMin'));
            //this.ui.dOut.html(this.model.get('dMin'));
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
            model : model
        }));
        //layout.getRegion('main').show(new App.Marionette.ItemView({
        //    template: template,
        //    updatePieChart: function() {
        //
        //    }
        //}))
    })
});
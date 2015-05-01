
define(['app/app', 'text!templates/charts.hbs', 'text!templates/letterGradeGraphics.hbs', 'text!templates/gradeSchema.hbs', 'chart'], function(App, chartTemplate, template1, template2, chart) {
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
        template : App.Handlebars.compile(template1),
        modelEvents : {
            "change" : "onShow"
        },
        //graphTitle: "A",
        onShow : function () {
            if (!this.barCtx) {
                return
            }
            var gradeArray = this.model.findGraphArray();
            var gradeData = {
                labels : gradeArray[0],
                datasets: [
                    {
                        label : "A",
                        fillColor: this.model.get('aColor')[0],
                        strokeColor: this.model.get('aColor')[1],
                        highlightFill: this.model.get('aColor')[2],
                        highlightStroke: this.model.get('aColor')[3],
                        data: gradeArray[1]

                    }
                ]
            }
            this.barChart = new Chart(this.barCtx).Bar(gradeData, NULL);
        },
        onAttach : function (){
            this.barCtx = this.$('.barChart')[0].getContext('2d');
        }
    });

    //var data = {
    //    labels: gradeArray[0],
    //    datasets: [
    //        {
    //            label: "My First dataset",
    //            fillColor: green[0],
    //            strokeColor: green[1],
    //            highlightFill: green[2],
    //            highlightStroke: green[3],
    //            data: gradeArray[1]
    //        }
    //    ]
    //};


    var model = new App.Backbone.Model({
        findGraphArray : function() {
            return [[50, 55, 60, 65, 68, 70, 71, 75, 78, 79, 80, 83, 88, 89, 90, 91, 94], [1, 2, 3, 1, 2, 1, 1, 2, 3, 4, 1, 2, 3, 4, 1, 3, 4]];
        },
        dColor :  ["rgba(255,0,0,0.5)", "rgba(255,0,0,0.6)", "rgba(255,0,0,0.7)", "rgba(220,220,220,0.7)"],
        fColor :  ["rgba(255,0,0,0.8)", "rgba(255,0,0,0.8)", "rgba(255,0,0,0.9)", "rgba(220,220,220,1)"],
        cColor : ["rgba(255, 165, 0, 0.5)", "rgba(255, 165, 0, 0.8)", "rgba(255, 165, 0, 0.75)", "rgba(255, 165, 0, 1)"],
        bColor :  ["rgba(255, 255, 0,0.5)", "rgba(255, 255, 0,0.8)", "rgba(255, 255, 0,0.75)", "rgba(255, 255, 0,1)"],
        aColor : ["rgba(0,255,0,0.5)", "rgba(0,255,0,0.8)", "rgba(0,255,0,0.75)", "rgba(0,255,0,1)"],
        aMin: 90,
        bMin: 80,
        cMin: 70,
        dMin: 60
    });
        //= new App.Backbone.Collecti
    //})
    var GradeSchemaView = App.Mn.ItemView.extend({
        model: GradeSchema,
        template : App.Handlebars.compile(template2),
        ui: {
            "aMin" : '.aMinInput',
            "bMin" : '.bMinInput',
            "cMin" : '.cMinInput',
            "dMin" : '.dMinInput',
            "aOut" : '.aMinOutput',
            "bOut" : '.bMinOutput',
            "cOut" : '.cMinOutput',
            "dOut" : '.dMinOutput'

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


    var GraphView = App.Mn.LayoutView.extend({
        template : App.Handlebars.compile(chartTemplate),
        regions : {
            graph : ".chartGraphics",
            schema : ".schema"
        }
    });

    App.Router.route(("charts"), "chart", function() {
        //var layout = App.show(new App.StandardLayoutView());
        var graphView = new GraphView();
        App.show(graphView);
        graphView.getRegion("graph").show(new LetterGradeGraphView({
            model : model
        }));
        graphView.getRegion("schema").show(new GradeSchemaView({
            model : model
        }));


        //App.show(new GradeSchemaView({
        //    model : model
        //}));
        //layout.getRegion('main').show(new App.Marionette.ItemView({
        //    template: template,
        //    updatePieChart: function() {
        //
        //    }
        //}))
    })
});
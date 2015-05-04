
define(['app/app', 'text!templates/charts.hbs', 'text!templates/letterGradeGraphics.hbs', 'text!templates/gradeSchema.hbs', 'chart'], function(App, chartTemplate, template1, template2, chart) {
    var GradeSchema = App.Backbone.Model;
    var GraphModel = App.Course;


    var LetterGradeGraphView = App.Mn.ItemView.extend({
        model : GraphModel,
        template : App.Handlebars.compile(template1),
        modelEvents : {
            "change" : "onShow"
        },
        //graphTitle: "A",
        onShow : function () {
            if (!this.barCtx || !this.pieCtx) {
                return
            }
            var numGradeLetters = this.model.get('numGradeLetters');
            var aMin = this.model.get('aMin');
            var bMin = this.model.get('bMin');
            var cMin = this.model.get('cMin');
            var dMin = this.model.get('dMin');
            var aColor = this.model.get('aColor');
            var bColor = this.model.get('bColor');
            var cColor = this.model.get('cColor');
            var dColor = this.model.get('dColor');
            var fColor = this.model.get('fColor');
            var gradeArray = this.model.get('findGraphArray')();
            var barGraphData = {
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
            };
            // want to make this global so the gradeSchema can see it.
            var gradeLetterTotals = function () {
                var i = 0;
                var gradeTotalArray = new Uint32Array(5);
                    gradeArray[0].forEach(function(value) {
                        switch (true) {
                            case(value >= aMin):
                                gradeTotalArray[0] += gradeArray[1][i];
                                break;
                            case(value >= bMin):
                                gradeTotalArray[1] += gradeArray[1][i];
                                break;
                            case(value >= cMin):
                                gradeTotalArray[2] += gradeArray[1][i];
                                break;
                            case(value >= dMin):
                                gradeTotalArray[3] += gradeArray[1][i];
                                break;
                            default:
                                gradeTotalArray[4] += gradeArray[1][i];
                                break;
                        }
                        i++;
                    });

                return gradeTotalArray;
            };
            var pieChartData = [
                    {
                        value: gradeLetterTotals()[0],
                        color: this.model.get('aColor')[0],
                        highlight: this.model.get('aColor')[1],
                        label: "A"
                    },
                    {
                        value: gradeLetterTotals()[1],
                        color: this.model.get('bColor')[0],
                        highlight: this.model.get('bColor')[1],
                        label: "B"
                    },
                    {
                        value: gradeLetterTotals()[2],
                        color: this.model.get('cColor')[0],
                        highlight: this.model.get('cColor')[1],
                        label: "C"
                    },
                    {
                        value: gradeLetterTotals()[3],
                        color:this.model.get('dColor')[0],
                        highlight: this.model.get('dColor')[1],
                        label: "D"
                    },
                    {
                        value: gradeLetterTotals()[4],
                        color: this.model.get('fColor')[0],
                        highlight: this.model.get('fColor')[1],
                        label: "F"
                    }

                ];


            this.pieChart = new Chart(this.pieCtx).Pie(pieChartData,null);
            this.barChart = new Chart(this.barCtx).Bar(barGraphData, null);
            var changeSingleBarColor = function(chartIn, bar, color) {

                chartIn.datasets[0].bars[bar].fillColor =  color[0];
                chartIn.datasets[0].bars[bar].strokeColor =  color[1];
                chartIn.datasets[0].bars[bar].highlightFill = color[2];
                chartIn.datasets[0].bars[bar].highlightStroke =  color[3];

                chartIn.update();
            };
            var varcheckBarChartColors = function (gradesArray, chart){
                for(var x = 0; x < gradesArray.length; x++) {
                    switch (true) {
                        case(gradesArray[x] >= aMin):
                            changeSingleBarColor(chart, x, aColor);
                            break;
                        case(gradesArray[x] >= bMin):
                            changeSingleBarColor(chart, x, bColor);
                            break;
                        case(gradesArray[x] >= cMin):
                            changeSingleBarColor(chart, x, cColor);
                            break;
                        case(gradesArray[x] >= dMin):
                            changeSingleBarColor(chart, x, dColor);
                            break;
                        default:
                            changeSingleBarColor(chart, x, fColor);
                            break;
                    }
                }
            }(gradeArray[0], this.barChart);
        },
        onAttach : function (){
            this.barCtx = this.$('.barChart')[0].getContext('2d');
            this.pieCtx = this.$('.pieChart')[0].getContext('2d');
        }
    });

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
        dMin: 60,
        numGradeLetters: 5
    });

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
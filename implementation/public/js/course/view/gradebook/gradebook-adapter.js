define(function (require) {
    var $ = require('jquery');
    var _ = require('underscore');
    var Q = require('q');
    var Backbone = require('util/backbone-helper');
    var Radio = require('backbone.radio');
    var Mn = require('backbone.marionette');
    var Hbs = require('handlebars');
    var template = require('text!course/view/gradebook/gradebookView.hbs');
    var coursechannel = Radio.channel('course');
    
    return {
        calculateTableHeaderLayout: function() {
            var category = courseChannel.request('current:course').get('category');
            var rowCats = category.groupByRow();
            var colspan = _.partial(lookup, category.findColSpans())
            var rowspan = _.partial(lookup, category.findRowSpans())
            var result = [];
            var height = 1 + category.findHeight();

            category.tree().forEach(_.partial(render, _, result, 0));
            return result;
            
            function lookup(table, item) {
                return table[item.cid];
            }
            
            function assignmentColumn(a) {
                return {
                    name: a.get('name'),
                    style: "assignment",
                    colspan: 1,
                    rowspan: rowspan(a),
                    cid: a.cid,
                    assignment: a
                }
            }
            
            function categoryColumn(cat) {
                return {
                    name: cat.get('name'),
                    style: "category",
                    colspan: colspan(cat),
                    rowspan: 1,
                    cid: cat.id
                }
            }
            
            function appendColumnToRow(rows, rowNum, column) {
                while (rows.length <= rowNum) {
                    rows.push([]);
                }
                rows[rowNum].push(column);
            }

            function render(cat, rows, rowNum) {
                var addBelow = _.partial(appendColumnToRow, rows, rowNum + 1);
                var renderChild = _.partial(render, _, rows, rowNum + 1);
                if (cat.has('assignments')) {
                    var mkLeaf = _.compose(addBelow, assignmentColumn);
                    cat.get('assignments').map(mkLeaf);
                }
                
                _.each(cat.tree(), renderChild);
                appendColumnToRow(rows, rowNum, categoryColumn(cat));
                return rows;
            }
        }
    }
});
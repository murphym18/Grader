define(function (require) {
    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('util/backbone-helper');
    var Hbs = require('handlebars');
    var Mn = require('backbone.marionette');
    var Q = require('q');
    var userChannel = require('user/module');
    var Radio = require('backbone.radio');
    var CreateCourseView = require('course/new-course-view');
    var pageChannel = Radio.channel('page');
    var template = require('text!templates/headerNavNewCourseButton.hbs');
    
    return Mn.ItemView.extend({
        tagName: 'li',
        template: Hbs.compile(template),

        events: {
            'click': function() {
                var modalRegion = pageChannel.request('modalRegion');
                modalRegion.show(new CreateCourseView({}));
            }
        }
    });
});
define(function (require) {
    var _ = require('underscore');
    var Q = require('q');
    var Backbone = require('util/backbone-helper');
    var Radio = require('backbone.radio');
    var Course = require('course/model/course');
    var Student = require('course/model/student');
    var CourseList = require('course/model/course-list');
    
    var channel = Radio.channel('course');
    
    var currentState = new Backbone.Model({
        course: null,
        courseList: null
    });
    
    var Registry = Backbone.Collection.extend({
         constructor: function Registery() {
             Backbone.Collection.apply(this);
         }
     });

    var registry = window.regestery = new Registry();
    
    channel.comply('register', function(doc) {
        registry.add(doc);
    });
    var StudentCollection = Backbone.Collection.extend({
            model: Student,
            comparator: 'last',
            initialize: function(options){
                this.url = '/api/students?course='+options.path.toString() +'';
                
            }
        });
    channel.reply('students', function(course) {
        var path;
        if (!course) {
            path = channel.request('current:course').get('colloquialUrl');
        }
        else {
            path = course.get('colloquialUrl');
        }
        
        return new StudentCollection({path: path})
        
    })

    channel.reply('current:course', function(course) {
        return currentState.get('course');
    });
    
    channel.reply('current:list', function(courseList) {
        return currentState.get('courseList');
    });
    
    channel.reply('set:current:course', function(course) {
        window.x = course;
        currentState.set('course', course);
        return course;
    });
    
    channel.reply('set:current:list', function(courseList) {
        currentState.set('courseList', courseList);
    });
    
    channel.reply('updateCourses', function() {
        currentState.get('courseList').sort();
        return currentState.get('courseList').fetch();
    });
    
    channel.reply('new:Course', function(options, attr){
        return new Course(options, attr);
    });
    
    channel.reply('new:CourseList', function(options, attr){
        return new CourseList();
    });
    return channel;
})
define(function (require) {
    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('util/backbone-helper');
    var Hbs = require('handlebars');
    var Mn = require('backbone.marionette');
    var Q = require('q');
    var Radio = require('backbone.radio');
    var Category = require('course/model/category');
    var RoleManager = require('course/model/role-manager');
    require('backbone-documentmodel');
    var courseChannel = Radio.channel('course');
    
    var DocModel = require('util/doc-model');
    var DocCollection = require('util/doc-collection');
    
    var adminUserText = require('text!api/Users/admin');
    
    var defaultCourse = JSON.stringify({
        "minCredit": 60,
        "minD": 60,
        "minC": 70,
        "minB": 80,
        "minA": 90,
        "roles":[
            {
                "name":"NONE",
                "users":[JSON.parse(adminUserText)._id],
                "permissions":[]
            }
        ],
        "students": [],
        "categories": [],
    });
    
    return Backbone.Model.extend({
        idAttribute: "_id",
        urlRoot: '/api/courses',    
        
        defaults: function() {
            return JSON.parse(defaultCourse);
        },
        
        findGraphArray: function(data) {
        
        },
        
        initialize : function (options) {
            this.setupUrl();
            this.listenTo(this, 'all', function() {
                if (console.warn)
                    console.warn("DEBUG: ", arguments[0]);
            });
            

        },
        
        // fetch: function(options) {
        //     options = options || {};
        //     if (!this.get("colloquialUrl")) {
        //         var msg = "Cannot fetch course. Its colloquialUrl is undefined."
        //         throw new Error(msg)
        //     }
        //     //this.url = this.url + '?populate=students.user,roles.users'
        //     var result = DocModel.prototype.fetch.call(this, options);
        //     this.url = '/api/courses/' + this.get("colloquialUrl") + "";
        //     return result;
        // },
        
        setupUrl: function() {
            var colloquialUrl = this.get("colloquialUrl");
            if (colloquialUrl) {
                this.url = '/api/courses/' + colloquialUrl + "";
            }
            else {
                this.url = '/api/courses'
            }
        },

        // For collections
        getNestedCollection: getNestedCollection
        
    }, {
        createColloquialUrl: createColloquialUrl,
        findTermDates: findTermDates,
        isValidTerm: isValidTerm,
        isValidYear: isValidYear
    });
    
    function getNestedCollection(nestedKey, nestedValue, nestedOptions) {
        switch (nestedKey) {
            case 'categories':
                return new Category(nestedValue, nestedOptions);
                
            case 'roles':
                return new RoleManager(nestedValue, nestedOptions);
                
            case 'aColor':
            case 'bColor':
            case 'cColor':
            case 'dColor':
            case 'fColor':
            default:
                return new DocCollection(nestedValue, nestedOptions);
        }
    }
    
    function createColloquialUrl(course) {
        var fields = [
            'classCode',
            'classNumber',
            'section',
            'term',
        ]
        var year = course.get('year');
        var term = course.get('term');
        if (_.every(fields, course.has, course) && isValidYear(year) &&
         isValidTerm(term)) {
            return _.map(fields, course.get, course).join('-') + year;
        }
        return false;
    }
    
    function findTermDates(term, year) {
        function date(m1, d1, m2, d2) {
            return {
                start: new Date(year, m1, d1),
                end: new Date(year, m2, d2)
            }
        }
        return {
            'Winter': date(0, 5, 2, 20),
            'Spring': date(2, 30, 5, 12),
            'Summer': date(5, 19, 7, 29),
            'Fall': date(8, 22, 11, 12)
        }[term];
    }
    
    function isValidTerm(term) {
        var validTerms = [
            'Winter',
            'Spring',
            'Summer',
            'Fall'
        ];
        return _.contains(validTerms, term);
    }
    
    function isValidYear(year) {
        return /^\d{4}$/.test(year);
    }
    
});
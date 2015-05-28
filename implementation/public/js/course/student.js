define(function (require) {
    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('util/backbone-helper');
    var Hbs = require('handlebars');
    var Mn = require('backbone.marionette');
    var Q = require('q');
    var Radio = require('backbone.radio');
    var proxy = require('util/prop-proxy');
    var DocCollection = require('util/doc-collection');
    var DocModel = require('util/doc-model');
    var User = DocModel.extend({
        constructor: function User() {
            DocModel.apply(this, arguments);
            
        }
    })
    var UserWrapper = DocCollection.extend({
        model: User,
        constructor: function UserWrapper() {
            DocCollection.apply(this, arguments);
        }
    })
    
    var StudentRecord = DocModel.extend({
        defaults: {
            'extra': {},
            'grades': []
        },
        
        constructor: function StudentRecord() {
            DocModel.apply(this, arguments);
        },
        
        getNestedCollection: function (nestedKey, nestedValue, nestedOptions) {
            switch (nestedKey) {
                case 'user':
                    return new UserWrapper(nestedValue, nestedOptions);
            }
        },
        
        mutators:{
            fullName:{
                get: function() {
                    var fullName = this.get("firstName");
                    fullName += " " + this.get("middleInit");
                    fullName += ". " + this.get("lastName");
                    return fullName;
                },
                transient: true
            }
        },
        
        setupProxyAccessors: function() {
            proxyUser(this);
            _.each(['grades', 'extra'], _.bind(proxy.proxyGet, proxy, this))
            _.each(['comment'], _.bind(proxy.proxyGetAndSet, proxy, this))
        },
        
        initialize: function(options) {
            this.setupProxyAccessors();
            var mutators = this.mutators = {}

            mutators.user = {
                get: function() {
                    var result = Mutator.prototype.oldGet.call(this, 'user');
                    return result.find(_.identity);
                },
                
                set: function(key, value, options, set) {
                    set({
                        'user': [value]
                    }, options);
                }
            }
        }
    })
    
    return DocCollection.extend({
        model: StudentRecord,
        constructor: function StudentsCollection() {
            DocCollection.apply(this, arguments);
        },
        
        initialize: function(models, options) {
            
        }
    });
    
    function proxyUser(obj) {
        Object.defineProperty(obj, 'user', {
            get: function() {
                var list = obj.get('user');
                if (list && list.length > 0)
                    return list.at(0);
            },
            set: function(value) {
                obj.set({
                    'user': [value]
                });
            }
        })
    }
    
    function proxyUserData(obj, field) {
        Object.defineProperty(obj, field, {
            get: function() {
                return obj.get(field) || obj.user.get(field);
            },
            set: function(value) {
                console.log(value);
                input = {}
                input[field] = value
                obj.set(input);
            }
        })
    }
    
})
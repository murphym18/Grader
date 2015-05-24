define(function (require) {
    var $ = require('jquery');
    var _ = require('underscore');
    var Q = require('q');
    var Backbone = require('backbone');
    require('backbone.marionette');
    require('radio.shim');
    require('backbone.radio');
    require('backbone-relational');
   
    Backbone.Marionette.Renderer.render = function(template, data) {
        return template(data);
    };
   
   function ajaxFactory(fetchProgressFunc, saveProgressFunc) {
        var xhr = new window.XMLHttpRequest();
        if (_.isFunction(fetchProgressFunc)) {
            xhr.addEventListener("progress", fetchProgressFunc, false);
        }
        if (_.isFunction(saveProgressFunc)) {
            xhr.upload.addEventListener("progress", saveProgressFunc, false);
        }
        return xhr;
    }
    
    function updateProgress(progressEventName, progressEvent) {
        if (progressEvent.lengthComputable) {
            var percentDone = 100 * progressEvent.loaded / progressEvent.total;
            percentDone = Math.round(percentDone);
            this.trigger(progressEventName, percentDone);
        }
    }
    
    function updateFetchProgress(event){
        updateProgress.call(this, "fetch:progress", event);
    }
    
    function updateSaveProgress(event){
        updateProgress.call(this, "save:progress", event);
    }
    
    function initAjaxOptions(self, optionsArg) {
        var options = _.isObject(optionsArg) ? optionsArg : {};
        var onFProgress = self.updateFetchProgress.bind(self);
        var onSProgress = self.updateSaveProgress.bind(self);
        
        options.xhr = _.partial(ajaxFactory, onFProgress, onSProgress);
        return options
    }
    
    function cacheSuperMethods(proto) {
        return {
            fetch: proto.fetch,
            save: proto.save
        }
    }
    
    function wrapIoMethods(fetchFunc, saveFunc) {
        return {
            fetch: fetchFunc,
            save: saveFunc
        }
    }
    
    var progressEventGenerators = {
        "updateFetchProgress": updateFetchProgress,
        "updateSaveProgress": updateSaveProgress
    }
    
    _.each(["Model", "Collection"], function(name) {
        var clazz = Backbone[name];
        var superClassMethod = cacheSuperMethods(clazz.prototype);
        var ioMethods = wrapIoMethods(fetchFunc, saveFunc);
        
        _.extend(clazz.prototype, progressEventGenerators, ioMethods);
        
        function fetchFunc(optionsArg) {
            var options = initAjaxOptions(this, optionsArg);
            this.trigger("fetch", this, options);
            return Q(superClassMethod.fetch.call(this, options));
        }
        
        function saveFunc(attrsArg, optionsArg) {
            var attr = _.isObject(attrsArg) ? attrsArg : {};
            var options = initAjaxOptions(this, optionsArg);
            this.trigger("save", this, attr, options);
            return Q(superClassMethod.save.call(this, attr, options));
        }
    });
    
   return Backbone;
});
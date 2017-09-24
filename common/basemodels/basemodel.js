
var PersistedModel = require('loopback').PersistedModel;

module.exports = function (basemodel) {

  basemodel.setup = function(){
        PersistedModel.setup.call(this);
        var model = this;
        // model.beforeRemote('**', function(ctx, modelInstance, next) {
        //     var log = ctx.req.log || log;
        //     log.trace(ctx.methodString, ' begin');
        //     log.debug(ctx.methodString, ' args:', ctx.args);
        //     ctx.args.log = log;
        //     next();
        // });
    model.disableRemoteMethod("create", true);
    model.disableRemoteMethod("upsert", true);
    model.disableRemoteMethod("updateAll", true);
    model.disableRemoteMethod("updateAttributes", false);
    
    model.disableRemoteMethod("find", true);
    model.disableRemoteMethod("findById", true);
    model.disableRemoteMethod("findOne", true);
    
    model.disableRemoteMethod("deleteById", true);
    
    model.disableRemoteMethod("confirm", true);
    model.disableRemoteMethod("count", true);
    model.disableRemoteMethod("exists", true);
    model.disableRemoteMethod("resetPassword", true);
    
    model.disableRemoteMethod('__count__accessTokens', false);
    model.disableRemoteMethod('__create__accessTokens', false);
    model.disableRemoteMethod('__delete__accessTokens', false);
    model.disableRemoteMethod('__destroyById__accessTokens', false);
    model.disableRemoteMethod('__findById__accessTokens', false);
    model.disableRemoteMethod('__get__accessTokens', false);
    model.disableRemoteMethod('__updateById__accessTokens', false);
  }
};    
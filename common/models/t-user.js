'use strict';

module.exports = function(Tuser) {
    var co = require('co');
    var LoopBackContext = require('loopback-context');
    
    //UserList
    Tuser.remoteMethod(
        'UserList',
        {
            http: { verb: 'get' },
            description: '请求列表',
            accepts: { arg: 'data', type: 'object', description: '{"searchtext":"ceshi","pagesize":"20","pagenum":"1"}', root: true },
            returns: { arg: 'data', type: 'object', root: true }
        }
    );

    Tuser.UserList = function (Data, cb) {
      co(function* () {
        console.log(Data);
        var retData = {};
        var startRecord = Data.pagesize * (Data.pagenum -1)
        if(Data.searchtext== null || Data.searchtext== ""){
          retData.list = yield Tuser.app.models.TUser.find({limit:Data.pagesize,skip:startRecord})
          retData.recordcnt = yield Tuser.count()
        }
        else{
          retData.list = yield Tuser.app.models.TUser.find({"where":{"or":[{usermobile:{like:"%"+Data.searchtext+"%"}},{username:{like:"%"+Data.searchtext+"%"}}]},limit:Data.pagesize,skip:startRecord})
          retData.recordcnt = yield Tuser.count({"where":{"or":[{usermobile:{like:"%"+Data.searchtext+"%"}},{username:{like:"%"+Data.searchtext+"%"}}]}})
        }
        if(retData.recordcnt){
          if(typeof retData.list =='undefined'|| retData.list == null){
             retData.list = []
          }
          cb(null, retData);
        }
        else{
          retData.list = []
          retData.recordcnt = 0
          cb(null,retData)
        }
      })
      .catch(function(err){
        cb('Error', { "Result": err });
      });
    }
};

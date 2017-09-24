'use strict';

module.exports = function(Timgs) {
    var co = require('co');
     //Timgs
    Timgs.remoteMethod(
        'ImgsList',
        {
            http: { verb: 'get' },
            description: '请求列表',
            accepts: { arg: 'data', type: 'object', description: '{"tableid":"1","tablename":"ceshi","pagesize":20,"pagenum":1}', root: true },
            returns: { arg: 'data', type: 'object', root: true }
        }
    );

    Timgs.ImgsList = function (Data, cb) {
      co(function* () {
          var retData = {};
       retData.list = yield Timgs.find({"where":{"and":[{tableid:Data.tableid},{tablename:Data.tablename}]},limit:Data.pagesize,skip:Data.pagesize * Data.pagenum})
        retData.recordcnt = yield Timgs.count({"where":{"and":[{tableid:Data.tableid},{tablename:Data.tablename}]}})
        if(retData.recordcnt){
          if(typeof retData.list =='undefined'|| retData.list == null){
             retData.list = []
          }
          cb(null, retData);
          return
        }
        else{
           retData.list = []
           retData.recordcnt = 0
          cb(null, retData)
          return
        }
      })
      .catch(function(err){
        //console.log(err);
        cb('Error', { "Result": err });
      });
    }

    //------删除数据----//
    Timgs.remoteMethod(
        'DeleteImgsList',
        {
            http: { verb: 'get' },
            description: '请求列表',
            accepts: { arg: 'data', type: 'object', description: '{"tableid":"1","tablename":"ceshi"}', root: true },
            returns: { arg: 'data', type: 'object', root: true }
        }
    );

    Timgs.DeleteImgsList = function (Data, cb) {
      co(function* () {
        var retData = {};
        var data = yield Timgs.destroyAll({"and":[{tableid:Data.tableid},{tablename:Data.tablename}]})
        cb(null, data);
      })
      .catch(function(err){
        cb('Error', { "Result": err });
      });
    }

    //------删除数据----//
    Timgs.remoteMethod(
        'DeleteImgsUrl',
        {
            http: { verb: 'get' },
            description: '请求列表',
            accepts: { arg: 'data', type: 'object', description: '{"tableid":"1","tablename":"ceshi",imgpath:"..."}', root: true },
            returns: { arg: 'data', type: 'object', root: true }
        }
    );

    Timgs.DeleteImgsUrl = function (Data, cb) {
      co(function* () {
        var retData = {};
        var data = yield Timgs.destroyAll({"and":[{tableid:Data.tableid},{tablename:Data.tablename},{imgpath:Data.imgpath}]})
        cb(null, data);
      })
      .catch(function(err){
        cb('Error', { "Result": err });
      });
    }
};

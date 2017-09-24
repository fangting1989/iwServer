'use strict';

module.exports = function(Tprod) {
    var co = require('co');
    //TprodList
    Tprod.remoteMethod(
        'ProdList',
        {
            http: { verb: 'get' },
            description: '请求列表',
            accepts: { arg: 'data', type: 'object', description: '{"searchtext":"ceshi","pagesize":"20","pagenum":"1"}', root: true },
            returns: { arg: 'data', type: 'object', root: true }
        }
    );

    Tprod.ProdList = function (Data, cb) {
      co(function* () {
          var retData = {};
          var filter = {}
          var Countfilter = {}
          if(Data.searchtext != null && Data.searchtext != ""){
            filter.where = {
              or:[{prodname:{like:'%'+Data.searchtext+'%'}},{prodid:{like:'%'+Data.searchtext+'%'}}]
            }
            Countfilter.where = {
              or:[{prodname:{like:'%'+Data.searchtext+'%'}},{prodid:{like:'%'+Data.searchtext+'%'}}]
            }
          }

          if(Data.state != null){
            if(filter.where == null){
              filter.where = {}
              Countfilter.where = {}
            }
            if(filter.where.and == null){
                filter.where.and = []
                Countfilter.where.and = []
            }
            filter.where.and.push({state:Data.state})
            Countfilter.where.and.push({state:Data.state})
          }

          filter.limit = Data.pagesize
          filter.skip = Data.pagesize * Data.pagenum


          retData.list = yield Tprod.find(filter)
          retData.recordcnt = yield Tprod.count(Countfilter.where)
          if(retData.recordcnt){
            if(typeof retData.list =='undefined'|| retData.list == null){
              retData.list = []
              retData.recordcnt = 0
            }
            cb(null, retData);
          }
          else{
            cb(null, {list:[],recordcnt:0});
          }
      })
      .catch(function(err){
        cb(null, {errid:100,errmsg:err});
      });
    }
};

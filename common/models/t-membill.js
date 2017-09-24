'use strict';

module.exports = function(Tmembill) {
    var co = require('co');
    var _ = require('underscore')
    function billexcutesql(sqlstring){
            return new Promise(function (resolve, reject) {
                var sql = sqlstring
                 Tmembill.dataSource.connector.execute(sql,null,function(err,data){
                    if(err){
                        reject(err)
                    }
                    else{
                        if(data.length > 0){
                            resolve(data[0]) 
                        }else{
                            resolve(data) 
                        }
                       
                    }
                })
            });
        }

    //Tmembill
    Tmembill.remoteMethod(
        'MembillList',
        {
            http: { verb: 'get' },
            description: '请求列表',
            accepts: { arg: 'data', type: 'object', description: '{"memid":"1","pagesize":"20","pagenum":"1"}', root: true },
            returns: { arg: 'data', type: 'object', root: true }
        }
    );

    Tmembill.MembillList = function (Data, cb) {
      co(function* () {
        var retData = {};
        if(Data.memid == null){
          cb(null, {list:[],recordcnt:0});
          return
        }

        var filter = {}
        var CountFilter = {}

        if(Data.memid != null){
          if(filter.where == null){
            filter.where = {}
            CountFilter.where = {}
          }
          if(filter.where.and == null){
              filter.where.and = []
              CountFilter.where.and = []
          }
          filter.where.and.push({memid:Data.memid})
          filter.where.and.push({paystate:1})
          CountFilter.where.and.push({memid:Data.memid})
           CountFilter.where.and.push({paystate:1})
        }
        if(Data.startdate != null){
          if(filter.where == null){
            filter.where = {}
            CountFilter.where = {}
          }
          if(filter.where.and == null){
              filter.where.and = []
              CountFilter.where.and = []
          }
          filter.where.and.push({billcosttime:{gte:new Date(Data.startdate)}})
          CountFilter.where.and.push({billcosttime:{gte:new Date(Data.startdate)}})
        }
        if(Data.enddate != null){
          if(filter.where == null){
            filter.where = {}
            CountFilter.where = {}
          }
          if(filter.where.and == null){
              filter.where.and = []
              CountFilter.where.and = []
          }
          filter.where.and.push({billcosttime:{lte:new Date(Data.enddate)}})
           CountFilter.where.and.push({billcosttime:{lte:new Date(Data.enddate)}})
        }

        filter.limit = Data.pagesize
        filter.skip = Data.pagesize * Data.pagenum
        filter.order = 'billcosttime DESC'

        retData.list = yield Tmembill.find(filter)
        retData.recordcnt = yield Tmembill.count(CountFilter.where)
        if(retData.recordcnt){
          if(typeof retData.list =='undefined'|| retData.list == null){
             retData.list = []
          }
          cb(null, retData);
        }
        else{
          retData = {
            list:[],
            recordcnt:0
          }
          cb(null,retData)
        }
      })
      .catch(function(err){
        cb('Error', { "Result": err });
      });
    }


    Tmembill.remoteMethod(
        'UpdateMembill',
        {
            http: { verb: 'get' },
            description: '请求列表',
            accepts: { arg: 'data', type: 'object', description: '{"membillid":1,"paystate":1}', root: true },
            returns: { arg: 'data', type: 'object', root: true }
        }
    );

    Tmembill.UpdateMembill = function (Data, cb) {
      var model = {}
      model.membillid = Data.membillid
      model.paystate = Data.paystate
      Tmembill.upsert(model).then(function(err,model){
        if(err){
          cb(null,{errid:100,errmsg:err})
        }
        else{
          cb(null,{data:model})
        }
      })
    }



    //----钩子程序----//
    Tmembill.observe('after save', function(ctx, next) {
      //更新数据
      co(function* () {
        var findArray =  yield Tmembill.find({"where":{membillid:ctx.instance.membillid}})
        var pArray = [];
        if(findArray != null){
          _.each(findArray,function(obj){
            var sql = "select sum(membillamount) as totalmembillamount,count(*) as totalmembillnum,memid from t_membill where paystate =1 and memid = "+obj.memid;
            pArray.push(billexcutesql(sql))
          })
          var data = yield pArray
          var modelArray = []
          _.each(data,function(oobj){
            if(typeof oobj.memid != 'undefined' && typeof oobj.memid !=""){
            var newModel = {
              memberid:oobj.memid,
              costamount:oobj.totalmembillamount,
              costnum:oobj.totalmembillnum,
            }
            Tmembill.app.models.TMember.upsert(newModel)
            }
          })
        }
       
      })
      .catch(function(err){
        console.log("update account and num error,location Tmembill after save")
      })
      next();
    });
};

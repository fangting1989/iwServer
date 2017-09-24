'use strict';

module.exports = function(Tmember) {
    var co = require('co');
    var _ = require('underscore')
     //Tbillcomment
    Tmember.remoteMethod(
        'MemberList',
        {
            http: { verb: 'get' },
            description: '请求列表',
            accepts: { arg: 'data', type: 'object', description: '{"searchtext":"ceshi","pagesize":"20","pagenum":"1"}', root: true },
            returns: { arg: 'data', type: 'object', root: true }
        }
    );

    Tmember.MemberList = function (Data, cb) {
      co(function* () {
          var retData = {};
          var filter = {};
          var Countfilter = {}
          if((Data.searchtext != null && Data.searchtext != "")|| Data.startaccount != null || Data.endaccount != null){
            filter.where = {}
            Countfilter.where = {}
          }

          if(Data.searchtext != null && Data.searchtext != ""){
            filter.where.or = [{memname:{like:'%'+Data.searchtext+'%'}},{memmobile:{like:'%'+Data.searchtext+'%'}}]
            Countfilter.where.or = [{memname:{like:'%'+Data.searchtext+'%'}},{memmobile:{like:'%'+Data.searchtext+'%'}}]
          }

          if(Data.startaccount != null){
            if(filter.where.and == null){
                filter.where.and = []
                Countfilter.where.and = []
            }
            filter.where.and.push({costamount:{gte:Data.startaccount}})
            Countfilter.where.and.push({costamount:{gte:Data.startaccount}})
          }
          if(Data.endaccount != null){
            if(filter.where.and == null){
                filter.where.and = []
                Countfilter.where.and = []
            }
            filter.where.and.push({costamount:{lte:Data.endaccount}})
            Countfilter.where.and.push({costamount:{lte:Data.endaccount}})
          }

          filter.limit = Data.pagesize
          filter.skip = Data.pagesize * Data.pagenum

        retData.list = yield Tmember.find(filter)
        retData.recordcnt = yield Tmember.count(Countfilter.where)
        if(retData.recordcnt){
          if(typeof retData.list =='undefined'|| retData.list == null){
             retData.list = []
          }
          cb(null, retData);
        }
        else{
          cb(null,{ errid:"100",errmsg:"未找到数据" })
        }
      })
      .catch(function(err){
        //console.log(err)
        cb(null,{ errid:"100",errmsg:err })
      });
    }

    /*************消费笔数 */
    Tmember.remoteMethod(
        'CostCountandAmount',
        {
            http: { verb: 'get' },
            description: '请求列表',
            accepts: { arg: 'data', type: 'object', description: '{"postArray":[1,2,3]}', root: true },
            returns: { arg: 'data', type: 'object', root: true }
        }
    );
    Tmember.CostCountandAmount = function (Data, cb) {
      if(Data.postArray == null){
        cb(null,{ errid:"100",errmsg:"对象类型不是数组" })
        return
      }
        if(!Array.isArray(Data.postArray) || Data.postArray.length == 0){
           cb(null,{ errid:"100",errmsg:"对象类型不是数组" })
           return
        }
        var arrString = ''
        _.each(Data.postArray,function(obj){
          if(arrString == ''){
            arrString += obj;
          }else{
            arrString += ","+obj
          }
        })
        var sql = "SELECT COUNT(MEMID) AS COUNTBILL,SUM(MEMBILLAMOUNT) AS MEMBILLAMOUNT,MEMID FROM ( SELECT * FROM t_membill WHERE MEMID IN("+arrString+") and paystate = 1) B GROUP BY MEMBILLGUID"
          var retData = {};
          Tmember.dataSource.connector.execute(sql,function(err,result){
            if(err) {
              cb(null,{ errid:"100",errmsg:err})
              return 
            }
            retData.data = result
             cb(null,retData );
          })
    }

};

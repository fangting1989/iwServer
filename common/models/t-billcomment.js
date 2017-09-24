//'use strict';
module.exports = function(Tbillcomment) {
    var co = require('co');
    var _ = require('underscore')

     function billexcutesql(obj){
            return new Promise(function (resolve, reject) {
                var sql = "select memname,wechatname,memmobile,membillamount,billcosttime,b.membillid from t_member a,t_membill b where a.memberid = b.memid and b.membillid=" + obj.membillid
                 Tbillcomment.dataSource.connector.execute(sql,null,function(err,data){
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


     //Tbillcomment
    Tbillcomment.remoteMethod(
        'BillcommentList',
        {
            http: { verb: 'get' },
            description: '请求列表',
            accepts: { arg: 'data', type: 'object', description: '{"pagesize":20,"pagenum":0}', root: true },
            returns: { arg: 'data', type: 'object', root: true }
        }
    );
    /*memid 会员信息, pagesize 页大小 pagenum 当前页*/
    Tbillcomment.BillcommentList = function (Data, cb) {

      co(function* () {
        var retData = {};
        var filter = {}
        var resultData = []
        var Countfilter = {}
        var pArray = []
        if(typeof Data.pagesize == 'undefined' || typeof Data.pagenum == 'undefined'){
             cb(null,{ errid:"100",errmsg:"参数不正确" })
             return
        }
        if(Data.state != null || Data.startDate != null || Data.endDate != null){
            filter.where = {};
        }
        if(Data.state != null){
            if(filter.where.and == null){
                filter.where.and = []
            }
            filter.where.and.push({state:Data.state})
        }
        if(Data.startDate != null){
            if(filter.where.and == null){
                filter.where.and = []
            }
            filter.where.and.push({commentdate:{gte:new Date(Data.startDate)}})
        }
         if(Data.endDate != null){
            if(filter.where.and == null){
                filter.where.and = []
            }
            filter.where.and.push({commentdate:{lte:new Date(Data.endDate)}})
        }

        filter.order = 'state asc,commentdate DESC'
        filter.limit = Data.pagesize
        filter.skip = Data.pagesize * Data.pagenum

        Countfilter.limit = Data.pagesize
        Countfilter.skip = Data.pagesize * Data.pagenum

        retData.list = yield Tbillcomment.find(filter);
        retData.recordcnt = yield Tbillcomment.count(Countfilter)
        
        if(!retData.list){
            retData.list = []
            retData.recordcnt = 0
        }
        else{
            _.each(retData.list,function(obj){
                var funobj = billexcutesql(obj)
                pArray.push(funobj)
            })
            console.log("retData")
            console.log(retData)
            var RetData1 = yield pArray
            console.log("RetData1")
            console.log(RetData1)
            _.each(retData.list,function(obj){
                _.each(RetData1,function(oobj){
                    if(obj.membillid === oobj.membillid){
                        resultData.push(Object.assign(obj,oobj))
                    }
                })
            })
            cb(null, {list:resultData,recordcnt:retData.recordcnt});
        }
      })
      .catch(function(err){
        cb(null, { errid:100,errmsg:err });
      });
    }
};

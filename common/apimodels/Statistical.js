module.exports = function(Statistical) {
  var co = require('co');
  var moment = require('moment')

  //------------今日客单数----------------//
  Statistical.remoteMethod(
        'TodayBillCount',
        {
            http: { verb: 'get' },
            description: '当天客单数',
            accepts: { arg: 'data', type: 'object', description: '', root: true, http: { source: 'body' } },
            returns: { arg: 'data', type: 'object', root: true }
        }
    );

    Statistical.TodayBillCount = function (Data, cb) {
      var filter = {};
      filter.where = {}
      Statistical.app.models.TMembill.count({and:[{billcosttime:moment().format('YYYY-MM-DD')},{paystate:1}]}).then(function(result){
        cb(null,{data:result})
      })
    }
    //----------------今日营收金额------//
    Statistical.remoteMethod(
        'TodayBillCost',
        {
            http: { verb: 'get' },
            description: '当天客单数',
            accepts: { arg: 'data', type: 'object', description: '', root: true, http: { source: 'body' } },
            returns: { arg: 'data', type: 'object', root: true }
        }
    );

    Statistical.TodayBillCost = function (Data, cb) {
      var sql = "SELECT SUM(MEMBILLAMOUNT) as sumcount FROM t_membill WHERE PayState = 1 and BillCostTime = '"+moment().format('YYYY-MM-DD')+"'";
     Statistical.app.models.TMembill.dataSource.connector.execute(sql, null,function(err,data){
       if(err){
         cb(null,{errid:"100",errmsg:err})
       }
       else{
       if(data.length <= 0){
         cb(null,{errid:"100",errmsg:"找不到数据"})
       }
       else{
         if(data[0].sumcount == null){
           data[0].sumcount = 0
         }
         cb(null,{data:data[0].sumcount})
       }
       }
     });
    }

    /**最近30天营收曲线 */
    Statistical.remoteMethod(
        'LatelyCost',
        {
            http: { verb: 'post' },
            description: '最近三十天曲线',
            accepts: { arg: 'data', type: 'object', description: '', root: true, http: { source: 'body' } },
            returns: { arg: 'data', type: 'object', root: true }
        }
    );

    Statistical.LatelyCost = function (Data, cb) {
       if(typeof Data.datecount == 'undefined'){
         cb(null,{errid:"100",errmsg:"参数错误"})
       }
      var sql = "select BillCostTime,sum(membillamount) as totalmembillamount from ("
       +" select * from t_membill where PayState = 1 and BillCostTime <='"+moment().subtract(1, 'days').format('YYYY-MM-DD')+"' and BillCostTime>='"+moment().subtract(Data.datecount+1, 'days').format('YYYY-MM-DD')+"') as A group by billcosttime";
     console.log(sql)
     Statistical.app.models.TMembill.dataSource.connector.execute(sql, null,function(err,data){
       if(err){
         cb(null,{errid:"100",errmsg:err})
       }else{
       if(data.length <= 0){
         cb(null,{errid:"100",errmsg:"找不到数据"})
       }
       else{
         cb(null,{data:data})
       }
       }
     });
    }
    //
};

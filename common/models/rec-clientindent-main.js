'use strict';

module.exports = function(Recclientindentmain) {
    var co = require('co');
    const uuidV4 = require('uuid/v4');
    var _ = require('underscore')
    var Promise = require('bluebird');
    var moment = require('moment')
    var sql = require('mssql');
    var Promise = require('bluebird')

    //创建订单
    Recclientindentmain.remoteMethod(
        'CreateOrder',
        {
            http: { verb: 'post' },
            description: '请求列表',
            accepts: { arg: 'data', type: 'object', description: '{"clientcode": "0001","orderlist": [{"clscode": "001","mtcode": "0034","barcode": "","mtname": "黄金珍珠","spec": "1箱=20包","stockunit": "包","storeunit": "包","formulaunit": "克","selnum": 3}]}', root: true },
            returns: { arg: 'data', type: 'object', root: true }
        }
    );

    Recclientindentmain.CreateOrder = function (Data, cb) {  
        console.log(Data)
        getFormCode().then(function(fomcode){
            var retData = {}
            Recclientindentmain.beginTransaction('READ COMMITTED', function(err, tx) {
                var postData  = {
                    formdate:moment(),
                    formno:fomcode,
                    clientcode:Data.clientcode,
                    formstate:2,
                    createdate:moment(),
                    paycode:'01'
                }
                Recclientindentmain.create(postData, {transaction: tx}, function(err, inst) {
                    if(err){
                        tx.rollback(function(err) {
                            cb(null,{errid:-1,errmsg:err})
                        });
                        return
                    }
                    retData.data = inst;
                    var PromiseArray = [];
                    _.each(Data.orderlist,function(item){
                        var OrderDetail = {
                            formno:inst.formno,
                            mtcode:item.mtcode,
                            quantity:item.selnum,
                            sendprice:item.price,
                            saleamount:item.price * item.selnum,
                            createdate:moment()
                        }
                        PromiseArray.push(Recclientindentmain.app.models.RecClientindent.create(OrderDetail, {transaction: tx}))
                    })
                    Promise.all(PromiseArray).then(function(ret){
                        retData.data.orderlist = ret;
                        var flag = true;
                        _.each(ret,function(it){
                            if(!it){
                                flag = false;
                                tx.rollback(function(err) {
                                    cb(null,{errid:-100,errmsg:err})
                                });
                            }
                        })
                        if(flag){
                            tx.commit(function(err) {
                                cb(null,{errid:1,errmsg:err,data:retData.data})
                            });
                        }
                    }).catch(function(err){
                        cb(null,{errid:-111,errmsg:err})
                    })
                })
            });
        }).catch(function(err){
            cb(null,{errid:-100,errmsg:err})
        })
    }

    function getFormCode(){
        return new Promise(function(resolve, reject){
            var aaconfig = require('../../server/datasources.json').mssql
            console.log(aaconfig)
            var config = {
                user: aaconfig.user,
                password:  aaconfig.password,
                server: aaconfig.host,
                database:  aaconfig.database
            }
            
            var conn = new sql.Connection(config);
            conn.connect().then(function(conn) {
                var request = new sql.Request(conn);
                request.input('As_FormName', sql.VarChar(30), 'SF');
                request.output('As_FormNo', sql.VarChar(30), '');
                request.execute('SP_GET_FORMNO').then(function(err, recordsets, returnValue, affected) {
                    return resolve(request.parameters.As_FormNo.value)
                }).catch(function(err) {
                    return reject(err)
                });
            })
        })
    }



    Recclientindentmain.remoteMethod(
        'OrderTotalCountMoney',
        {
            http: { verb: 'post' },
            description: '请求列表',
            accepts: { arg: 'data', type: 'object', description: '{formno:"SF1709040003"}', root: true },
            returns: { arg: 'data', type: 'object', root: true }
        }
    );

    Recclientindentmain.OrderTotalCountMoney = function (Data, cb) { 
        //获得当前订单详细情况 
       var sql = "SELECT COUNT(*) AS PROCOUNT,SUM(SALEAMOUNT) AS TOTALMONEY,SUM(quantity) as TOTALQUANTITY FROM REC_CLIENTINDENT WHERE FORMNO = '" +Data.formno+ "'";
        Recclientindentmain.dataSource.connector.execute(sql, null,function(err,data){
        if(err){
            cb(null,{errid:"-100",errmsg:err})
        }
        else{
        if(data.length <= 0){
            cb(null,{errid:"-100",errmsg:"找不到数据"})
        }
        else{
            cb(null,{errid:1,errmsg:'成功',data:data[0]})
        }
       }
     });
    }

    //根据名称、开始时间、结束时间删选内容
    Recclientindentmain.remoteMethod(
        'orderlist',
        {
            http: { verb: 'post' },
            description: '请求列表',
            accepts: { arg: 'data', type: 'object', description: '{formstate:"7",startdate:"2010-01-01",enddate:"2012-01-01"}', root: true },
            returns: { arg: 'data', type: 'object', root: true }
        }
    );

    Recclientindentmain.orderlist = function (Data, cb) { 
        console.log(Data)
        Data = typeof Data == 'undefined' ? {}:Data
        //获得当前订单详细情况 
        var mssql = "";
        mssql += "SELECT * FROM REC_CLIENTINDENT_MAIN WHERE FormState = 7 "
        if(Data.startdate){
            mssql += " and FormDate >= '"+Data.startdate+"'"
        }
        if(Data.enddate){
            mssql += "  AND CONVERT(varchar,FormDate,23) <=  '"+Data.enddate+"' "
        }
        if(Data.searchtext){
            mssql += " and EXISTS(SELECT 1 FROM REC_CLIENTINDENT A,REC_MATERIAL B WHERE A.MtCode = B.MTCode AND B.MTName LIKE '%"+Data.searchtext+"%' and A.FormNo = REC_CLIENTINDENT_MAIN.FormNo)"
        }
        mssql + " ORDER BY formdate DESC "
        console.log(mssql)
        Recclientindentmain.dataSource.connector.execute(mssql, null,function(err,data){
        if(err){
            cb(null,{errid:"-100",errmsg:err})
        }
        else{
        if(data.length <= 0){
            cb(null,{errid:"-100",errmsg:"找不到数据"})
        }
        else{
            cb(null,{errid:1,errmsg:'成功',data:data})
        }
       }
     });
    }

    //部分收货
    Recclientindentmain.remoteMethod(
        'PartPro',
        {
            http: { verb: 'post' },
            description: '部分收货',
            accepts: { arg: 'data', type: 'object', description: '{"formno": "SF1709200003","list": [{"clscode": "001","mtcode": "0034","barcode": "","mtname": "黄金珍珠","spec": "1箱=20包","stockunit": "包","storeunit": "包","formulaunit": "克","selnum": 3}]}', root: true },
            returns: { arg: 'data', type: 'object', root: true }
        }
    );

    Recclientindentmain.PartPro = function (Data, cb) {  
        var retData = {}
        Recclientindentmain.beginTransaction('READ COMMITTED', function(err, tx) {
            var postData  = {
                where:{
                    and:[{formno:Data.formno}]
                }
            }
            var MainModel = {
                formstate:6
            }
            Recclientindentmain.upsertWithWhere(postData.where,MainModel, {transaction: tx}, function(err, inst) {
                if(err){
                    tx.rollback(function(err) {
                        cb(null,{errid:-1,errmsg:err})
                    });
                    return
                }
                retData.data = inst;
                //查询所有项数据
                var filter = {
                    where:{
                        and:[{formno:Data.formno}]
                    }
                }
                var PromiseArray = [];
                console.log(Data.list)
                _.each(Data.list,function(item){
                    var updatewhere = {
                        where:{
                            and:[{formno:item.formno},{mtcode:item.mtcode}]
                        }
                    }
                    var RecClientindentModal = {
                        sendquantity:item.selnum
                    }
                    PromiseArray.push(Recclientindentmain.app.models.RecClientindent.upsertWithWhere(updatewhere.where,RecClientindentModal, {transaction: tx}))
                })
                Promise.all(PromiseArray).then(function(ret){
                    retData.data.list = ret;
                    var flag = true;
                    _.each(ret,function(it){
                        console.log(it)
                        if(!it){
                            flag = false;
                            tx.rollback(function(err) {
                                cb(null,{errid:-100,errmsg:err})
                            });
                        }
                    })
                    if(flag){
                        tx.commit(function(err) {
                            cb(null,{errid:1,errmsg:err,data:retData.data})
                        });
                    }
                }).catch(function(caterr){
                    tx.rollback(function(err) {
                            cb(null,{errid:1,errmsg:caterr})
                    });
                    
                })  
                
            })
        });
    }

    //全部收货
    Recclientindentmain.remoteMethod(
        'AllPro',
        {
            http: { verb: 'post' },
            description: '全部收货',
            accepts: { arg: 'data', type: 'object', description: '{"formno": "SF1709200003"}', root: true },
            returns: { arg: 'data', type: 'object', root: true }
        }
    );

    Recclientindentmain.AllPro = function (Data, cb) {  
        var retData = {}
        Recclientindentmain.beginTransaction('READ COMMITTED', function(err, tx) {
            var postData  = {
                where:{
                    and:[{formno:Data.formno}]
                }
            }
            var MainModel = {
                formstate:7
            }
            Recclientindentmain.upsertWithWhere(postData.where,MainModel, {transaction: tx}, function(err, inst) {
                if(err){
                    tx.rollback(function(err) {
                        cb(null,{errid:-1,errmsg:err})
                    });
                    return
                }
                retData.data = inst;
                //查询所有项数据
                var filter = {
                    where:{
                        and:[{formno:Data.formno}]
                    }
                }
                Recclientindentmain.app.models.RecClientindent.find(filter).then(function(listdata,err){
                    var PromiseArray = [];
                    console.log(listdata)
                    _.each(listdata,function(item){
                        var updatewhere = {
                            where:{
                                and:[{formno:item.formno},{mtcode:item.mtcode}]
                            }
                        }
                        var RecClientindentModal = {
                            sendquantity:item.quantity
                        }
                        PromiseArray.push(Recclientindentmain.app.models.RecClientindent.upsertWithWhere(updatewhere.where,RecClientindentModal, {transaction: tx}))
                    })
                    Promise.all(PromiseArray).then(function(ret){
                        retData.data.list = ret;
                        var flag = true;
                        _.each(ret,function(it){
                            console.log(it)
                            if(!it){
                                flag = false;
                                tx.rollback(function(err) {
                                    cb(null,{errid:-100,errmsg:err})
                                });
                            }
                        })
                        if(flag){
                            tx.commit(function(err) {
                                cb(null,{errid:1,errmsg:err,data:retData.data})
                            });
                        }
                    }).catch(function(caterr){
                        tx.rollback(function(err) {
                                cb(null,{errid:1,errmsg:caterr})
                        });
                       
                    })  
                })
                
            })
        });
    }
    
};

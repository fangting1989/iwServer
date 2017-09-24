'use strict';

module.exports = function(Recclientindentmain) {
    var co = require('co');
    const uuidV4 = require('uuid/v4');
    var _ = require('underscore')
    var Promise = require('bluebird');
    var moment = require('moment')
    var sql = require('mssql');
    var Promise = require('bluebird')

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
                    formstate:1,
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
    
};

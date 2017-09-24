module.exports = function (smshelper) {
    var crypto = require('crypto');
    var http = require('http');
    var request = require('request');
    var querystring = require('querystring');
    var moment = require('moment')

    //send message
     // Token Valid
    smshelper.remoteMethod(
        'single_send',
        {
            http: { verb: 'get' },
            description: '发送短信',
            accepts: 
               [ { arg: 'data', type: 'object', description: '{"mobile":18657181338,"content":"测试内容"}', root: true},
             ],
            returns: { arg: 'data', type: 'object', root: true }
        }
    );
    smshelper.single_send = function (Data, cb) {
        if(Data.mobile == null || Data.content == null){
           cb(null,{errid:105,errmsg:'参数不正确'})
           return 
        }
        SendSmsMessage(Data.mobile,Data.content).then(function(err,data){
            cb(null,{data:'发送成功!'})
        }).catch(function(err){
            cb(null,{errid:1,errmsg:err})
        })
    }

    smshelper.remoteMethod(
        'SendSmsValid',
        {
            http: { verb: 'get' },
            description: '发送短信',
            accepts: 
               [ { arg: 'data', type: 'object', description: '{"mobile":"18657181338","type":1}', root: true},
             ],
            returns: { arg: 'data', type: 'object', root: true }
        }
    );

    smshelper.SendSmsValid=function(Data,cb){
        var filter = {
            where : {
                and:[
                    {phone:Data.mobile},{type:Data.type},{state:0}
                ]
            }
        }
        smshelper.app.models.TSmsmessage.find(filter).then(function(result){
          if(result.length == 0){
              var RandomData = GetRandomNum();
              var SendMsg = "尊敬的用户，你的验证码为:【"+RandomData + "】,90秒内有效。"
               SendSmsMessage(Data.mobile,SendMsg).then(function(err,data){
                    var newModel = {
                        type :1,
                        content:RandomData,
                        sendtime:moment(),
                        state:0,
                        phone:Data.mobile
                    }
                    smshelper.app.models.TSmsmessage.upsert(newModel).then(function(ret){
                        cb(null,{mobile:Data.mobile,content:'发送成功!',state:1})
                        return;
                    })
                })
          }
          else{
              //比较时间差 返回多少秒 90秒
             var seconds =  moment().diff(moment(result[0].sendtime),'seconds')
             if(seconds < 90){
                cb(null,{mobile:Data.mobile,content:'对不起，你发送的短信还未过期,请输入验证码',state:0,seconds:90 - seconds})
             }
             else{
                 var RandomData = GetRandomNum();
                 var SendMsg = "尊敬的用户，你的验证码为:【"+RandomData + "】,90秒内有效。"
                 SendSmsMessage(Data.mobile,SendMsg).then(function(err,data){
                    result[0].sendtime = moment();
                    result[0].state = 0
                    result[0].content = RandomData
                    smshelper.app.models.TSmsmessage.upsert(result[0]).then(function(ret){
                        cb(null,{mobile:Data.mobile,content:'发送成功!',state:1})
                        return;
                    })
                 }).catch(function(err){
                     cb(null,{errid:1,errmsg:err})
                 })
             }
          }  
        })
    }

    function GetRandomNum(){
        var random = require("random-js")(); // uses the nativeMath engine
        var value = random.integer(1, 9999);
        value = value + '';
        if(value.length != 4){
            for(var i = 0;i < 4-value.length; i ++){
                value  = '0'+value;
            }
        } 
        return value
    }

    function SendSmsMessage(mobile,content){
         return new Promise(function (resolve, reject) {
            var apikey = "MjA5YTllODA2OWY3MTE0ZjFkMGRmODU5NWNiZjViOTg=";
            var account = "5295"
            var md5 = crypto.createHash('md5');
            var signstring = md5.update(apikey).digest('base64');

            var data ={
                account: account,
                mobile: mobile,
                text:content,
                sign : apikey
            };
            data = JSON.stringify(data); 

            var options = {
                host: '202.91.244.252',
                port: 30001,
                path:'/yqx/v1/sms/single_send',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': Buffer.byteLength(data)
                }
            };

            try {
                // //请求
                var postReq =  http.request(options, (res) => {
                if (res.statusCode == 200) { 
                    var getBodyData = ""
                        res.setEncoding('utf8');
                        res.on('data', (chunk) => {
                        getBodyData = getBodyData + chunk
                        });
                        res.on('end', () => {
                            console.log(getBodyData);
                            var ResultData = JSON.parse(getBodyData)
                            if(ResultData.code == 0){
                                resolve(null,'success')
                            }
                            else{
                                reject({errid:'senderror',errmsg:ResultData})
                            }
                        });
                }
                })
                postReq.on('error', (e) => {
                     reject(e.message)
                });
                // // 写入数据到请求主体
              
                postReq.write(data);
                postReq.end();

            }
            catch (e) {
                reject({errid:105,errmsg:'catch send err error'+ e.message})
            }
         })
    }

    smshelper.remoteMethod(
        'SmsValid',
        {
            http: { verb: 'get' },
            description: '验证短信',
            accepts: 
               [ { arg: 'data', type: 'object', description: '{"mobile":"18657181338","type":1,"code":"12345"}', root: true},
             ],
            returns: { arg: 'data', type: 'object', root: true }
        }
    );

    smshelper.SmsValid=function(Data,cb){
        var filter = {
            where : {
                and:[
                    {phone:Data.mobile},{type:Data.type},{state:0},{content:Data.code}
                ]
            }
        }
        smshelper.app.models.TSmsmessage.find(filter).then(function(result){
          if(result.length == 0){
                cb(null,{errid:'100',errmsg:'对不起,验证码错误!'})
          }
          else{
               var seconds =  moment().diff(moment(result[0].sendtime),'seconds')
                if(seconds > 90){
                     cb(null,{errid:'100',errmsg:'对不起,验证码过期!'})
                     return;
                }
                result[0].state = 1
                smshelper.app.models.TSmsmessage.upsert(result[0]).then(function(ret){
                    cb(null,{data:'success'})
                    return;
                })
          }  
        })
    }


   

    
    
};    
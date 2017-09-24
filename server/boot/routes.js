module.exports = function(app) {
  const express = require('express')
  const path = require('path')
  var fs = require('fs');
  var url = require("url");
  var crypto = require("crypto");
  var Hashids = require('hashids');
  var Utils = require("../../utils/index").Utils
  const uuidV4 = require('uuid/v4');
  const moment = require('moment')
  var multiparty = require('multiparty');
  var util = require('util');
  var bodyParser = require("body-parser");  
  /**wechat  */
  var config = require('../../wechat/config')();
  var WeiXin = require("../../wechat/main").WeiXin
  var co = require('co');
  function sha1(str){
    var md5sum = crypto.createHash("sha1");
    md5sum.update(str);
    str = md5sum.digest("hex");
    return str;
  }

app.use(bodyParser.urlencoded({ extended: false }));

  app.get('/token', function(req, res,next) {
    WeiXin.validToken(req, res)
  })
  app.use('/auth',function(req, res){
    var url = ""
    if(req.query.redirect_uri == undefined || req.query.redirect_uri == null){
      res.json({errid:"100",errmsg:"跳转路径未定义"})
    }
    if(req.query.redirect_uri.indexOf("#") > -1){
      //处理angularjs
      var stringcode =  req.query.redirect_uri.split('#')
      url = config.hosturl + "/wechatnav/?urlhost="+stringcode[0]+"urlparam_code_url"+stringcode[1]+"urlparam_type_url=3"
    }
    else{
      url =  config.hosturl + "/wechatnav/?urlhost="+req.query.redirect_uri+"urlparam_type_url=3"
    }
    var tokenUrl = config.wechatauth + '?appid='+config.appId+'&redirect_uri='+url+'&response_type=code&scope=snsapi_userinfo&state=1#wechat_redirect';
    res.redirect(tokenUrl);
  })
  app.use('/authbase',function(req, res){
    var url = ""
    var type = "";
    if(req.query.redirect_uri == undefined || req.query.redirect_uri == null){
      res.json({errid:"100",errmsg:"跳转路径未定义"})
    }
    //type = 1 未关注 type =2 已关注
    if(req.query.fromtype == undefined || req.query.fromtype == null){
      type = 1
    }
    else{
      type = req.query.fromtype
    }
    if(req.query.redirect_uri.indexOf("#") > -1){
      //处理angularjs
      var stringcode =  req.query.redirect_uri.split('#')
      url = config.hosturl + "/wechatnav/?urlhost="+stringcode[0]+"urlparam_code_url"+stringcode[1]+"urlparam_type_url="+type
    }
    else{
      url =  config.hosturl + "/wechatnav/?urlhost="+req.query.redirect_uri+"urlparam_type_url="+type
    }
    var tokenUrl = config.wechatauth + '?appid='+config.appId+'&redirect_uri='+url+'&response_type=code&scope=snsapi_base&state=1#wechat_redirect';
    res.redirect(tokenUrl);
  })
  app.get('/wechatnav/',function(req,res){
    var code = req.query.code
    WeiXin.getOpenIdByCode(config,code,function(err,data){
      if(err){
        res.json({errid:"wechatnav",errmsg:data});
      }else{
        var urlstring = req.query.urlhost
        var reqType = urlstring.split("urlparam_type_url")[1]
        reqType = reqType.replace("=","")
        if(reqType == "3"){
          WeiXin.getUserInfo(data,function(err,userdata){
            if(err){
              res.json({errid:"userinfo",errmsg:userdata});
              return;
            }
            app.models.TMember.find({"where":{wechatopenid:userdata.openid}}).then(function(result){
              if(result.length > 0){
                result[0].wechatopenid = userdata.openid
                result[0].wechatimg = userdata.headimgurl
                result[0].wechatname = userdata.nickname
                app.models.TMember.upsert(result[0]).then(function(model){
                    urlstring = urlstring.replace("urlparam_code_url","#").replace("urlparam_type_url","?from_wechat_type");
                    if(urlstring.length > 0 && urlstring.substr(urlstring.length-1,1) == "/"){
                      urlstring = urlstring.substr(0,urlstring.length-1)
                    }
                    var redurl = urlstring+"&openid="+userdata.openid
                    res.redirect(redurl);
                }).catch(function(err){
                  res.json({errid:"error",errmsg:JSON.parse(err)});
                })
              }
              else{
               var newobj = {
                 wechatopenid:userdata.openid,
                 wechatimg:userdata.headimgurl,
                 wechatname:userdata.nickname
                }
                app.models.TMember.upsert(newobj).then(function(modelData){
                    urlstring = urlstring.replace("urlparam_code_url","#").replace("urlparam_type_url","?from_wechat_type");
                    if(urlstring.length > 0 && urlstring.substr(urlstring.length-1,1) == "/"){
                      urlstring = urlstring.substr(0,urlstring.length-1)
                    }
                    var redurl = urlstring+"&openid="+data.openid
                    res.redirect(redurl);
                }).catch(function(err){
                  console.log("--insert error")
                   res.json({errid:"error",errmsg:JSON.parse(err)});
                })
              }
            })
            
          })
        }
        else if(reqType == "2"){
          WeiXin.getUserInfoAuth(config,data.openid,function(err,userdata){
            if(err){
              res.json({errid:"wechatnav",errmsg:err});
            }else{
              app.models.TMember.find({"where":{wechatopenid:userdata.openid}}).then(function(result){
                if(result.length > 0){
                  result[0].wechatopenid = userdata.openid
                  result[0].wechatimg = userdata.headimgurl
                  result[0].wechatname = userdata.nickname
                  app.models.TMember.upsert(result[0]).then(function(model){
                      urlstring = urlstring.replace("urlparam_code_url","#").replace("urlparam_type_url","?from_wechat_type");
                      if(urlstring.length > 0 && urlstring.substr(urlstring.length-1,1) == "/"){
                        urlstring = urlstring.substr(0,urlstring.length-1)
                      }
                      var redurl = urlstring+"&openid="+userdata.openid
                      res.redirect(redurl);
                  }).catch(function(err){
                    res.json({errid:"error",errmsg:JSON.parse(err)});
                  })
                }
                else{
                var newobj = {
                  wechatopenid:userdata.openid,
                  wechatimg:userdata.headimgurl,
                  wechatname:userdata.nickname
                  }
                  app.models.TMember.upsert(newobj).then(function(modelData){
                      urlstring = urlstring.replace("urlparam_code_url","#").replace("urlparam_type_url","?from_wechat_type");
                      if(urlstring.length > 0 && urlstring.substr(urlstring.length-1,1) == "/"){
                        urlstring = urlstring.substr(0,urlstring.length-1)
                      }
                      var redurl = urlstring+"&openid="+data.openid
                      res.redirect(redurl);
                  }).catch(function(err){
                    console.log("--insert error")
                    res.json({errid:"error",errmsg:JSON.parse(err)});
                  })
                }
              })
            }
          })
        }
        else{
          urlstring = urlstring.replace("urlparam_code_url","#").replace("urlparam_type_url","?from_wechat_type");
          if(urlstring.length > 0 && urlstring.substr(urlstring.length-1,1) == "/"){
            urlstring = urlstring.substr(0,urlstring.length-1)
          }
          var redurl = urlstring+"&openid="+data.openid
          res.redirect(redurl);
        }
      }
    })
  })
  app.get('/payment/wechat_order',function(req,res){
    if(req.query.openid == undefined || req.query.openid == null){
      res.json({errid:"100",errmsg:"openid 未定义"})
    }else{
      var openid = req.query.openid;
    }
    var ipAddress = Utils.requestIP(req);
    ipAddress = ipAddress == '127.0.0.1'?'':ipAddress
    /*order demo*/
    /*
    {attach:"cpay",body:"ceshineirong",notify_url:"",code:"dd123456",money:"1"}
    */
    /**插入数据库订单*/
    co(function* () {
      var retData = {};
      var listData = yield app.models.TMember.find({"where":{wechatopenid: req.query.openid}});
      if(typeof listData =='undefined'|| listData == null){
              res.json({errid:"100",errmsg:'cannot find userMessage'});
      }
      var CurrMemBill = {}
      CurrMemBill.membillguid = uuidV4()
      CurrMemBill.memid = listData[0].memberid
      CurrMemBill.membillamount = req.query.costmoney
      CurrMemBill.billcosttime = moment.utc()
      CurrMemBill.paystate = 0
      var resultCreate = yield app.models.TMembill.create(CurrMemBill)
      if(typeof resultCreate.membillid =='undefined'|| resultCreate.membillid == null){
        res.json({errid:"100",errmsg:'create bill error'});
      }

      var order = {
        attach:resultCreate.membillguid,
        body: uuidV4(),
        notify_url:"http://www.iwmemory.com/payment/wechat_notify",
        code:resultCreate.membillguid,
        money:resultCreate.membillamount  * 100
      }
      
      WeiXin.PackageParam(config,openid,ipAddress,order,function(err,data){
        if(err){
          console.log(err)
          res.json({errid:"100",errmsg:err});
        }else{
          res.json(data);
        }
      })
    })
    .catch(function(errMsg){
       res.json({errid:"100",errmsg:errMsg});
    })

  })
  app.use('/payment/wechat_notify',function(req,res){
    WeiXin.notify(req,res,function(err,data){
      if(err){
        console.log(err)
        res.json({errid:"100",errmsg:err});
      }else{
        app.models.TWechatcallback.upsert(data).then(function(model){
          if(model.returnCode == 'SUCCESS'){
            if(model.attach != null && model.attach != '')
              app.models.TMembill.updateAll({membillguid:model.attach},{paystate:1},function(err,info){
                if(err){
                  console.log(err)
                }
              })
          }
        }).catch(function(error){
          res.json({errid:"100",errmsg:error});
        })
      }
    })
  })
  app.use('/payment/test',function(req,res){
    WeiXin.getToken(config,function(err,data){
      if(err){
        res.json({errid:"100",errmsg:err});
      }else{
        res.json(data);
      }
    })
     
  })
  app.use('/jssdk/Signature',function(req,res){
    console.log(req.query.url)
    WeiXin.getSignaturejs(config,req.query.url,function(err,data){
      if(err){
        res.json({errid:"100",errmsg:err});
      }else{
        res.json(data);
      }
    })
  })
  app.post('/file/uploading', function(req, res, next){
    var uploadDir = "./client/public/files/"
    var UrlDir = "/public/files/"
    //生成multiparty对象，并配置上传目标路径
    var form = new multiparty.Form({uploadDir: uploadDir});
    //上传完成后处理
    form.parse(req, function(err, fields, files) {
      var filesTmp = JSON.stringify(files,null,2);
      if(err){
        console.log(err)
        res.json({errid:"100",errmsg:err});
      } else {
        var inputFile = files.file[0];
        var uploadedPath = inputFile.path;
        var NewFileName = uuidV4() + "."+ inputFile.originalFilename.substring(inputFile.originalFilename.lastIndexOf('.') + 1);
        var dstPath = uploadDir + NewFileName ;
        //重命名为真实文件名
        fs.rename(uploadedPath, dstPath, function(err) {
          if(err){
            console.log('rename error: ' + err);
          } else {
            console.log('rename ok');
          }
          var ImgsModel = {
            tableid:fields.code[0],
            tablename:fields.codetable[0],
            addtime:new Date(),
            imgpath:UrlDir + NewFileName
          }
          console.log(ImgsModel)
          app.models.TImgs.create(ImgsModel).then(function(err){
            if(err)
            {
              res.json(err)
            }
          })
          .catch(function(err){
            res.json({errid:"100",errmsg:err});
          })
        });
      }

    
    });
   })
}
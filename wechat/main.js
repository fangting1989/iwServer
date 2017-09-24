//微信相关的方法
//?appid=wx8888888888888888&secret=aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa&code=00b788e3b42043c8459a57a8d8ab5d9f&grant_type=authorization_code
var request = require('request');
var url = require("url");
var fs = require('fs');
var iconv = require('iconv-lite');
var BufferHelp = require('bufferhelper');
var crypto = require("crypto");
var config = require("./config")()

function sha1(str){
  var md5sum = crypto.createHash("sha1");
  md5sum.update(str);
  str = md5sum.digest("hex");
  return str;
}


var wechatCom = {
	key:config.wechatpay_key,
	raw: function(args) {  
        var keys = Object.keys(args);  
        keys = keys.sort()  
        var newArgs = {};  
        keys.forEach(function(key) {  
            newArgs[key] = args[key];  
        });  
        var string = '';  
        for (var k in newArgs) {  
            string += '&' + k + '=' + newArgs[k];  
        }  
        string = string.substr(1);  
        return string;  
    },
	// 随机字符串产生函数  
	createNonceStr:function() {  
		return Math.random().toString(36).substr(2, 15);  
	},
	writeFile:function(path, str, cb) {
		var writestream = fs.createWriteStream(path);

		writestream.write(str);
		writestream.on('close', function() {
			cb && cb();
		});
	},
	readFile:function(path, cb) {
		fs.exists(path, function (exists) {
			if(exists === false){
				fs.writeFile(path, '{}', function (err) {
					if (err) throw err;
					try{
						var readstream = fs.createReadStream(path);
						var bf = new BufferHelp();
						readstream.on('data', function(chunk) {
							bf.concat(chunk);
						});
						readstream.on('end', function() {
							cb && cb(wechatCom.decodeBuffer(bf));
						});
					}
					catch(e){
						
					}
				});
			}else{
				try{
					var readstream = fs.createReadStream(path);
					var bf = new BufferHelp();
					readstream.on('data', function(chunk) {
						bf.concat(chunk);
					});
					readstream.on('end', function() {
						cb && cb(wechatCom.decodeBuffer(bf));
					});
				}
				catch(e){
					
				}
			}
		})
		
	},
	decodeBuffer:function(bf, encoding) {
		var val = iconv.decode(bf.toBuffer(), encoding || 'utf8');
		if (val.indexOf('�') != -1) {
			val = iconv.decode(bf.toBuffer(), 'gbk');
		}
		return val;
	},
	// 时间戳产生函数 
	createTimeStamp:function() {  
		return parseInt(new Date().getTime() / 1000) + '';  
	},
	getXMLNodeValue: function(node_name, xml) {
		try{
			xml = xml+"";
        	var tmp = xml.split("<" + node_name + ">");  
        	var _tmp = tmp[1].split("</" + node_name + ">");  
        	return _tmp[0];
		}
		catch(e){
			throw new Error('xml 解析错误');
		}
	  
    },
	getWechatXmlNodeValue:function(node_name, xml){
		try{
			var tempstr = wechatCom.getXMLNodeValue(node_name, xml);
			var tmp = tempstr.split('[');  
			var tmp1 = tmp[2].split(']');
			return tmp1[0];
		}
		catch(e){
			throw new Error('xml 解析错误');
		}
	},
	paysignjs: function(appid, nonceStr, package, signType, timeStamp) {  
        var ret = {  
            appId: appid,  
            nonceStr: nonceStr,  
            package: package,  
            signType: signType,  
            timeStamp: timeStamp  
        };  
        var string = this.raw(ret);  
        string = string + '&key=' + wechatCom.key;  
        var sign = crypto.createHash('md5').update(string, 'utf8').digest('hex');  
        return sign.toUpperCase();  
    }
}

exports.WeiXin = {
	getToken:function(config,cb){
		wechatCom.readFile(config.cache_json_file + '/cache.json', function(str) {
			var obj = null
			try{
				obj = JSON.parse(str)
			}
			catch(e){
				wechatCom.writeFile(config.cache_json_file + '/cache.json',"{}")
				obj = {}
			}
			
			if(typeof obj != 'undefined'){
				 if(typeof obj.createtime == 'undefined' || (new Date().getTime() - obj.createtime) > 7000000){
					var tokenUrl = 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appId=' + config.appId + '&secret=' + config.appSecret;
					request.get(tokenUrl, function(error, response, body) {
						if (error) {
							cb('getToken error', error);
						}
						else {
							try {
								var cacheobj = {access_token:JSON.parse(body).access_token,createtime:new Date().getTime()}
								wechatCom.writeFile(config.cache_json_file + '/cache.json',JSON.stringify(cacheobj))
								var token = JSON.parse(body).access_token;
								cb(null, token);
							}
							catch (e) {
								cb('getToken error', e);
							}
						}
					});
				 }else{
					 cb(null, obj.access_token);
				 }
			}
		})
	},
	getNewTicket:function(token, cb) {
		request.get('https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=' + token + '&type=jsapi', function(error, res, body) {
			if (error) {
				cb('getNewTicket error', error);
			}
			else {
				try {
					console.log(JSON.parse(body));
					var ticket = JSON.parse(body).ticket;
					cb(null, ticket);
				}
				catch (e) {
					cb('getNewTicket error', e);
				}
			}
		});
	},
	getSignaturejs:function(config,requrl,cb){
		this.getToken(config,function(err,data){
			request.get('https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=' + data + '&type=jsapi', function(error, res, body) {
				if (error) {
					cb('getNewTicket error', error);
				}
				else {
					try {
						console.log(JSON.parse(body));
						var ticket = JSON.parse(body).ticket;
						var timestamp = wechatCom.createTimeStamp();
						var noncestr = wechatCom.createNonceStr();
						console.log(config.iwwechat_url)
						var show_url = ""
						if(requrl == null){
							show_url= "http://fd123456.yunland.cn/iwwechat/www/"
						}
						else{
							show_url = requrl
						}
						
						console.log()
						var str = 'jsapi_ticket=' + ticket + '&noncestr='+ noncestr+'&timestamp=' + timestamp + '&url=' + show_url;
						console.log(str);
						var signature = crypto.createHash('sha1').update(str).digest('hex');
						cb(null, {
							appId: config.appId,
							ticket:ticket,
							timestamp: timestamp,
							nonceStr: noncestr,
							signature: signature
						});
					}
					catch (e) {
						cb('getNewTicket error', e);
					}
				}
			});
		})
	},
	getOpenIdByCode: function(config, code, cb) {
		var tokenUrl = 'https://api.weixin.qq.com/sns/oauth2/access_token?appId=' + config.appId + '&secret=' + config.appSecret+'&code=' + code + '&grant_type=authorization_code';
		request.get(tokenUrl, function(error, response, body) {
			if (error) {
				cb(error, 'getOpenIdByCode error');
			} else {
				try {
					cb(null, JSON.parse(body));
				} catch(e) {
					cb(e, 'getOpenIdByCode error');
				}
			}
		});
	},
	getUserInfo:function(body,cb){
		try {
				//请求
				tokenUrl = "https://api.weixin.qq.com/sns/userinfo?access_token=" + body.access_token + "&openid=" + body.openid+"&lang=zh_CN"
				request.get(tokenUrl, function(err, res, data) {
						if (err) {
							cb(err, 'getUserMessage request error');
						} else {
							try {
								cb(null, JSON.parse(data));
							} catch(e) {
								cb(e, 'getUserMessage error');
							}
						}
					})
			}
			catch (e) {
					cb(e, 'getUserAccessToken error');
			}
	},
	getUserInfoAuth:function(config,openid,cb){
		this.getToken(config,function(err,data){
			try {
				//请求
				tokenUrl = "https://api.weixin.qq.com/cgi-bin/user/info?access_token=" + data + "&openid=" + openid+"&openid=OPENID&lang=zh_CN"
				request.get(tokenUrl, function(err, res, backdata) {
						if (err) {
							cb(err, 'getUserMessage request error');
						} else {
							try {
								cb(null, JSON.parse(backdata));
							} catch(e) {
								cb(e, 'getUserMessage error');
							}
						}
					})
			}
			catch (e) {
					cb(e, 'getUserAccessToken error');
			}
		})
	},
	//微信支付 http://fd123456.yunland.cn/payment/wechat_notify
	PackageParam:function(config,openid,ip,order,cb){
		var Url = 'https://api.mch.weixin.qq.com/pay/unifiedorder'
		
		let obj = {
			appid: config.appId,
			attach : order.attach,
			body: order.body,
			mch_id:config.mach_id,
			nonce_str:wechatCom.createNonceStr(),
			notify_url:order.notify_url,
			openid:openid,
			out_trade_no:"dd"+wechatCom.createTimeStamp(),
			total_fee:order.money,
			trade_type:'JSAPI'
    	};
		if(ip!= ''){
			obj.spbill_create_ip =ip
		}
		var string = wechatCom.raw(obj);  
        string = string + '&key=' +  wechatCom.key; //key为在微信商户平台(pay.weixin.qq.com)-->账户设置-->API安全-->密钥设置  
        console.log(string)
		var sign = crypto.createHash('md5').update(string, 'utf8').digest('hex');  
        var signstring =  sign.toUpperCase();
		var bodyData = '<xml> ' +
			'<appid>'+obj.appid+'</appid> ' +
			'<attach>'+obj.attach+'</attach> ' +
			'<body>'+obj.body+'</body> ' +
			'<mch_id>'+obj.mch_id+'</mch_id> ' +
			'<nonce_str>'+obj.nonce_str+'</nonce_str> ' +
			'<notify_url>'+obj.notify_url+'</notify_url>' +
			'<openid>'+obj.openid+'</openid> ' +
			'<out_trade_no>'+obj.out_trade_no+'</out_trade_no>'+
			'<spbill_create_ip>'+(typeof(obj.spbill_create_ip) == 'undefined'?'':obj.spbill_create_ip) +'</spbill_create_ip> ' +
			'<total_fee>'+obj.total_fee+'</total_fee> ' +
			'<trade_type>'+obj.trade_type+'</trade_type> ' +
			'<sign>'+signstring+'</sign> ' + // 此处必带签名， 否者微信在验证数据的时候是不通过的
			'</xml>';
			console.log(bodyData)
		request({url:Url,method:'POST',body:bodyData}, function (err, response, data) {
			if (!err && response.statusCode == 200) {
				var resultCode = null;
				console.log(data)
				try{
					resultCode = wechatCom.getWechatXmlNodeValue('result_code', data.toString("utf-8"));
					if(resultCode == 'FAIL'){
						cb("Error",wechatCom.getWechatXmlNodeValue('err_code_des', data.toString("utf-8")))
						return
					}
				}
				catch(e){
					cb("Error","XML 解析错误!")
					return
				}
                var prepay_id = wechatCom.getXMLNodeValue('prepay_id', data.toString("utf-8")); 
                var tmp = prepay_id.split('[');  
                var tmp1 = tmp[2].split(']');  
                //签名
				var signtimeStamp = wechatCom.createTimeStamp()
				
                var _paySignjs = wechatCom.paysignjs(obj.appid, obj.nonce_str, 'prepay_id=' + tmp1[0], 'MD5', signtimeStamp);  
                var args = {  
                    appId: obj.appid,  
                    timeStamp: signtimeStamp,  
                    nonceStr: obj.nonce_str,  
                    signType: "MD5",  
                    package: 'prepay_id='+tmp1[0],  
                    paySign: _paySignjs  
                };
				cb(null,args)
			}
			else{
				cb(err, 'getUserAccessToken error');
			}
    	})
	},
	validToken:function(req,res)  {
	  var query = url.parse(req.url,true).query;
	  var signature = query.signature;
	  var echostr = query.echostr;
	  var timestamp = query['timestamp'];
	  var nonce = query.nonce;
	  var oriArray = new Array();
	  oriArray[0] = nonce;
	  oriArray[1] = timestamp;
	  oriArray[2] = "iw_wechat_token";
	  oriArray.sort();
	  var original = oriArray.join('');
	  var scyptoString = sha1(original);
	  if(signature == scyptoString){
        console.log("valid wechat server success!")
        res.end(echostr);
      }else {
        res.end("false");
        console.log("valid wechat server falid!")
      }
	},
	notify:function(req,res,cb){
		console.log("=================wechat pay callback===============")
		var data='';
		req.setEncoding('utf8');
		req.on('data', function(chunk) {
		data += chunk;
		});

		req.on('end', function() {
			console.log("=================wechat pay callback data===============")
			console.log(data)
			req.rawBody = data;
			try{
				var newObj = {};
				newObj.appid = wechatCom.getWechatXmlNodeValue('appid', data.toString("utf-8"));
				newObj.attach = wechatCom.getWechatXmlNodeValue('attach', data.toString("utf-8"));
				newObj.cashFee = wechatCom.getWechatXmlNodeValue('cash_fee', data.toString("utf-8"));
				newObj.feeType = wechatCom.getWechatXmlNodeValue('fee_type', data.toString("utf-8"));
				newObj.isSubscribe = wechatCom.getWechatXmlNodeValue('is_subscribe', data.toString("utf-8"));
				newObj.mchId = wechatCom.getWechatXmlNodeValue('mch_id', data.toString("utf-8"));
				newObj.nonceStr = wechatCom.getWechatXmlNodeValue('nonce_str', data.toString("utf-8"));
				newObj.openid = wechatCom.getWechatXmlNodeValue('openid', data.toString("utf-8"));
				newObj.outTradeNo = wechatCom.getWechatXmlNodeValue('out_trade_no', data.toString("utf-8"));
				newObj.resultCode = wechatCom.getWechatXmlNodeValue('result_code', data.toString("utf-8"));
				newObj.returnCode = wechatCom.getWechatXmlNodeValue('return_code', data.toString("utf-8"));
				newObj.totalFee = wechatCom.getXMLNodeValue('total_fee', data.toString("utf-8"));
				newObj.timeEnd = wechatCom.getWechatXmlNodeValue('time_end', data.toString("utf-8"));
				newObj.tradeType = wechatCom.getWechatXmlNodeValue('trade_type', data.toString("utf-8"));
				newObj.transactionId = wechatCom.getWechatXmlNodeValue('transaction_id', data.toString("utf-8"));
				cb(null,newObj)
			}
			catch(e)
			{

				cb(e,"解析xml错误")
			}
			console.log("==========================");
		});
	}
}
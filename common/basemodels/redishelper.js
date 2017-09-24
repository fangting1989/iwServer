module.exports = function (redishelper) {
    var redis   = require('redis');
    var Promise = require('bluebird');
   
    var client = null
    redishelper.connect=function(){
        return new Promise(function(resolve, reject){
            client  = redis.createClient('6379', '192.168.15.90');
            client.on("error", function(err) {
                console.log('redis--connect---error')
                reject(err);
            });
            client.on('ready',function(err){
                if(typeof err == 'undefined')
                {
                    console.log('redis--connect---ready')
                    resolve(client)
                }
            })
        })
    };

    redishelper.close = function(redisObject){
        redisObject.end();
    }
    //设置内容
    redishelper.set = function(key,value,timeout){
        if(redis == null || redis == 'undefined'){
            return new Promise.reject('redis undefined')
        }
        return new Promise(function(resolve, reject){
            client.set(key, value,function(error, data){
                if (error) {
                    reject(error);
                } else {
                    if(timeout != null)
                        client.expire(key, timeout);
                    resolve(data)
                }
            });
        });
    }
    //获得内容
    redishelper.get = function(key){
        if(redis == null || redis == 'undefined'){
            return new Promise.reject('redis undefined')
        }
        return new Promise(function(resolve, reject){
            client.get(key,function(error,data){
                if(error){
                    reject(error);
                } else {
                    resolve(data)
                }
            })
        })
        
    }
    //red data demo
    // redishelper.connect().then(function(redisClient){
    //     return redishelper.set('ccc','ceshineirong',30)
    // })
    // .then(function(result){
    //     if(result == 'OK'){
    //         return redishelper.get('ccc')
    //     }
    // })
    // .then(function(result){
    //     redishelper.close(client)
    //     console.log(result)
    // })
    // .catch(function(err){
    //     console.log(err)
    // })
    // .finally(function() {
    //      redishelper.close()
    // });
};    
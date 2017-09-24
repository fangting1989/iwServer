module.exports = function (rethinkdbhelper) {
   var WeiXin = require('../../config/weixinconfig')
   console.log(WeiXin.Config)
   var r = require('rethinkdbdash')({servers: [{host: '192.168.15.90', port: 28015}]});
   r.db("cachedb").table('user').filter({id:123}).run().then(function(result) {
        
        console.log('rethinkdb connect success')
        //console.log(result)

        
    });
};    
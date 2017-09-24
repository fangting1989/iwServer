module.exports = function(User) {
  var co = require('co');
  User.remoteMethod(
        'LoginInfo',
        {
            http: { verb: 'post' },
            description: '账户登入',
            accepts: { arg: 'data', type: 'object', description: '{"UserName":"admin","UserPwd":"admin"}', root: true, http: { source: 'body' } },
            returns: { arg: 'data', type: 'object', root: true }
        }
    );

    User.LoginInfo = function (Data, cb) {
      if(typeof Data.username == 'undefined' || typeof Data.userpwd == 'undefined'){
         cb(null,{ errid:"100",errmsg:"noData" })
      }
      co(function* () {
        var result = yield User.app.models.TUser.findOne({"where":{"and":[{usermobile:Data.username},{userpwd:Data.userpwd}]}})
        if(result){
          cb(null, result);
        }
        else{
          cb(null,{ errid:"100",errmsg:"对不起，用户名密码错误" })
        }
        return result;
      })
      .catch(function(err){
         cb(null,{ errid:"100",errmsg:err })
      });


        // .then(function(result){
        //   if(!result){
        //     cb('Error', { "Result": "Error" });
        //   }else{
        //     console.log(result)
        //     cb(null,"ceshineirong")
        //   }
          
        // })
       
    }
};

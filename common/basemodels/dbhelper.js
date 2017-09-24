module.exports = function (dbhelper) {
    var Promise = require('bluebird')
    DoSQL = function (SQL, resultFun) {
        
        console.log(SQL);
        var dataSource = dbhelper.app.datasources.mysql;
        dataSource.connector.execute(SQL, resultFun);
    }

    _ExecuteSQL = function (SQL, resultFun) {
        try {
            console.log(SQL);
            var dataSource = dbhelper.app.datasources.mysql;
            dataSource.connector.execute(SQL, resultFun);
        } catch (ex) {
            throw ex;
        }
    }

    ExecuteSyncSQLResult = function (bsSQL, ResultObj) {
        return new Promise(function (resolve, reject) {
            ExecuteSQLResult(bsSQL, ResultObj, resolve, reject)
        });
    }


    ExecuteSQLResult = function (SQL, ResultObj, resolve, reject) {
        try {
            _ExecuteSQL(SQL, function (err, result) {
                if (err) {
                    reject(err);
                } else {
                    if (ResultObj)
                        ResultObj.Result = result;
                    resolve(result);
                }
            })
        } catch (ex) {
            throw ex;
        }
    }


    ExecuteSQL = function (SQL, resolve, reject) {
        try {
            _ExecuteSQL(SQL, function (err, result) {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            })
        } catch (ex) {
            throw ex;
        }
    }


    

    ToLower = function (obj) {
        for (var p in obj) { // 方法 
            if (typeof (obj[p]) != "function") {
                //转化成小写
                var lowPropName = p.toString().toLowerCase();
                obj[lowPropName] = obj [p];
                //删除原有属性
                 delete obj[p];
            } 
        }
        return obj;
    }

    

};    
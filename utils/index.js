/*  云地nodejs库 */
exports.Utils = {
    version:"1.0",
    requestIP:function(req){
        console.log(req.header('x-forwarded-for'))
        var ipAddress;
        var forwardedIpsStr = req.header('x-forwarded-for'); 
        if (forwardedIpsStr) {
            var forwardedIps = forwardedIpsStr.split(',');
            ipAddress = forwardedIps[0];
        }
        if (!ipAddress) {
            ipAddress = req.connection.remoteAddress;
        }
        return ipAddress;
    }
}
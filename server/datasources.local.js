module.exports = {
    storage:{ //  "storage" 是之前创建存储组件数据源时取的名字
        allowedContentTypes:['application/msword', 'image/jpg', 'image/png', 'image/jpeg', 'image/tiff'],   // 限定上传文件的类型
        maxFileSize: 50 * 1024 * 1024, // 限定上传文件大小为50M
        getFilename:function(fileInfo){
            var fileName = fileInfo.name.replace(/\s+/g, '-').toLowerCase();
            var dotPosition = fileName.lastIndexOf('.');
            var name = fileName.substring(0, dotPosition);
            var extension = "";
            if (dotPosition !== -1){
                extension = fileName.substring(dotPosition);
            }
            return name + '-' + Date.now() + extension; //给文件名加上时间戳
        }
    }
};
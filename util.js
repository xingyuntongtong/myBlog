//对字符串进行md5加密，update指定输入 digest进行输出  hex十六进制
exports.md5=function(str){
    return require('crypto').createHash('md5').update(str).digest('hex');
};
//不管输入多少东西，它的密码就是16个字节，2个是一个字节
//用十六进制是因为长度固定好管理，10进制不行
//console.log(exports.md5('haha'));



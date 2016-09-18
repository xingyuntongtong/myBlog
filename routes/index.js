var express = require('express');
var router = express.Router();

/* GET home page. */
//首页
router.get('/', function(req, res, next) {
  //渲染模板=模板+数据 后面的数据也可以require进来
    res.redirect('/article/list');//这里是匹配模板的
});

module.exports = router;

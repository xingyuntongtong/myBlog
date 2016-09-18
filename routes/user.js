var express = require('express');
var util = require('../util');
var middleware = require('../middleware');
var router = express.Router();

/* GET users listing. */
//获取注册的路由
router.get('/reg',middleware.checkNotLogin, function(req, res, next) {
  //是个相对路径 是相对于views的路径 不能写成../views/user/reg
    res.render('user/reg');//最后它会和app.js里面的res.locals合并在输出
});
//接收用户的注册表单
router.post('/reg',middleware.checkNotLogin,function(req,res,next){
  var user=req.body; //里面会有这样一个对象{username,password..}
  if(user.password != user.repassword){
      //两个参数表示赋值 一个参数表示取值，累加在一起它是一个数组  第一个参数表示类型
      req.flash('error','密码和重复密码不一致!');
      res.redirect('back');//回到上一个路径如果两次密码不一样
  }
  //1.对密码进行md5加密
  user.password=util.md5(user.password);
  //得到我的头像地址  s=30是头像的大小
  user.avatar=`https://secure.gravatar.com/avatar/${util.md5(user.email)}?s=30`;
    //查找username里面有没有同名记录  Model('User')：数据库的模型
  Model('User').findOne({username:user.username}).then(function(userDb){
      if(userDb){
        //如果有同名的记录，则注册失败，编写一个错误提示
          req.flash('error','此用户名已经被占用!');
          return Promise.reject();
          //返回失败的回调直接到下面的catch里面 它直接创建了一个失败的Promise的实例
      }else{//没有就创建一个
          return Model('User').create(user);//返回的是Promise的实例
      }
  }).then(function(doc){
      req.session.user=doc;//给当前用户的会话赋一个user属性
      //实现规划 写入session 返回给客户端 提示注册成功
      req.flash('success','恭喜！此用户注册成功!');
      res.redirect('/');
  }).catch(function(err){
      console.log(err);
      req.flash('error',err.toString());
      res.redirect('back');
  });

});
//登录的路由
router.get('/login',middleware.checkNotLogin, function(req, res, next) {
    res.render('user/login');
});
router.post('/login',middleware.checkNotLogin, function(req, res, next) {
    var user = req.body;
    user.password = util.md5(user.password);
    Model('User').findOne(user).then(function(user){
        if(user){
            req.session.user = user;
            req.flash('success','登录成功');
            res.redirect('/');
        }else{
            req.flash('error','用户名或密码错误');
            res.redirect('back');
        }
    }).catch(function(err){
        req.flash('error','服务器端错误');
        res.status(500).send('服务器端错误');
    })
});
//退出的路由
router.get('/logout',middleware.checkLogin, function(req, res, next) {
    req.session.user = null;
    res.redirect('/user/login');
});
module.exports = router;

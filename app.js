var express = require('express');
//path 用来处理路径的  join 连接路径  resolve 从当前路径出发，得到绝对路径
var path = require('path');
//收藏夹图标
var favicon = require('serve-favicon');
//记录请求日志的，请求的url地址，请求的方法名，响应的时间 响应体的大小
var logger = require('morgan');
//解析cookie 会在req上多了一个cookies属性  req.cookies 它会把请求头中的cookie取出来，
//比如 name=zfpx; age=6, 然后把它转成对象，赋值给req.cookies,使用querystring.parse模块转换
var cookieParser = require('cookie-parser');
//引入session中间件
var session = require('express-session');
var flash = require('connect-flash');

//解析请求体 req.body  会在req上多了一个body属性
var bodyParser = require('body-parser');
require('./db');

//导入路由模块
var routes = require('./routes/index');
var user = require('./routes/user');
var article = require('./routes/article');//文章路由模块

var app = express();

// view engine setup  设置模板引擎
//views：设置模板的存放目录 都在当前目录的views文件夹中，所以引用的时候可以不用写views
app.set('views', path.join(__dirname, 'views'));
//设置模板引擎 view engine 用的是html 也可以直接用ejs
app.set('view engine', 'html');
//如果是html模板，使用ejs的方法来进行渲染
app.engine('html',require('ejs').__express);

// uncomment after placing your favicon in /public 在放置你的logo图标的时候取消注释
// 当客户端访问favicon.ico路径的时候，返回public/favicon.ico
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
//dev是格式的一种  请求的方法 请求路径 响应状态码 响应时间 响应体的大小
              // GET /stylesheets/style.css 200 10.693 ms - 111
app.use(logger('dev'));//写日志的
//解析json格式的请求体
app.use(bodyParser.json());
//解析查询字符串格式的请求 key=value&key2=value2
// extended true ,把查询字符串转对象用querystring模块
// 如果有false,使用bodyParser自己写的一个转换方法
app.use(bodyParser.urlencoded({ extended: false }));
//解析cookie
app.use(cookieParser());
//它依赖于cookie所以写在它的下面 使用了这个中间件之后会多了一个req.session对象属性
app.use(session({
    resave:true,//每次请求都要重新保存session
    saveUninitialized:true,//保存未初始化的session
    secret:'tong'//加密cookie用的
}));
//如果使用这个插件以后会有一个 req.flash对象
app.use(flash());
app.use(function(req,res,next){
  //消息一旦取出则清除
  //真正渲染模板的对象是res.locals
    res.locals.success=req.flash('success').toString();//它是一个数组得转成字符串
    res.locals.error=req.flash('error').toString();
    res.locals.user = req.session.user;
    res.locals.keyword = '';
    next();
});
//静态文件中间件 当请求到来的时候先去public目录下找，如果找到返回，找不到继续next看路由能不能匹配上
app.use(express.static(path.join(__dirname, 'public')));
//第一个参数 表示 以这个路径开头
app.use('/', routes);
//当路径 /users/add也可匹配到
app.use('/user', user);
//启用这几个路由
app.use('/article', article);

// catch 404 and forward to error handler  捕获404错误并转发到错误处理程序(中间件)
//如果走到这里，意味着静态文件中间件，路由也没有匹配上
app.use(function(req, res, next) {
      /*var err = new Error('Not Found');
     err.status = 404;
     next(err);//next如果传了错误对象会交给错误中间件来处理*/
    res.render('404');
});

// error handlers

// development error handler  开发时的错误处理器
// will print stacktrace  将打印详细错误
if (app.get('env') === 'development') {
  //没有调用 next 所以不会在继续执行 所有和下面的代码不会一起执行
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler  生产环境的错误处理
// no stacktraces leaked to user  不向终端用户泄漏错误信息
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;

/**
 * 这个文件只能叫Index 不能叫别的不然找不到
 * 定义model和Schema 连接数据库
 */
var mongoose=require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;
mongoose.Promise=Promise;
mongoose.connect('mongodb://localhost:27017/201606blog');
//创建用户的schema  记录用户的用户名。。。
var UserSchema=new mongoose.Schema({
    username:{type:String,required:true},//用户名
    password:{type:String,required:true},//密码
    email:{type:String},//邮箱
    avatar:{type:String}//头像 使用全球通用头像，通过邮箱得到
});
//定义一个模型
mongoose.model('User',UserSchema);

var ArticleSchema = new mongoose.Schema({
    title:String,
    content:String,
    pv:{type:Number,default:0},
    comments:[{user:{type:ObjectId,ref:'User'},content:String,createAt:{type:Date,default:Date.now()}}],
    createAt:{type:Date,default:Date.now()},
    user:{type:ObjectId,ref:'User'}
});
mongoose.model('Article',ArticleSchema);

//为global上赋一个全局变量 model全局可以用
global.Model=function(modelName){
    return mongoose.model(modelName);
};







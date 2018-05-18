
//加载模块
var express=require('express');
var swig=require('swig');
var mysql=require('mysql');
var bodyParser=require('body-parser');
var cookies=require('cookies');
//创建app应用,相当于http的createServer()
var app=express();

var port=8088;

//bode-parser模块设置，这些设置必须放在路由设置的前面才会有效，不然req.body的返回是空的
// app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.urlencoded({ extended: false }))  
// parse application/json  
app.use(bodyParser.json())

app.use(function(req,res,next){
    req.cookies=new cookies(req,res);
    //解析登录信息的cookie
    req.userInfo={};
    if(req.cookies.get('userInfo')){
      try {
        req.userInfo=JSON.parse(req.cookies.get('userInfo'));
      } catch (error) {
        
      }
    }
   
    next();
})
//设置静态文件托管，当用户访问的url以/public开始时，那么直接返回对应__dirname+'/public'下的文件

app.use('/public',express.static(__dirname+'/public'));
//根据不同的功能划分模块
app.use('/admin',require('./routers/admin'));
app.use('/',require('./routers/index'));
app.use('/api',require('./routers/api'))
//定义模板引擎,都一个参数表示模板的名称，第二个参数表示定义解析模板的方法
app.engine('html',swig.renderFile);
//定义模板文件存放的位置
app.set('views','./views');
//注册模板引擎
app.set('view engine','html');

swig.setDefaults({cache:false});
//app.get或post可以将一个url地址与一个或者多个函数进行绑定

// app.get('/',function(req,res,next){
//     console.log('22');
//     res.render('index');//读取指定目录（view）下的文件，解析并返回给客户端，
//                       //第一个参数表示模板文件的目录(相对于view的文件夹),第二个参数表示传递给模板使用的数据
// }); 


//加载数据库模块
 var connection=mysql.createConnection({
  host:'localhost',
  user:'root',
  password:'123456',
  database:'nodejs',
  port:'3306'
});

connection.connect(function(err){
      if(err){
        console.log(err);
        return ;
      }
      console.log('connection suceed!')
});

var server = app.listen(3000, function () {
    var host = server.address().address;
    var port = server.address().port;
  
    console.log('Example app listening at http://%s:%s', host, port);
  });



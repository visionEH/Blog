

var express =require('express');
var sql=require('../db/sql')
var router=express.Router();

var responseDate;//统一默认返回格式
router.use(function(req,res,next){
    responseDate={
        code:0,
        message:''
    }
    next();
})
/**
 * 登录检测
 * 
 */
router.post('/admin/login',function(req,res,next){
        console.log('come');
        console.log(req.body);
        var username=req.body.username;
        var password=req.body.password;

        if(username==''){
          responseDate.code=1;
          responseDate.message='用户名不能为空';
          res.json(responseDate);
          return;
        }else if(password==''){
            responseDate.code=1;
            responseDate.message='密码不能为空';
            res.json(responseDate);
            return ;
        }else{
          var where ="username='"+username+"' and password='"+password+"'";
          sql.find('user',where,function(err,date){
              if(err){
                  console.log(err);
              }
              if(date[0]==null){
                  //表示没有该元素
                  responseDate.code=2;
                  responseDate.message='用户名或密码不存在';
              }else{ 
                  responseDate.message='登录成功';
                //用JSON.stringify将json转化为字符串，不然存不进去
                  req.cookies.set('userInfo',JSON.stringify({
                    id:date[0].Id,
                    username:date[0].username
                  }));
                 
              }
              res.json(responseDate);
              return ;
          })
        }
      
        

});

module.exports=router;


var express =require('express');

var router=express.Router();
var db=require('../db/sql');

var count=5;//表示一页最多显示的数据量
/**
 * 登录界面，并将之前的用户cookie清除
 */
router.get('/login',function(req,res,next){
        req.cookies.set('userInfo',null);
        res.render('../views/admin/login');
});
//管理员首页
router.get('/',function(req,res,next){
        
        console.log(req.userInfo);
        res.render('../views/admin/index',{
                userInfo:req.userInfo
        });
});
/**
 * 分类首页
 */
router.get('/category',function(req,res,next){
        
        var userInfo=req.userInfo;
        if(!userInfo){
               //表示用户没有登录 
               return ;
        }
        var where='ownId='+userInfo.id;
        db.find('category',where,function(err,data){
                if(err){
                        console.log(err);
                        return;
                }
                res.render('../views/admin/category',{
                        userInfo:req.userInfo,
                        categorys:data
                });
        })
});
/**
 * 分类添加
 */
router.get('/category/add',function(req,res,next){
        res.render('../views/admin/category_add',{
                userInfo:req.userInfo
        });
      
});
/**
 * 分类添加表单提交
 */
router.post('/category/add',function(req,res,next){
        var userInfo=req.userInfo;
        if(!userInfo){
               //表示用户没有登录 
               return ;
        }
        var name=req.body.name|| '';
        var where='ownId='+userInfo.id+" and name='"+name+"'";
        db.find('category',where,function(err,data){
                if(err){
                        console.log(err);
                        return ;
                }
                if(data.length==0){
                        //表示没有这个分类
                        var obj={
                                ownId:userInfo.id,
                                name:name
                        };
                        db.insert('category',obj,function(err,data){
                                if(err){
                                        console.log(err);
                                        return ;
                                }
                                //表示添加成功
                                res.render('../views/admin/success',{
                                        userInfo:req.userInfo,
                                        message:'添加分类成功'
                                });
                        })
                }
        })
       
});
/**
 * 内容首页
 */
router.get('/content',function(req,res,next){
        var userInfo=req.userInfo;
        var page=req.query.page||1;//默认显示第一页
        var offset;
        var max_page=0;
        var where='ownId='+userInfo.id;
          db.find('content',where,function(err,data){
                  if(err){
                          console.log(err);
                          return ;
                  }else{
                        max_page=Math.ceil(data.length/count);//计算总页数,向上取整
                        page=Math.min(page,max_page);
                        page=Math.max(page,1);
                        offset=(page-1)*count;
                        db.select('content',offset,count,function(err,data){
                                if(err){
                                   console.log(err);
                                }else{
                                  res.render('../views/admin/content',{
                                               userInfo:req.userInfo,
                                               contents:data,
                                               page:page,
                                               pages:max_page,
                                               count:count,
                                               max_count:data.length
                                             });
                                }
                        });
                  }            
          });
       
      
});
/**
 * 博客添加
 */
router.get('/content/add',function(req,res,next){
        var userInfo=req.userInfo;
        if(!userInfo){
               //表示用户没有登录 
               return ;
        }
        var where='ownId='+userInfo.id;
        db.find('category',where,function(err,data){
                if(err){
                        console.log(err);
                        return;
                }
                res.render('../views/admin/content_add',{
                        userInfo:req.userInfo,
                        categorys:data
                });
        })
});
/**
 * 博客添加，表单提交
 */
router.post('/content/add',function(req,res,next){
        var userInfo=req.userInfo;
        if(!userInfo){
               //表示用户没有登录 
               return ;
        }
        var title=req.body.title|| '';
        var categoryId=req.body.category || '';
        var content=req.body.content || '';
        var brief= req.body.brief;
        var date=new Date().toLocaleDateString();
        date.replace('/','-');
        var obj={
            title:title,
            categoryId:categoryId,
            content:content,
            ownId:userInfo.id,
            brief:brief,
            date:date
        };
        db.insert('content',obj,function(err,data){
                if(err){
                        console.log(err);
                        return ;
                }
                 //表示添加成功
                 res.render('../views/admin/success',{
                        userInfo:req.userInfo,
                        message:'博客添加成功'
                }); 
        })
});


/**
 * 用户管理
 */
router.get('/user',function(req,res,next){

        var page=req.query.page||1;//默认显示第一页
        var offset;
        var max_page=0;
          db.count('user',function(err,data){
                  if(err){
                  }else{
                        max_page=Math.ceil(data.length/count);//计算总页数,向上取整
                        page=Math.min(page,max_page);
                        page=Math.max(page,1);
                        offset=(page-1)*count;
                        db.select('user',offset,count,function(err,data){
                                if(err){
                                   console.log(err);
                                }else{
                                  res.render('../views/admin/user_index',{
                                               userInfo:req.userInfo,
                                               users:data,
                                               page:page,
                                               pages:max_page,
                                               count:count,
                                               max_count:data.length
                                             });
                                }
                        });
                  }            
          });
       
       
        
});
module.exports=router;

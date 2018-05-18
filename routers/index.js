
var express =require('express');

var router=express.Router();
var db=require('../db/sql');
var count=8;
var categorys;//分类信息
/**
 * 处理通用数据
 */
router.use(function(req,res,next){
      var where='ownId='+1;  
      db.find('category', where, function (err, data) {
                if (err) {
                        console.log(err);
                        return;
                }
                categorys=data;
      });
      next();
});
router.get('/',function(req,res,next){
        var where='ownId='+1;
        var page = req.query.page || 1;//默认显示第一页
        var offset;
        var max_page = 0;
        var where = 'ownId=' + 1;
        db.find('content', where, function (err, data) {
                if (err) {
                        console.log(err);
                        return;
                } else {
                        max_page = Math.ceil(data.length / count);//计算总页数,向上取整
                        offset = (page - 1) * count;
                        db.select('content', offset, count, function (err, data) {
                                if (err) {
                                        console.log(err);
                                } else {
                                        res.render('../views/index', {
                                                userInfo: req.userInfo,
                                                categorys: categorys,
                                                contents: data,
                                                page: page,
                                                pages: max_page
                                        });
                                }
                        });
                }
        })
});
/**
 * 分类展示前台博客
 */
router.get('/category',function(req,res,next){
        var where='ownId='+1;
        var page=req.query.page||1;//默认显示第一页
        var Id=req.query.Id || "";
        var offset;
        var max_page=0;
        var where='ownId='+1+' and categoryId=' +Id;
        db.find('content', where, function (err, data) {
                if (err) {
                        console.log(err);
                        return;
                } else {
                        if(data.length == 0) {
                                res.render('../views/index', {
                                        userInfo: req.userInfo,
                                        categorys: categorys
                                });
                                return;
                        };
                        max_page = Math.ceil(data.length / count);//计算总页数,向上取整
                        offset = (page - 1) * count;
                        var contents=data.slice(offset,offset+count);
                        res.render('../views/index', {
                                                userInfo: req.userInfo,
                                                categorys: categorys,
                                                contents: data,
                                                page: page,
                                                pages: max_page
                                        });
                        // db.select('content', offset, count, function (err, data) {
                        //         if (err) {
                        //                 console.log(err);
                        //         } else {
                        //                 console.log(data.length);
                        //                 res.render('../views/index', {
                        //                         userInfo: req.userInfo,
                        //                         categorys: categorys,
                        //                         contents: data,
                        //                         page: page,
                        //                         pages: max_page
                        //                 });
                        //         }
                        // });
                }
        });
});
router.get('/view',function(req,res,next){
      var contentId= req.contentId || '';
});

module.exports=router;

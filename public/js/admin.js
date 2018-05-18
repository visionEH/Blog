


$(function(){

    var submit=$(":button");
    submit.on('click',function(){
        console.log("click");
        //通过ajax提交请求
        $.ajax({
          type:"post",
          url:"/api/admin/login",
          data:{
               username:$("#inputUserName").val(),
               password:$("#inputPassword").val()
         },
         dataType:'json',
          success:function(result){
             if(!result.code){
                 //表示登录成功
                window.location.href='/admin';
             }else{
                 console.log(result.message);
             }
          }
        });
    })
});


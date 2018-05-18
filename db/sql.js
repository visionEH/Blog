var mysql=require('mysql');
var util=require('util');
const db=mysql.createPool({
    host:'localhost',
    user:'root',
    password:'123456',
    database:'nodejs',
    port:'3306'
})
/**
 * 
 * @param {*} table 表的名字
 * @param {*} where 代表查询条件
 * @param {*} callback 回调函数，返回查询后状态
 */
var findOne=function(table,where,callback){
    var _WHERE='';
    if(util.isObject(where)){
      
    }else if(typeof where =='string'){
        _WHERE='WHERE '+where;
    }
   var sql="SELECT * FROM "+table+' '+_WHERE;
   console.log(sql+'-------------------------');
   db.query(sql,callback);
}
/**
 * 分页查找所有数据
 * @param {*} table 表名
 * @param {*} offset 偏移量，初始为0，-1表示不分页
 * @param {*} rows   读取最大数据数量
 * @param {*} callback 查询后回调
 */
var select=function(table,offset,rows,callback){ 
    //查找所有；
    var sql="SELECT * FROM "+table;
    if(offset!=-1){
       sql+=' LIMIT '+offset+','+rows;
    }
    console.log(sql);
    db.query(sql,callback);
}
/**
 * 返回该表中的数据量个数
 * @param {*} table 
 */
var count= function(table ,callback){ 
    var sql="SELECT * FROM "+table;
    db.query(sql,callback);
}
var insert =function(table,obj,callback){
    //insert into table() values()
    //{username:'guojikai',age:'55',sex:'1'}
    var fields='';
    var values='';
    for( var k in obj){
        fields+=k+',';
        values=values+"'"+obj[k]+"',"
    }
    fields=fields.slice(0,-1);
    values=values.slice(0,-1);
    var sql="INSERT INTO "+table+'('+fields+') VALUES('+values+')';
    console.log(sql+'--------------');
    db.query(sql,callback);
}
var update=function(table,sets,where,callback){
    var _SETS='';
    var _WHERE='';
    var keys='';
    var values='';
    for(var k in sets){
        _SETS+=k+"='"+sets[k]+"',";
    }
    _SETS=_SETS.slice(0,-1);
    for(var k2 in where){
        _WHERE+=k+"='"+where[k2]+"' AND ";
    }
    //update table set username='admin2',age='55'   where id="5";
    var sql="UPDATE "+table+' SET '+_SETS+' '+_WHERE;
    db.query(sql,callback);
}
var del=function(table,where,callback){
    var _WHERE='';

    // for(var k2 in where){
    //     _WHERE+=k+"='"+where[k2]+"' AND ";
    // }
     var sql="DELETE  FROM "+table+'  '+where;
     db.query(sql,callback);
     
}

module.exports={
    db:db,
    insert:insert,
    select:select,
    find:findOne,
    del:del,
    update:update,
    count:count
}

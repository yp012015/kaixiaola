/**
 * ts.executeSql(sqlQuery,[value1,value2..],dataHandler,errorHandler)
 *1.sqlQuery：需要具体执行的sql语句，可以是create、select、update、delete；
 *2.[value1,value2..]：sql语句中所有使用到的参数的数组，在executeSql方法中，将s>语句中所要使用的参数先用“?”代替，然后依次将这些参数组成数组放在第二个参数中
 *3.dataHandler：执行成功是调用的回调函数，通过该函数可以获得查询结果集；
 *4.errorHandler：执行失败时调用的回调函数；
 * 
 * @param {Object} sql
 * @param {Object} valueArray	
 */
function exectueSql (db,sql,valueArray) {
	//开启数据库事务
	db.transaction(function (ctx,result) {
        ctx.executeSql(sql,valueArray,
        	function(ctx,result){//执行成功是调用的回调函数
				return true;
	        },
	        function(tx, error){//执行失败时调用的回调函数
	            return false;
	        });
    });
	return false;
}
/**
 * 获取数据库一个表单里面的所有数据
 * @param {Object} dataBase
 * @param {Object} selectALLSQL
 * @param {Object} valueArray
 * @param {Object} callFun 回调函数
 */
function websqlGetAllData(dataBase,selectALLSQL,valueArray,callFun){   
    dataBase.transaction(function (ctx) {
        ctx.executeSql(selectALLSQL,valueArray,function (ctx,result){
            if(typeof callFun == "function") callFun(result);
        },
        function (tx, error) {
            if(typeof callFun == "function") callFun(error);
        });
    });
}
/**
 * 封装的get请求方法
 * @param {Object} loadingSelector	等待框的选择器
 * @param {Object} url
 * @param {Object} params	请求参数
 * @param {Object} callback	请求成功后的回调函数
 */
function sendHttpGet (loadingSelector,url,params,callback) {
	$(loadingSelector).show();//显示等待框
	mui.ajax(url,{
		data:params,
		dataType:'json',//服务器返回json格式数据
		type:'get',//HTTP请求类型
		timeout:10000,//超时时间设置为10秒；
		success:function(data){
			$(loadingSelector).hide();//关闭loading等待框
			if(typeof callback == "function") callback(data);
		},
		error:function(xhr,type,errorThrown){
			$(loadingSelector).hide();//关闭loading等待框
			mui.alert("服务器错误!");
		}
	});
}
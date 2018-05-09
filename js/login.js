mui.init();
mui.plusReady();
var account,pwd;
//登录按钮
var btnLogin = document.getElementById("btn-login");
//登录按钮的点击事件
btnLogin.addEventListener('tap',function () {
	$('#errorMsg').hide();
	//获取用户名和密码
	account = $('#input-account').val();
	pwd = $('#input-pwd').val();
	//检查用户名是否为空
	if (!account) {
		$('#errorMsg').text('手机号不能为空').show();
		return;
	}
	//检查密码是否为空
	if (!pwd) {
		$('#errorMsg').text('密码不能为空').show();
		return;
	}
	//在线登录
	doLogin();
})

function doLogin () {
	$('#btn-login').text('登录中……').attr('disabled',true);
	mui.later(function(){
		$('#btn-login').text('登录').attr('disabled',false);
		//登录成功后将用户信息存储到本地
		plus.storage.setItem('userInfo',"account= " + account + "\npassword= " + pwd);
		//跳转到主页
		mui.openWindow({
			url:"main.html",
			id:"main"
		});
	},2000)
}
mui.init();
mui.plusReady(function () {
	plus.nativeUI.closeWaiting();//关闭菊花框
	//显示当前页面
	plus.webview.currentWebview().show();
})
var n1,n2,n3,i=0,val=[];
//设置定时器，每隔1秒执行
var my_interval = setInterval(function(){
	//随机生成三个0~255之间的整数
	n1 = parseInt(Math.random()*256);
	n2 = parseInt(Math.random()*256);
	n3 = parseInt(Math.random()*256);
	//将随机数转化成RGBA值，并存放到val数组中
	val[i%3] = "rgba("+n1+","+n2+","+n3+",0.5)";
//	console.log(val);
	//圈a
	var $1 = $(".paomadeng .mui-col-sm-4:nth-child(1)");
	$1.css("background-color",val[i%3]);
	//圈b
	var $2 = $(".paomadeng .mui-col-sm-4:nth-child(2)");
	$2.css("background-color",val[(i+3-1)%3]);
	//圈c
	var $3 = $(".paomadeng .mui-col-sm-4:nth-child(3)");
   	if (val[1]) {//如果圈b有背景颜色，圈3才设置背景色
		$3.css("background-color",val[(i+3-2)%3]);
   	}
   	if (++i == 3) {
   		i=0;
   	}
},500);
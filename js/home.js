mui.init({
	swipeBack:true //启用右滑关闭功能
});
var titleHeight=0,topGridHeight=0;
//设置标题栏渐变的范围
$(document).ready(function () {
	mui.plusReady(function () {
		//显示主页
		plus.webview.getWebviewById('main').show();
	})
	//获取顶部标题栏的高度
	titleHeight = $(".head-title").height();
	topGridHeight = $(".mui-grid-9.head").height();
	var alpha1 = 1,alpha2=0;
	$(window).scroll(function () {
		var scrollTop = $(window).scrollTop();
		if (scrollTop < 30) {
			alpha1 = 1-scrollTop/30;
			alpha2 = 0;
		} else{
			alpha1 = 0;
			alpha2 = 0.4+0.6*(scrollTop-30)/(topGridHeight-30);
		}
		if(alpha1>1) alpha1=1;
		if(alpha2>1) alpha2=1; 
		changeTitleColor(alpha1);
		changeImgAlpha(alpha2);
		changeGridAlpha(1-scrollTop/topGridHeight);
	});
});

//图片透明度随导航栏背景变色
function changeImgAlpha (alpha) {
	$("#header").css("opacity",alpha);
//	$(".btn1").css("opacity",alpha);
//	$(".btn2").css("opacity",alpha);
//	$(".btn3").css("opacity",alpha);
//	$(".btn4").css("opacity",alpha);
}
//字体跟随导航栏标题同时变色！
function changeTitleColor(alpha) {
	$(".title-txt").css("opacity",alpha);
	$("#btn-add-title").css("opacity",alpha);
}
function changeGridAlpha (alpha) {
//	console.log(1-alpha);
	$(".head .mui-icon").css({
		"opacity":alpha,
		"top":60*(1-alpha)
	});
	$(".head .mui-media-body").css({
		"opacity":alpha
	});
}

document.getElementById("adv-img").addEventListener('tap',function () {
	mui.openWindow({
		url:'test.html',
		id:'test.html'
	})
})
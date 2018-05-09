var self = null;
mui.init({
	beforeback:function(){
		plus.webview.close(self);
	}
})
// 扩展API加载完毕后调用onPlusReady回调函数
document.addEventListener("plusready", onPlusReady, false);
//添加自定义事件,该页面作为预加载页面，在main.html页面可以触发该事件
/*window.addEventListener('start',function (event) {
    //获取预加载页面传递过来的参数
    var params = event.detail.from;
    console.log(params);
})*/
// 扩展API加载完毕，现在可以正常调用扩展API
function onPlusReady() {
//	closeWaiting();
	self = plus.webview.currentWebview();
	//当Webview窗口显示（窗口动画完成后）时触发此事件
	self.addEventListener("show",function(e){
		console.log("show");
//		startRecognize();
    	startScan();
	},false);
	//当Webview窗口隐藏（窗口动画完成后）时触发此事件
	self.addEventListener("hide",function(e){
		cancelScan();
//		scan = null;
		console.log("hide");
	},false);
	
	self.addEventListener("close",function(e){
		scan = null;
		console.log("close")
	},false);
	//通过WebviewObject对象的setBounce方法开启回弹效果设置顶部下拉回弹changeoffset属性后，当用户向下拖拽窗口时触发发此事件，回调函数类型为BounceEventCallback。
	self.addEventListener("dragBounce",function(e){
		console.log("dragBounce")
	},false);
	//通过WebviewObject对象的setBounce方法开启回弹效果设置左右侧侧滑slideoffset属性后，当用户向左右侧拖拽窗口侧滑时触发发此事件，回调函数类型为BounceEventCallback。
	self.addEventListener("slideBounce",function(e){
		console.log("slideBounce")
	},false);
	//当Webview窗口开始加载新页面时触发此事件
	self.addEventListener("loading",function(e){
		console.log("loading")
	},false);
	//当Webview窗口页面加载完成时触发此事件
	self.addEventListener("loaded",function(e){
		console.log("loaded")
	},false);
	//当Webview窗口通过mask属性设置显示遮罩层并且点击时触发此事件
	self.addEventListener("maskClick",function(e){
		console.log("maskClick")
	},false);
	//当Webview窗口开始渲染内容时触发此事件
	self.addEventListener("rendered",function(e){
		console.log("rendering")
	},false);
	//当Webview窗口渲染完成时触发此事件
	self.addEventListener("rendered",function(e){
		console.log("rendered")
		startRecognize();
    	startScan();
	},false);
	//当Webview窗口加载新页面更新标题时触发此事件，回调函数类型为SuccessCallback。 注意：此事件会先于loaded事件触发，通常在加载网络页面时通过此事件可更快获取到页面的标题。
	self.addEventListener("titleUpdate",function(e){
		console.log("titleUpdate")
	},false);
	//当用户操作按下到Webview窗口时触发此事件
	self.addEventListener("touchstart",function(e){
		console.log("touchstart")
	},false);
	//当Webview窗口侧滑返回时触发此事件
	self.addEventListener("popGesture",function(e){
		console.log("popGesture")
	},false);
	//当Webview窗口加载页面进度变化时触发此事件
	self.addEventListener("progressChanged",function(e){
		console.log("progressChanged")
	},false);
	
}
var scan = null;

function onmarked(type, result) {
	var text = '未知: ';
	switch(type) {
		case plus.barcode.QR:
			text = 'QR: ';
			break;
		case plus.barcode.EAN13:
			text = 'EAN13: ';
			break;
		case plus.barcode.EAN8:
			text = 'EAN8: ';
			break;
		case plus.barcode.AZTEC:
			text = 'AZTEC: ';
			break;
		case plus.barcode.DATAMATRIX:
			text = 'DATAMATRIX: ';
			break;
		case plus.barcode.UPCA:
			text = 'UPCA: ';
			break;
		case plus.barcode.UPCE:
			text = 'UPCE: ';
			break;
		case plus.barcode.CODABAR:
			text = 'CODABAR: ';
			break;
		case plus.barcode.CODE39:
			text = 'CODE39: ';
			break;
		case plus.barcode.CODE93:
			text = 'CODE93: ';
			break;
		case plus.barcode.CODE128:
			text = 'CODE128: ';
			break;
		case plus.barcode.ITF:
			text = 'ITF: ';
			break;
		case plus.barcode.MAXICODE:
			text = 'MAXICODE: ';
			break;
		case plus.barcode.PDF417:
			text = 'PDF417: ';
			break;
		case plus.barcode.RSS14:
			text = 'RSS14: ';
			break;
		case plus.barcode.RSSEXPANDED:
			text = 'RSSEXPANDED: ';
			break;
	}
	cancelScan();
	mui.openWindow({
	  url: 'scan_result.html',
	  id: 'scan_result',
	  extras:{
			result:result  //扩展参数
	  },
	  styles: {                             // 窗口参数 参考5+规范中的WebviewStyle,也就是说WebviewStyle下的参数都可以在此设置
	    titleNView: {                       // 窗口的标题栏控件
	      titleText:"扫码结果",                // 标题栏文字,当不设置此属性时，默认加载当前页面的标题，并自动更新页面的标题
	      titleColor:"#FFFFFF",             // 字体颜色,颜色值格式为"#RRGGBB",默认值为"#000000"
	      titleSize:"17px",                 // 字体大小,默认17px
	      backgroundColor:"#1891ee",        // 控件背景颜色,颜色值格式为"#RRGGBB",默认值为"#F7F7F7"
	      progress:{                        // 标题栏控件的进度条样式
	        color:"#00FF00",                // 进度条颜色,默认值为"#00FF00"  
	        height:"2px"                    // 进度条高度,默认值为"2px"         
	      },
	      splitLine:{                       // 标题栏控件的底部分割线，类似borderBottom
	        color:"#CCCCCC",                // 分割线颜色,默认值为"#CCCCCC"  
	        height:"1px"                    // 分割线高度,默认值为"2px"
	      },
	      autoBackButton:true//标题栏控件是否显示左侧返回按钮
	    }
	  }
	});
	/*mui.alert(result,text,"确认",function () {
		startScan();
	})*/
}
function closeWaiting () {
	plus.nativeUI.closeWaiting();//关闭菊花框
	//显示当前页面
	plus.webview.currentWebview().show();
}
//创建扫描控件
function startRecognize() {
//	var winH = $(document).height();
//	console.log("winH= " + winH);
//	$("#bcid").css("height",winH);
	$("#bcid").fadeIn();
	scan = new plus.barcode.Barcode('bcid',null,{
		frameColor:"#1891ee",//扫描框颜色
		scanbarColor:"#1891ee",//扫描条颜色
//		background:"rgba(0,0,0,0)"//条码识别控件背景颜色
	});
	scan.onmarked = onmarked;
	$('.msg-info').fadeOut();
}
//开始扫描
function startScan() {
	scan.start();
}
//取消扫描
function cancelScan() {
	scan.cancel();
}
var isOpenFlash = false;
//开启闪光灯
function setFlash() {
	scan.setFlash(isOpenFlash);
}
//开启闪光灯按钮
var btnFlash = document.getElementById("btn-flash");
btnFlash.addEventListener('tap',function () {
	isOpenFlash = !isOpenFlash;
	setFlash();
	if (isOpenFlash) {
		$(this).attr('src','../img/ic_flash_opened.png');
	} else{
		$(this).attr('src','../img/ic_flash_closed.png');
	}
});
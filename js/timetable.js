//加号按钮
var btnAdd = document.getElementById("btn-add-title");
//弹出菜单是，有一个半透明的黑色遮罩，这里阻止点击遮罩时隐藏弹出菜单
mui('body').on('tap', '.mui-backdrop.mui-active', function() {
//  mui.toast("点击了遮罩！");
    //传入toggle参数，用户也无需关心当前是显示还是隐藏状态，mui会自动识别处理；
	mui('#topPopover').popover('toggle',btnAdd);
});
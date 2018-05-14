mui.init({
	swipeBack:true //启用右滑关闭功能
});
mui(".mui-table-view").on('tap','.mui-table-view-cell:not(.picker)',function(){
	var self = $(this);
	var url = 'test.html';
	var id = 'test';
	//获取点击的item文字内容
	var href = self.find("a").attr("href");
	href = $.trim(href).replace(/[\r\n]/g,"");//去掉回车换行;
	if (href) {
		if (href.lastIndexOf(".html")>0) {
			url = href;
			id = href;
		} else{
//			console.log('href.lastIndexOf(".html")===' + href.lastIndexOf(".html"));
		}
	}
	//拨打电话
	if(self.attr("number")){
		var btnArray = ['取消', '拨打'];
		mui.confirm(self.attr("number"), '拨打电话', btnArray, function(e) {
			if (e.index == 1) {
				plus.device.dial(self.attr("number"),false);
			} else {
			}
		});
		return;
	}
	if ($("#topPopover")) {
		mui('#topPopover').popover('hide');
	}
  	mui.openWindow({
	    id:id,
	    url:url,
	    waiting:{
	    	autoShow:true,
	   		title:"正在加载…"
	    },
//	    show:{
//	    	autoShow:false,
//	    	duration:100
//	    }
  	});
}) 

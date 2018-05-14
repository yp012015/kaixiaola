mui.init({
	beforeback:function(){
		//设置状态栏的前景色为白色
		plus.navigator.setStatusBarStyle('light');
	},
	pullRefresh : {
	    container:"#refreshContainer",//下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等
	    down : {
	      style:'circle',//必选，下拉刷新样式，目前支持原生5+ ‘circle’ 样式
	      color:'#2BD009', //可选，默认“#2BD009” 下拉刷新控件颜色
	      height:'50px',//可选,默认50px.下拉刷新控件的高度,
	      range:'100px', //可选 默认100px,控件可下拉拖拽的范围
	      offset:'0px', //可选 默认0px,下拉刷新控件的起始位置
	      auto: true,//可选,默认false.首次加载自动上拉刷新一次
	      contentdown : "下拉可以刷新",//可选，在下拉可刷新状态时，下拉刷新控件上显示的标题内容
	      contentover : "释放立即刷新",//可选，在释放可刷新状态时，下拉刷新控件上显示的标题内容
	      contentrefresh : "正在刷新...",//可选，正在刷新状态时，下拉刷新控件上显示的标题内容
	      callback:pullDownFresh //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
	    },
      	up : {
	      height:50,//可选.默认50.触发上拉加载拖动距离
	      auto:false,//可选,默认false.自动上拉加载一次
	      contentrefresh : "正在加载...",//可选，正在加载状态时，上拉加载控件上显示的标题内容
	      contentnomore:'没有更多数据了',//可选，请求完毕若没有更多数据时显示的提醒内容；
	      callback :pullUpFresh //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
	    }
  }
});
(function($){
	//阻尼系数
	var deceleration = mui.os.ios?0.003:0.0009;
	$('.mui-scroll-wrapper').scroll({
		bounce: false,
		indicators: true, //是否显示滚动条
		deceleration:deceleration
	});
})(mui)
mui.plusReady(function(){
	//设置状态栏的前景色为黑色
	plus.navigator.setStatusBarStyle("dark");
});
function pullDownFresh(){
	//业务逻辑代码，比如通过ajax从服务器获取新数据；
     //注意，加载完新数据后，必须执行如下代码，注意：若为ajax请求，则需将如下代码放置在处理完ajax响应数据之后
     //没有更多内容了，endPulldown 传入true， 不再执行下拉刷新
     setTimeout(function(){
     	mui('#refreshContainer').pullRefresh().endPulldownToRefresh(); //refresh completed
     },1500)
}
//上拉加载更多的业务操作
function pullUpFresh(){
	setTimeout(function(){
		mui('#refreshContainer').pullRefresh().endPullupToRefresh(true);//参数为true代表没有更多数据了。
	},1500);
}

mui('.mui-row').on('tap','.mui-col-sm-4.mui-col-xs-4',function(event){
  	var index = $(this).attr('index');
  	switch (index){
  		case '0':
  			$(".student-type").toggle();
  			break;
  		default:
  			break;
  	}
}) 

mui('.student-type .mui-table-view').on('tap','.mui-table-view-cell',function(){
	updateSelected(".student-type .mui-table-view-cell>img",this);
}) 
mui('.class-type .mui-table-view').on('tap','.mui-table-view-cell',function(){
	updateSelected(".class-type .mui-table-view-cell>img",this);
}) 

function updateSelected (selector,item) {
	//移除之前选中的图标
	$(selector).remove();
	//在当前行加入选中图标
  	$(item).append('<img src="../img/tx_ic_selected_blue_u2.png" class="mui-pull-right"/>');
}
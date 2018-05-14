mui.init({
	beforeback:function(){
		//设置状态栏的前景色为白色
		plus.navigator.setStatusBarStyle('light');
	}
});
mui.plusReady(function(){
	//设置状态栏的前景色为黑色
	plus.navigator.setStatusBarStyle("dark");
});
var btnPop = document.getElementById("datePicker");
btnPop.addEventListener('tap',function(){
	mui('#topPopover').popover('toggle',btnPop);
})
mui('.mui-table-view').on('tap','.picker',function(){
  var text = $(this).text().trim();
  $("#btnDate").text(text);
  mui('#topPopover').popover('hide');
}) 
//使用等额本息还款方法还贷款，第n个月还贷本金为：B=Mr(1+r)^(n-1)÷[(1+r)^N-1]
//　　其中B=等额本息还贷每月所还本金;M=贷款总金额;r=贷款月利率(年利率除12);n=第n期还贷数;N=还贷总期数(即总月数)。
var N = 360;//贷款期数
var r = 0.0539/12;//贷款月利率
var M = 560000;//贷款总额
var timeArray = [],//时间轴
	benxiXT = [],//等额本息的利息总额
	benxiBT = [] ;//等额本息的本金总额
	benjinXT = [],//等额本金的利息总额
	benjinBT = [] ;//等额本金的本金总额
// 基于准备好的dom，初始化echarts实例
var myChart = echarts.init(document.getElementById('benxi'));
initData();
/**
 * 初始化数据
 */
function initData(){
	//等额本息每月应还金额：M*[r*(1+r)^n]/[(1+r)^n-1]
	//（注：M：贷款本金 ，r：贷款月利率， n：贷款月数 ）
	var benxiVal = M*r*Math.pow((1+r),N)/(Math.pow((1+r),N)-1);
	benxiVal = benxiVal.toString().substring(0,benxiVal.toString().lastIndexOf('.')+3);
	//等额本息的还贷总金额
	var benxiTotal = benxiVal*N;
	//等额本息的利息总额递减情况
	var benxiXT_val = benxiTotal - M;
	//等额本息的本金总额递减情况
	var benxiBT_val = M;
	
	//等额本金每月应还金额：本金/贷款总月数+本金×[1—上个期数/贷款总期数]×月利率
	var benjinVal = 0;
	//等额本金总利息=〔(总贷款额÷还款月数+总贷款额×月利率)+总贷款额÷还款月数×(1+月利率)〕÷2×还款月数-总贷款额
	var benjinXT_val = ((M/N+M*r) + (M/N)*(1+r))/2*N-M;
	//等额本金的本金总额递减情况
	var benjinBT_val = M;
	for(n=1; n<=N; n++){
		//等额本息每月应还本金
		var B=M*r*Math.pow((1+r),(n-1))/(Math.pow((1+r),N)-1);
		//等额本息的总本金每月递减情况
		benxiBT_val -= B;
		//等额本息的总利息每月递减情况
		benxiXT_val -= (benxiVal-B);
		//等额本金的本金总额递减情况
		benjinBT_val -= M/N;
		//等额本金每月应还利息金额：本金×[1—上个期数/贷款总期数]×月利率
		benjinX_val = M*(1-(n-1)/N)*r;
		//等额本金利息总额每月递减情况
		benjinXT_val -= benjinX_val;
		if(n%12 == 0){
			timeArray.push("第" + n/12+ "年");
			if (n<N) {
				benxiBT.push(parseInt(benxiBT_val));
				benxiXT.push(parseInt(benxiXT_val));
				benjinBT.push(parseInt(benjinBT_val));
				benjinXT.push(parseInt(benjinXT_val));
			} else{
				benxiBT.push(0);
				benxiXT.push(0);
				benjinBT.push(0);
				benjinXT.push(0);
			}
		}
	}
	option = {
		title : [
			{
				top:'10px',
				left:'center',
		        text: '等额本息'
		   },
			{
				top:'50%',
				left:'center',
		        text: '等额本金'
		    }
		],
	    tooltip : {
	        trigger: 'axis',
	        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
	            type : 'line'        // 默认为直线，可选为：'line' | 'shadow'
	        }
	    },
	    legend: {
	    	left:'20px',
	    	top:'10px',
	        data: ['本金', '利息']
	    },
	/*    grid: {
	        left: '20px',
	        right: '20px',
	        bottom: '3%',
	        containLabel: true
	    },*/
	   grid: [{
	        bottom: '55%'
	    }, {
	        top: '55%'
	    }],
	    xAxis:[
		    {
	//	        type: 'category',
		        data: timeArray,
		        gridIndex: 0
		    },
		    {
	//	        type: 'time',
		        data: timeArray,
		        gridIndex: 1
		    }
	    ],
	    yAxis:[
	    	{
	//	        type: 'value',
		        gridIndex: 0
		    },
	    	{
	//	        type: 'value',
		        gridIndex: 1
		    }
	    ] ,
	    series: [
	        {
	            name: '本金',
	            type: 'bar',
	            stack: '等额本息',
	            label: {
	                normal: {
	                    show: false,
	                    position: 'insideRight'
	                }
	            },
	            data: benxiBT,
	            xAxisIndex: 0,
	        	yAxisIndex: 0
	        },
	        {
	            name: '利息',
	            type: 'bar',
	            stack: '等额本息',
	            label: {
	                normal: {
	                    show: false,
	                    position: 'insideRight'
	                }
	            },
	            data: benxiXT,
	            xAxisIndex: 0,
	        	yAxisIndex: 0
	        },
	        {
	            name: '本金',
	            type: 'bar',
	            stack: '等额本金',
	            label: {
	                normal: {
	                    show: false,
	                    position: 'insideRight'
	                }
	            },
	            data: benjinBT,
	            xAxisIndex: 1,
	        	yAxisIndex: 1
	        },
	        {
	            name: '利息',
	            type: 'bar',
	            stack: '等额本金',
	            label: {
	                normal: {
	                    show: false,
	                    position: 'insideRight'
	                }
	            },
	            data: benjinXT,
	            xAxisIndex: 1,
	        	yAxisIndex: 1
	        }
	    ]
	};
	// 使用刚指定的配置项和数据显示图表。
	myChart.setOption(option,false);	
}
var year_picker = new mui.PopPicker();
var btnYear = document.getElementById("btn-year");
btnYear.addEventListener('tap',showYearPicker);
//贷款可选择的年限数据
var yearList = [];
for(i=30; i>0; i--){
	var year = {
		text:i+'年(' + i*12 + '期)',
		value:i*12
	};
	yearList.push(year);
}
year_picker.setData(yearList);
function showYearPicker(){
	year_picker.show(function (selectItems) {
		$("#btn-year button").text(selectItems[0].text);
		N = selectItems[0].value;
		myChart.clear();
		console.log(myChart.getOption());
		console.log(myChart.isDisposed());
		initData();
//		myChart.setOption(option,true,false,false);
	    //console.log(selectItems[0].text);
		//console.log(selectItems[0].value);
	});
}
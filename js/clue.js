mui.init({});
//使用等额本息还款方法还贷款，第n个月还贷本金为：B=Mr(1+r)^(n-1)÷[(1+r)^N-1]
//　　其中B=等额本息还贷每月所还本金;M=贷款总金额;r=贷款月利率(年利率除12);n=第n期还贷数;N=还贷总期数(即总月数)。
var N = 360;//贷款期数
var r = 0.0539/12;//贷款月利率
var M = 560000;//贷款总额
var timeArray = [],//时间轴
	benxiXT = [],//等额本息的利息总额
	benxiBT = [] ;//等额本息的本金总额
//等额本息每月应还金额：M*[r*(1+r)^n]/[(1+r)^n-1]
//（注：M：贷款本金 ，r：贷款月利率， n：贷款月数 ）
var benxiVal = M*r*Math.pow((1+r),N)/(Math.pow((1+r),N)-1);
benxiVal = benxiVal.toString().substring(0,benxiVal.toString().lastIndexOf('.')+3);
//等额本息的还贷总金额
var benxiTotal = benxiVal*N;
//等额本息的利息总金额
var benxiXT_val = benxiTotal - M;
var benxiBT_val = M;
for(n=1; n<=N; n++){
	timeArray.push("第" + n + "期");
	//等额本息每月应还本金
	var B=M*r*Math.pow((1+r),(n-1))/(Math.pow((1+r),N)-1);
//	B = B.toString().substring(0,B.toString().lastIndexOf('.'+3));
	if (n<360) {
		//等额本息的总本金每月递减情况
		benxiBT_val -= B;
		benxiBT.push(parseInt(benxiBT_val));
		//等额本息的总利息每月递减情况
		benxiXT_val -= (benxiVal-B);
		benxiXT.push(parseInt(benxiXT_val));
	} else{
		benxiBT.push(0);
		benxiXT.push(0);
	}
}

option = {
    tooltip : {
        trigger: 'axis',
        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        }
    },
    legend: {
        data: ['本金', '利息']
    },
    grid: {
        left: '20px',
        right: '20px',
        bottom: '3%',
        containLabel: true
    },
    xAxis:  {
        type: 'category',
        data: timeArray
        
    },
    yAxis: {
        type: 'value'
    },
    series: [
        {
            name: '本金',
            type: 'bar',
            stack: '总量',
            label: {
                normal: {
                    show: false,
                    position: 'insideRight'
                }
            },
            data: benxiBT
        },
        {
            name: '利息',
            type: 'bar',
            stack: '总量',
            label: {
                normal: {
                    show: false,
                    position: 'insideRight'
                }
            },
            data: benxiXT
        },
        
    ]
};
// 基于准备好的dom，初始化echarts实例
var myChart = echarts.init(document.getElementById('main'));
// 使用刚指定的配置项和数据显示图表。
myChart.setOption(option);
mui.init({
	gestureConfig:{
	   hold:true,//开启按住屏幕监听功能
	   release:true//开启离开屏幕监听功能
	}
});
// 扩展API加载完毕后调用onPlusReady回调函数 
document.addEventListener( "plusready", onPlusReady, false );
// 扩展API加载完毕，现在可以正常调用扩展API 
var record = null;
var player = null;
var db=null;
var friendName = 'Peter';
var createSql = 'INSERT INTO MSG (friendName,time,type,content,duration) VALUES(?, ?, ?, ?, ?)';
function onPlusReady() { 
	//获取上一界面的传值
	var self = plus.webview.currentWebview();
	friendName = self.nickname;
	$(".mui-title").text(friendName);
	//打开数据库
	db = window.openDatabase('TianXiao', '1.0', 'Test DB', 2 * 1024 * 1024);
	//创建MSG表
	var sqlStr = 'CREATE TABLE IF NOT EXISTS MSG (rowid INTEGER PRIMARY KEY AUTOINCREMENT,FriendName text,time text,type INTEGER,content text,duration text)';
	exectueSql(db,sqlStr,[]);
	//查询聊天记录
	sqlStr = "SELECT * FROM MSG WHERE FriendName = ?";
	var array = [];
	array[0] = friendName;
	websqlGetAllData(db,sqlStr,array,function (data) {
		if (!data || data.length==0) {
			return;
		}
		mui(data.rows).each(function (index,element) {
			switch (element.type){//判断消息类型
				case 1://文本消息
					addMsgToRight(element.content);
					break;
				case 2://音频消息
					addAudioToRight(element.duration,element.content);
					break;
				default:
					break;
			}
		})
	});
}
//鹏哥哥与别人聊天
var nickname = null;
var imgSrc = null;
//在浏览器中直接加载时，SDK 暴露的所有的成员都挂载在 AV 命名空间下:
//获取气泡列表对象
var msgList = document.querySelector('.chat-list');
//获取表情按钮对象
var btnEmoticon = document.getElementById("emoticon");
//获取更多按钮对象
var btnMore = document.getElementById("more");
//获取发送按钮对象
var btnSend = document.getElementById("btnSend");
//获取文本输入框对象
var text_input = document.getElementById("input-text");
//给文本输入框添加事件监听器
text_input.addEventListener('input', function() {
	var msgValue = text_input.value;
	if(msgValue.trim().length > 0) {
		//显示发送按钮，隐藏更多按钮
		btnSend.style.display = 'block';
		btnMore.style.display = 'none';
	} else {
		//隐藏发送按钮，显示更多按钮
		btnMore.style.display = '';
		btnSend.style.display = '';
	}
});
//给发送按钮添加事件监听器
btnSend.addEventListener('tap', function() {
	var msgValue = text_input.value;//用户输入的文本对象
	var sql = "";
	addMsgToRight(msgValue);
	saveData(Date.now(), 1,msgValue,-1);
});
/**
 * 将消息存储到Web Sql
 * @param {Object} msgDate 消息时间
 * @param {Object} msgType 消息类型（1.发送的文本消息2.发送的语音消息，-1。接收到的文本消息-2.接收到的语音消息）
 * @param {Object} msgContent 消息内容（如果是语音消息，直接存放文件名）
 * @param {Object} duration	消息时长（如果是文本消息，默认值为-1）
 */
function saveData (msgDate,msgType,msgContent,duration) {
	var array = [];
	array[0]=friendName;
	array[1]=msgDate;
	array[2]=msgType;
	array[3]=msgContent;
	array[4]=duration;
	exectueSql(db,createSql,array);
}

/*消息发送成功之后将消息添加到右边气泡*/
function addMsgToRight(msgValue) {
	var willSendMsg = '<div class="chat-box chat-box-right mui-content-padded">' +
		'	<img class="chat-head" src="../img/avatar10.png" />' +
		'	<div class="chat-content">' +
		'		<div class="chat-content-inner">' +
		msgValue +
		'		</div>' +
		'		<div class="chat-content-arrow"></div>' +
		'	</div>' +
		'	<div class="clear-float"></div>' +
		'</div>';
	//隐藏发送按钮，显示更多按钮
	btnMore.style.display = '';
	btnSend.style.display = '';
	//清除文本输入框内容
	text_input.value = '';
	//将聊天消息追加到屏幕
	appendNewDom(willSendMsg);
}

/*接收到消息后将消息添加到左边气泡*/
function addMsgToLeft(msgValue){
	var willSendMsg = '<div class="chat-box chat-box-left mui-content-padded">' +
		'	<img class="chat-head" src="' + imgSrc + '" />' +
		'	<div class="chat-content">' +
		'		<div class="chat-content-inner">' +
		msgValue +
		'		</div>' +
		'		<div class="chat-content-arrow"></div>' +
		'	</div>' +
		'	<div class="clear-float"></div>' +
		'</div>';
	//将聊天消息追加到屏幕
	appendNewDom(willSendMsg);
}
/**
 * 追加语音消息到聊天列表
 * @param {Object} duration 语音时长
 * @param {Object} filePath 语音文件的路径
 */
function addAudioToRight (duration, filePath) {
	var showTime = duration>=60? (Math.floor(duration/60)+'′' + duration%60 + '″'):(duration + '″');
	/*10秒以内，宽度占比50%
	30秒，75%
	3分钟100%
	总的宽度基数70%,最低宽度基数20%*/
	var audioWidth = '50px';//给定一个初始值
	if(duration<=10){
		audioWidth = 20 + 50*0.5*(duration/10);
	}else if(duration<=30){
		audioWidth = 20 + 50*0.5 + 50*0.25*(duration-10)/20;
	}else if(duration<180){
		audioWidth = 20 + 50*0.75 + 50*0.25*(duration-30)/150;
	} else {
		audioWidth = 70;
	}
	var widthStyle = 'style="width:' + audioWidth + '%;"';
	var willSendMsg = '<div class="chat-box chat-box-right mui-content-padded contrain-audio" path="' + filePath +  '">' +
		'	<img class="chat-head" src="../img/avatar10.png" />' +
		'	<div class="chat-content"' +widthStyle+ '>' +
		'		<div class="chat-content-inner">' +
					'<div class="div-audio">'+
						'<i class="mui-icon iconfont icon-yuyinbofang2 icon-bofang me-speek"></i>'+
					'</div>' +
		'		</div>' +
		'		<div class="chat-content-arrow"></div>' +
		'	</div>' +
			'<span class="audio-duration">'+ showTime +'</span>'
		'	<div class="clear-float"></div>' +
		'</div>';
	//将语音消息追加到屏幕
	appendNewDom(willSendMsg);
	setPlayListener();
}

/**
 * 将聊天消息追加到屏幕
 * @param {Object} willSendMsg 消息内容
 */
function appendNewDom (willSendMsg) {
	//创建一个新的DOM
	var newDom = document.createElement('div');
	//把拼接好的气泡html赋值给newDom
	newDom.innerHTML = willSendMsg;
	//将newDom追加到气泡列表
	msgList.appendChild(newDom);
	//将消息列表滑到底部
	msgList.scrollTop = msgList.scrollHeight - msgList.offsetHeight;
}

function setPlayListener () {
	mui(".chat-list").on("tap",".contrain-audio",function () {
		var path = this.getAttribute("path");
		startPlay(path,this);
	})
}

//切换到语音聊天
document.getElementById("btn-switch-to-speek").addEventListener("tap",function () {
	$("#input-text").toggle();
	$("#btn-speek").toggle();
})
//监听【按住说话】的按住事件
var btnSpeek = document.getElementById("btn-speek");
//按住屏幕
var startTime,endTime;
btnSpeek.addEventListener('hold',function () {
	doRecord();
})
//离开屏幕
btnSpeek.addEventListener('release',function () {
	// 停止录音
	record.stop();
})
//执行录音操作
function doRecord () {
	//记录录音开始时间
	startTime = Date.now();
	// 录音操作
	record = plus.audio.getRecorder();
	record.record(
		{filename:"_doc/audio/"}, //录音文件保存的路径
		
		function (recordFile) {// 录音操作成功回调函数
			if ( plus.audio == undefined ) {
				mui.alert( "Device not ready!" );
				return;
			}
			player = plus.audio.createPlayer(recordFile);//创建音频播放对象
			//如果还未获取到音频流信息则返回NaN，此时需要延迟获取此信
			//记录录音结束时间
			endTime = Date.now();
			//计算录音的时长
//			console.log('startTime= ' + startTime + '----endTime= ' + endTime);
			var duration = Math.ceil((endTime-startTime)/1000);
//			var duration = getAudioDuration(player);
			addAudioToRight(duration,recordFile);
			saveData(Date.now(), 2,recordFile,duration);
		}, 
		
		function ( e ) {// 录音操作错误回调函数
			mui.alert( "Audio record failed: " + e.message );
		}
	);
}
//获取录音时长
function getAudioDuration (player) {
	//如果还未获取到音频流信息则返回NaN，此时需要延迟获取此信
	return player.getDuration();
}
var isPlaying = false;//标记是否正在播放语音
//开始播放语音
function startPlay(filePath,element) {
	$(element).attr('disabled',true);
	if ( plus.audio == undefined ) {
		mui.alert( "Device not ready!" );
	}
	player = plus.audio.createPlayer(filePath);
	isPlaying = true;
	setPlayingAnimation(element);
	//当音频文件播放完成时回调。
	player.play( function () {
		isPlaying = false;
	}, 
	//当音频文件播放发生错误时回调。
	function ( e ) {
		isPlaying = false;
		mui.alert( "Audio play error: " + e.message ); 
	}); 
}
//结束播放语音
function stopPlay() {
	isPlaying = false;
	player.stop();
}
/**
 * 设置播放图标的动画
 * @param {Object} element 用户点击的标签
 */
function setPlayingAnimation (element) {
	//找到用户点击的语音片段下面的图标
	var iconEle = $(element).find('.icon-bofang');
	var i = 0;//用于循环切换动画图标
	changeIcon(iconEle,i);
}
/**
 * 更改播放图标
 * @param {Object} element 播放图标的dom
 * @param {Object} i用于标记该切换到那张图片
 */
function changeIcon (element,i) {
	if(isPlaying){
		var classStr = 'mui-icon iconfont icon-yuyinbofang' + i + ' icon-bofang me-speek';
		$(element).attr('class',classStr);
		setTimeout(function () {
			changeIcon(element,++i%3);
		},500);
	}else{
		$(element).attr('class','mui-icon iconfont icon-yuyinbofang2 icon-bofang me-speek');
	}
}

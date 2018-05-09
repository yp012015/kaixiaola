// JavaScript Document
var utils = (function() {
	
	function _utils() {
		var _this = this;
		if(!(_this instanceof _utils)) {
			return new _utils();
		}
	}

	//静态共有属性方法
	_utils.prototype = {
		// 获取url中的参数
		getUrlParam: function(name) {
			var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
			var u = unescape(window.location.search.substr(1));
			//alert("win:"+window.location);
			var r = decodeURIComponent(u).match(reg);
			//decodeURIComponent
			if(r != null) {
				return unescape(r[2]);
			} else {
				return null;
			}
		},
		// 获取url中的参数使用MAP封装的JONS对象返回
		getJsonObjParam: function() {
			var name = 'params';
			var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
			var u = unescape(window.location.search.substr(1));
			var r = decodeURIComponent(u).match(reg);
			//decodeURIComponent
			if(r != null) {
				var jsonObj = JSON.parse(unescape(r[2]));

				var json = new Map();
				for(var item in jsonObj) {
					//alert(item);
					if(jsonObj['' + item + ''] != '' && jsonObj['' + item + ''] != null)
						json.setItem(item, jsonObj['' + item + ''])
				}

				//var jstr=unescape(r[2]);
				//return eval('('+jstr+')');						
				return json;
			} else {
				return null;
			}
		},

		// 获取url中的参数使用JONS字符串返回
		getJsonStrParam: function() {
			var name = 'params';
			var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
			var u = unescape(window.location.search.substr(1));
			var r = decodeURIComponent(u).match(reg);
			//decodeURIComponent
			if(r != null) {
				return unescape(r[2]);
			} else {
				return null;
			}
		},

		//根据key获取value的string值 jsonstr：josn字符串
		getStrValue: function(key, jsonstr) {
			var jsonObj = JSON.parse(jsonstr);
			//1、使用eval方法      
			/*var eValue = eval('jsonObj.' + key);
			alert(eValue);
			//2、遍历Json串获取其属性  
			for(var item in jsonObj) {
				if(item == key) { //item 表示Json串中的属性，如'name'  
					var jValue = jsonObj[item]; //key所对应的value  
					alert(jValue);
				}
			}*/
			//使用方法三
			//3、直接获取  
			//alert(jsonObj['' + key + '']);
			try {
				var s = jsonObj['' + key + ''];
				return JSON.stringify(s);
			} catch(e) {
				return "";
			}
		},

		/**
		 * 雷原添加
		 * @param {Object} key
		 * @param {Object} jsonstr
		 */
		getStrValue_2: function(key, jsonstr) {
			var jsonObj = JSON.parse(jsonstr);
			try {
				var s = jsonObj['' + key + ''];
				// maybe some problem！！！！！！雷原在此修改
				return s;
			} catch(e) {
				return "";
			}
		},

		//根据key获取value的string值
		getObjValue: function(key, jsonObj) {
			try {
				var str = "";
				if(jsonObj instanceof Map)
					str = jsonObj.list()['' + key + ''];
				else
					str = jsonObj['' + key + ''];
				return JSON.stringify(str);
			} catch(e) {
				console.log('jsonObj不是MAP对象,或者不是标准的集合对象')
				return "";
			}
		},

		//设置加密的字符串URL参数
		setUrlParams: function(urlparams) {
			var urlpar = urlparams;
			var u = encodeURIComponent(urlpar);
			//escape
			urlpar = escape(u);
			return '?' + urlpar;
		},

		//设置加密的JSON结构URL参数
		setJsonParams: function(urlparams) {
			var urlpar = urlparams;
			var u = encodeURIComponent(urlpar);
			//escape
			urlpar = escape(u);
			return '?params=' + urlpar;
		},

		//MAP集合转换为json字符串
		listTOjsonStr: function(list) {
			try {
				if(list instanceof Map) {
					var l = list.list();
					return JSON.stringify(l);
				} else {
					return JSON.stringify(list);
				}
			} catch(e) {
				console.log('list不是MAP对象,或者不是标准的集合对象')
				return "";
			}
		},

		//json字符串转换为JSON对象
		jsonStrTOjonsObj: function(jsonStr) {
			try {
				if(jsonStr != null && jsonStr != "") {
					var jsonObj = JSON.parse(jsonStr);
					var json = new Map();
					for(var item in jsonObj) {
						if(jsonObj['' + item + ''] != '' && jsonObj['' + item + ''] != null)
							json.setItem(item, jsonObj['' + item + ''])
					}
					return json;
				} else {
					return "";
				}
			} catch(e) {
				return "";
			}
		},

		//对Storage中的JSON字符串，指定节点进行添加
		//storageType:数据存储类型,local或者session; 
		//nodeObj:添加的接点对象(Map); 
		//attr:storage中的的目标;
		//tageNodeName：目标添加节点，可为空(为空的时就像跟节点添加)
		addDataStorageJsonNode: function(storageType, nodeObj, attr, tageNodeName) {
			var dataStorage;
			if(storageType == 'local')
				dataStorage = window.localStorage;
			else if(storageType == 'session')
				dataStorage = window.sessionStorage;
			else
				return;

			var arrJson = unescape(dataStorage.getItem(attr));
			var maplist = this.jsonStrTOjonsObj(arrJson);
			if(tageNodeName == null) //在根下直接添加
			{
				if(arrJson != null) {
					for(var key in nodeObj.list()) {
						maplist.setItem(key, nodeObj.getItem(key));
					}
					var mapStr = escape(this.listTOjsonStr(maplist));
					dataStorage.setItem(attr, mapStr);
					//alert('存储后的:'+mapStr);	
				} else {
					var mapStr = escape(this.listTOjsonStr(nodeObj));
					dataStorage.setItem(attr, mapStr);
				}
			} else //在指定节点下添加
			{
				var tageJson;
				for(var key in maplist.list()) {
					if(key == tageNodeName) {
						tageJson = maplist.getItem(tageNodeName);
						var i = 0;
						for(var k in nodeObj.list()) {
							maplist.getItem(tageNodeName)[k] = nodeObj.getItem(k);
							i++;
						}
						break;
					}
				}
				var mapStr = escape(this.listTOjsonStr(maplist));
				dataStorage.setItem(attr, mapStr);
				//alert('存储后的:'+mapStr);		

			}

		},
		//对Storage中的JSON字符串，指定节点进行取值返回
		//storageType:数据存储类型,local或者session; 
		//attr:storage中的的目标;
		//tageNodeName：目标取值节点,可为空，如果为空的情况下就取得整个storage中的属性，不为空就取属性中的一个jons节点
		getDataStorageJsonNode: function(storageType, attr, tageNodeName) {
			var dataStorage;
			if(storageType == 'local')
				dataStorage = window.localStorage;
			else if(storageType == 'session')
				dataStorage = window.sessionStorage;
			else
				return;

			var arrJson = unescape(dataStorage.getItem(attr));
			var maplist = this.jsonStrTOjonsObj(arrJson);
			if(arrJson != null) {
				if(tageNodeName != null) {
					if(maplist.getItem(tageNodeName) != undefined) {

						if(typeof(maplist.getItem(tageNodeName)) == 'string') {
							return maplist.getItem(tageNodeName);
						} else {
							var mapStr = this.listTOjsonStr(maplist.getItem(tageNodeName));
							return mapStr;
						}
					} else
						return "";
				} else {
					return arrJson;
				}
			} else
				return "";
		},

		//对Storage中的JSON字符串，指定节点进行删除
		//storageType:数据存储类型,local或者session; 
		//attr:storage中的的目标;
		//tageNodeName：目标删除节点		
		delDataStorageJsonNode: function(storageType, attr, tageNodeName) {
			var dataStorage;
			if(storageType == 'local')
				dataStorage = window.localStorage;
			else if(storageType == 'session')
				dataStorage = window.sessionStorage;
			else
				return;

			var arrJson = unescape(dataStorage.getItem(attr));
			var maplist = this.jsonStrTOjonsObj(arrJson);

			if(arrJson != null) {
				if(tageNodeName == null) { //如果tageNodeName为空，删除整个根节点的内容
					dataStorage.removeItem(attr);
				} else {
					maplist.removeItem(tageNodeName);
					var mapStr = escape(this.listTOjsonStr(maplist));
					dataStorage.setItem(attr, mapStr);
					return unescape(mapStr);
				}
			} else
				return "";
		}
	}

	return _utils;
})();

//静态方法(构造单例模式)
getUtils = function() {
	var Utils;
	if(Utils === undefined) {
		Utils = new utils();
		return Utils;
	} else {
		return Utils;
	}
};

//========================MAP集合
function Map() {
	this.keys = new Array();
	this.data = new Array();
	this.datalist = new Object();
	//添加键值对
	this.setItem = function(key, value) {
		if(this.data[key] == null) { //如键不存在则身【键】数组添加键名
			this.keys.push(key);
		}
		if(!(value instanceof Map)) {
			this.data[key] = value; //给键赋值
			this.datalist[key] = value;
		} else {
			try {
				this.data[key] = value.list(); //给键赋值
				this.datalist[key] = value.list();
			} catch(e) {
				console.log('value不是MAP对象')
			}
		}
	};
	//获取键对应的值
	this.getItem = function(key) {
		return this.data[key];
	};
	//去除键值，(去除键数据中的键名及对应的值)
	this.removeItem = function(key) {
		//this.keys.remove(key);
		for(var i = 0; i < this.keys.length; i++) {
			if(this.keys[i] == key) {
				this.keys.splice(i, 1);
				this.data[key] = null;
				this.datalist[key] = null;
				break;
			}
		}

	};
	//判断键值元素是否为空
	this.isEmpty = function() {
		return this.keys.length == 0;
	};
	//获取键值元素大小
	this.size = function() {
		return this.keys.length;
	};

	this.list = function() {
		return this.datalist;
	}
}

/**
LIST对象 作废

var list = (function() {
	function _list() {
		var _this = this;
		if(!_this instanceof _list) {
			return new _list();
		}
	}
	
	//静态共有属性方法
	_list.prototype = {
		add: function(key, value) {
			 this[key] = value; 
			 },
		get: function(key) { return this[key] },
	}

	return _list
})();
**/
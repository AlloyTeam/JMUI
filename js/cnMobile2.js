//base
(function(){
	var cm={
 		$namespace: function(name) {
	        if ( !name ) {
	            return window;
	        }

	        nsArr = name.split(".");
	        var ns=window;

            for(i = 0 , l = nsArr.length; i < l; i++){
            	var n = nsArr[i];
  				ns[n] = ns[n] || {};
  				ns = ns[n];
            }

            return ns;
        },
		$package:function(ns,func){
			var target;
			if(typeof ns == "function"){
				func=ns;
				target = window; 
			}
			else if(typeof ns == "string"){
				target = this.$namespace(ns);
			}
			else if(typeof ns == "object"){
				target  = ns;
			}
			func.call(target,this);
		},
		extend:function(destination,source){
			for(var n in source){
				if(source.hasOwnProperty(n)){
					destination[n]=source[n];
				}
			}
			return destination;

		},
	    bind:function(func, context, var_args) {
	        var slice = [].slice;
	        var a = slice.call(arguments, 2);
	        return function(){
	            return func.apply(context, a.concat(slice.call(arguments)));
	        };
		},
		indexOf:function(arr,elem){
			var $T= cm.type;
			//数组或类数组对象
			if(arr.length){
				return [].indexOf.call(arr,elem);
			}
			else if($T.isObject(arr)){
				for(var i in arr){
					if(arr.hasOwnProperty(i) && arr[i] === elem){
						return i;
					}	
				}
			}			
		},
		every:function(arr,callback){
			if(arr.length){
				return [].every.call(arr,callback);
			}
			else if($T.isObject(arr)){
				var flag = true;
				this.each(arr,function(e,i,arr){
					if(!callback(e,i,arr)) flag = false;
				});
				return flag;
			}
		},
		some:function(arr,callback){
			if(arr.length){
				return [].some.call(arr,callback);
			}
			else if($T.isObject(arr)){
				var flag = false;
				this.each(arr,function(e,i,arr){
					if(callback(e,i,arr)) flag = true;
				});
				return flag;
			}
		},
		each:function(arr,callback){
			var $T = cm.type;
			if(arr.length){
				[].forEach.call(arr,callback);
			}
			else if($T.isObject(arr)){
				for(var i in arr){
					if(arr.hasOwnProperty(i))
						if(callback.call(arr[i],arr[i],i,arr) === false) return;
				}
			}
		},
		map:function(arr,callback){
			var $T = cm.type;
			if(arr.length){
				[].map.call(arr,callback);
			}
			else if($T.isObject(arr)){
				for(var i in arr){
					if(arr.hasOwnProperty(i))
						arr[i] = callback.call(arr[i],arr[i],i,arr);
				}				
			}
		},
		filter:function(arr,callback){
			var $T = cm.type;
			if(arr.length){
				return [].filter.call(arr,callback);
			}
			else if($T.isObject(arr)){
				var newObj={};
				this.each(arr,function(e,i){
					if(callback(e,i)){
						newObj[i] = e;
					}
				});
				return newObj;
			}
		},
		isEmptyObject:function(obj){
			for(var n in obj){
				return false;
			}
			return true;
		}

	}
	window.cnMobile=window.cm=cm;
})();
//type
cm.$package(function(cm){

	var ots=Object.prototype.toString;

	var type={
		isArray : function(o){
			return o && (o.constructor === Array || ots.call(o) === "[object Array]");
		},
	    isObject : function(o) {
	    	return o && (o.constructor === Object || ots.call(o) === "[object Object]");
		},
	    isBoolean : function(o) {
	    	return (o === false || o) && (o.constructor === Boolean);
		},
	    isNumber : function(o) {
	    	return (o === 0 || o) && o.constructor === Number;
		},
	    isUndefined : function(o) {
	   		return typeof(o) === "undefined";
		},
	    isNull : function(o) {
	   		return o === null;
		},
	    isFunction : function(o) {
	   		return o && (o.constructor === Function);
		},
		isString : function(o) {
        	return (o === "" || o) && (o.constructor === String);
    	}
	}
	cm.type=type;
});
//browser
cm.$package(function(cm){
	var ua = navigator.userAgent;
	var platform = {};

	platform.android = ua.indexOf("Android") > -1 ,
	platform.iPhone = ua.indexOf("iPhone") > -1 ,
	platform.iPad = ua.indexOf("iPad") > -1 ,
	platform.iPod = ua.indexOf("iPod") > -1 ,
	platform.IOS = platform.iPad || platform.iPhone;
	platform.touchDevice = "ontouchstart" in window;

	cm.platform = platform;
});
//dom
cm.$package(function(cm){
	var doc = document,
	$T = cm.type,
	tagNameExpr = /^[\w-]+$/,
	idExpr = /^#([\w-]*)$/,
	classExpr = /^\.([\w-]+)$/,
	selectorEngine;

	var hasClassListProperty = 'classList' in document.documentElement;

	var $D={

		$:function(selector,context){
			var result;
			var qsa;
			context = context || doc;

			//优先使用原始的
			if(idExpr.test(selector)) {
				result = this.id(selector.replace("#",""));
				if(result)  return [result] ;
				else return [] ;
			}
			else if(tagNameExpr.test(selector)){
				result = this.tagName(selector);
			}
			else if(classExpr.test(selector)){
				result = this.className(selector.replace(".",""));
			}
			//自定义选择器
			else if(selectorEngine) result = selectorEngine(selector,context);
			//querySelectorAll
			else if(qsa=context.querySelectorAll) result = qsa.call(context,selector);
			else throw Error("querySelectorAll required");

			//nodeList转为array
			return [].slice.call(result);
				
		},
		id:function(id){
			return doc.getElementById(id);
		},
		tagName:function(tagName,context){
			context=context||doc;
			return context.getElementsByTagName(tagName);
		},
		className:function(className,context){
			context=context||doc;
			return context.getElementsByClassName(className);
		},
		setSelectorEngine:function(func){
			selectorEngine=func;
		},
		matchesSelector:function(ele,selector){
			var matchesSelector = ele.webkitMatchesSelector || ele.mozMatchesSelector || ele.oMatchesSelector || ele.matchesSelector;
			if(matchesSelector) return matchesSelector.call(ele,selector);
			var list = this.$(selector);
			if(cm.indexOf(list,ele)) return true;
			return false;
		},
		toDomStyle:function(cssStyle){
			if(!$T.isString(cssStyle)) return;
				return cssStyle.replace(/\-[a-z]/g,function(m) { return m.charAt(1).toUpperCase(); });
		},
		toCssStyle:function(domStyle){
			if(!$T.isString(domStyle)) return;
  				return domStyle.replace(/[A-Z]/g, function(m) { return '-'+m.toLowerCase(); });
		},
		setStyle:function(elem ,styleName,styleValue){
			if($T.isObject(styleName)){
				for(var n in styleName){
					if(styleName.hasOwnProperty(n)){
						elem.style[n] = styleName[n];
					}
				}
				return;
			}
			if($T.isString(styleName)){
				elem.style[styleName] = styleValue;
			}
		},
		closest:function(elem,selector){
			while(elem){
				if($D.matchesSelector(elem,selector)){
					return elem;
				}
				elem = elem.parentNode;
			}
		},
		filterSelector:function(arr,selector){
			return cm.filter(arr,function(elem){
				return $D.matchesSelector(elem,selector);
			});
		},
		addClass:function(){
			if(hasClassListProperty){
	            return function (elem, className) {
	                if (!elem || !className || $D.hasClass(elem, className)){
	                    return;
	                }
	                elem.classList.add(className);
	            };
			}
			else{
				return function(elem, className){
	                if (!elem || !className || $D.hasClass(elem, className)) {
	                    return;
	                }
	                elem.className += " "+ className;
				}	
			}
		}(),
	    hasClass:function(){
	        if (hasClassListProperty) {
	            return function (elem, className) {
	                if (!elem || !className) {
	                    return false;
	                }
	                return elem.classList.contains(className);
	            };
	        } else {
	            return function (elem, className) {
	                if (!elem || !className) {
	                    return false;
	                }
	                return -1 < (' ' + elem.className + ' ').indexOf(' ' + className + ' ');
	            };
	        }
	    }(),
	    removeClass:function(){
	        if (hasClassListProperty) {
	            return function (elem, className) {
	                if (!elem || !className || !$D.hasClass(elem, className)) {
	                    return;
	                }
	                elem.classList.remove(className);
	            };
	        } else {
	            return function (elem, className) {
	                if (!elem || !className || !$D.hasClass(elem, className)) {
	                    return;
	                }
	                elem.className = elem.className.replace(new RegExp('(?:^|\\s)' + className + '(?:\\s|$)'), ' ');
	            };
	        }	    	
	    }()
	};

	cm.dom=$D;
});

//event
cm.$package(function(cm){

	var $T=cm.type;

	var isDomEvent=function(obj,evtType){
		//addEventListener supported by ie9+
		return obj.tagName && obj.addEventListener && "on" + evtType in window;
	}

	var $E={
		on:function(obj, evtType, handler){
			if($T.isArray(obj)){
				for(var i=obj.length;i--;){
					$E.on(obj[i], evtType, handler);
				}			
			}
			//evtType is a string split by space
			if($T.isString(evtType)&&evtType.indexOf(" ")>0){
				evtType = evtType.split(" ");
				for(var i=evtType.length;i--;){
					$E.on(obj, evtType[i], handler);
				}
				return;
			}
			//handler is an array
			if($T.isArray(handler)){
				for(var i=handler.length;i--;){
					$E.on(obj, evtType, handler[i]);
				}
				return;
			}
			//evtType is an object
			if($T.isObject(evtType)){
				for(var eName in evtType){
					$E.on(obj, eName, evtType[eName]);
				}
				return;
			}

			//is dom event
			if(isDomEvent(obj,evtType)){
				obj.addEventListener(evtType ,handler ,false);
				return;
			}
			//is specific custom event
			if(customEvent[evtType]){
				customEvent[evtType](obj,handler);
				return;
			}
		
			if(!obj.events) obj.events={};
			if(!obj.events[evtType]) obj.events[evtType]=[];

			obj.events[evtType].push(handler);
			

		},
		once:function(obj,evtType,handler){
			var f = function(){
				handler();
				$E.off(obj ,evtType ,f);
			}
			$E.on(obj ,evtType ,f);
		},
		off:function(obj,evtType,handler){
			//evtType is a string split by space
			if($T.isString(evtType)&&evtType.indexOf(" ")>0){
				evtType = evtType.split(" ");
				for(var i=evtType.length;i--;){
					$E.off(obj, evtType[i], handler);
				}
				return;
			}
			//handler is an array
			if($T.isArray(handler)){
				for(var i=handler.length;i--;){
					$E.off(obj, evtType, handler[i]);
				}
				return;
			}
			//evtType is an object
			if($T.isObject(evtType)){
				for(var eName in evtType){
					$E.off(obj, eName, evtType[eName]);
				}
				return;
			}

			if(isDomEvent(obj,evtType)){
				obj.removeEventListener( evtType , handler ,false );
				return;
			}	
			//is specific custom event
			if(customEvent[evtType]){
				customEvent._off(obj,evtType,handler);
				return;
			}	
			
			if(!evtType) {
				obj.events={}; 
				return;
			}
	
			if(obj.events){
				if(!handler) {
					obj.events[evtType]=[];
					return;
				}
				if(obj.events[evtType]){
					var evtArr=obj.events[evtType];
					for(var i=evtArr.length;i--;){
						if(evtArr[i]==handler){
							evtArr.splice(i,1);
							return;
						}
					}
				}
			}
		},
		fire:function(obj,evtType){
			var arg = [].slice.call(arguments,2);
			//obj is dom element
			if(isDomEvent(obj,evtType)){
		        var evt = document.createEvent('HTMLEvents');
        		evt.initEvent(evtType, true, true);
        		obj.dispatchEvent(evt);
        		return;
			}
			if(obj.events&&obj.events[evtType]){
				var handler=obj.events[evtType];
				for(var i=0,l=handler.length;i<l;i++){
					handler[i].apply(window,arg);
				}
			}
		}

	};

	var startEvt,moveEvt,endEvt;
	var pt_pos,//上次按下位置
		pt_up_pos,//上次松开位置
		pt_time,//上次按下时间
		pt_up_time;//上次松开时间

	//选择不同事件
	if(cm.platform.touchDevice){
		startEvt="touchstart";
		moveEvt="touchmove";
		endEvt="touchend";
	}
	else{
		startEvt="mousedown";
		moveEvt="mousemove";
		endEvt="mouseup";			
	}

	var getTouchPos = function(e){
		var t = e.touches ? e.touches[0] : e;
		return {x : t.pageX , y : t.pageY};
	}
	var getDist = function(p1 , p2){
		if(!p1 || !p2) return 0;
		return Math.sqrt((p1.x - p2.x) * (p1.x - p2.x) + (p1.y - p2.y) * (p1.y - p2.y));

	}


	var customEventHandlers = [];
	var isCustomEvtMatch = function(ch,ele,evtType,handler){
		return ch.ele == ele && evtType == ch.evtType && handler == ch.handler
	}
	//自定义事件
	var customEvent = {
		_fire:function(ele,evtType,handler){
			cm.each(customEventHandlers,function(ch){
				if(isCustomEvtMatch(ch,ele,evtType,handler)){
					handler.call(ele,{
						type:evtType
					});
				}
			});			
		},
		_off:function(ele,evtType,handler){
			cm.each(customEventHandlers,function(ch,i){
				var at = ch.actions;
				if(isCustomEvtMatch(ch,ele,evtType,handler)){
					//删除辅助处理程序
					for(var n in at){
						$E.off(ele ,n ,at[n]);
					}
					//删除本处理程序数据
					customEventHandlers.splice(i,1);
					return;
				}
			});
		},
		tap:function(ele,handler){
			//按下松开之间的移动距离小于20，认为发生了tap
			var TAP_DISTANCE = 20;
			var startEvtHandler = function(e){
				var touches = e.touches;
				if(!touches || touches.length == 1){//鼠标点击或者单指点击
					pt_pos = getTouchPos(e);
					pt_time = Date.now();
				}
			}
			var endEvtHandler = function(e){
				var p = getTouchPos(e);
				var dist = getDist(p , pt_pos);
				if(dist < TAP_DISTANCE){
					handler.call(ele,{
						oriEvt:e,
						type:"tap"
					});
					pt_up_time = Date.now();
				}
			}

			$E.on(ele,startEvt,startEvtHandler);
			$E.on(ele,endEvt,endEvtHandler);

			var evtOpt = {
				ele:ele,
				evtType:"tap",
				handler:handler
			}
			evtOpt.actions = {};
			evtOpt.actions[startEvt] = startEvtHandler;
			evtOpt.actions[endEvt] = endEvtHandler;

			customEventHandlers.push(evtOpt);
			
		},
		doubletap:function(ele,handler){
			//按下松开之间的移动距离小于20，认为发生了tap
			var TAP_DISTANCE = 20;
			//双击之间最大耗时
			var DOUBLE_TAP_TIME = 300;
			var pre_tap_time;
			var startEvtHandler = function(e){
				var touches = e.touches;
				if(!touches || touches.length == 1){//鼠标点击或者单指点击
					pt_pos = getTouchPos(e);
					pt_time = Date.now();
				}
			}
			var endEvtHandler = function(e){
				var now = Date.now();
				var p = getTouchPos(e);
				var dist = getDist(p , pt_up_pos);

				if(dist < TAP_DISTANCE && pre_tap_time && now - pre_tap_time < DOUBLE_TAP_TIME){
					handler.call(ele,{
						oriEvt:e,
						type:"doubletap"
					});
					pt_up_time = now;
				}
				pre_tap_time = now;
			}

			$E.on(ele,startEvt,startEvtHandler);
			$E.on(ele,endEvt,endEvtHandler);

			var evtOpt = {
				ele:ele,
				evtType:"doubletap",
				handler:handler
			}
			evtOpt.actions = {};
			evtOpt.actions[startEvt] = startEvtHandler;
			evtOpt.actions[endEvt] = endEvtHandler;

			customEventHandlers.push(evtOpt);
		},
		hold:function(ele,handler){
			//按下松开之间的移动距离小于20，认为点击生效
			var HOLD_DISTANCE = 20;
			//按下两秒后hold触发
			var HOLD_TIME = 2000;
			var holdTimeId;
			var current_pos;
			var startEvtHandler = function(e){
				var touches = e.touches;
				if(!touches || touches.length == 1){//鼠标点击或者单指点击
					current_pos = pt_pos = getTouchPos(e);
					pt_time = Date.now();

					holdTimeId = setTimeout(function(){
						if(getDist(pt_pos,current_pos) < HOLD_DISTANCE){
							handler.call(ele,{
								oriEvt:e,
								type:"hold"
							});
						}
					},HOLD_TIME);
				}
			}
			var moveEvtHandler = function(e){
				current_pos = getTouchPos(e);
			}
			var endEvtHandler = function(e){
				clearTimeout(holdTimeId);
				pt_up_time = Date.now();
			}	
			$E.on(ele,startEvt,startEvtHandler);
			$E.on(ele,moveEvt,moveEvtHandler);
			$E.on(ele,endEvt,endEvtHandler);	

			var evtOpt = {
				ele:ele,
				evtType:"hold",
				handler:handler
			}
			evtOpt.actions = {};
			evtOpt.actions[startEvt] = startEvtHandler;
			evtOpt.actions[moveEvt] = moveEvtHandler;
			evtOpt.actions[endEvt] = endEvtHandler;

			customEventHandlers.push(evtOpt);	
		}

	}



	//scrollstart scrollend事件
	$E.on(window ,"scroll" ,function(){
		if(!isScrolling){
			isScrolling = true;
			$E.fire(window,"scrollstart");
		}
		clearTimeout(scrollTimeId);
		scrollTimeId = setTimeout(function(){
			isScrolling = false;
			$E.fire(window ,"scrollend");
		},250);
	});

	cm.event=$E;
});













//http
cm.$package(function(cm){
	var http = {
		serializeParam : function ( param ) {
			if ( !param ) return '';
			var qstr = [];
			for ( var key in  param ) {
				qstr.push( encodeURIComponent(key) + '=' + encodeURIComponent(param[key]) );
			};
			return  qstr.join('&');
		},
		getUrlParam :  function ( name ,href ,noDecode ) {
			var re = new RegExp( '(?:\\?|#|&)' + name + '=([^&]*)(?:$|&|#)',  'i' ), m = re.exec( href );
			var ret = m ? m[1] : '' ;
			return !noDecode ? decodeURIComponent( ret ) : ret;
		},
		ajax : function ( option ) {
			var o = option;
			var m = o.method.toLocaleUpperCase();
			var isPost = 'POST' == m;
			var isComplete = false;
			var overtime = o.overtime;

			var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : false;
			if ( !xhr ) {
			 	o.error && o.error.call( null, { ret : 999 , msg : 'Create XHR Error!' } );
			 	return false;
			}

			var qstr = http.serializeParam( o.param );

			// get 请求 参数处理
			!isPost && ( o.url += ( o.url.indexOf( '?' ) > -1 ?  '&' : '?' ) + qstr );

			xhr.open( m, o.url, true );

			isPost && xhr.setRequestHeader( 'Content-Type', 'application/x-www-form-urlencoded' );

			xhr.onreadystatechange = function(){
				if ( 4 == xhr.readyState ) {
					var status = xhr.status;
					if ( (status >= 200 && status < 300) || status == 304) {
						var response = xhr.responseText.replace( /(\r|\n|\t)/gi, '' );
						// var m = /callback\((.+)\)/gi.exec( response );
						// var result = { ret : 998, msg : '解析数据出错，请稍后再试' };
						// try{ result = eval( '(' + m[1] + ')' ) } catch ( e ) {};
						// result = eval( '(' + m[1] + ')' )
						o.success && o.success(JSON.parse(response),xhr);
					}else{
						o.error && o.error(xhr);
					};
					isComplete = true;
				}
				
			};
			

			xhr.send( isPost ? qstr : void(0) );
	
			if(overtime){
				setTimeout(function(){
					if(!isComplete){
						xhr.abort();//不abort同一url无法重新发送请求？
						o.timeout && o.timeout(xhr);
					}
				},overtime);
			}

			return xhr;
		}	
	}
	cm.http = http;
});




//base
(function(){
	var J={
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
		Class:function(){
	        var length = arguments.length;
	        var option = arguments[length-1];
        	option.init = option.init || function(){};
   
	        if(length === 2){
	            var superClass = arguments[0].extend;
	
	            var tempClass = function() {};
	            tempClass.prototype = superClass.prototype;

	            var subClass = function() {
	                this.init.apply(this, arguments);
	            }
	          
	            subClass.superClass = superClass.prototype;
	            subClass.callSuper = function(context,func){
	                var slice = Array.prototype.slice;
	                var a = slice.call(arguments, 2);
	                var func = subClass.superClass[func];
	           
	                if(func){
	                    func.apply(context, a.concat(slice.call(arguments)));
	                }
	            };
	            subClass.prototype = new tempClass();
	            subClass.prototype.constructor = subClass;
	            
	            J.extend(subClass.prototype, option);
	            

	            subClass.prototype.init = function(){
	                option.init.apply(this, arguments);
	            };
	            return subClass;
	        }else if(length === 1){
	            var newClass = function() {
	                return this.init.apply(this, arguments);
	            }
	            newClass.prototype = option;
	            return newClass;
	        }   
	    },
		indexOf:function(arr,elem){
			var $T = J.type;
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
			var $T = J.type;
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
			var $T = J.type;
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
			var $T = J.type;
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
	window.JM=window.J=J;
})();
//connection
J.$package(function(J){
	var c = navigator.connection || {type:0};
	var ct = ["unknow","ethernet","wifi","cell_2g","cell_3g"];
	J.connectType = ct[c.type]; 
});
//type
J.$package(function(J){

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
	J.type=type;
});
//browser
J.$package(function(J){
	var ua = navigator.userAgent;
	var platform = {};

	platform.android = ua.indexOf("Android") > -1 ,
	platform.iPhone = ua.indexOf("iPhone") > -1 ,
	platform.iPad = ua.indexOf("iPad") > -1 ,
	platform.iPod = ua.indexOf("iPod") > -1 ,
	platform.IOS = platform.iPad || platform.iPhone;
	platform.touchDevice = "ontouchstart" in window;

	J.platform = platform;
});
//dom
J.$package(function(J){
	var doc = document,
	$T = J.type,
	tagNameExpr = /^[\w-]+$/,
	idExpr = /^#([\w-]*)$/,
	classExpr = /^\.([\w-]+)$/,
	selectorEngine;

	var hasClassListProperty = 'classList' in document.documentElement;
	var vendors = ['o', 'ms' ,'moz' ,'webkit'];
	var div = document.createElement('div');

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
			if(!ele || !selector) return;
			var matchesSelector = ele.webkitMatchesSelector || ele.mozMatchesSelector || ele.oMatchesSelector || ele.matchesSelector;
			if(matchesSelector) return matchesSelector.call(ele,selector);
			var list = this.$(selector);
			if(J.indexOf(list,ele) > 0) return true;
			return false;
		},
		closest:function(elem,selector){
			while(elem){
				if($D.matchesSelector(elem,selector)){
					return elem;
				}
				elem = elem.parentNode;
			}
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
			var self = this;
			if($T.isArray(elem)){
				J.each(elem ,function(e){
					self.setStyle(e,styleName,styleValue);
				});
				return;
			}
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
		//获取带有出产商的属性名
		getVendorPropertyName : function(prop) {
			var style = div.style;
			var _prop;
		    if (prop in style) return prop;
		    // _prop = prop;
		    _prop = prop.charAt(0).toUpperCase() + prop.substr(1);
		    for(var i = vendors.length; i--;){
		    	var v = vendors[i];
		    	var vendorProp = v + _prop;
		    	if (vendorProp in style) {
		    		return vendorProp;
		    	}
		    }	  	
		},
	 	//检测是否支持3D属性
	 	isSupprot3d : function(){
	 		// var transformStr = $D.getVendorPropertyName("transform");
	 		// $D.setStyle(div ,transformStr ,"rotatex(90deg)");
	 		// if(div.style[transformStr] == "") return false;
	 		// return true;
	 		var p_prop = $D.getVendorPropertyName("perspective");
	 		return p_prop && p_prop in div.style;
	 	},
		filterSelector:function(arr,selector){
			return J.filter(arr,function(elem){
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
	    }(),
	    toggleClass:function(ele,className){
	    	if($D.hasClass(ele,className)){
	    		$D.removeClass(ele,className);
	    	}
	    	else{
	    		$D.addClass(ele,className);
	    	}
	    }
	};

	J.dom=$D;
});

//event
J.$package(function(J){

	var $T=J.type,
		scrollTimeId,
		isScrolling,
		gestureEvent={
			"tap":1,
			"doubletap":1,
			"hold":1,
			"swipe":1,
			"dragstart":1,
			"drag":1,
			"dragend":1,
			"transform":1,
			"transformstart":1,
			"transformend":1
		};

	var supportDomEvent=function(obj,evtType){
		//addEventListener supported by ie9+
		return obj.addEventListener;
	}
	var isUseCustomGesture=function(obj,evtType){
		// return obj.addEventListener &&!(("on" + evtType) in obj) && gestureEvent[evtType]; 是否有必要？
		return obj.addEventListener && gestureEvent[evtType];
	}
	//自定义手势事件信息
	var GestureEventMessage=function(options){
		this.obj=options.obj;
		this.evtType=options.evtType;
		this.handler=options.handler;//function or array
	}

	//添加静态方法
	J.extend(GestureEventMessage,{
		msgInfo :{},
		add:function(em){
			var evtType = em.evtType;
			var obj = em.obj;
			var handler = em.handler;
			var msgInfo = this.msgInfo;

			if(!msgInfo[evtType]) msgInfo[evtType] = [];
			for(var i = msgInfo[evtType].length;i--;){
				if(msgInfo[evtType][i].obj === obj){
					msgInfo[evtType][i].handler.push(handler);
					return;
				}
			}
			em.handler=[em.handler];
			msgInfo[evtType].push(em);
		},
		remove:function(em){
			var evtType = em.evtType;
			var handler = em.handler;
			var obj = em.obj;
			var msgInfo = this.msgInfo;
			var msgArr;
			if(msgArr = msgInfo[EvtType]){
				if(msgArr[i].obj === obj){
					if(handler){
						var handler = msgArr[i].handler;
						for(var j = handler.length;j--;){
							if(handler[i] === handler){
								handler.splice(i,1);
								return;
							}
						}
					}
					else {
						msgArr.splice(i,1);
					}
				}
			}
		},
		get:function(obj,evtType){

			var msgInfo = this.msgInfo;
			var msgArr;
			
			if(msgArr = msgInfo[evtType]){
				for(var i=msgArr.length;i--;){
					if(msgArr[i].obj === obj){
						return msgArr[i];
					}
				}
			}

		}
	})
	var canSimulateGesture = function(){
		return !(evtType in window) && gestureEvent[evtType];
	}

	var $E={
		setGestureEventConfig:function(options){
			if("drag_distance" in options) DRAG_DISTANCE = options["drag_distance"];
		},
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
			//is use custom gesture
			if(isUseCustomGesture(obj,evtType)){
				bindCustomGestureHandler(obj);//模拟自定义手势事件
				GestureEventMessage.add(new GestureEventMessage({
					obj:obj,
					evtType:evtType,
					handler:handler
				}));
				return;
			}

			//obj is dom element
			if(supportDomEvent(obj,evtType)){
				obj.addEventListener(evtType ,handler ,false);
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

			//is use custom gesture
			if(isUseCustomGesture(obj,evtType)){
				GestureEventMessage.remove(new GestureEventMessage({
					obj:obj,
					evtType:evtType,
					handler:handler
				}));
				return;
			}

			if(supportDomEvent(obj,evtType)){
				obj.removeEventListener( evtType , handler ,false );
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
			if(isUseCustomGesture(obj,evtType)){
				var gestureEvtMsg = GestureEventMessage.get(obj,evtType);
				if(!gestureEvtMsg) return;

				var handler = gestureEvtMsg.handler;

				for(var i=0,l=handler.length;i<l;i++){
					handler[i].apply(window,arg);
				}

				return;
			}
			//obj is dom element
			if(supportDomEvent(obj,evtType)){
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


	var startEvt,moveEvt,endEvt;
	var	HOLD_TIME = 2000,//hold事件在2秒后触发
		TAP_DISTANCE = 20,//按下松开之间的移动距离小于20，认为发生了tap
		DOUBLE_TAP_TIME = 300,//双击之间最大耗时
		DOUBLE_TAP_DISTANCE = 50,//双击之间最大距离
		DRAG_DISTANCE = 20,//按下之后移动20px之后就认为拖动开始
		SWIPE_DISTANCE = 30,//按下之后移动30px之后就认为swipe开始
		SWIPE_TIME = 500;//swipe最大经历时间

	var holdTimeId;//hold定时器id
	var preTouchPos;//之前点击的位置
	var preTouchTime;//之前一次点击时间
	var preUpTime;//之前一次点击松开时间
	var currentGesture;//当前手势
	var currentPos;//当前位置
	var isPressed;//是否已经按下
	var preFingerDist;//之前两只手指间距离
	var preAngle;//之前两手指所成角度
	var currentFingerDist;//当前两只手指间距离
	var preUpPos;//上次手指离开位置
	var tp1;//transform其中一只手指
	var tp2;//transform另一只手指
	var currentScale;//当前transform缩放比例
	var currentRotation;//当前transform旋转角度

	//自定义手势事件对象
	var GestureEventObject = function(options){
		this.originalEventObject = options.originalEventObject;
		this.touches = options.touches;
		this.position = options.position;
		this.angle = options.angle;
		this.scale = options.scale;
		this.rotation = options.rotation;
		this.direction = options.direction;
		this.distance = options.distance;
	}
	//点击位置点
	var TouchPoint = function(x,y){
		this.x=x;
		this.y=y;
	}
	//计算两点之间距离
	TouchPoint.getPosDist = function(p1,p2){
		var x1=p1.x,y1=p1.y,x2=p2.x,y2=p2.y;
		return Math.sqrt((x1-x2)*(x1-x2)+(y1-y2)*(y1-y2));
	};
	//计算两点之间所成角度
	TouchPoint.getAngle = function(p1,p2){
		var r = Math.atan2(p1.y - p2.y, p2.x - p1.x);
		return r * 180 / Math.PI;
	};
	
	//获取swipe的方向
	var getSwipeDirection=function(currentPos,preTouchPos){
		var dx = currentPos.x - preTouchPos.x;
		var dy = -currentPos.y + preTouchPos.y;	
		var angle = Math.atan2(dy,dx)*180/Math.PI;

		if(angle<45 && angle>-45) return "right";
		if(angle>=45 && angle<135) return "top";
		if(angle>=135 || angle< -135) return "left";
		if(angle>=-135 && angle<=-45) return "bottom";

	}
	//获取touch手指数目
	var getTouchesCount=function(e){
		return e.touches.length;
	}


	//模拟自定义手势事件
	var bindCustomGestureHandler = function(obj){

		if(obj.getAttribute("hasBindCustomGesture")){
			return;
		}
		obj.setAttribute("hasBindCustomGesture",true);
		//选择不同事件
		if(J.platform.touchDevice){
			startEvt="touchstart";
			moveEvt="touchmove";
			endEvt="touchend";
		}
		else{
			startEvt="mousedown";
			moveEvt="mousemove";
			endEvt="mouseup";			
		}

		$E.on(obj,startEvt,function(e){
			
			// e.preventDefault();
		
			var touches = e.touches;

			if(!touches || touches.length == 1){
				preTouchTime = Date.now();//单指点击时间
				var tou;
				if(touches) tou = touches[0];
				else tou = e;
	
				preTouchPos = currentPos = new TouchPoint(tou.pageX , tou.pageY);
				// currentGesture = "hold";
				//事件信息对象实例
				var evtObj = new GestureEventObject({
					originalEventObject:e,
					touches:touches,
					position:currentPos
				});

				holdTimeId = setTimeout(function(){
					//触发hold事件
					if(TouchPoint.getPosDist(preTouchPos,currentPos)< TAP_DISTANCE){
						$E.fire(obj,"hold",evtObj);
					}
				},HOLD_TIME);

				isPressed=true;
			}

		
		});
		$E.on(obj ,moveEvt ,function(e){
			
			// e.preventDefault();

			if(!isPressed) return;

			var touches = e.touches;
			//单点击
			if(!touches || touches.length == 1){
				
				var tou;
				if(e.touches) tou = e.touches[0];
				else tou = e;

				currentPos = new TouchPoint(tou.pageX , tou.pageY);

				if(!preTouchPos) return;

				//事件信息对象实例
				var evtObj = new GestureEventObject({
					originalEventObject:e,
					touches:touches,
					position:currentPos
				});

				var dist = TouchPoint.getPosDist(currentPos,preTouchPos);//拖动距离

				if(currentGesture!="drag" && dist > DRAG_DISTANCE){
					//触发dragstart事件
					$E.fire(obj,"dragstart",evtObj);
					currentGesture = "drag";
					return;	
				}
				//拖动相对于起点距离
				evtObj.distance = dist;
				//拖动相对于起点所成角度
				evtObj.angle = TouchPoint.getAngle(preTouchPos,currentPos);

				if(currentGesture=="drag") {
					$E.fire(obj,"drag",evtObj);
				}
				
			}
			//双点击
			else if(touches.length == 2){
				
				var tou1 = touches[0], tou2 = touches[1];
				tp1 = new TouchPoint(tou1.pageX , tou1.pageY),
				tp2 = new TouchPoint(tou2.pageX , tou2.pageY);

				var currentFingerDist = TouchPoint.getPosDist(tp1,tp2);
				var currentAngle = Math.atan2(tp2.y - tp1.y, tp2.x-tp1.x);

				//事件信息对象实例
				var evtObj = new GestureEventObject({
					originalEventObject:e,
					touches:touches,
					position:new TouchPoint((tp1.x + tp2.x)/2 , (tp1.y + tp2.y)/2) //transform 位置

				});

				if(currentGesture != "transform"){
					//transform start clear hold time id
					clearTimeout(holdTimeId);

					preFingerDist = currentFingerDist;
					preAngle = currentAngle;
					//触发transformstart事件
					$E.fire(obj,"transformstart",evtObj);	
					currentGesture = "transform";
					return;
				}
				//手势缩放比
				currentScale = currentFingerDist/preFingerDist;
				//手势旋转角度
				currentRotation = (currentAngle - preAngle) * 180/Math.PI;

				evtObj.scale = currentScale;
				evtObj.rotation = currentRotation;

				//触发transform"事件
				$E.fire(obj,"transform",evtObj);
			}
			
		});
		$E.on(obj ,endEvt ,function(e){
			// e.preventDefault();

			clearTimeout(holdTimeId);
			
			var touches = e.touches;


			if(!touches || touches.length == 0){
				
				currentPos = currentPos || preTouchPos;
				
				var now = Date.now();

				//事件信息对象实例
				var evtObj = new GestureEventObject({
					originalEventObject:e,
					touches:touches,
					position:currentPos
				});


				//和按下点的距离
				var dist = TouchPoint.getPosDist(currentPos,preTouchPos);

				if(dist < TAP_DISTANCE){
					if(preUpTime) {
						if(now - preUpTime < DOUBLE_TAP_TIME && TouchPoint.getPosDist(preUpPos,currentPos) < DOUBLE_TAP_DISTANCE){
							//触发doubletap事件
							$E.fire(obj,"doubletap",evtObj);	
								preUpTime = now;
								preUpPos = currentPos ;
								preTouchPos = currentPos = null;
								return;	
							} 	
					}
					//触发tap事件
					$E.fire(obj,"tap",evtObj);
				}
				if(currentGesture=="drag") {

					//事件信息对象实例
					var evtObj = new GestureEventObject({
						originalEventObject:e,
						touches:touches,
						position:currentPos,
						//离拖动起点的距离以及角度
						distance:dist,
						angle:TouchPoint.getAngle(preTouchPos,currentPos)
					});
					
					$E.fire(obj,"dragend",evtObj);
					currentGesture="";
				}
				
				if(dist > SWIPE_DISTANCE && now - preTouchTime < SWIPE_TIME){

					var direction = getSwipeDirection(currentPos,preTouchPos);
					//事件信息对象实例
					var evtObj = new GestureEventObject({
						originalEventObject:e,
						touches:touches,
						position:currentPos,
						//离拖动起点的距离以及角度
						distance:dist,
						direction:direction
					});

	
					//触发 swipe 事件
					$E.fire(obj, "swipe",evtObj);
				}
				isPressed = false;
				preUpTime = now;
			}
			else if(touches.length == 1){//transform
				
				//触发transformend事件
				if(currentGesture == "transform") {

					//事件信息对象实例
					var evtObj = new GestureEventObject({
						originalEventObject:e,
						touches:touches,
						position:new TouchPoint((tp1.x + tp2.x)/2 , (tp1.y + tp2.y)/2),
						scale:currentScale,
						rotation:currentRotation
					});

					$E.fire(obj,"transformend",evtObj);
					tp1 = tp2 = null;
					currentGesture = "";
					currentPos = new TouchPoint(touches[0].pageX , touches[0].pageY);//剩下的手指的当前点击位置
					preTouchPos = currentPos;//重新设置点击位置，使drag能顺利继续执行
					return;
				}
				
			}
			preUpPos = currentPos ;
			preTouchPos = currentPos = null;
			
 
		});
	}

	J.event=$E;
});
//Util
J.$package(function(J){
	var $D = J.dom,
		$E = J.event,
		$T = J.type;
	var preventScroll = function(e){
        if (e.target.type === 'range') { return; }
            e.preventDefault();
	}
	var hideScroll = function(){
		setTimeout(function(){
			if(!location.hash){
				var ph = window.innerHeight + 60;
				if(document.documentElement.clientHeight < ph){
					$D.setStyle(document.body,"height",ph + "px");
				}
				window.scrollTo(0,1);
			}
		},200);
	}
		

	var Util = {
		//隐藏URL栏
		hideUrlBar:function(){
			$E.on(window ,"load resize" ,hideScroll);
		},
		//禁止滚动
		preventScrolling : function() {
	 	    $E.on(document ,'touchmove' ,preventScroll);
    	},
    	//启用滚动
    	activeScrolling:function(){
    		$E.off(document ,'touchmove' ,preventScroll);
    	},
		//滚动到顶部动画(css3动画)
		scrollToTop:function(duration,runType){
			var $A = J.Animation;
			var body = document.body;
			var scrollTop = window.pageYOffset || document.body.scrollTop || document.documentElement.scrollTop;
			
			$D.setStyle(body, $D.getVendorPropertyName("transform"), "translate(0,"+ (- scrollTop) + "px)");

			document.body.scrollTop ? document.body.scrollTop = 0:document.documentElement.scrollTop = 0;	
			new $A({
				selector:body,
				duration:duration,
				runType:runType,
				use3d:true
			}).translateY(0).transit();
		}
	};
	J.Util = Util;
});

//animation time, runType ,scale, rotate, rotateX, rotateY, translateX, translateY, skewX, skewY
J.$package(function(J){
	var $D = J.dom,
		$E = J.event,
		$T = J.type;
	
 	//3d支持
 	var support3d = $D.isSupprot3d();
 	var finishedCount = 0;

	var Animation = J.Class({
		init:function(options){
		
			this.setElems(options.selector);
			this.setDuration(options.duration || 1000);
			this.setRunType(options.runType || "ease-in-out");
			this.setDelay(options.delay || 0);
			this.setUsed3d(options.use3d);
			this.transformArr = [];
		},
		setDuration:function(duration){
			this.duration = duration;
			return this;
		},
		setDelay:function(delay){
			this.delay = delay;
			return this;
		},
		setElems:function(selector){
			if($T.isString(selector)){
				this.elems = $D.$(selector);
			}
			else if($T.isArray(selector)){
				this.elems = selector;
			}
			else if(selector.tagName){
				this.elems = [selector];
			}
			return this;
		},
		setRunType:function(runType){
			this.runType = runType;
			return this;
		},
		setUsed3d:function(use3d){
			this.use3d = use3d;
			return this;
		},
		scale:function(scale){
			this.transformArr.push("scale(" + scale + ")");
			return this;
		},
		scaleX:function(scaleX){
			this.transformArr.push("scalex(" + scaleX + ")");
			return this;
		},
		scaleY:function(scaleY){
			this.transformArr.push("scaley(" + scaleY + ")");
			return this;
		},
		rotate:function(rotate){
			this.transformArr.push("rotate(" + rotate + "deg)");
			return this;
		},
		rotateX:function(rotateX){
			this.transformArr.push("rotatex(" + rotateX + "deg)");
			return this;
		},
		rotateY:function(rotateX){
			this.transformArr.push("rotatey(" + rotateY + "deg)");
			return this;
		},
		rotateZ:function(rotateZ){
			this.transformArr.push("rotatez(" + rotateZ + "deg)");
			return this;
		},
		translate:function(translateX,translateY,translateZ){
			if(support3d && translateZ)
				this.transformArr.push("translate3d" + '(' + translateX + ',' + translateY + ','+ translateZ +')');
			else
				this.transformArr.push("translate" + '(' + translateX + ',' + translateY + ')');
			return this;
		},
		translateX:function(translateX){
			this.translate(translateX,0);
			return this;
		},
		translateY:function(translateY){
			this.translate(0,translateY);
			return this;
		},	
		skew:function(x,y){
			this.transformArr.push("skew(" + x + "deg," + y + "deg)");
			return this;
		},
		skewX:function(x){
			this.transformArr.push("skewx(" + x + "deg)");
			return this;
		},	
		skewY:function(y){
			this.transformArr.push("skewy(" + y + "deg)");
			return this;
		},	
		setStyle:function(styleName,styleValue){
			var s = "";
			if($T.isUndefined(this.styleStr)) this.styleStr = "";
			//样式变化
			if($T.isObject(styleName)){
				J.each(styleName ,function(sv,sn){
					s += $D.toCssStyle($D.getVendorPropertyName(sn)) + ":" + sv + ";";
				});
			}
			else if($T.isString(styleName)){
				s += $D.toCssStyle($D.getVendorPropertyName(styleName)) + ":" + styleValue + ";";
			}
			this.styleStr += s;
			return this;
			
		},
		toOrigin:function(){
			this.transformArr = [];
			return this;
		},
		transit:function(onFinished){
			var self = this;
			var elems = this.elems;
			J.each(elems ,function(e){
				self._transit(e);
			});
			window.setTimeout(function(){
				$E.fire(self,"end");
				J.each(elems,function(elem){
					$D.setStyle(elem ,$D.getVendorPropertyName("transition") ,"");
				});
				onFinished && onFinished.call(self);
			},this.duration);
			return this;
		},
		_transit:function(elem){
		
			var self = this;
			var transformStr = this.transformArr.join(" ");
			if(support3d && this.use3d){
				transformStr += " translatez(0)";
			}

			var aStr =  "all"
						+ ' ' + this.duration/1000 + 's ' 
						+ this.runType
						+ ' ' + this.delay/1000 + 's';
				
			$D.setStyle(elem ,$D.getVendorPropertyName("transition") ,aStr);
			
			elem.style[$D.getVendorPropertyName("transform")] = transformStr;
			elem.style.cssText += this.styleStr;

			$E.fire(this ,"start");
		}
	});
	J.Animation = Animation;
});


//http
J.$package(function(J){
	var http = {
		serializeParam : function ( param ) {
			if ( !param ) return '';
			var qstr = [];
			for ( var key in  param ) {
				qstr.push( key + '=' + param[key] );
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
					if ( status >= 200 && status < 300 ) {
						var response = xhr.responseText.replace( /(\r|\n|\t)/gi, '' );
						// var m = /callback\((.+)\)/gi.exec( response );
						// var result = { ret : 998, msg : '解析数据出错，请稍后再试' };
						// try{ result = eval( '(' + m[1] + ')' ) } catch ( e ) {};
						// result = eval( '(' + m[1] + ')' )
						o.success && o.success.call( xhr, JSON.parse(response) );
					}else{
						o.error && o.error.call( xhr, { ret : 997, msg : '连接错误，请稍后再试', status : status } );
					};
				}
			};
			

			xhr.send( isPost ? qstr : void(0) );

			return xhr;
		}	
	}
	J.http = http;
});




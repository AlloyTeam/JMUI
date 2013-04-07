JM.$package("MUI",function(J){
	var $D = J.dom,
		$E = J.event,
		dragingHandler;

	var isTouchDevice = J.platform.touchDevice;
	var startEvt = isTouchDevice ? "touchstart" : "mousedown";
	var moveEvt = isTouchDevice ? "touchmove" : "mousemove";
	var endEvt = isTouchDevice ? "touchend" : "mouseup";

	var Slider = J.Class({
		init:function(options){
			this.elem = $D.id(options.id);
			this.rangeClassName = options.rangeClassName || "slider_range";
			this.handlerClassName = options.handlerClassName || "slider_handler";
			this.s_elem = $D.$("input[type=range]" ,this.elem)[0];
			this.r_elem = $D.className(this.rangeClassName,this.elem)[0];
			this.handler = $D.className(this.handlerClassName,this.elem)[0];
			this.vertical = options.vertical;//是否垂直模式
			(this.vertical) ? this.elem_length = this.elem.clientHeight : this.elem_length = this.elem.clientWidth;

			this.value = this.elem.value;
			this.max = options.max || 100;
			this.min = options.min || 0;
			this.range = this.max - this.min;
			this.bindHandlers();

		},
		_handleEvent:function(e){
			switch (e.type) {
				case startEvt: this._onStartEvt(e); break;
				case moveEvt: this._onMoveEvt(e); break;
				case endEvt: this._onEndEvt(e); break;
			}
		},
		_onStartEvt:function(e){
			var h = this.handler;
			var target = e.target || e.srcElement;
			if(target === h){
				e.preventDefault();
				dragingHandler = h;
			}
		},
		_onMoveEvt:function(e){
			if(dragingHandler !== this.handler) return;
			e.preventDefault();

			var touch = isTouchDevice? e.touches[0] : e;
			var pos = { x: touch.clientX , y: touch.clientY };
			var ep = this.elem.getBoundingClientRect();//实时获取，因为元素位置随时会变化

			var r = this.handler;
			var l = this.elem_length;
			var dist; 
			
			this.vertical? dist = Math.min(Math.max(0 ,ep.bottom - pos.y) ,l) : dist = Math.min(Math.max(0 ,pos.x - ep.left), l);
			//实时改变slider的值
			this.setValue(this._distToValue(dist));

		},
		_onEndEvt:function(e){
			dragingHandler = null;	
		},
		bindHandlers:function(){
			var _handleEvent = this._handleEvent = J.bind(this._handleEvent , this);
			$E.on(this.handler, startEvt ,_handleEvent);
			$E.on(document.body ,moveEvt ,_handleEvent);
			$E.on(document.body ,endEvt ,_handleEvent);
		},
		_setStyle:function(dist){
			var h = this.handler;
			var r = this.r_elem;
			var l = this.elem_length;
			var half;
			if(this.vertical){
				half = h.clientHeight/2;
				if(r) $D.setStyle(r ,"height" ,(dist + half) / l * 100 +"%");
				$D.setStyle(h ,"bottom" ,dist - half + "px");
			}
			else {
				half = h.clientWidth/2;
				if(r) $D.setStyle(r ,"width" ,(dist + half) / l * 100 +"%");
				$D.setStyle(h ,"left" ,dist - half + "px");
				console.log(dist);
			}
		},
		_distToValue:function(dist){
			return this.min + dist/this.elem_length * (this.range);
		},
		_valueToDist:function(val){
			return (val - this.min) * this.elem_length /this.range;
		},
		setValue:function(val){
			this.value = this.s_elem.value = val;
			this._setStyle(this._valueToDist(this.value));		
			//触发change事件
			$E.fire(this,"change",{
				value:this.value
			});
		},
		getValue:function(){
			return this.currentValue;
		},
		destory:function(){
			var _handleEvent = this._handleEvent;
			$E.off(this.handler, startEvt ,_handleEvent);
			$E.off(document.body ,moveEvt ,_handleEvent);
			$E.off(document.body ,endEvt ,_handleEvent);
			$D.remove(this.elem);
		}
	});
	this.Slider = Slider;
});
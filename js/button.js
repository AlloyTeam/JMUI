JM.$package("MUI",function(J){
	var $D = J.dom,
		$E = J.event;
	var isTouchDevice = J.platform.touchDevice;

	var startEvt = isTouchDevice ? "touchstart" : "mousedown";
	var moveEvt = isTouchDevice ?  "touchmove" : "mousemove";
	var endEvt = isTouchDevice ?  "touchend" : "mouseup";
	
	var Button = J.Class({
		init:function(options){
			this.elem = $D.id(options.id);
			this.activeClassName = options.activeClassName || "active";
			this.disableClassName = options.disableClassName || "disable";
			this.bindHandler();
		},
		_handleEvent:function(e){
			switch (e.type) {
				case startEvt: this._onStartEvt(e); break;
				case moveEvt: this._onMoveEvt(e); break;
				case endEvt: this._onEndEvt(e); break;
			}
		},
		_onStartEvt:function(e){debugger;
			if(this._disable) return;
			var b = this.elem;
			var activeClassName = this.activeClassName;
			if(!$D.hasClass(b,activeClassName)){
				$D.addClass(b,activeClassName);
			}
		},
		_onMoveEvt:function(e){
			if(this._disable) return;
			e.preventDefault();//修复android touchend不触发的bug
		},
		_onEndEvt:function(e){
			if(this._disable) return;
			var b = this.elem;
			var activeClassName = this.activeClassName;
			if($D.hasClass(b,activeClassName)){
				$D.removeClass(b,activeClassName);
			}
			
		},
		bindHandler:function(){
			var self = this;
			var b = this.elem;
			var _handleEvent = this._handleEvent = J.bind(this._handleEvent,this);
	
			$E.on(b,startEvt,_handleEvent);
			$E.on(b,moveEvt,_handleEvent);
			$E.on(document.body,endEvt,_handleEvent);		
		},
		_setEnable:function(enable){
			$D[enable?"removeClass":"addClass"](this.elem,this.disableClassName);
		},
		enable:function(){
			this._disable = false;
			this._setEnable(true);
		},
		disable:function(){
			this._disable = true;
			this._setEnable(false);
		},
		destory:function(){
			var  b = this.elem;
			$E.off(b,[startEvt,moveEvt,endEvt].join(" "),this._handleEvent);
			$D.remove(b);
		}
	});
	this.Button = Button;
	
});
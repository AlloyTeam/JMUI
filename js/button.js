JM.$package("MUI",function(J){
	var $D = J.dom,
		$E = J.event;
	var isTouchDevice = J.platform.touchDevice,
		startEvt,
		moveEvt,
		endEvt;

	isTouchDevice ? startEvt = "touchstart" : "mousedown";
	isTouchDevice ? moveEvt = "touchmove" : "mousemove";
	isTouchDevice ? endEvt = "touchend" : "mouseup";
	var Button = J.Class({
		init:function(options){
			this.elem = $D.id(options.id);
			this.activeClassName = options.activeClassName || "active";
			this.bindHandler();
		},
		handleEvent:function(e){
			switch (e.type) {
				case startEvt: this._onStartEvt(e); break;
				case moveEvt: this._onMoveEvt(e); break;
				case endEvt: this._onEndEvt(e); break;
			}
		},
		_onStartEvt:function(e){
			this.destory();
			var b = this.elem;
			var activeClassName = this.activeClassName;
			if(!$D.hasClass(b,activeClassName)){
				$D.addClass(b,activeClassName);
			}
		},
		_onMoveEvt:function(e){
			e.preventDefault();//修复android touchend不触发的bug
		},
		_onEndEvt:function(e){
			var b = this.elem;
			var activeClassName = this.activeClassName;
			if($D.hasClass(b,activeClassName)){
				$D.removeClass(b,activeClassName);
			}
			
		},
		bindHandler:function(){
			var self = this;
			var b = this.elem;
			$E.on(b,startEvt,this);
			$E.on(b,moveEvt,this);
			$E.on(document.body,endEvt,this);		
		},
		destory:function(){
			$D.remove(this.elem);
		}
	});
	this.Button = Button;
	
});
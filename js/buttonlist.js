JM.$package("MUI",function(J){
	var $D = J.dom,
		$E = J.event,
		$T = J.type;
	var isTouchDevice = J.platform.touchDevice,
		startEvt,
		moveEvt,
		endEvt;

	isTouchDevice ? startEvt = "touchstart" : "mousedown";
	isTouchDevice ? moveEvt = "touchmove" : "mousemove";
	isTouchDevice ? endEvt = "touchend" : "mouseup";	


 	var ButtonList = J.Class({
		init:function(options){
			this.elem = $D.id(options.id);
			this.list = $D.tagName("button" ,this.elem);
			this.activeClassName = options.activeClassName || "active";
			this._initIndex();
			this.bindHandlers();
		},
		_initIndex:function(){
			var self = this;
			J.each(this.list,function(c,i){
				c.setAttribute("_index",i);
			});
		},
		_onStart:function(e){
			var target = e.target || e.srcElement;
			var activeClassName = this.activeClassName;
			var btn = target.parentNode;
			if(!$D.hasClass(btn,activeClassName)){
				$D.addClass(btn,activeClassName);
			}
		},
		_onEnd:function(e){
			var target = e.target || e.srcElement;
			var activeClassName = this.activeClassName;
			var btn = target.parentNode;
			if($D.hasClass(btn,activeClassName)){
				$D.removeClass(btn,activeClassName);
			}
		},
		bindHandlers:function(){
			var self = this;
			var ele = this.elem;
			$E.on(ele,startEvt,function(e){
				self._onStart(e);
			});
			$E.on(ele,moveEvt,function(e){
				e.preventDefault();//修复android touchend不触发的bug
			});
			$E.on(ele,endEvt,function(e){
				self._onEnd(e);
			});
		}
	});
	this.ButtonList = ButtonList;
});
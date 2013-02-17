cnMobile.$package("MUI",function(cm){
	var $D = cm.dom,
		$E = cm.event,
		$T = cm.type;
	var isTouchDevice = cm.platform.touchDevice,
		startEvt,
		moveEvt,
		endEvt;

	isTouchDevice ? startEvt = "touchstart" : "mousedown";
	isTouchDevice ? moveEvt = "touchmove" : "mousemove";
	isTouchDevice ? endEvt = "touchend" : "mouseup";	


 	var ButtonList = cm.Class({
		init:function(options){
			this.elem = $D.id(options.id);
			this.list = $D.tagName("button" ,this.elem);
			this._initIndex();
			this.bindHandlers();
		},
		_initIndex:function(){
			var self = this;
			cm.each(this.list,function(c,i){
				c.setAttribute("_index",i);
			});
		},
		_onClick:function(e){
			var target = e.target || e.srcElement;
			$E.fire(this,"click",{
				originalEventObj:e,
				buttonClicked:target,
				index:target.getAttribute("_index")
			});
		},
		_onStart:function(e){
			var target = e.target || e.srcElement;
			var btn = target.parentNode;
			if(!$D.hasClass(btn,"active")){
				$D.addClass(btn,"active");
			}
		},
		_onEnd:function(e){
			var target = e.target || e.srcElement;
			var btn = target.parentNode;
			if($D.hasClass(btn,"active")){
				$D.removeClass(btn,"active");
			}
		},
		bindHandlers:function(){
			var self = this;
			var ele = this.elem;
			$E.on(ele,startEvt,function(e){
				self._onStart(e);
			});
			$E.on(ele,endEvt,function(e){
				self._onEnd(e);
			});
			$E.on(ele,"click",function(e){
				self._onClick(e);
			});
		}
	});
	this.ButtonList = ButtonList;
});
cnMobile.$package("MUI",function(cm){
	var $D = cm.dom,
		$E = cm.event;
	var isTouchDevice = cm.platform.touchDevice,
		startEvt,
		moveEvt,
		endEvt;

	isTouchDevice ? startEvt = "touchstart" : "mousedown";
	isTouchDevice ? moveEvt = "touchmove" : "mousemove";
	isTouchDevice ? endEvt = "touchend" : "mouseup";
	var Button = cm.Class({
		init:function(options){
			this.elem = $D.id(options.id);
			this.bindHandler();
		},
		bindHandler:function(){
			var self = this;
			var b = this.elem;

			$E.on(b,startEvt,function(e){
				if(!$D.hasClass(b,"active")){
					$D.addClass(b,"active");
				}
			});
			$E.on(b,moveEvt,function(e){
				e.preventDefault();//修复android touchend不触发的bug
			});

			$E.on(document.body,endEvt,function(e){
				if($D.hasClass(b,"active")){
					$D.removeClass(b,"active");
				}
			});		
			$E.on(b,"click",function(e){
				self._onClick(e);
			});		
		},
		_onClick:function(e){
			$E.fire(this,"click",{
				originalEventObj:e
			});
		}
	});
	this.Button = Button;
	
});
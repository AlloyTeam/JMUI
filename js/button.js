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
			this.activeClassName = options.activeClassName || "active";
			this.bindHandler();
		},
		bindHandler:function(){
			var self = this;
			var b = this.elem;
			var activeClassName = this.activeClassName;

			$E.on(b,startEvt,function(e){
				if(!$D.hasClass(b,activeClassName)){
					$D.addClass(b,activeClassName);
				}
			});
			$E.on(b,moveEvt,function(e){
				e.preventDefault();//修复android touchend不触发的bug
			});

			$E.on(document.body,endEvt,function(e){
				if($D.hasClass(b,activeClassName)){
					$D.removeClass(b,activeClassName);
				}
			});		
	
		}

	});
	this.Button = Button;
	
});
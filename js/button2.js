cnMobile.$package("MUI",function(cm){
	var $D = cm.dom,
		$E = cm.event;
	var isTouchDevice = cm.platform.touchDevice,
	btns = $D.tagName("button"),
	startEvt,
	moveEvt,
	endEvt;

	isTouchDevice ? startEvt = "touchstart" : "mousedown";
	isTouchDevice ? moveEvt = "touchmove" : "mousemove";
	isTouchDevice ? endEvt = "touchend" : "mouseup";

	cm.each(btns,function(b,i){
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
	});
});
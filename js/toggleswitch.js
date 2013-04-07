JM.$package("MUI",function(J){
	var $D = J.dom,
		$E = J.event,
		$T = J.type,
		dragingHandler,
		currentLeft;

	
	var isTouchDevice = J.platform.touchDevice;
	var tapEvt = isTouchDevice ? "click" : "click";//需要修改
	var startEvt = isTouchDevice ? "touchstart" : "mousedown";
	var moveEvt = isTouchDevice ? "touchmove" : "mousemove";
	var endEvt = isTouchDevice ? "touchend" : "mouseup";
	var body = document.body;


	var ToggleSwitch = J.Class({
		init:function(options){
			this.elem = $D.id(options.id);
			
			this.handler = $D.className("toggle_handler" ,this.elem)[0];
			this.toggle_wrap = $D.className("toggle_wrap",this.elem)[0];
			this.toggle_items = $D.tagName("span" ,this.toggle_wrap);
			
			this.bindHandlers();
			this.handlerWidth = this.handler.clientWidth;
			this.handlerRight = this.handler.offsetLeft;
			this.handlerLeft = this.elem.clientWidth - this.handlerRight - this.handlerWidth;
			//默认移动到右边
			this.turnOn();
		},
		_moveTo:function(left){

			currentLeft = left;
			$D.setStyle(this.handler, "left", left + "px");
		
			//左内容宽度百分比
			var l_percent = (left + this.handler.clientWidth)/this.elem.clientWidth * 100 / 2;
			$D.setStyle(this.toggle_items[0], {
				"width" : l_percent + "%"
			});

		},
		_showLeft:function(){
			$D.setStyle(this.toggle_items[0],"opacity",1);
		},
		_hideLeft:function(){
			$D.setStyle(this.toggle_items[0],"opacity",0);
		},
		_showRight:function(){
			$D.setStyle(this.toggle_items[1],"opacity",1);
		},
		_hideRight:function(){
			$D.setStyle(this.toggle_items[1],"opacity",0);
		},
		turnOff:function(){
			this._moveTo(this.handlerLeft);
			this._showRight();
			this._hideLeft();
			//触发change事件
			$E.fire(this,"change",{
				selectedIndex : 1,
				selectedItem : this.toggle_items[1]
			});
		},
		turnOn:function(){
			this._moveTo(this.handlerRight);
			this._showLeft();
			this._hideRight();
			//触发change事件
			$E.fire(this,"change",{
				selectedIndex : 0,
				selectedItem : this.toggle_items[0]
			});
		},
		_handleEvent:function(e){
			switch (e.type) {
				case startEvt: this._onStartEvt(e); break;
				case moveEvt: this._onMoveEvt(e); break;
				case endEvt: this._onEndEvt(e); break;
				case tapEvt: this._onTap(e); break;
			}
		},
		_onStartEvt:function(e){
			var target = e.target || e.srcElement;
			var h = this.handler;
			if(e.target == h){
				e.preventDefault();
				dragingHandler = h;
				this._showLeft();
				this._showRight();
			}
		},
		_onMoveEvt:function(e){
			if(dragingHandler != this.handler) return;
			e.preventDefault();
			var elem = this.elem;
			var touch = isTouchDevice? e.touches[0] : e;
			var pos = {x : touch.clientX , y : touch.clientY};
			var ep = elem.getBoundingClientRect();
			currentLeft = Math.min(Math.max(0 , pos.x - ep.left) ,elem.clientWidth - this.handlerWidth);
			this._moveTo(currentLeft);
		},
		_onEndEvt:function(e){
			if($T.isUndefined(currentLeft) || dragingHandler!=this.handler) return;
			e.preventDefault();
			dragingHandler = null;
			
			var handlerLeft = this.handlerLeft;
			var handlerRight = this.handlerRight;
			var halfLeft = (handlerRight - handlerLeft)/2;

			if(currentLeft >= halfLeft){//right
				this.turnOn();
			}
			else{//left
				this.turnOff();
			}
		},
		_onTap:function(e){
			var target = e.target || e.srcElement;
			if(target == this.toggle_items[1]){//right
				this.turnOn();
			}
			else if(target == this.toggle_items[0]){//left
				this.turnOff();
			}
		},
		bindHandlers:function(){	
			var _handleEvent = this._handleEvent = J.bind(this._handleEvent , this);
	
			$E.on(this.handler, startEvt ,_handleEvent);
			$E.on(body, moveEvt ,_handleEvent);
			$E.on(body, endEvt ,_handleEvent);
			$E.on(this.elem, tapEvt ,_handleEvent);
		},
		destory:function(){
			var ele = this.elem;
			var _handleEvent = this._handleEvent;
			$E.off(this.handler, startEvt ,_handleEvent);
			$E.off(body, moveEvt ,_handleEvent);
			$E.off(body, endEvt ,_handleEvent);
			$E.off(ele, tapEvt ,_handleEvent);	
			$D.remove(ele);
		}

	});
	this.ToggleSwitch = ToggleSwitch;
});
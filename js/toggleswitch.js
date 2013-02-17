cnMobile.$package("MUI",function(cm){
	var $D = cm.dom,
		$E = cm.event,
		$T = cm.type,
		dragingHandler,
		currentLeft;

	
	var isTouchDevice = cm.platform.touchDevice;
	var tapEvt = isTouchDevice ? "tap" : "click";
	var startEvt = isTouchDevice ? "touchstart" : "mousedown";
	var moveEvt = isTouchDevice ? "touchmove" : "mousemove";
	var endEvt = isTouchDevice ? "touchend" : "mouseup";


	var ToggleSwitch = cm.Class({
		init:function(options){
			this.elem = $D.id(options.id);
			this.elemPos = this.elem.getBoundingClientRect();
			this.handler = $D.className("toggle_handler" ,this.elem)[0];
			this.toggle_wrap = $D.className("toggle_wrap",this.elem)[0];
			this.toggle_items = $D.tagName("span" ,this.toggle_wrap);
			
			this.bindHandlers();
			this.handlerWidth = this.handler.clientWidth;
			this.handlerRight = this.handler.offsetLeft;
			this.handlerLeft = this.elem.clientWidth - this.handlerRight - this.handlerWidth;
			//默认移动到右边
			this._moveToRight();
		},
		_moveTo:function(left){

			currentLeft = left;
			$D.setStyle(this.handler, "left", left + "px");
			//左内容宽度百分比
			var l_percent = (left + this.handler.clientWidth)/this.elem.clientWidth * 100 / 2;
			//右内容宽度百分比
			var r_percent = (this.elem.clientWidth - left)/this.elem.clientWidth * 100 / 2;

			$D.setStyle(this.toggle_items[0], {
				"width" : l_percent + "%"
			});
			$D.setStyle(this.toggle_items[1], {
				"width" : r_percent + "%"
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
		_moveToLeft:function(){
			this._moveTo(this.handlerLeft);
			this._showRight();
			this._hideLeft();
			//触发change事件
			$E.fire(this,"change",{
				selectedIndex : 1,
				selectedItem : this.toggle_items[1]
			});
		},
		_moveToRight:function(){
			this._moveTo(this.handlerRight);
			this._showLeft();
			this._hideRight();
			//触发change事件
			$E.fire(this,"change",{
				selectedIndex : 0,
				selectedItem : this.toggle_items[0]
			});
		},
		bindHandlers:function(){

			var self = this;
			var h = this.handler;
			var ep = this.elemPos;
			var elem = this.elem;
	
			//模拟的drag事件并不能冒泡，所以这里还是使用原生的
			$E.on(h, startEvt ,function(e){
				var target = e.target || e.srcElement;
				if(e.target == h){
					e.preventDefault();
					dragingHandler = h;
					self._showLeft();
					self._showRight();
				}
			});
			$E.on(document.body, moveEvt ,function(e){
				if(dragingHandler != self.handler) return;

				e.preventDefault();
				var touch = isTouchDevice? e.touches[0] : e;
				var pos = {x : touch.pageX , y : touch.pageY};

				currentLeft = Math.min(Math.max(0 , pos.x - ep.left) ,elem.clientWidth - self.handlerWidth);
				self._moveTo(currentLeft);
			});

			$E.on(document.body, endEvt ,function(e){
				if($T.isUndefined(currentLeft) || dragingHandler!=self.handler) return;
				e.preventDefault();
				dragingHandler = null;
				

				var handlerLeft = self.handlerLeft;
				var handlerRight = self.handlerRight;
				var halfLeft = (handlerRight - handlerLeft)/2;

				if(currentLeft >= halfLeft){//right
					self._moveToRight();
				}
				else{//left
					self._moveToLeft();
				}
				
			});

			$E.on(this.elem, tapEvt ,function(e){
				if(isTouchDevice) e = e.originalEventObject;

				var target = e.target || e.srcElement;
				if(target == self.toggle_items[1]){//right
					self._moveToRight();
				}
				else if(target == self.toggle_items[0]){//left
					self._moveToLeft();
				}
			});
		}

	});
	this.ToggleSwitch = ToggleSwitch;
});
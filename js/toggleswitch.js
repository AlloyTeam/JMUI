cnMobile.$package("MUI",function(cm){
	var $D = cm.dom,
		$E = cm.event,
		$T = cm.type,
		dragingHandler,
		currentLeft;

	var isTouchDevice = cm.platform.touchDevice;

	var ToggleSwitch = function(options){
		this.init(options);
	}
	ToggleSwitch.prototype = {
		init:function(options){
			this.elem = $D.id(options.id);
			this.handler = $D.id(options.handlerId);
			this.itemWrap = $D.$("div div",this.elem)[0];
			this.items = $D.tagName("span",this.itemWrap);
			this.elemPos = this.elem.getBoundingClientRect();
			
			this.bindHandlers();
			this.handlerLeft = 0;
			this.handlerWidth = this.handler.clientWidth;
			this.handlerRight = this.elem.clientWidth - this.handlerWidth - 3;
			

		},
		_moveTo:function(left){
			currentLeft = left;
			$D.setStyle(this.handler, "left", left + "px");
			$D.setStyle(this.items[0], {
				"marginLeft":-(70- left ) +"px"
			});
		},
		_moveToLeft:function(){
			this._moveTo(this.handlerLeft);
		},
		_moveToRight:function(){
			this._moveTo(this.handlerRight);
		},
		bindHandlers:function(){
			// $E.setGestureEventConfig({
			// 	"drag_distance":0
			// });
			var self = this;
			var h = this.handler;
			var ep = this.elemPos;
			var elem = this.elem;
			var tapEvt = isTouchDevice ? "tap" : "click";
			var startEvt = isTouchDevice ? "touchstart" : "mousedown";
			var moveEvt = isTouchDevice ? "touchmove" : "mousemove";
			var endEvt = isTouchDevice ? "touchend" : "mouseup";
			//模拟的drag事件并不能冒泡，所以这里还是使用原生的
			$E.on(h, startEvt ,function(e){
				var target = e.target || e.srcElement;
				if(e.target == h){
					e.preventDefault();
					dragingHandler = h;
				}
			});
			$E.on(document.body, moveEvt ,function(e){
				if(!dragingHandler) return;

				e.preventDefault();
				var touch = isTouchDevice? e.touches[0] : e;
				var pos = {x : touch.pageX , y : touch.pageY};

				currentLeft = Math.min(Math.max(self.handlerLeft , pos.x - ep.left), self.handlerRight);
				self._moveTo(currentLeft);


			});

			$E.on(document.body, endEvt ,function(e){
				
				e.preventDefault();
				dragingHandler = null;
				if($T.isUndefined(currentLeft)) return;

				var handlerLeft = self.handlerLeft;
				var handlerRight = self.handlerRight;
				var halfLeft = (handlerRight - handlerLeft)/2;

				if(currentLeft>=halfLeft){//right
					self._moveToRight();
				}
				else{//left
					self._moveToLeft();
				}
				
			});

			$E.on(this.elem, tapEvt ,function(e){
		
				if(isTouchDevice) e = e.originalEventObject;

				var target = e.target || e.srcElement;

				if(target == self.items[1]){//right
					self._moveToRight();
				}
				else if(target == self.items[0]){//left
					self._moveToLeft();
				}
			});
		},
		getValue:function(){
			return this.currentValue;
		}
	}
	this.ToggleSwitch = ToggleSwitch;
});
cnMobile.$package("MUI",function(cm){
	var $D = cm.dom,
		$E = cm.event;
	var isTouchDevice = cm.platform.touchDevice;

	var SwipeChange = function(options){
		this.init(options);

	};
	SwipeChange.prototype = {
		init:function(options){
			this.elem = $D.id(options.id);
			this.contentWrap = $D.tagName("div",this.elem)[0];
			this.contents = $D.tagName("div",this.contentWrap);
			this.currentIndex = options.currentIndex || 0;
			this.moveDist = 0;
			this.runType = options.runType || "ease-out";
			this.slideTime = options.slideTime || 200;
		
			this._sizeAdjust();
			this.bindHandlers();
			$E.setGestureEventConfig({
				"drag_distance":0
			});
			var self = this;


		},
		bindHandlers:function(){
			var self = this;
			var startX = 0;

			cnMobile.event.on(this.elem,"touchstart touchmove touchend",function(e){
				e.preventDefault();
			});
			$E.on(this.elem,"dragstart",function(e){
				var x = e.position.x - self.elemLeft;
				startX = x;//相对于container
				
			});
			$E.on(this.elem,"drag",function(e){
				var x = e.position.x;
				if(x < self.elemLeft || x > self.elemRight) return;
				x = e.position.x - self.elemLeft;

				self.moveDist = x - startX;
				self._removeAnimation(self.contentWrap);
				self._moveTo(self.currentIndex * -self.contentWidth + self.moveDist);
				
			});
			$E.on(this.elem,"dragend",function(e){
				
				var d = self.moveDist;
				var currentIndex = self.currentIndex;
				
				if(d > self.elemHalf) {
					currentIndex = Math.max(0 ,currentIndex - 1);
				}
				else if(d < - self.elemHalf) {
					currentIndex = Math.min(self.contents.length - 1 ,currentIndex + 1);

				}
				// self._moveTo(currentIndex * -self.contentWidth);
				self.slideTo(currentIndex);
				self.currentIndex = currentIndex;
			});
			$E.on(this.contentWrap,"webkitTransitionEnd",function(){
				$E.fire(self ,"change" ,{
					currentIndex:self.currentIndex
				});
			});
		},
		_removeAnimation:function(ele){
			ele.style["-webkit-transition"] = "";//删除动画效果
		},
		_sizeAdjust:function(){
			var ele = this.elem;
			var count = this.contents.length;
			var hasClientRect = "getBoundingClientRect" in ele;
			//幻灯片宽度
			var contentWidth = hasClientRect ? ele.getBoundingClientRect().width : ele.offsetWidth;
			$D.setStyle(this.contentWrap , "width" ,contentWidth * count + "px");
			cm.each(this.contents ,function(e){
				$D.setStyle(e,"width",contentWidth + "px");
			});

			this.contentWidth = contentWidth;
			this.elemLeft = hasClientRect ? ele.getBoundingClientRect().left : ele.offsetLeft;
			this.elemRight = this.elemLeft + this.contentWidth;
			this.elemHalf = this.elemLeft + this.contentWidth/2;
		},
		_moveTo:function(x){
			//webkit和moz可用3D加速，ms和o只能使用translate
			this.contentWrap.style["-webkit-transform"] = "translate3d("+ x + "px, 0,0 )";
		},
		slideTo:function(index){
			this.contentWrap.style["-webkit-transition"] = "all " + this.slideTime/1000 +"s " + this.runType;
			this._moveTo(index * -this.contentWidth);
		}

	};
	this.SwipeChange = SwipeChange;
});
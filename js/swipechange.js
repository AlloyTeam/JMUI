cnMobile.$package("MUI",function(cm){
	var $D = cm.dom,
		$E = cm.event;
	var isTouchDevice = cm.platform.touchDevice;
	var dragingElem;
	var isTouchDevice = cm.platform.touchDevice;
	var startEvt = isTouchDevice ? "touchstart" : "mousedown";
	var moveEvt = isTouchDevice ? "touchmove" : "mousemove";
	var endEvt = isTouchDevice ? "touchend" : "mouseup";
	var hasClientRect = "getBoundingClientRect" in document.body;

	var SwipeChange = cm.Class({
		init:function(options){
			this.elem = $D.id(options.id);
			this.contentWrap = $D.$("#" + options.id + ">.wrap",this.elem)[0];
			this.contents = $D.$("#" + options.id + ">.wrap > div");
			this.count = this.contents.length;
			this.currentIndex = options.currentIndex || 0;
			this.moveDist = 0;
			this.runType = options.runType || "ease-out";
			this.slideTime = options.slideTime || 200;
			this.canSwipe = options.canSwipe || false;
			this._sizeAdjust();
			this._moveTo(this.currentIndex * -this.contentWidth);
		
			this.bindHandlers();

			var self = this;


		},
		bindHandlers:function(){
			var startX = 0;
			var self = this;
			var elem = this.elem;
			$E.on(this.contentWrap,"webkitTransitionEnd",function(){
				$E.fire(self ,"change" ,{
					currentIndex:self.currentIndex
				});
			});

			if(!this.canSwipe) return;
		
			$E.on(elem,moveEvt,function(e){
				e.preventDefault();
			});

			$E.on(elem,startEvt,function(e){
				var target = e.target||e.srcElement;

				if(!$D.closest(target,".wrap")) return;
				dragingElem = target;
				var tou = e.touches? e.touches[0] : e;
				var elemLeft = hasClientRect ? elem.getBoundingClientRect().left : elem.offsetLeft;

				var x = tou.clientX - elemLeft;
				startX = x;//相对于container
				
				
			});
			$E.on(elem,moveEvt,function(e){

				if(!dragingElem) return;
				var tou = e.touches? e.touches[0] : e;
				var x = tou.clientX;
				var elemLeft = hasClientRect ? elem.getBoundingClientRect().left : elem.offsetLeft;
				var elemRight = elemLeft + self.contentWidth;

				if(x < elemLeft || x > elemRight) return;
				x = x - elemLeft;

				self.moveDist = x - startX;

				self._removeAnimation(self.contentWrap);

				self._moveTo(self.currentIndex * -self.contentWidth + self.moveDist);
				// e.preventDefault();
				
			});
			$E.on(this.elem,endEvt,function(e){
				if(!dragingElem) return;

				var d = self.moveDist;
				var currentIndex = self.currentIndex;
				var elemLeft = hasClientRect ? elem.getBoundingClientRect().left : elem.offsetLeft;
				var elemHalf = elemLeft + self.contentWidth/2;
				
				if(d > elemHalf) {
					currentIndex = Math.max(0 ,currentIndex - 1);
				}
				else if(d < - elemHalf) {
					currentIndex = Math.min(self.contents.length - 1 ,currentIndex + 1);

				}
				// self._moveTo(currentIndex * -self.contentWidth);
				self.slideTo(currentIndex);
				dragingElem = null;
			});
			

		},
		_removeAnimation:function(ele){
			ele.style["-webkit-transition"] = "";//删除动画效果
		},
		_sizeAdjust:function(){
			var ele = this.elem;
			var count = this.count;
			
			//幻灯片宽度
			var contentWidth = hasClientRect ? ele.getBoundingClientRect().width : ele.offsetWidth;
			$D.setStyle(this.contentWrap , "width" ,contentWidth * count + "px");
			cm.each(this.contents ,function(e){
				$D.setStyle(e,"width",contentWidth + "px");
			});

			this.contentWidth = contentWidth;
			
	

		},
		_moveTo:function(x){
			//webkit和moz可用3D加速，ms和o只能使用translate
			this.contentWrap.style["-webkit-transform"] = "translate3d("+ x + "px, 0,0 )";
		},
		slideTo:function(index){
			this.contentWrap.style["-webkit-transition"] = "all " + this.slideTime/1000 +"s " + this.runType;
			this._moveTo(index * -this.contentWidth);
			this.currentIndex  = index ;

		},
		next:function(){
			var index = this.currentIndex + 1;
			if(index >= this.count) return;
			this.slideTo(index);
		},
		pre:function(){
			var index = this.currentIndex - 1;
			if(index < 0) return;
			this.slideTo(index);
		}

	});
	this.SwipeChange = SwipeChange;
});
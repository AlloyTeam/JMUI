JM.$package("MUI",function(J){
	var $D = J.dom,
		$E = J.event;
	var isTouchDevice = J.platform.touchDevice;
	var dragingElem;
	var isTouchDevice = J.platform.touchDevice;
	var startEvt = isTouchDevice ? "touchstart" : "mousedown";
	var moveEvt = isTouchDevice ? "touchmove" : "mousemove";
	var endEvt = isTouchDevice ? "touchend" : "mouseup";
	var hasClientRect = "getBoundingClientRect" in document.body;

	var Slide = J.Class({
		init:function(options){
			
			this.elem = $D.id(options.id)||options.id;
			this.wrapClassName = options.wrapClassName || "wrap";
		
			this.contentWrap = $D.$("." + this.wrapClassName,this.elem)[0];
			this.contents = $D.$("." + this.wrapClassName + ">li",this.contentWrap);
			this.count = this.contents.length;
			this.currentIndex = options.currentIndex || 0;
			this.moveDist = 0;
			this.runType = options.runType || "ease-out";
			this.slideTime = options.slideTime || 200;
			this.fastChange = options.fastChange;
			this._sizeAdjust();
			this._moveTo(this.currentIndex * -this.contentWidth);
			this.bindHandlers();
		},
		bindHandlers:function(){
			var startX = 0;
			var self = this;
			var elem = this.elem;
			$E.on(this.contentWrap,"webkitTransitionEnd",function(e){
				// self._removeAnimation();
				$E.fire(self ,"changed" ,{
					type:"changed",
					currentIndex:self.currentIndex
				});
			});
			//用于fastchange恢复
			$E.on(self ,"changed" ,function(e){
				if(!self.fastChange || !self.hideArr) return;
				while(self.hideArr[0]){
					$D.setStyle(self.hideArr[0],"display","");
					self.hideArr.shift();
				}
				self._removeAnimation();
				self._moveTo(e.currentIndex * -self.contentWidth);
			});
		},
		_removeAnimation:function(ele){
			this.contentWrap.style["-webkit-transition"] = "";//删除动画效果	
		},
		_sizeAdjust:function(){
			var ele = this.elem;
			var count = this.count;
			//幻灯片宽度
			var contentWidth = hasClientRect ? ele.getBoundingClientRect().width : ele.offsetWidth;
		
			$D.setStyle(this.contentWrap , "width" ,contentWidth * count + "px");
			J.each(this.contents ,function(e){
				$D.setStyle(e,"width",contentWidth + "px");
			});

			this.contentWidth = contentWidth;
		},
		_moveTo:function(x){
			//webkit和moz可用3D加速，ms和o只能使用translate
			this.contentWrap.style["-webkit-transform"] = "translate3d("+ x + "px, 0,0 )";
		},
		slideTo:function(index){
			var self = this;
			var currentIndex = this.currentIndex;
			var d_index = index - currentIndex;
			this.currentIndex  = index ;
			
			if(this.fastChange && d_index && Math.abs(d_index) != 1){
				if(d_index != 0){
					var l,p;
					var cts = this.contents;
					if(!this.hideArr) this.hideArr = [];
					if(d_index > 0) {
						l = d_index -1;
						p = 1; 
						index = currentIndex + 1;
					}
					else {
						l = -(d_index + 1);
						p = -1; 
						this._removeAnimation();
						this._moveTo((this.currentIndex+1) * -this.contentWidth);
					}
				
					for(var i = 1;i <= l; i++){
						var ct = cts[currentIndex + i * p];

						$D.setStyle(ct,"display","none");
						this.hideArr.push(ct);
					}
					
				}
			}
			//不加setTimeout 0 在fastchange并且倒行的时候会闪白
			setTimeout(function(){
				self.contentWrap.style["-webkit-transition"] = "all " + self.slideTime/1000 +"s " + self.runType;
				self._moveTo(index * -self.contentWidth);
			},0);
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
	this.Slide = Slide;
});
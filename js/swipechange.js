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

	var SwipeChange = cm.Class({extend:MUI.Slide},{
		init:function(options){
			SwipeChange.callSuper(this,"init",options);
		},
		bindHandlers:function(){
			SwipeChange.callSuper(this,"bindHandlers");
			var startX = 0;
			var self = this;
			var elem = this.elem;
		
			$E.on(elem,moveEvt,function(e){
				e.preventDefault();
			});

			$E.on(elem,startEvt,function(e){
				var target = e.target||e.srcElement;
				if(!$D.closest(target ,"." + self.wrapClassName)) return;
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
				self._removeAnimation();
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
		}

	});
	this.SwipeChange = SwipeChange;
});
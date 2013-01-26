cnMobile.$package("MUI",function(cm){
	var $D = cm.dom,
		$E = cm.event,
		dragingHandler;

	var isTouchDevice = cm.platform.touchDevice;

	var Slider = function(options){
		this.init(options);
	}
	Slider.prototype = {
		init:function(options){
			this.elem = $D.id(options.id);
			this.handler = $D.id(options.handlerId);
			this.elemPos = this.elem.getBoundingClientRect();
			this.maxValue = options.maxValue||1;
			this.minValue = options.minValue||0;
			this.length = this.maxValue - this.minValue;
			
			this.bindHandlers();
		},
		bindHandlers:function(){
			// $E.setGestureEventConfig({
			// 	"drag_distance":0
			// });

			var startEvt = isTouchDevice ? "touchstart" : "mousedown";
			var moveEvt = isTouchDevice ? "touchmove" : "mousemove";
			var endEvt = isTouchDevice ? "touchend" : "mouseup";

			var self = this;
			var h = this.handler;
			var ep = this.elemPos;
			var elem = this.elem;
			
			$E.on(h, startEvt ,function(e){
				var target = e.target || e.srcElement;
				if(target == h){
					e.preventDefault();
					dragingHandler = h;
				}
			});
			$E.on(document.body ,moveEvt ,function(e){
				if(!dragingHandler) return;
				e.preventDefault();

				var touch = isTouchDevice? e.touches[0] : e;
				var pos = { x: touch.pageX , y: touch.pageY };
				var left = Math.min(Math.max(0,pos.x - ep.left), elem.clientWidth );
				$D.setStyle(h,{
					"left": left+ "px"
				});
				var currentValue = self.minValue + left/elem.clientWidth * (self.length);

				$E.fire(self,"change",{
					currentValue:currentValue
				});
				self.currentValue = currentValue;

			});
			$E.on(document.body ,endEvt ,function(e){
				dragingHandler = null;
				
			});
		},
		getValue:function(){
			return this.currentValue;
		}
	}
	this.Slider = Slider;
});
cnMobile.$package("MUI",function(cm){
	var $D = cm.dom,
		$E = cm.event,
		dragingHandler;

	var isTouchDevice = cm.platform.touchDevice;
	var startEvt = isTouchDevice ? "touchstart" : "mousedown";
	var moveEvt = isTouchDevice ? "touchmove" : "mousemove";
	var endEvt = isTouchDevice ? "touchend" : "mouseup";

	var Slider = cm.Class({
		init:function(options){
			this.elem = $D.id(options.id);
			
			this.s_elem = $D.$("input[type=range]" ,this.elem)[0];
			this.r_elem = $D.className("slider_range",this.elem)[0];
			this.handler = $D.className("slider_handler" ,this.elem)[0];
			this.vertical = options.vertical;//是否垂直模式
			(this.vertical) ? this.elem_length = this.elem.clientHeight : this.elem_length = this.elem.clientWidth;

			this.value = this.elem.value;
			this.max = options.max || 100;
			this.min = options.min || 0;
			this.range = this.max - this.min;
			this.bindHandlers();

		},
		bindHandlers:function(){
			var self = this;
			var h = this.handler;
			var elem = this.elem;
			
			$E.on(h, startEvt ,function(e){
				var target = e.target || e.srcElement;
				if(target === h){
					e.preventDefault();
					dragingHandler = h;
				}
			});
			$E.on(document.body ,moveEvt ,function(e){
				if(dragingHandler !== self.handler) return;
				e.preventDefault();

				var touch = isTouchDevice? e.touches[0] : e;
				var pos = { x: touch.clientX , y: touch.clientY };
				var ep = elem.getBoundingClientRect();//实时获取，因为元素位置随时会变化

				var r = self.handler;
				var l = self.elem_length;
				var dist; 
				
				self.vertical? dist = Math.min(Math.max(0 ,ep.bottom - pos.y) ,l) : dist = Math.min(Math.max(0 ,pos.x - ep.left), l);
				

				//实时改变slider的值
				self._setStyle(dist);
				self.value = self.s_elem.value = self._distToValue(dist);
				//触发change事件
				$E.fire(self ,"change",{
					value:self.value
				});
			});
			$E.on(document.body ,endEvt ,function(e){
				dragingHandler = null;	
			});
		},
		_setStyle:function(dist){
			var h = this.handler;
			var r = this.r_elem;
			var l = this.elem_length;
			var half;
			if(this.vertical){
				half = h.clientHeight/2;
				if(r) $D.setStyle(r ,"height" ,(dist + half) / l * 100 +"%");
				$D.setStyle(h ,"bottom" ,dist - half + "px");
			}
			else {
				half = h.clientWidth/2;
				if(r) $D.setStyle(r ,"width" ,(dist + half) / l * 100 +"%");
				$D.setStyle(h ,"left" ,dist - half + "px");
				console.log(dist);
			}
		},
		_distToValue:function(dist){
			return this.min + dist/this.elem_length * (this.range);
		},
		_valueToDist:function(val){
			return (val - this.min) * this.elem_length /this.range;
		},
		setValue:function(val){
			this.value = this.s_elem.value = val;
			this._setStyle(this._valueToDist(this.value));		
		},
		getValue:function(){
			return this.currentValue;
		}
	});
	this.Slider = Slider;
});
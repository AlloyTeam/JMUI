JM.$package("MUI",function(J){
	var $D = J.dom,
		$E = J.event;

	var ImageChange = J.Class({
		init:function(options){	
			this.elem = $D.id(options.id);
			this.imgsWrapClassName = options.imgsWrapClassName || "wrap";
			this.btnsWrapClassName = options.btnsWrapClassName || "btnsWrap";
			this.imgsContainer = $D.className(this.imgsWrapClassName,this.elem)[0];
			this.btnsContainer = $D.className(this.btnsWrapClassName,this.elem)[0];
			this.currentIndex = options.currentIndex || 0;
		
			this.contentsSwipe = MUI.SwipeChange({
				id:options.id,
				wrapClassName:this.imgsWrapClassName,
				fastChange:true
			});

			this.preIndex = this.currentIndex;
			this.count = this.contentsSwipe.count;

			this.isAutoChange = options.isAutoChange;
			this.autoChangeTime = options.autoChangeTime || 3000;
			this._initBtns();
			this.bindHandlers();
			if(this.isAutoChange) this.autoChange();

		},
		_handleEvent:function(e){
			var type = e.type;
			if(type == "changed"){
				this._onSwipeChanged(e);
			}
		},
		_onSwipeChanged:function(e){
			var currentIndex = e.currentIndex;
			$D.removeClass(this.btns[this.preIndex],"selected");
			$D.addClass(this.btns[currentIndex],"selected");
			this.currentIndex = this.preIndex = currentIndex;
			if(this.isAutoChange) this.autoChange();

		},
		autoChange:function(){
			var self = this;
			var count = this.count;
			clearTimeout(this.runTimeId);
			this.runTimeId = setTimeout(function(){
				var currentIndex = self.currentIndex;
				if(currentIndex >= count-1) currentIndex = 0;
				else currentIndex ++;
				self.slideTo(currentIndex);
			},self.autoChangeTime);
		},
		slideTo:function(index){
			this.contentsSwipe.slideTo(index);
		},
		_initBtns:function(){
			var count = this.count;
			var currentIndex = this.currentIndex;
			var content = "";
			for(var i=0;i<count;i++){
				if(i===currentIndex) content += "<li class='selected' _index='"+ i +"'></li>";
				else content += "<li _index='"+ i +"'></li>";
			}
			this.btnsContainer.innerHTML = content;
			this.btns = $D.tagName("li",this.btnsContainer);
		},
		bindHandlers:function(){
			var _handleEvent = this._handleEvent = J.bind(this._handleEvent , this);
			$E.on(this.contentsSwipe,"changed",_handleEvent);
		},
		destory:function(){
			$E.off(this.contentsSwipe,"changed",this._handleEvent);
			this.contentsSwipe.destory();
			$D.remove(this.elem);
			
		}
	});

	this.ImageChange = ImageChange;
});
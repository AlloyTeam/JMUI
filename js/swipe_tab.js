JM.$package("MUI",function(J){
	var $D = J.dom,
		$E = J.event;

	var isListItem =function(ele){
		return ele.tagName == "LI";
	}
	var isTouchDevice = J.platform.touchDevice;
	var touchEvt = isTouchDevice ? "tap":"click";
	var SwipeTab = J.Class({extend:MUI.Tab},{
		init:function(options){
			this.wrapClassName = this.wrapClassName || "tab_body";
			this.tabBodySlide = MUI.SwipeChange({
				id:options.id,
				slideTime:options.slideTime || 600,
				wrapClassName:this.wrapClassName,
				fastChange:options.fastChange
			});
			SwipeTab.callSuper(this,"init",options);
		},
		_handleEvent:function(e){
			SwipeTab.callSuper(this,"_handleEvent",e);
			var type = e.type;
			if(type == "changed"){
				this._onChanged(e);
			}
			
		},
		_onChanged:function(e){
			//触发tab 的 selected事件
			this.select(e.currentIndex);
		},
		bindHandlers:function(){
			SwipeTab.callSuper(this,"bindHandlers");
			var _handleEvent =  this._handleEvent = J.bind(this._handleEvent,this);
			$E.on(this.tabBodySlide,"changed",_handleEvent);
		},
		_setSelectedClass:function(selectedIndex){
			var tabs = this.tabs;
			var currentIndex = this.currentIndex;
			if(currentIndex == selectedIndex) return;

			$D.removeClass(tabs[currentIndex],this.selectedClass);
			$D.addClass(tabs[selectedIndex],this.selectedClass);
		},
		select:function(selectedIndex){
			if(selectedIndex == this.currentIndex) return;
			SwipeTab.callSuper(this,"select",selectedIndex);
			this.tabBodySlide.slideTo(selectedIndex);
		},
		destory:function(){
			AnimateTab.callSuper(this,"destory");
			$E.off(this.tabBodySlide,"changed",this._handleEvent);
			this.tabBodySlide.destory();
		}

	});
	this.SwipeTab = SwipeTab;
});
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

			this.tabBodySlide = MUI.SwipeChange({
				id:options.id,
				slideTime:options.animateDuration || 600,
				wrapClassName:"tab_body",
				fastChange:options.fastChange
			});
			SwipeTab.callSuper(this,"init",options);
		},
		bindHandlers:function(){
			SwipeTab.callSuper(this,"bindHandlers");
			var self = this;

			$E.on(this.tabBodySlide,"changed",function(e){
				var selectedIndex = e.currentIndex;
				//触发tab 的 selected事件
				self.select(selectedIndex);
			});
		},
		_setSelectedClass:function(selectedIndex){
			var tabs = this.tabs;
			var currentIndex = this.currentIndex;
			if(currentIndex == selectedIndex) return;

			$D.removeClass(tabs[currentIndex],this.selectedClass);
			$D.addClass(tabs[selectedIndex],this.selectedClass);
		},
		select:function(selectedIndex){
			SwipeTab.callSuper(this,"select",selectedIndex);
			this.slideTo(selectedIndex);
		},
		slideTo:function(index){
			this.tabBodySlide.slideTo(index);
		}

	});
	this.SwipeTab = SwipeTab;
});
JM.$package("MUI",function(J){
	var $D = J.dom,
		$E = J.event;
		
	var isTouchDevice = J.platform.touchDevice;
	var touchEvt = isTouchDevice ? "tap":"click";
	var AnimateTab = J.Class({extend:MUI.Tab},{
		init:function(options){
			
		
			this.tabBodySlide = MUI.Slide({
				id:options.id,
				slideTime:options.slideTime || 1000,
				wrapClassName:"tab_body",
				fastChange:options.fastChange
			});
			AnimateTab.callSuper(this,"init",options);
		
		},
		_handleEvent:function(e){
			AnimateTab.callSuper(this,"_handleEvent",e);
			var type = e.type;
			if(type == "changed"){
				this._onBodySlideChanged(e);
			}
		},
		bindHandlers:function(){
			AnimateTab.callSuper(this,"bindHandlers");
			var _handleEvent = this._handleEvent = J.bind(this._handleEvent,this);
			$E.on(this.tabBodySlide,"changed",_handleEvent);
		},
		_onBodySlideChanged:function(e){
			$E.fire(this,"changefinished",e);
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
			AnimateTab.callSuper(this,"select",selectedIndex);
			this.tabBodySlide.slideTo(selectedIndex);
		},
		destory:function(){
			AnimateTab.callSuper(this,"destory");
			$E.off(this.tabBodySlide,"changed",this._handleEvent);
			this.tabBodySlide.destory();
		}

	});
	this.AnimateTab = AnimateTab;
});
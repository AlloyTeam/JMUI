JM.$package("MUI",function(J){
	var $D = J.dom,
		$E = J.event;

	var isListItem =function(ele){
		return ele.tagName == "LI";
	}
	var isTouchDevice = J.platform.touchDevice;
	var touchEvt = isTouchDevice ? "tap":"click";
	var Tab = J.Class({
		init:function(options){
			this.elem = $D.id(options.id);
			var tb = $D.tagName("ul" ,this.elem);
			this.tabHeaderClassName = options.tabHeaderClassName || "tab_head";
			this.tabBodyClassName = options.tabBodyClassName || "tab_body";
			this.selectedClass = options.selectedClass || "active";

			this.tabHeader = $D.className(this.tabHeaderClassName,this.elem)[0];
			this.tabBody = $D.className(this.tabBodyClassName,this.elem)[0];

			this.tabs = $D.$("."+this.tabHeaderClassName + ">li",this.elem);
			this.tabContents = $D.$("."+this.tabBodyClassName+">li",this.elem);

			this.currentIndex = options.currentIndex || 0;

			this.bindHandlers();
			this._setIndex();
			this._setHeaderWidth();

			$D.addClass(this.tabs[this.currentIndex] ,this.selectedClass);
			$D.setStyle(this.tabContents[this.currentIndex],"display","block");

		},
		_handleEvent:function(e){
			var type = e.type;
			if(type == "click"){
				this._onClick(e);
			}
		},
		bindHandlers:function(){
			var self = this;
			var _handleEvent = this._handleEvent = J.bind(this._handleEvent,this);
			$E.on(this.elem ,touchEvt ,_handleEvent);
		},
		getIndex:function(ele){
			return parseInt(ele.getAttribute("_index"));
		},
		_setSelectedClass:function(selectedIndex){
			var tabs = this.tabs;
			var tabContents = this.tabContents;
			var currentIndex = this.currentIndex;
			if(currentIndex == selectedIndex) return;

			$D.removeClass(tabs[currentIndex],this.selectedClass);
			$D.setStyle(this.tabContents[currentIndex],"display","none");
			$D.addClass(tabs[selectedIndex],this.selectedClass);
			$D.setStyle(this.tabContents[selectedIndex],"display","block");
		},
		_setHeaderWidth:function(){
			var tabs = this.tabs;
			var count = this.tabs.length;
			J.each(tabs,function(t,i){
				$D.setStyle(t,"width",100/count + "%");
			});
		},
		_setIndex:function(){
			var tabs = this.tabs;
			J.each(tabs,function(e,i){
				e.setAttribute("_index" ,i);
			});
		},
		_onClick:function(e){
			var target = e.target || e.srcElement;
			if(isListItem(target) && target.parentNode == this.tabHeader){
				var selectedIndex = this.getIndex(target);
				this.select(selectedIndex);
			}

		},
		select:function(selectedIndex){
			this._setSelectedClass(selectedIndex);
			this.currentIndex = selectedIndex;
			//触发tab 的 selected事件
			$E.fire(this,"selected",{
				selectedIndex : selectedIndex,
				selectedTab : this.tabs[selectedIndex],
				selectedTabContent : this.tabContents[selectedIndex]
			});
				
		},
		destory:function(){
			$E.off(this.elem,touchEvt,this._handleEvent);
			$D.remove(this.elem);
		}

	});
	this.Tab = Tab;
});
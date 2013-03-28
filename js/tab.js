cnMobile.$package("MUI",function(cm){
	var $D = cm.dom,
		$E = cm.event;

	var isListItem =function(ele){
		return ele.tagName == "LI";
	}
	var Tab = function(options){
		this.init(options);
	}
	var isTouchDevice = cm.platform.touchDevice;
	var touchEvt = isTouchDevice ? "tap":"click";
	/*
	*tab参数:id,selctedClass,currentIndex,animate,animateDuration,gesture.
	*
	*/
	Tab.prototype = {
		init:function(options){
			this.elem = $D.id(options.id);
			var tb = $D.tagName("ul" ,this.elem);
			this.selectedClass = options.selectedClass || "active";
			this.tabHeader = $D.className("tab_head",this.elem)[0];
			this.tabBody = $D.className("tab_body",this.elem)[0];

			this.tabs = $D.$(".tab_head>li",this.elem);
			this.tabContents = $D.$(".tab_body>li",this.elem);

			this.currentIndex = options.currentIndex || 0;
			this.animate = options.animate;
			if(this.animate){
				this.animateDuration = options.animateDuration || "1s";
			}
			//手势滑动tab页
			this.gesture = options.gesture;
			this.touchId = options.touchId;
		 
			this.bindHandlers();
			this._setIndex();
			this._initStyle();

			$D.addClass(this.tabs[this.currentIndex] ,this.selectedClass);
		},
		bindHandlers:function(){
			var self = this;
			$E.on(this.elem,touchEvt ,cm.bind(this._onClick,this));
			if(this.gesture){
					var touchId = $D.id(this.touchId); 
					var isTouchDevice = cm.platform.touchDevice;
					var startEvt = isTouchDevice ? "touchstart" : "mousedown";
					var moveEvt = isTouchDevice ? "touchmove" : "mousemove";
					var endEvt = isTouchDevice ? "touchend" : "mouseup";
					var startClientX,
						endClientX,
					    currentIndex1,
						currentIndex2;
					//手势距离
					var gestureLen = 100;
				   // var currentIndex = self.currentIndex;  
				   var tabsLen = self.tabs.length - 1;
					$E.on(touchId, startEvt, function(e){
						startClientX = isTouchDevice ? e.changedTouches[0].clientX : e.clientX;
					});
					$E.on(touchId, moveEvt, function(e){
                          e.preventDefault();
					});   
					$E.on(touchId, endEvt, function(e){

						endClientX = isTouchDevice ? e.changedTouches[0].clientX : e.clientX;  
						var clientXWidth = startClientX - endClientX;
						
						if(clientXWidth > gestureLen){
                             currentIndex1 = self.currentIndex -1 >= 0 ? self.currentIndex - 1 : tabsLen;			
							self._setSelectedClass(currentIndex1); 
							self.currentIndex = currentIndex1;
							
						}else if(clientXWidth < -gestureLen){
							currentIndex2 = self.currentIndex + 1 > tabsLen ? 0 : self.currentIndex + 1 ; 
							self._setSelectedClass(currentIndex2);
							self.currentIndex = currentIndex2;
						}
					});

				}

		},
		getIndex:function(ele){
			return ele.getAttribute("_index");
		},
		_hideUnselectedItems:function(){
			cm.each(function(item,i){
				if(i != currentIndex){
					$D.setStyle(this.tabContents[i],"display","none");
				}
			});
		},
		_initStyle:function(){
			var tb_cons = this.tabContents;
			var ori_w = this.tabBody.clientWidth;
			var ori_item_w = tb_cons[0].clientWidth;

			if(this.animate){
				$D.setStyle(this.tabBody,"-webkit-transition" , "all," + this.animateDuration);
			}
		},
		_setSelectedClass:function(selectedIndex){
			var tabs = this.tabs;
			var tabBody = this.tabBody;
			var tabContents = this.tabContents;
			var currentIndex = this.currentIndex;
			if(currentIndex == selectedIndex) return;

			$D.removeClass(tabs[currentIndex],this.selectedClass);
			$D.addClass(tabs[selectedIndex],this.selectedClass);

			var dist = selectedIndex * -tabContents[0].clientWidth;
			$D.setStyle(tabBody,"-webkit-transform","translate3d(" + dist + "px,0,0)");
		},
		_setIndex:function(){
			var tabs = this.tabs;
			cm.each(tabs,function(e,i){
				e.setAttribute("_index" ,i);
			});
		},
		_onClick:function(e){
			var self = this;
			var target = e.target || e.srcElement;
			if(isListItem(target) && target.parentNode == self.tabHeader){
				var selectedIndex = self.getIndex(target);

				this._setSelectedClass(selectedIndex);
				this.currentIndex = selectedIndex;

				//触发tab 的 selected事件
				$E.fire(self,"selected",{
					selectedIndex : selectedIndex,
					selectedTab : target,
					selectedTabContent : self.tabContents[selectedIndex]
				});

			}	
		}

	}
	this.Tab = Tab;
});

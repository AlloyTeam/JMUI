cnMobile.$package("MUI",function(cm){
	var $D = cm.dom,
		$E = cm.event;

	var AutoLoadList = cm.Class({extend:MUI.List},{
		init:function(options){
			AutoLoadList.callSuper(this,"init",options);
			this.isLoading = false;
			this.loadingWord = options.loadingWord || "加载中...";
			this.loadingTipsClassName = options.loadingTipsClassName || "list_loading_tips";
		},
		bindHandlers:function(){
			AutoLoadList.callSuper(this,"bindHandlers");
			var self = this;

			$E.on(window,"scrolltobottom",function(e){
				if(!self.isLoading){
					self.loadData();
					self.isLoading = true; 
				}
			});
		},
		hideLoadingTips:function(){
			this.elem.removeChild(this.loadingTips);
		},
		showLoadingTips:function(){
			if(!this.loadingTips){
				var loadingTips = $D.node("li");
				loadingTips.className = this.loadingTipsClassName;
				loadingTips.innerHTML = this.loadingWord;
				this.loadingTips = loadingTips;
			}
			this.elem.appendChild(this.loadingTips);
		},
		loadData:function(){
			this.showLoadingTips();
			$E.fire(this,"loadingData");
			//这里添加加载方法
			//...
		},
		createLoadedList:function(data){
		}
	});
	this.AutoLoadList = AutoLoadList;
});
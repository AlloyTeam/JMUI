JM.$package("MUI",function(J){
	var $D = J.dom,
		$E = J.event;

	var AutoLoadList = J.Class({extend:MUI.List},{
		init:function(options){
			AutoLoadList.callSuper(this,"init",options);
			this.isLoading = false;
			this.loadingWord = options.loadingWord || "加载中...";
			this.loadingTipsClassName = options.loadingTipsClassName || "list_loading_tips";
		},
		_handleEvent:function(e){
			var type = e.type;
			AutoLoadList.callSuper(this,"handleEvent",e);
			if(type == "scrolltobottom"){
				this._onScrollToBottom(e);
				return;
			}
		},
		bindHandlers:function(){
			AutoLoadList.callSuper(this,"bindHandlers");
			var _handleEvent = this._handleEvent = J.bind(this._handleEvent,this);
			$E.on(window,"scrolltobottom",_handleEvent);
		},
		_onScrollToBottom:function(e){
			if(!this.isLoading){
				this.loadData();
				this.isLoading = true; 
			}
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
		},
		destory:function(){
			AutoLoadList.callSuper(this,"destory");
			$E.off(window,"scrolltobottom",this._handleEvent);
		}
	});
	this.AutoLoadList = AutoLoadList;
});
JM.$package("MUI",function(J){
	var $D = J.dom,
		$E = J.event;

	var LoadList = J.Class({extend:MUI.List},{
		init:function(options){

			this.loadingWord = options.loadingWord || "加载中...";
			this.loadBtnWord = options.loadBtnWord || "查看更多";
			LoadList.callSuper(this,"init",options);
			
			this.isLoading = false;
		},
		showLoadBtn:function(){
			if(!this.loadBtn){
				var loadBtn = $D.node("li");
				loadBtn.className = 'list_load_btn';
				loadBtn.innerHTML = this.loadBtnWord;
				this.loadBtn = loadBtn;
			}
			this.elem.appendChild(this.loadBtn);
		},
		_handleEvent:function(e){
			var type = e.type;
			if(type == "click"){
				this._onClick(e);
			}
		},
		_onClick:function(e){
			if(!this.isLoading){
				this.loadData();
				this.isLoading = true; 
			}
		},
		showLoadingTips:function(){
			if(!this.loadingTips){
				var loadingTips = $D.node("li");
				loadingTips.className = 'list_loading_tips';
				loadingTips.innerHTML = this.loadingWord;
				this.loadingTips = loadingTips;
			}
			this.elem.appendChild(this.loadingTips);
		},
		bindHandlers:function(){
			var _handleEvent = this._handleEvent = J.bind(this._handleEvent , this);
			LoadList.callSuper(this,"bindHandlers");
			this.showLoadBtn();
			$E.on(this.loadBtn ,"click",_handleEvent);
		},
		hideLoadBtn:function(){
			this.elem.removeChild(this.loadBtn);
		},
		hideLoadingTips:function(){
			this.elem.removeChild(this.loadingTips);
		},
		loadData:function(){
			this.hideLoadBtn();
			this.showLoadingTips();
			$E.fire(this,"loadingData");
			//这里添加加载方法
			//...
		},
		createLoadedList:function(data){
		}
	});
	this.LoadList = LoadList;
});
cnMobile.$package("MUI",function(cm){
	var $D = cm.dom,
		$E = cm.event;
	
	var AutoGrowTextarea = cm.Class({
		init:function(options){
			this.id = options.id;
			this.elem = $D.id(this.id);
			this.textLineHeight = parseInt(document.defaultView.getComputedStyle(this.elem,null).lineHeight) || 12;
			this.bindHandler();
			$D.setStyle(this.elem ,"overflow" ,"hidden");
		},
		bindHandler:function(){
			$E.on(this.elem ,"input",cm.bind(this._onInput,this));
		},
		_onInput:function(){
			var ele = this.elem;
			var clientHeight = ele.clientHeight;
			var scrollHeight = ele.scrollHeight;
			//textarea出现滚动条
			if(scrollHeight > clientHeight){
				$D.setStyle(ele,"height" ,scrollHeight + this.textLineHeight + "px");
			}
		}
	});
	this.AutoGrowTextarea = AutoGrowTextarea;
});
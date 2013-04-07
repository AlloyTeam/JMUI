JM.$package("MUI",function(J){
	var $D = J.dom,
		$E = J.event;
	
	var AutoGrowTextarea = J.Class({
		init:function(options){
			this.id = options.id;
			this.elem = $D.id(this.id);
			this.textLineHeight = parseInt(document.defaultView.getComputedStyle(this.elem,null).lineHeight) || 12;
			this.bindHandler();
			$D.setStyle(this.elem ,"overflow" ,"hidden");
		},
		_handleEvent:function(e){
			var type = e.type;
			if(type == "input"){
				this._onInput(e);
			}
		},
		bindHandler:function(){
			var _handleEvent = this._handleEvent = J.bind(this._handleEvent,this);
			$E.on(this.elem ,"input",_handleEvent);
		},
		_onInput:function(e){
			var ele = this.elem;
			var clientHeight = ele.clientHeight;
			var scrollHeight = ele.scrollHeight;
			//textarea出现滚动条
			if(scrollHeight > clientHeight){
				$D.setStyle(ele,"height" ,scrollHeight + this.textLineHeight + "px");
			}
		},
		destory:function(){
			$E.off(this.elem,"input",this._handleEvent);
			$D.remove(this.elem);
		}
	});
	this.AutoGrowTextarea = AutoGrowTextarea;
});
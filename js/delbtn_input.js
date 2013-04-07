JM.$package("MUI",function(J){
	var $D = J.dom,
	$E = J.event;
	var isTouchDevice = J.platform.touchDevice;
	var touchEvt = isTouchDevice ? "tap":"click";
	var DelBtn_Input = J.Class({
		init:function(options){
			this.elem = $D.id(options.id);
			this.inputDelBtnClassName = options.inputDelBtnClassName || "input_del_btn";
			this.inputEle = $D.tagName("input",this.elem)[0];
			this.delBtn = $D.className(this.inputDelBtnClassName,this.elem)[0];
			this.bindHandler();
		},
		_handleEvent:function(e){
			switch (e.type) {
				case "focus": this._onFocus(e); break;
				case "input": this._onInput(e); break;
				case "blur": this._onBlur(e); break;
				case touchEvt: this._onTap(e); break;
			}
		},
		_onTap:function(e){
			var inputEle = this.inputEle;
			$D.setStyle(this.delBtn,"display","none");
			inputEle.value = "";
			inputEle.focus();
		},
		_onBlur:function(e){
			var delBtn = this.delBtn;
			setTimeout(function(){
				$D.setStyle(delBtn,"display","none");
			},300);
		},
		_onFocus:function(e){
			if(this.inputEle.value!=""){
				$D.setStyle(this.delBtn,"display","block");
			}		
		},
		_onInput:function(){
			var delBtn = this.delBtn;
			if(this.inputEle.value!=""){
				$D.setStyle(delBtn,"display","block");
			}
			else{
				$D.setStyle(delBtn,"display","none");
			}
		},
		bindHandler:function(){
			var _handleEvent = this._handleEvent = J.bind(this._handleEvent,this);
			$E.on(this.inputEle,"focus input blur",_handleEvent);
			$E.on(this.delBtn,touchEvt,_handleEvent);
		},
		destory:function(){
			var _handleEvent = this._handleEvent;
			$E.off(this.inputEle,"focus input blur",_handleEvent);
			$E.off(this.delBtn,touchEvt,_handleEvent);
			$D.remove(this.delBtn);
			$D.remove(this.inputEle);
		}
	});
	this.DelBtn_Input  = DelBtn_Input ;
});
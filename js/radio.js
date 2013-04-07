JM.$package("MUI",function(J){
	var $D = J.dom,
		$E = J.event;

	var Radio = J.Class({
		init:function(options){
			this.elem = $D.id(options.id);
			this.radioElem = $D.$("input[type=radio]",this.elem)[0];
			this.checkedClassName = options.checkedClassName || "checked";
			this.checked = this.radioElem.checked;
			this.value = this.radioElem.value;
			this.bindHandler();
		},
		_handleEvent:function(e){
			var type = e.type;
			if(type == "click"){
				this._onClick(e);
			}
		},
		bindHandler:function(){
			var _handleEvent = this._handleEvent = J.bind(this._handleEvent,this);
			$E.on(this.radioElem,"click",_handleEvent);
		},
		setValue:function(val){
			this.radioElem.value = this.value = val;
		},
		uncheck:function(){
			this._changeState(false);
		},
		check:function(){
			this._changeState(true);
		},
		_changeState:function(checked){
			var re = this.radioElem;
			var checkedClassName = this.checkedClassName;

			this.checked = re.checked = checked;
			if(checked)
				$D.addClass(this.elem,checkedClassName);
			else
				$D.removeClass(this.elem,checkedClassName);
			//触发selected事件
			$E.fire(this,"chaged",{
				checked:checked
			});
		},
		_onClick:function(e){
			//当已经是选中状态，不触发selected事件
			if(this.checked) return;
			this._changeState(this.radioElem.checked);
		},
		destory:function(){
			$E.off(this.radioElem,"click",this._handleEvent);
			$D.remove(this.elem);
		}
	
	});
	this.Radio = Radio;
});
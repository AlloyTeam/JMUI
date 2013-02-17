cnMobile.$package("MUI",function(cm){
	var $D = cm.dom,
		$E = cm.event;

	var Radio = cm.Class({
		init:function(options){
			this.elem = $D.id(options.id);
			this.radioElem = $D.$("input[type=radio]",this.elem)[0];
			this.checked = this.radioElem.checked;
			this.value = this.radioElem.value;
			this.bindHandler();
		},
		bindHandler:function(){
			var self = this;
			$E.on(this.radioElem,"click",function(e){
				self._onClick(e);
			});
		},
		setValue:function(val){
			this.radioElem.value = this.value = val;
		},
		select:function(selected){
			if(this.checked) return;
			this._setSelected();
		},
		unselect:function(){
			this.radioElem.checked = false;
			this.checked = false;
			$D.removeClass(this.elem,"checked");
		},
		_setSelected:function(e){
			var re = this.radioElem;
			var evtObj = {};

			if(!re.checked) re.checked = true;
			this.checked = true;

			$D.addClass(this.elem,"checked");
			if(e){
				evtObj.originalEventObj = e;
			}
			//触发selected事件
			$E.fire(this,"selected",evtObj);
		},
		_onClick:function(e){
			var target = e.target || e.srcElement; 
			var ele = this.elem;
			//触发click事件
			$E.fire(this,"click",{
				originalEventObj:e
			});
			//当已经是选中状态，不触发selected事件
			if(this.checked) return;
			this._setSelected();
		}
	
	});
	this.Radio = Radio;
});
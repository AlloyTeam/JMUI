cnMobile.$package("MUI",function(cm){
	var $D = cm.dom,
		$E = cm.event;

	var Checkbox = cm.Class({
		init:function(options){
			this.elem = $D.id(options.id);
			this.checkboxElem = $D.$("input[type=checkbox]",this.elem);
			this.checked = this.checkboxElem.checked;
			this.value = this.checkboxElem.value;
			this.bindHandler();
		},
		setValue:function(val){
			this.checkboxElem.value = this.value = val;
		},
		bindHandler:function(){
			var self = this;
			$E.on(this.checkboxElem,"click",function(e){
				self._onChange(e);
			});
		},
		_onChange:function(e){
			var target = e.target || e.srcElement; 
			var ele = this.elem;
			this.checked = target.checked;
		
			$E.fire(this,"change click",{
				originalEventObj:e,
				checked:this.checked
			});
			if(this.checked){
				$D.addClass(ele,"checked");
			}
			else{
				$D.removeClass(ele,"checked");
			}
				
		}
	
	});
	this.Checkbox = Checkbox;
});
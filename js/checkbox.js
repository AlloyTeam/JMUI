JM.$package("MUI",function(J){
	var $D = J.dom,
		$E = J.event;

	var Checkbox = J.Class({
		init:function(options){
			this.elem = $D.id(options.id);
			this.checkboxElem = $D.$("input[type=checkbox]",this.elem)[0];
			this.checked = this.checkboxElem.checked;
			this.value = this.checkboxElem.value;
			this.checkedClass = options.checkedClass || "checked";
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
			var checkedClass = this.checkedClass;
			this.checked = target.checked;
		
			$E.fire(this,"change click",{
				originalEventObj:e,
				checked:this.checked
			});
			if(this.checked){
				$D.addClass(ele,checkedClass);
			}
			else{
				$D.removeClass(ele,checkedClass);
			}
				
		}
	
	});
	this.Checkbox = Checkbox;
});
JM.$package("MUI",function(J){
	var $D = J.dom,
		$E = J.event;

	var isRadio = function(elem){
		return elem.tagName == "INPUT" && elem.type == "radio";
	}

	var addSelectedRadioStyle = function(radioBtn,checkedClassName){
		$D.addClass(radioBtn.parentNode,checkedClassName);
	}

	var removeSelectedRadioStyle = function(radioBtn,checkedClassName){
		$D.removeClass(radioBtn.parentNode,checkedClassName);
	}

	var RadioButtonList = function(options){
		this.init(options);
	}
	RadioButtonList.prototype = {
		init:function(options){
			this.elem = $D.id(options.id);
			this.radioBtns = $D.tagName("input",this.elem);
			this.checkedClassName = options.checkedClassName || "checked";
			this.selectedIndex = this.getSelectedIndex();

			addSelectedRadioStyle(this.radioBtns[this.selectedIndex],this.checkedClassName);
			this.bindHandlers();
			
		},

		getSelectedIndex:function(){
			for(var i = this.radioBtns.length; i--;){
				if(this.radioBtns[i].checked) return i;
			}
			return 0;//默认首个选中
		},
		_onChange:function(e,target){
			var currentSelectedIndex = this.getSelectedIndex();
			
			if(currentSelectedIndex != this.selectedIndex){
				addSelectedRadioStyle(target,this.checkedClassName);
				removeSelectedRadioStyle(this.radioBtns[this.selectedIndex],this.checkedClassName);
				this.selectedIndex = currentSelectedIndex;
			}

			$E.fire(this,"change",{
				originalEventObj:e,
				radioSelected:target,
				selectedIndex:this.selectedIndex
			});
		},
		bindHandlers:function(){
			var self = this;
			$E.on(this.elem,"click",function(e){
				var target = e.target || e.srcElement;
				if(isRadio(target)){
					self._onChange(e,target);
				}
			});
		}
	}
	this.RadioButtonList = RadioButtonList;
});
cnMobile.$package("MUI",function(cm){
	var $D = cm.dom,
		$E = cm.event;

	var isRadio = function(elem){
		return elem.tagName == "INPUT" && elem.type == "radio";
	}

	var SelectEvent = function(option){
		this.originalEventObj = option.originalEventObj;
		this.radioSelected = option.radioSelected;
		this.selectedIndex = option.selectedIndex;
	}

	var addSelectedRadioStyle = function(radioBtn){
		radioBtn.parentNode.className = "checked";
	}

	var removeSelectedRadioStyle = function(radioBtn){
		radioBtn.parentNode.className = "";
	}

	var RadioButtonList = function(options){
		this.init(options);
	}
	RadioButtonList.prototype = {
		init:function(options){
			this.elem = $D.id(options.id);
			this.radioBtns = $D.tagName("input",this.elem);
			this.selectedIndex = this.getSelectedIndex();

			addSelectedRadioStyle(this.radioBtns[this.selectedIndex]);
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
				addSelectedRadioStyle(target);
				removeSelectedRadioStyle(this.radioBtns[this.selectedIndex]);
				this.selectedIndex = currentSelectedIndex;
			}

			$E.fire(this,"change",new SelectEvent({
				originalEventObj:e,
				radioSelected:target,
				selectedIndex:this.selectedIndex
			}));
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
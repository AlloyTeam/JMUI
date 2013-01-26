cnMobile.$package("MUI",function(cm){
	var $D = cm.dom,
		$E = cm.event;
	

	var MenuSelect = function(options){
		this.init(options);
	}
	MenuSelect.prototype = {
		init:function(options){
			this.elem = $D.id(options.id);
			this.selectElem = $D.tagName("select",this.elem)[0];
			this.selectTextElem = $D.tagName("span",this.elem)[0];
			this.setText(this.selectElem.selectedIndex);

			this.bindHandlers();
		},
		setText:function(selectedIndex){
			this.selectTextElem.innerHTML =this.selectElem.options[selectedIndex].innerHTML;
		},
		setCurrentSelectedIndex:function(index){
			this.selectElem.selectedIndex = index;
			this.setText(index);
		},
		bindHandlers:function(){
			var self = this;
			var selectElem = this.selectElem;
			var selectTextElem = this.selectTextElem;
			$E.on(this.selectElem,"change",function(e){
				self.setText(selectElem.selectedIndex);
				//触发MenuSelect本身的事件
				$E.fire(self, "change", e);
			});
		}
	}
	this.MenuSelect = MenuSelect;
});
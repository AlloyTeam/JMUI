cnMobile.$package("MUI",function(cm){
	var $D = cm.dom,
		$E = cm.event;
	

	var Select = cm.Class({

		init:function(options){
			this.elem = $D.id(options.id);
			this.selectElem = $D.tagName("select",this.elem)[0];
			this.selectTextClassName = options.selectTextClassName || "select_text";
			this.selectTextElem = $D.className(this.selectTextClassName,this.elem)[0];
			
			this.select(this.selectElem.selectedIndex);
			this.bindHandlers();
		},
		select:function(index){
			this.selectedIndex = index;
			this.selectText = this.selectTextElem.innerHTML = this.selectElem.options[index].innerHTML;
		},
		bindHandlers:function(){
			var self = this;
			var selectElem = this.selectElem;
			var selectTextElem = this.selectTextElem;
			$E.on(this.selectElem,"change",function(e){
				self.select(selectElem.selectedIndex);
				//触发change事件
				$E.fire(self, "change", e);
			});
		}
	});
	this.Select = Select;
});
JM.$package("MUI",function(J){
	var $D = J.dom,
		$E = J.event;
	

	var Select = J.Class({

		init:function(options){
			this.elem = $D.id(options.id);
			this.selectElem = $D.tagName("select",this.elem)[0];
			this.selectTextClassName = options.selectTextClassName || "select_text";
			this.selectTextElem = $D.className(this.selectTextClassName,this.elem)[0];
			
			this.select(this.selectElem.selectedIndex);
			this.bindHandlers();
		},
		_handleEvent:function(e){
			var type = e.type;
			if(type == "change"){
				this._onChange(e);
			}
		},
		_onChange:function(e){
			this.select(this.selectElem.selectedIndex);
		},
		select:function(index){
			if(this.selectedIndex == index) return;
			this.selectedIndex = index;
			this.selectText = this.selectTextElem.innerHTML = this.selectElem.options[index].innerHTML;
			//触发change事件
			$E.fire(this, "change",{
				selectedIndex:index,
				selectedText:this.selectText
			});
		},
		bindHandlers:function(){
			var _handleEvent = this._handleEvent = J.bind(this._handleEvent,this);
			$E.on(this.selectElem,"change",_handleEvent);
		},
		destory:function(){
			$E.off(this.selectElem,"change",this._handleEvent);
			$D.remove(this.elem);
		}
	});
	this.Select = Select;
});
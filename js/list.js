JM.$package("MUI",function(J){
	var $D = J.dom,
		$E = J.event,
		$T = J.type;
	var isTouchDevice = J.platform.touchDevice;
	var touchEvt = isTouchDevice ? "tap":"click";
	var isListItem = function(ele){
		return $D.hasClass(ele ,"list_item");
	}
	var List = J.Class({
		init:function(options){
			this.elem = $D.id(options.id);
			this.listItemClassName = options.listItemClassName || "list_item";
			this.selectedClassName = options.selectedClassName || "selected";
			this.listItems = $D.className(this.listItemClassName,this.elem);
			this.selectedIndex = options.selectedIndex;
			
			this._setIndex();
			this.bindHandlers();
			this.select(this.selectedIndex);
		},
		_handleEvent:function(e){
			var type = e.type;
			if(type == touchEvt){
				this._onClick(e);
			}
		},
		bindHandlers:function(){
			var _handleEvent = this._handleEvent = J.bind(this._handleEvent , this);
			$E.on(this.elem ,touchEvt ,_handleEvent);
		},
		select:function(selectedIndex){
			if(selectedIndex == this.selectedIndex) return;
			if($T.isNumber(this.selectedIndex))
				$D.removeClass(this.listItems[this.selectedIndex],this.selectedClassName);

			if($T.isNumber(selectedIndex)){
				$D.addClass(this.listItems[selectedIndex],this.selectedClassName);
				this.selectedIndex = selectedIndex;
			}
			//触发selected事件
			$E.fire(this ,"selected" ,{
				type:"selected",
				selectedItem : this.listItems[selectedIndex],
				selectedIndex : selectedIndex
			});
		},
		_setIndex:function(){
			J.each(this.listItems ,function(l,i){
				l.setAttribute("_index" ,i);
			});
		},
		_onClick:function(e){
			var target = e.target || e.srcElement;
			var pn = target.parentNode;
	
			if(isListItem(pn)){
				var li = pn;
				var l_index = parseInt(li.getAttribute("_index"));
				this.select(l_index);	
			}
		},
		destory:function(){
			$E.off(this.elem,touchEvt,this._handleEvent);
			$D.remove(this.elem);
		}
	});
	this.List = List;
});
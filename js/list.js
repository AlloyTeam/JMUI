cnMobile.$package("MUI",function(cm){
	var $D = cm.dom,
		$E = cm.event,
		$T = cm.type;

	var isListItem = function(ele){
		return $D.hasClass(ele ,"list_item");
	}
	var List = cm.Class({
		init:function(options){
			this.elem = $D.id(options.id);
			this.listItems = $D.className("list_item",this.elem);
			this.selectedIndex = options.selectedIndex;
			
			this._setIndex();
			this.bindHandlers();
			this.select(this.selectedIndex);
		},
		bindHandlers:function(){
			$E.on(this.elem ,"click" ,cm.bind(this._onClick,this));
		},
		select:function(selectedIndex){
			if($T.isNumber(this.selectedIndex))
				$D.removeClass(this.listItems[this.selectedIndex],"selected");

			if($T.isNumber(selectedIndex)){
				$D.addClass(this.listItems[selectedIndex],"selected");
				this.selectedIndex = selectedIndex;
			}
		},
		_setIndex:function(){
			cm.each(this.listItems ,function(l,i){
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
				//触发selected事件
				$E.fire(this ,"selected" ,{
					selectedItem : li,
					selectedIndex : l_index
				});
			}
		}
	});
	this.List = List;
});
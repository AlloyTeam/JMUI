cnMobile.$package("MUI",function(cm){
	var $D = cm.dom,
		$E = cm.event,
		$T = cm.type;

	var isCheckbox = function(elem){
		return elem.tagName == "INPUT" && elem.type == "checkbox";
	}


 	var CheckboxList = cm.Class({
		init:function(options){
			this.elem = $D.id(options.id);
			this.list = $D.$("input[type=checkbox]",this.elem);
			this._initCheckboxes();
			this.bindHandlers();
		},
		getSelectedCheckBoxes:function(){
			var selectedArr = [];
			cm.each(this.list ,function(c,i){
				if(c.checked) selectedArr.push(c);
			});
			return selectedArr;
		},
		getCheckbox:function(index){
			if($T.isNumber(index)){
				return this.radioBtns[index];
			}
			else if(isCheckbox(index)){
				return index;
			}
		},
		_initCheckboxes:function(){
			var self = this;
			cm.each(this.list,function(c,i){
				if(c.checked) $D.addClass(c.parentNode ,"checked");
				c.setAttribute("_index",i);
			});
		},
		_onClick:function(e,target){
			var cp = target.parentNode;
			if(target.checked){
				$D.addClass(cp ,"checked");
			}
			else{
				$D.removeClass(cp ,"checked");
			}

			$E.fire(this,"change",{
				originalEventObj:e,
				checkboxChanged:target,
				index:target.getAttribute("_index")
			});
		},
		bindHandlers:function(){
			var self = this;
			$E.on(this.elem,"click",function(e){
				var target = e.target || e.srcElement;
				//避免点击label触发两次事件
				if(!isCheckbox(target)) return;
				self._onClick(e,target);
			});
		}
	});
	this.CheckboxList = CheckboxList;
});
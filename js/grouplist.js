JM.$package("MUI",function(J){
	var $D = J.dom,
		$E = J.event;
	var isTouchDevice = J.platform.touchDevice;
	var touchEvt = isTouchDevice ? "tap":"click";
	var GroupList = J.Class({
		init:function(options){
			this.id = options.id;
			this.elem = $D.id(this.id);
			this.groupClassName = options.groupClassName || "list_group";
			this.groupTitleClassName = options.groupTitleClassName || "list_group_title";
			this.groupBodyClassName = options.groupBodyClassName || "list_group_body";
			this.groups = $D.className(this.groupClassName);
			this.groupTitles = $D.className(this.groupTitleClassName);
			this.groupBodies = $D.className(this.groupBodyClassName);

			this.bindHandlers();
			this._setIndex();
			this._initList();

		},
		_handleEvent:function(e){
			var type = e.type;
			if(type == touchEvt){
				this._onClick(e);
			}
		},
		_initList:function(){
			this.list = new MUI.List({
				id:this.id
			});
		},
		bindHandlers:function(){
			var _handleEvent = this._handleEvent = J.bind(this._handleEvent , this);
			$E.on(this.elem ,touchEvt ,_handleEvent);
		},
		_setIndex:function(){
			J.each(this.groupTitles ,function(e,i){
				e.setAttribute("_index" ,i);
			});
		},
		selectTitle:function(index){
			var g_title = this.groupTitles[index];
			var g_body = this.groupBodies[index];
			if(g_body){
				var computedStyle = document.defaultView.getComputedStyle(g_body,null);//getComputedStyle supported by ie9
				if( computedStyle.display == "none" ){
					$D.setStyle(g_body ,"display" ,"block");	
				}
				else{
					$D.setStyle(g_body ,"display" ,"none");
				}
			}	
			//触发selected事件
			$E.fire(this ,"titleselected" ,{
				selectedTitle : g_title,
				selectedList : g_body,
				selectedIndex : index
			});
		},
		_onClick:function(e){
			var target = e.target || e.srcElement;
			var pn = target.parentNode;

			if($D.closest(pn ,"." + this.groupTitleClassName)){
				var g_index = parseInt(pn.getAttribute("_index"));
				this.selectTitle(g_index);
			}
		},
		destory:function(){
			$E.off(this.elem ,touchEvt ,this._handleEvent);
			$D.remove(this.elem);
		}
	});
	this.GroupList = GroupList;
});
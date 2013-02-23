cnMobile.$package("MUI",function(cm){
	var $D = cm.dom,
		$E = cm.event;

	var isGroupTitle = function(ele){
		return $D.hasClass(ele ,"list_group_title");
	}
	var GroupList = cm.Class({
		init:function(options){
			this.id = options.id;
			this.elem = $D.id(this.id);
			this.groups = $D.className("list_group");
			this.groupTitles = $D.className("list_group_title");
			this.groupBodies = $D.className("list_group_body");

			this.bindHandlers();
			this._setIndex();
			this._initList();

		},
		_initList:function(){
			this.list = new MUI.List({
				id:this.id
			});
		},
		bindHandlers:function(){
			$E.on(this.elem ,"click" ,cm.bind(this._onClick,this));
		},
		_setIndex:function(){
			cm.each(this.groupTitles ,function(e,i){
				e.setAttribute("_index" ,i);
			});
		},
		_onClick:function(e){
			var target = e.target || e.srcElement;
			var pn = target.parentNode;

			if($D.closest(pn,".list_group_title")){
				var g_title = pn;
				var g_index = g_title.getAttribute("_index");
				var g_body = this.groupBodies[g_index];
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
				$E.fire(this ,"selected" ,{
					selectedTitle : g_title,
					selectedList : g_body,
					selectedIndex : g_index
				});
				$D.setStyle(document.body,"display","block");
			}
		}
	});
	this.GroupList = GroupList;
});
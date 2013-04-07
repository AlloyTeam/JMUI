JM.$package("MUI",function(J){
	var $D = J.dom,
		$E = J.event;

	var SlideList = J.Class({
		init:function(options){	
			this.elem = $D.id(options.id);
			this.wrapClassName = options.wrapClassName || "list_slide_wrap";
			this.toolBarClassName = options.toolBarClassName || "toolbar_header";
			this.toolbar = $D.className(this.toolBarClassName,this.elem)[0];

			this.s_list = MUI.List({
				id:options.list_id
			});
			this.s_swipe = MUI.Slide({
				id:options.id,
				wrapClassName:this.wrapClassName,
				fastChange:true
			});
			this.backBtn = MUI.Button({
				id:options.back_btn_id
			});
			this.bindHandlers();

		},
		_handleEvent:function(e){
			var type = e.type;
			switch (e.type) {
				case "selected": this._onSelectedEvt(e); break;
				case "click": this._onClickEvt(e); break;
			}
		},
		_onClickEvt:function(e){
			this.select(0);
		},
		_onSelectedEvt:function(e){
			var selectedIndex = e.selectedIndex;
			this.select(selectedIndex);
		},
		select:function(selectedIndex){
			this.s_swipe.slideTo(selectedIndex);
			$E.fire(this,"selected",{
				selectedIndex:selectedIndex
			});
		},
		bindHandlers:function(){
			var _handleEvent = this._handleEvent = J.bind(this._handleEvent,this);
			$E.on(this.s_list,"selected",_handleEvent);
			$E.on(this.backBtn,"click",_handleEvent);
		},
		destory:function(){
			var _handleEvent = this._handleEvent;
			$E.off(this.s_list,"selected",_handleEvent);
			$E.off(this.backBtn,"click",_handleEvent);	
			$D.remove(this.toolbar);
			$D.remove(this.elem);	
		}
	});

	this.SlideList = SlideList;
});
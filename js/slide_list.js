JM.$package("MUI",function(J){
	var $D = J.dom,
		$E = J.event;

	var SlideList = J.Class({
		init:function(options){	
			this.elem = $D.id(options.id);
			this.wrapClassName = options.wrapClassName || "list_slide_wrap";
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
		select:function(selectedIndex){
			this.s_swipe.slideTo(selectedIndex);
			$E.fire(this,"selected",{
				selectedIndex:selectedIndex
			});
		},
		bindHandlers:function(){
			var self = this;
			$E.on(this.s_list,"selected",function(e){
				var selectedIndex = e.selectedIndex;
				self.select(selectedIndex);
			});
			$E.on(this.backBtn,"click",function(){
				self.select(0);
			});
		}
	});

	this.SlideList = SlideList;
});
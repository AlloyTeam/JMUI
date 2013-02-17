cnMobile.$package("MUI",function(cm){
	var $D = cm.dom,
		$E = cm.event;

	var Progress = cm.Class({
		init:function(options){
			this.elem = $D.id(options.id);
			this.bar = $D.className("bar" ,this.elem)[0];
			this.barText = $D.className("bar_text" ,this.elem)[0];
			this.setPercent(options.percent || 0);
		},
		setPercent:function(p){
			this.percent = Math.max(Math.min(p ,100) ,0);
			if(this.barText) this.barText.innerHTML = this.percent + "%";
			$D.setStyle(this.bar ,"width" ,this.percent + "%");
		},
		getPercent:function(){
			return this.percent;
		}
	});
	this.Progress = Progress;
});
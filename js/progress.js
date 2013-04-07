JM.$package("MUI",function(J){
	var $D = J.dom,
		$E = J.event;

	var Progress = J.Class({
		init:function(options){
			this.elem = $D.id(options.id);
			this.barClassName = options.barClassName || "bar";
			this.barTextClassName = options.barTextClassName || "bar_text";
			this.bar = $D.className(this.barClassName ,this.elem)[0];
			this.barText = $D.className(this.barTextClassName ,this.elem)[0];
			this.setPercent(options.percent || 0);
		},
		setPercent:function(p){
			this.percent = Math.max(Math.min(p ,100) ,0);
			if(this.barText) this.barText.innerHTML = this.percent + "%";
			$D.setStyle(this.bar ,"width" ,this.percent + "%");
		},
		getPercent:function(){
			return this.percent;
		},
		destory:function(){
			$D.remove(this.elem);
		}
	});
	this.Progress = Progress;
});
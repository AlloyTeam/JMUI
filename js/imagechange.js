cnMobile.$package("MUI",function(cm){
	var $D = cm.dom,
		$E = cm.event;

	var isListItem = function(ele){
		return ele.tagName == "LI";
	}

	var ImageChange = cm.Class({extend:MUI.SwipeChange},{
		init:function(options){
			ImageChange.callSuper(this,"init",options);
			this.btnsContainer = $D.className("btnsWrap",this.elem)[0];
			this.preIndex = this.currentIndex;
			this.count = this.contents.length;
			this.isAutoChange = options.isAutoChange;
			this.autoChangeTime = options.autoChangeTime || 3000;
			this._initBtns();
			this.bindHandler();
			if(this.isAutoChange) this.autoChange();
		},
		autoChange:function(){
			var self = this;
			var count = this.count;
			clearTimeout(this.runTimeId);
			this.runTimeId = setTimeout(function(){
				var currentIndex = self.currentIndex;
				if(currentIndex >= count-1) currentIndex = 0;
				else currentIndex ++;
				self.slideTo(currentIndex);
			},self.autoChangeTime);
		},
		_initBtns:function(){
			var count = this.count;
			var currentIndex = this.currentIndex;
			var content = "";
			for(var i=0;i<count;i++){
				if(i===currentIndex) content += "<li class='selected' _index='"+ i +"'></li>";
				else content += "<li _index='"+ i +"'></li>";
			}
			this.btnsContainer.innerHTML = content;
			this.btns = $D.tagName("li",this.btnsContainer);
		},
		bindHandler:function(){
			var self = this;

			$E.on(this.contentWrap,"webkitTransitionEnd",function(e){
				var currentIndex = self.currentIndex;
				$D.removeClass(self.btns[self.preIndex],"selected");
				$D.addClass(self.btns[currentIndex],"selected");
				self.preIndex = currentIndex;
				if(self.isAutoChange) self.autoChange();
			});
		}
	});

	this.ImageChange = ImageChange;
});
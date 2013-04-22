JM.$package("MUI",function(J){
	var $D = J.dom,
		$E = J.event;	

	//图片懒加载 只实现了垂直的情况
	var LazyLoadImgs = J.Class({
		init:function(options){
			var self = this;
			this.elem = $D.id(options.id);
			this.souceProperty = options.souceProperty || "_ori_src";
			this.isFade = options.isFade;		

			this._loadFunc = this.isFade ? function(img,loadSrc){
					var newImg = img.cloneNode();
					$D.setStyle(newImg,{
						"-webkit-transition":"all 1s",
						"opacity":"0"
					})
					$E.once(newImg,"load",function(){
						img.parentNode.replaceChild(newImg,img);
						setTimeout(function(){
							$D.setStyle(newImg,"opacity","1");
						},0);
						
					});
					newImg.src = loadSrc;
					newImg.removeAttribute(self.souceProperty);
				} : function(img,loadSrc){
				img.src = loadSrc;
				img.removeAttribute(self.souceProperty);
			}
			this.bindHandlers();
		},
		_handleEvent:function(e){
			switch (e.type) {
				case "load": 
				case "resize": 
				case "scrollend": this._onResize(e); 
			}
		},
		_onResize:function(e){
			var _loadFunc = this._loadFunc;
			var souceProperty = this.souceProperty;
			var container = this.elem;
			var viewHeight = document.documentElement.clientHeight;
			var imgs = $D.$("img["+ souceProperty +"]" ,container);
			
			if(imgs.length == 0) return;

			J.each(imgs,function(img){
				var imgTop = img.getBoundingClientRect().top;
				var imgH = img.clientHeight;
				//图片在可视范围内
				if(imgTop > - imgH/2){
					if(imgTop < viewHeight) {
						_loadFunc(img ,img.getAttribute(souceProperty));
					}
					else {
						return false;//中断遍历
					}
				}
			});
		},
		bindHandlers:function(){
			var _handleEvent = this._handleEvent = J.bind(this._handleEvent , this);
			$E.on(window,"load resize scrollend",_handleEvent);
		},
		destory:function(){
			$E.off(window,"load resize scrollend",this._handleEvent);
		}
	});
	this.LazyLoadImgs = LazyLoadImgs;
});
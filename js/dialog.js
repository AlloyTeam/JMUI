JM.$package("MUI",function(J){
	var $D = J.dom,
		$E = J.event,
		$U = J.Util;
	var _transform = $D.getVendorPropertyName("transform");

	//show 效果
	var showEffect = {
		none:function(elem,mask,onShow){
	
			$D.setStyle(elem,{
				"opacity":1,
				"visibility":"visible"
			});
			$D.setStyle(mask,{
				"opacity":.8,
				"visibility":"visible"
			});
			$E.fire(this ,"show");
		},
		fade:function(elem,mask){
			var self = this;
			$D.setStyle(mask,"opacity",0);
			setTimeout(function(){
				new J.Animation({
					selector:mask,
					duration:300,
					use3d:self.use3d
				}).setStyle({
					"opacity":.8,
					"visibility":"visible"
				}).transit().setElems(elem).setStyle({
					"opacity":1,
					"visibility":"visible"
				}).transit(function(){
					$E.fire(self ,"show");
				});	
			},0);

		},
		pop:function(elem,mask){
			var self = this;
			$D.setStyle(mask ,"opacity" ,0);
			$D.setStyle(elem , _transform,"scale(0.5)");

			setTimeout(function(){
				new J.Animation({
					selector:mask,
					duration:300,
					use3d:self.use3d
				}).setStyle({
					"opacity":.8,
					"visibility":"visible"
				}).transit().setElems(elem).setStyle({
					"opacity":1,
					"visibility":"visible"
				}).scale(1).transit(function(){
					$E.fire(self ,"show");
				});	
			},0);			
		},
		slideup:function(elem,mask){
			var self = this;
			$D.setStyle(mask ,"opacity" ,0);
			$D.setStyle(elem ,_transform ,"translateY(300px)");
			setTimeout(function(){
				new J.Animation({
					selector:mask,
					duration:300,
					use3d:self.use3d
				}).setStyle({
					"opacity":.8,
					"visibility":"visible"
				}).transit().setElems(elem).translateY(0).setStyle({
					"opacity":1,
					"visibility":"visible"
				}).transit(function(){
					$E.fire(self ,"show");
				});	
			},0);
		},
		slidedown:function(elem,mask){
			var self = this;
			$D.setStyle(mask ,"opacity" ,0);
			$D.setStyle(elem ,_transform ,"translateY(-300px)");
			setTimeout(function(){

				new J.Animation({
					selector:mask,
					duration:300,
					use3d:self.use3d
				}).setStyle({
					"opacity":.8,
					"visibility":"visible"
				}).transit().setElems(elem).translateY(0).setStyle({
					"opacity":1,
					"visibility":"visible"
				}).transit(function(){
					$E.fire(self ,"show");
				});	
			},0);
		}
	};
	//hide 效果
	var hideEffect = {
		none:function(elem,mask){
			$D.setStyle([elem,mask],"visibility" ,"hidden");
			$E.fire(this ,"hide");
		},
		fade:function(elem,mask){
			var self = this;
			new J.Animation({
				selector:[elem,mask],
				duration:300,
				use3d:self.use3d
			}).setStyle({
				"opacity":0,
				"visibility":"hidden"
			}).transit(function(){
				$E.fire(self ,"hide");
			});			
		},
		pop:function(elem,mask){
			var self = this;
			new J.Animation({
				selector:[mask],
				duration:300,
				use3d:self.use3d
			}).setStyle({
				"opacity":0,
				"visibility":"hidden"
			}).transit().setElems(elem).setStyle({
				"opacity":0,
				"visibility":"hidden"
			}).scale(.5).transit(function(){
				$D.setStyle(elem , _transform,"");
				$E.fire(self ,"hide");
			});			
		},
		slidedown:function(elem,mask){
			var self = this;
			new J.Animation({
				selector:mask,
				duration:300,
				use3d:self.use3d
			}).setStyle({
				"opacity":0,
				"visibility":"hidden"
			}).transit().setElems(elem).translateY("300px").setStyle({
				"opacity":0,
				"visibility":"hidden"
			}).transit(function(){
				$D.setStyle(elem , _transform,"");
				$E.fire(self ,"hide");
			});			
		},
		slideup:function(elem,mask){
			var self = this;
			new J.Animation({
				selector:mask,
				duration:300,
				use3d:self.use3d
			}).setStyle({
				"opacity":0,
				"visibility":"hidden"
			}).transit().setElems(elem).translateY("-300px").setStyle({
				"opacity":0,
				"visibility":"hidden"
			}).transit(function(){
				$D.setStyle(elem , _transform,"");
				$E.fire(self ,"hide");
			});			
		}

	}
	var Dialog = J.Class({
		init:function(options){
			this.id = options.id;
			this.elem = $D.id(this.id);
			this.maskClassName = this.maskClassName || "mask";
			this.mask = $D.className(this.maskClassName)[0];
			this.use3d = options.use3d;
			this.preventScroll = options.preventScroll;

		},
		show:function(type){
			type = type || "none";
			showEffect[type].call(this ,this.elem ,this.mask ,this.onShow);
			if(this.preventScroll){
				$U.preventScrolling();
			}
			$E.fire(this,"show");
		},
		hide:function(type){
			type = type || "none";
			hideEffect[type].call(this ,this.elem ,this.mask);
			if(this.preventScroll){
				$U.activeScrolling();
			}
			$E.fire(this,"hide");
		},
		destory:function(){
			$D.remove(this.mask);
			$D.remove(this.elem);
		}
	});
	this.Dialog = Dialog;
});
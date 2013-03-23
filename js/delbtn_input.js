cnMobile.$package("MUI",function(cm){
	var $D = cm.dom,
	$E = cm.event;

	var DelBtn_Input = cm.Class({
		init:function(options){
			this.elem = $D.id(options.id);
			this.inputEle = $D.tagName("input",this.elem)[0];
			this.delBtn = $D.className("input_del_btn",this.elem)[0];
			this.bindHandler();
		},
		bindHandler:function(){
			var inputEle = this.inputEle;
			var delBtn = this.delBtn;

			$E.on(inputEle,"focus",function(){
				$D.setStyle(delBtn,"display","block");
			});
			$E.on(inputEle,"input",function(){
				if(inputEle.value!=""){
					$D.setStyle(delBtn,"display","block");
				}
				else{
					$D.setStyle(delBtn,"display","none");
				}
			});
			$E.on(inputEle,"blur",function(){
				setTimeout(function(){
					$D.setStyle(delBtn,"display","none");
				},300);
			});
			$E.on(this.delBtn,"click",function(){
				$D.setStyle(delBtn,"display","none");
				inputEle.value = "";
				inputEle.focus();
			});
		}
	});
	this.DelBtn_Input  = DelBtn_Input ;
});
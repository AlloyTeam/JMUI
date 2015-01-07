;(function( $, pro ) {
	pro.createWidget( 'Mask', {
		options: {
			animation: true,
			preventScroll: true
		},
		tpl: '<div class="ui-mask"></div>',
		_bindEvents: function(){
            var self = this;

            var options = this.options;

            this.$el.on('tap', function(){
            	if(options.tapHide === true){
					if(options.relatedWidget){
						$.isFunction(options.relatedWidget.hide) && options.relatedWidget.hide();
					}
					self.hide();
				}else if($.isFunction(options.tapHide)){
					options.tapHide();
				}
			});
        }
	}, true);
})(Zepto, pro);

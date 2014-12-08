(function( $, pro ) {
	pro.createWidget( 'Toast', {
		options: {
			animation: true,
			preventScroll: true,
			state: 'warning',	// 三种状态 warning，tips，success，参见 http://waltz.cdc.com/mqq.html#3539
			content: '',
			duration: 2000
		},
		tpl: '<div class="ui-toast">\
			  	<i></i>\
			  	<span class="ui-color-white"></span>\
			  </div>',
		_render: function(){
			this.$el.find('i').removeClass().addClass('ui-icon-' + this.options.state);
			this.$el.find('span').text(this.options.content);
		},
		show: function( opts ){
			var self = this;

			this.$super('show', opts);

			if(this.options.duration){
				clearTimeout(this.timer);
				
				this.timer = setTimeout(function(){
					self.hide();
				}, this.options.duration);
			}
		},
	}, true);
})(Zepto, pro);

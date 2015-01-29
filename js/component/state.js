;(function($){
	$.extend($.fn, {
		// 有点击态的按钮
		active: function(fn, className){
			className = className || 'jmu-active';
			$.each( this, function( i, el ) {
				var $el = $(el);

				$el.addClass(className);
				$el[0].offsetWidth;		// repaint

				setTimeout(function(){
					$.isFunction( fn ) && fn.apply( $el, [].slice.call( arguments, 1 ) );
					$el.removeClass(className);
				}, 50);
			});
		},
		// 状态切换的按钮
		change: function(className, fn){
			$.each( this, function( i, el ) {
				var $el = $(el);

				$el.toggleClass(className);

				$.isFunction( fn ) && fn.apply( $el, [].slice.call( arguments, 1 ) );
			});
		}
	});
})(Zepto);
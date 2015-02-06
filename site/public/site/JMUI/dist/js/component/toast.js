/**
 * Copyright (c) 2014 Tencent AlloyTeam, All rights reserved.
 * http://www.AlloyTeam.com/
 * Code licensed under the BSD License:
 * http://www.AlloyTeam.com/license.txt
 * 
 * @author  Yussicahe
 * @description toast组件
 */

;(function ($, JMU) {
	JMU.defineComponent('Toast', {
		options: {
			animation: true,
			preventScroll: true,
			state: 'warning',    // 三种状态 warning|tips|success，参见 http://waltz.cdc.com/mqq.html#3539
			content: '',
			duration: 2000
		},
		template: '<div class="jmu-toast jmu-no-wrap">\
				       <i class="jmu-icon-warning"></i>\
				       <span class="jmu-content"></span>\
				   </div>',
		state: 'warning',
		_render: function(){
			var options = this.options;

			this.$el.find('.jmu-icon-' + this.state).removeClass('jmu-icon-' + this.state).addClass('jmu-icon-' + options.state);
			this.$el.find('.jmu-content').text(options.content);

			this.state = options.state;
		}
	});
})(Zepto, JMU);

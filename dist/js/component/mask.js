/**
 * Copyright (c) 2014 Tencent AlloyTeam, All rights reserved.
 * http://www.AlloyTeam.com/
 * Code licensed under the BSD License:
 * http://www.AlloyTeam.com/license.txt
 * 
 * @author  Yussicahe
 * @description mask组件
 */

;(function ($, JMU) {
	JMU.defineComponent('Mask', {
		options: {
			animation: true,
            tapHide: true,
			preventScroll: true,
		},
		template: '<div class="jmu-mask"></div>',
		_bindEvents: function(){
            var self = this;

            var options = this.options;

            this.$el.on('tap', function () {
            	if (options.tapHide !== false) {
                    var relatedComponent = options.relatedComponent;

					if (relatedComponent && $.isFunction(relatedComponent.hide)) {
						relatedWidget.hide();
					}

                    if ($.isFunction(options.tapHide)) {    // tapHide支持回调形式
                        options.tapHide();
                    }

					self.hide();
				}
			});
        }
	});
})(Zepto, JMU);
(function($, JMU) {
    JMU.Component('Range', {
        options: {
            min: 1,      // 最小
            max: 100,    // 最大
            step: 1,     // 步长
            value: 50,   // 默认值
            onChange: function (){}, // 鼠标拖动按钮结束后触发
            onInput: function (){}   // 鼠标拖动按钮时持续触发
        },

        _init: function (el, opts){
            this.$super('_init', el, opts);

            this._render();
        },
        _render: function(){
            var options = this.options;  
            this._setRange(options);          
        },

        _setRange: function (options){
            var $range = this.$el.find('input[type="range"]'); 
            $range.attr('min', options.min);
            $range.attr('max', options.max);
            $range.attr('step', options.step);
            $range.attr('value', options.value);
        },

        _bindEvents: function(){
            var self = this;
            var $range = this.$el.find('input[type="range"]');
            var $val =  this.$el.find('.jmu-range-val');
            $range.on('input', function(e){
                $val.text($range.val());
                self.options.onInput();
            });
             $range.on('change', function(e){
                self.options.value = $(this).val();
                self.options.onChange();
            });
        },

        changeRange: function (range){
            //                 
        }
    });
})(Zepto, JMU);

(function($, pro) {
    pro.createWidget('Progress', {
        options: {
            type: 'normal',   
            color: 'green',   
            content: ''
        },

        _init: function (el, opts){
            this.$super('_init', el, opts);

            this._render();
        },
        _render: function(){
            var options = this.options;  
            this._setProgress(options);          
        },

        _setProgress: function (options){
            var deg = options.percentage / 100 * 360;
            this.$el.find('.progress-size-total').text(options.total);
            this.$el.find('.progress-size-curr').text((options.total * options.percentage / 100).toFixed(2));
            this.$el.find('.progress-bar').width(options.percentage + '%');
            this.$el.find('.progress-mask').height(100 - options.percentage + '%');
            this.$el.find('.progress-number').text(options.percentage);  

            if (deg <= 180) {
                // 小于 180 旋转右半圆
                 this.$el.find('.jmu-progress-right').css('transform', "rotate(" + deg + "deg)");
                 this.$el.find('.jmu-progress-left').css('transform', "rotate(0deg)");
            } else {
                // 大于 180 旋转左半圆
                 this.$el.find('.jmu-progress-right').css('transform', "rotate(180deg)");
                 this.$el.find('.jmu-progress-left').css('transform', "rotate(" + (deg - 180) + "deg)");
            };
        },

        _bindEvents: function(){
            this.$el.on('tap', '.action-cancle', function(e){
                // TODO
                console.log(1)
            });
        },

        changeProgress: function (percentage){
            var options = this.options;
            options.percentage = percentage;

            this._setProgress(options);         
        }
    });
})(Zepto, pro);

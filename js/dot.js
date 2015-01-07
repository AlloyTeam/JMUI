;(function( $, pro ) {
    pro.createWidget( 'Dot', {
        options: {
            type: 'normal',   // normal, new, num
            color: 'red',   // red 或 blue
            content: '',    // New红点和数字红点需要指定content
            css: null   // 样式，可以自由控制红点的位置和大小，默认红点在容器的右上角
        },
        tpl: '<div></div>',
        _render: function(){
            var options = this.options;
            
            this.$el.removeClass().addClass('ui-dot-' + options.type + ' ' + 'ui-dot-' + options.color).text(options.content);

            if(options.css){
                this.$el.css(options.css);
            }else{
                this.$el.addClass('ui-dot-tr');     // 位置默认在容器的右上角
            }
        }
    });
})(Zepto, pro);

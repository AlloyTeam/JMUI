(function( $, JMU ) {
    JMU.defineComponent( 'Dot', {
        options: {
            type: 'normal', // normal, new, num
            color: 'red',   // red 或 blue
            content: '',    // New 红点和数字红点需要指定 content
            css: null       // 样式，可以自由控制红点的位置和大小，默认红点在容器的右上角
        },
        template: '<div></div>',
        _render: function(){
            var options = this.options;
            
            this.$el.removeClass().addClass('jmu-dot-' + options.type + ' ' + 'jmu-dot-' + options.color).text(options.content);

            if(options.css){
                this.$el.css(options.css);
            }else{
                this.$el.addClass('jmu-dot-tr');     // 位置默认在容器的右上角
            }
        }
    });
})(Zepto, JMU);

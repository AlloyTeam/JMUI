(function( $, JMU ) {
    JMU.defineComponent( 'TextLoading', {
        options: {
            preventScroll: true,
            content: ''
        },
        template: '<div class="jmu-text-loading">\
                <div class="loading" data-color="255,255,255" data-size="36"></div>\
                <div class="content jmu-color-white"></div>\
            </div>',
        _render: function(){
            var options = this.options;
            
            this.$el.find('.loading').loading('show');

            this.$el.find('.content').html(options.content);
        }
    }, true);
})(Zepto, JMU);

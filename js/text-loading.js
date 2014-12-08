(function( $, pro ) {
    pro.createWidget( 'TextLoading', {
        options: {
            preventScroll: true,
            content: ''
        },
        tpl: '<div class="ui-text-loading">\
                <div class="loading" data-color="255,255,255" data-size="36"></div>\
                <div class="content ui-color-white"></div>\
            </div>',
        _render: function(){
            var options = this.options;
            
            this.$el.find('.loading').loading('show');

            this.$el.find('.content').html(options.content);
        }
    }, true);
})(Zepto, pro);

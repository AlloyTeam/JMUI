(function( $, pro ) {
    pro.createWidget( 'PageLoading', {
        options: {
            content: ''
        },
        tpl: '<div class="ui-page-loading">\
                <div class="loading"></div>\
                <div class="content"></div>\
            </div>',
        _render: function(){
            var options = this.options;
            
            this.$el.find('.loading').loading('show');

            this.$el.find('.content').html(options.content);
        }
    }, true);
})(Zepto, pro);

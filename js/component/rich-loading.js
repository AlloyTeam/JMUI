(function( $, pro ) {
    pro.createWidget( 'RichLoading', {
        options: {
            preventScroll: true,
            content: '',
            onClose: $.emptyFunction
        },
        tpl: '<div class="jmu-rich-loading">\
                <div class="loading" data-color="255,255,255" data-size="36"></div>\
                <div class="jmu-no-wrap content"></div>\
                <div class="jmu-icon-close btn"></div>\
            </div>',
        _render: function(){
            var options = this.options;
            
            this.$el.find('.loading').loading('show');

            this.$el.find('.content').html(options.content);
        },
        _bindEvents: function(){
            var self = this;

            this.$el.on('tap', '.btn', function(e){
                var $btn = $(e.currentTarget);

                $btn.active(function(){
                    self.options.onClose();
                    self.hide();    // 点击后隐藏dialog
                });
            });
        }
    }, true);
})(Zepto, pro);

;(function( $, pro ) {
    pro.createWidget( 'Dialog', {
        options: {
            mask: true,
            animation: true,
            tapHide: true,
            preventScroll: true,
            title: '提示',
            content: '',
            btnText: ['取消', '确定'],
            btnHandle: []
        },
        tpl: '<div class="ui-dialog">\
                <div class="body ui-color-black">\
                    <div class="title"></div>\
                    <div class="content"></div>\
                </div>\
                <div class="btns ui-border-1px ui-color-blue">\
                    <div class="btn"></div>\
                    <div class="btn ui-border-1px"></div>\
                </div>\
            </div>',
        _render: function(){
            var options = this.options;
            if(options.title){
                this.$el.find('.title').text(options.title).css('display', 'block');
            }else{
                this.$el.find('.title').css('display', 'none');
            }
            this.$el.find('.content').html(options.content);
            this.$el.find('.btn:nth-child(1)').text(options.btnText[0]);
            if(options.btnText.length > 1){
                this.$el.find('.btn:nth-child(2)').text(options.btnText[1]).css('display', 'block');
            }else{
                this.$el.find('.btn:nth-child(2)').css('display', 'none');
            }
        },
        _bindEvents: function(){
            var self = this;

            this.$el.on('tap', '.btn', function(e){
                var $btn = $(e.currentTarget);

                $btn.active(function(){
                    self.hide();    // 点击后隐藏dialog

                    // 防止dialog隐藏动画和其他渲染一起出现卡顿
                    setTimeout(function(){
                        var fn = self.options.btnHandle[$btn.index()];
                        $.isFunction( fn ) && fn();
                    }, 0); 
                });
            });
        },
        show: function( opts ){
            if(!this.$el){
                this._create();
                this._render();
            }

            if($.env.isPoorDevice){
                this.$el.css('top', window.scrollY + window.innerHeight/2);
            }
            this.$el.addClass('js-before-show');

            this.$super('show', opts);
        },
        hide: function(){
            this.$el.removeClass('js-before-show');

            this.$super('hide');
        }
    }, true);
})(Zepto, pro);

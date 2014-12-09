(function( $, pro ) {
    pro.createWidget( 'Lazyload', {
        options: {
            attribute: 'data-lazy',

            viewWidth: window.innerWidth*2,
            viewHeight: window.innerHeight*2,   // 默认懒加载为两屏
            
            handler: function($el, src){
                var img;

                if(src){
                    if($el[0].tagName.toLowerCase() == 'img'){
                        img = $el[0];
                    }else{
                        img = $('img', $el)[0];
                    }

                    if(img){
                        img.onload = function(){
                            $el.addClass('js-loaded');
                        };

                        img.src = src;
                    }
                }
            },

            defer: 200
        },
        _init: function(el, opts){
            this.$super('_init', el, opts);

            this.$scrollEl = this.$container;
            this.$container = $.isWindow(this.$scrollEl[0])? $('body') : this.$scrollEl;

            this._bindEvents();
        },
        _bindEvents: function(){
            this._debounceLoad = $.debounce($.proxy(this.startLoad, this), this.options.defer, false);

            this.$scrollEl.on('scroll', this._debounceLoad);

            $(window).on('resize', this._debounceLoad);
        },
        startLoad: function(){
            var $container = this.$container,
                attribute = this.options.attribute,
                handler = this.options.handler;

            var $els = $('[' + attribute + ']', $container);

            var flag = false;
            for(var i = 0, l = $els.length; i < l; i++){
                var el = $els[i],
                    $el = $(el);

                if(!$el.attr('skip-load') && $el.isInView(this.options.viewWidth, this.options.viewHeight)){
                    handler($el, $el.attr(attribute));
                    $el.removeAttr(attribute);
                    
                    flag = true;
                }else if(flag){
                    break;
                }
            }
        }
    });
})(Zepto, pro);

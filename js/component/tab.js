(function( $, pro ) {
    /*
    *   Tab 组件
    *
    *   使用示例：
    *    $("#id").tab({
    *       $el: '.jmu-tab',//tab item 父层通常为ul
    *       relateSelector:[], //可选，表示tab关联的下面的容器，可用data-target="#id1"写在HTML中
    *       onSwitchTab: function(index,item){} //监听tab切换函数,index:第几个tab; item: 当前tab
    *   })
    *
    *   样式需引入tab.css 
    */
    var activeClass = 'js-active';
    
    pro.createWidget( 'Tab', {
        options: {
            content: [],
            currentIndex: 0,
            relateSelector: [],
            onSwitchTab: $.emptyFunction
        },
        tpl: {
            main: '<ul class="jmu-tab"></ul>',
            ul: '<% for(var i = 0, l = list.length; i < l; i++){ %>\
                    <li class="jmu-border-1px item"><%=list[i]%></li>\
                <% } %>'
        },
        _init: function(el, opts){
            var self = this;

            this.$super('_init', el, opts);

            /* 支持在HTML中通过data-target='#id'来关联相关容器节点
             * 此时可以不传relateSelector
             * by gc
             */
            if(this.options.relateSelector.length === 0){
                var tabItems = this.$el.children();
                $.each(tabItems, function(index, item){
                    var relateItem = $($(item).data('target') || '');
                    self.options.relateSelector[index] = relateItem;
                });

            }else{
                $.each(this.options.relateSelector, function(index, item){
                    if(typeof item === 'string'){
                        self.options.relateSelector[index] = $(item);
                    }
                });
            }

        }, 
        _render: function(){
            var options = this.options;

            //兼容固定内容的tab，用于优先展示tab的情景，此时可不传content
            if(options.content.length > 0){
                this.$el.html($.template(this.tpl.ul, { list : options.content }));
            }

            this.switchTab();
        },
        _bindEvents: function(){
            var self = this;

            this.$el.on('tap', '.item', function(e){
                var $item = $(e.currentTarget),
                    index = $item.index();

                self.switchTab(index);

                //暴露当前第几个tab，以及tab节点给订阅者使用
                self.options.onSwitchTab(index, e.currentTarget);
            });
        },
        switchTab: function(index){
            var options = this.options;

            if(index === undefined){
                index = options.currentIndex;
            }

            var $item = $(this.$el.children()[index]);
            if(!$item.hasClass(activeClass)){
                // tab自身切换
                this.$el.find('.' + activeClass).removeClass(activeClass);
                $item.addClass(activeClass);

                // 与tab对应的容器切换
                options.relateSelector[options.currentIndex].hide();
                options.relateSelector[index].show();

                options.currentIndex = index;
            }   
        }
    });
})(Zepto, pro);

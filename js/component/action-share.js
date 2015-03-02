;(function( $, JMU ) {
    JMU.defineComponent( 'ActionShare', {
        options: {
            mask: true,
            animation: true,
            tapHide: true,
            preventScroll: true,
            content: '',
            btnHandle: []
        },
        template: {
            main: '<div class="jmu-action-sheet">\
                    <div class="sheet-title jmu-border-1px border-bottom">分享到:</div>\
                    <ul class="content"></ul>\
                    <div class="jmu-color-blue btn btn-cancel" data-cmd="as-cancel" data-dismiss="true">取消</div>\
                </div>',
            ul: '<% for(var i = 0, l = list.length; i < l; i++){\
                      if(typeof(list[i]) === "string"){\
                 %>\
                      <li class="jmu-color-blue btn" data-dismiss="true"><%=list[i]%></li>\
                      <% }else{ %>\
                      <li <%=list[i].id ? "id="+list[i].id : ""%> class="jmu-color-blue btn <%=list[i].className ? list[i].className : ""%>" data-dismiss="true" <%=list[i].cmd ? "data-cmd="+list[i].cmd : ""%> ><%=list[i].value ? list[i].value : ""%></li>\
                      <% }\
                } %>'
        }, 
        _render: function(){
            var options = this.options;

            if($.isArray(options.content)){
                this.$el.find('.content').html($.template(this.template.ul, { list : options.content }));
            }else{
                this.$el.find('.content').html(options.content);
            } 
        },
        _bindEvents: function(){
            var self = this;

            this.$el.on('tap', '.btn', function(e){
                var $btn = $(e.currentTarget);
                var command = $btn.data('cmd');

                $btn.active(function(){
                    var fn = null;
                    var index = -1;
                    if(command === 'as-cancel'){
                        index = self.$el.find('.content').children().length;
                    }else{
                        index = $btn.index();
                    }
                   
                    if($btn.data('dismiss')){
                        self.hide();    // 点击后隐藏action-sheet
                    } 

                    if(self.options.btnHandle.length > 0){
                        fn = self.options.btnHandle[index];
                        $.isFunction( fn ) && fn();
                    } else if($.isFunction( self.options[command] )){
                        self.options[command]();
                    }
                });
            });
        }
    });
})(Zepto, JMU);

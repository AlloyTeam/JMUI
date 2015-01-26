/**
 * Copyright (c) 2014 Tencent AlloyTeam, All rights reserved.
 * http://www.AlloyTeam.com/
 * Code licensed under the BSD License:
 * http://www.AlloyTeam.com/license.txt
 * 
 * @author  Yussicahe
 * @description dialog组件
 */

 ;(function ($, JMU) {
    JMU.defineComponent('Dialog', {
        options: {
            mask: true,
            animation: true,
            tapHide: true,
            preventScroll: true,
            showCloseBtn: false,
            title: '提示',
            content: '',
            btnText: ['取消', '确定'],
            btnHandle: []
        },
        template: '<div class="jmu-dialog">\
                <div class="body jmu-color-black">\
                    <div class="title"></div>\
                    <div class="content"></div>\
                </div>\
                <div class="btns jmu-border-1px jmu-color-blue">\
                    <div class="btn"></div>\
                    <div class="btn jmu-border-1px"></div>\
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
        }
    });
})(Zepto, JMU);

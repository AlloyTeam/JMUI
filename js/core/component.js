/**
 * Copyright (c) 2014 Tencent AlloyTeam, All rights reserved.
 * http://www.AlloyTeam.com/
 * Code licensed under the BSD License:
 * http://www.AlloyTeam.com/license.txt
 * 
 * @author  Yussicahe
 * @description 定义组件基类Component
 */

 ;(function ($, JMU) {
    /*
     * @class Component
     * @description 组件的基类Component
     */
    function Component() {}

    Component.prototype = {
        /**
         * @property {object} 组件默认配置选项
         */
        options: {},
        /**
         * @property {string|object} 组件模板
         */
        template: '',
        /**
         * @property {boolean} 组件是否显示
         */
        isShow: false,
        /*
         * @method setOptions
         * @description 设置组件配置选项
         * @param {object} 配置选项
         */
        setOptions: function (options) {
            $.extend(this.options, options);
        },
        /**
         * @method _init
         * @description 组件初始化
         * @param object 组件的容器节点
         */
        _init: function (container) {
            this.$container = $(container || document.body);
        },
        /*
         * @method _create
         * @description 创建组件的DOM节点
         */
        _create: function () {
            var options = this.options || {},
                $el = options.$el,
                template = this.template || '';

            if ($el) {    // 组件DOM已经存在的情况
                this.$el = typeof $el === 'string'? $($el, this.$container) : $el;    // $el可以是selector
            } else {    // 不存在则通过模板创建一个
                this.$el = $(typeof template === 'string'? template : template.main);    // 模板如果是对象，则以main来创建组件
            }

            // 将组件添加到DOM中
            this.$container.append(this.$el);
            
            this._bindEvents();
        },
        /*
         * @method _render
         * @description 渲染组件
         */
        _render: JMU.emptyFunction,
        /*
         * @method _bindEvents
         * @desc 给组件绑定相应的事件
         */
        _bindEvents: function () {
            // 需要的情况下阻止掉页面滚动
            if (this.options.preventScroll) {
                this.$el.on('touchmove', JMU.preventDefault);
            }
        },
        /*
         * @method show
         * @description 显示组件
         */
        show: function (options) {
            var self = this;

            this.setOptions(options);

            if (!this.$el) {
                this._create();
            }
            
            this._render();

            if (this.isShow) {
                return;
            }

            this.isShow = true;

            options = this.options;

            // 是否有遮罩
            if (options.mask && JMU.Mask) {
                $('body').mask('show', {
                    tapHide: options.tapHide,
                    relatedComponent: this    // tapHide为true时点击遮罩同时会隐藏组件
                });
            }

            // 显示之前加的class
            this.$el.addClass('jmu-before-show');

            // 是否有动画
            if (options.animation) {
                this.$el.show().addClass('jmu-effect');
                this.$el[0].offsetWidth;    // repaint
            } else {
                this.$el.removeClass('jmu-effect').show();
            }

            this.$el.off('webkitTransitionEnd');
            this.$el.addClass('jmu-show');

            // 是否显示一段时间后自动隐藏
            if(options.duration){
                clearTimeout(this.hideTimer);
                
                this.hideTimer = setTimeout(function(){
                    self.hide();
                }, options.duration);
            }
        },
        /*
         * @method hide
         * @description 隐藏组件
         */
        hide: function(options){
            var self = this;

            this.setOptions(options);

            if (!this.isShow) {
                return;
            }

            this.isShow = false;

            options = this.options;

            this.$el.removeClass('jmu-before-show');

            // 是否有动画
            if (options.animation) {
                this.$el.one('webkitTransitionEnd', function () {
                    self.$el.hide();
                });
            } else {
                this.$el.hide();
            }

            this.$el.removeClass('jmu-show');

            // 是否有遮罩
            if (options.mask && JMU.Mask) {
                $('body').mask('hide');
            }
        }
    };

    JMU.Component = Component;
})(Zepto, JMU);
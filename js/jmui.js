/**
 * Copyright (c) 2014 Tencent AlloyTeam, All rights reserved.
 * http://www.AlloyTeam.com/
 * Code licensed under the BSD License:
 * http://www.AlloyTeam.com/license.txt
 * 
 * @file JMUI核心js
 * @author  Yussicahe yussicahe@gmail.com
 */

;(function ($) {
	var DATA_PREFIX = 'jmu';		// data存储前缀

	/**
	 * @func attributeData 
	 * @desc 从DOM节点上获取所有"data-*"属性
	 * @param object DOM节点
	 * @returns {object} "data-*"属性的键值对
	 */
	function attributeData(node) {
		var store = {};

		$.each(node.attributes || [], function (i, attr) {
		  	if (parseInt(attr.name.indexOf('data-'), 10) === 0) {
		    	store[$.camelCase(attr.name.replace('data-', ''))] = $.zepto.deserializeValue(attr.value);
		    }
		});

		return store;
	}

	/**
	 * @function zeptolize 
	 * @description 将组件挂到$.fn上，便于调用
	 * @param {string} 组件名
	 */
	function zeptolize(name) {
	    var key = $.camelCase(name.substring(0, 1).toLowerCase() + name.substring(1)),
	        old = $.fn[key];

        /**
         * @function 
         * @description 调用组件
         * @param {object} 组件配置选项
         * @param {string} 组件方法名
         * @returns {*} 组件实例或者相应方法的返回值
         */
	    $.fn[key] = function (options, func) {
	        var args,
	            ret,
	            component,
	            dataName = DATA_PREFIX + '-' + key;

	        if (typeof options === 'string') {
                args = [].slice.call(arguments, 1);
	        	func = options;
                options = {};
	        } else {
                args = [].slice.call(arguments, 2);
            }

	        $.each(this, function (i, el) {
	            // 尝试从data中取组件实例
	            component = $(el).data(dataName);

	            if (typeof component === 'undefined') {
                    var attrOptions = attributeData(el);

	            	component = new JMU[name](el, $.extend({}, options, attrOptions));    // 无实例则创建一个

	            	$(el).data(dataName, component);
	            } else if (options) {    // 更新组件的配置选项
	            	component.setOptions(options);
	            }

	            if (typeof func === 'undefined') {    // 未指定方法，返回组件实例
	                ret = component;

	                return false;    // 断开循环
	            } else {    // 调用组件指定方法
                    func = component[func];

	                // 如果组件无指定方法，抛出错误信息
	                if (!$.isFunction(func)) {
	                    throw new Error(name + ' has no such method "' + func + '".');
	                }

	                ret = func.apply(component, args);

	                // 如果是get性质的方法，断开循环
	                if (typeof ret !== 'undefined') {
	                    return false;
	                }
	            }
	        });

	        return typeof ret !== 'undefined'? ret : this;
	    };

	    // NO CONFLICT
	    $.fn[key].noConflict = function () {
	        $.fn[key] = old;
	        return this;
	    };
	}

    window.JMU = {
        /**
         * @function emptyFunction
         * @description 空函数
         */
        emptyFunction: function () {},
        /**
         * @function preventDefault
         * @description 阻止事件的默认行为
         * @param {object} 事件对象e
         */
        preventDefault: function (e) {
            e = e || window.event;
            e.preventDefault();
        },
    	/**
         * @function defineComponent
         * @description 定义组件
         * @param {string} 组件名
         * @param {object} 组件原型
         * @param {class} 组件的父类
         * @returns {class} 组件类
         */
	    defineComponent: function (name, object, superClass) {
	        if (!$.isFunction(superClass)) {
	            superClass = JMU.Component;    // 默认基类为Component
	        }

            /**
             * @class
             * @description 组件类
             * @param object 组件的容器节点
             * @param {object} 组件配置选项
             */
	        function subClass(container, options) {
                // 初始化组件
	            this._init(container, options);
	        }

	        subClass.superClass = superClass;
	        subClass.prototype = Object.create(superClass.prototype);

            /**
             * @function $super
             * @description 调用父类的方法
             * @param {string} 方法名
             * @returns {*} 方法的返回值
             */ 
	        object.$super = function (name) {
	            var func = superClass.prototype[name];
	            return $.isFunction(func) && func.apply(this, [].slice.call(arguments, 1));
	        };

	        $.extend(subClass.prototype, object);

        	JMU[name] = subClass;
        	zeptolize(name);

	        return subClass;
	    }
    };
})(Zepto);
;/**
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
        _init: function (container, options) {
            this.$container = $(container || document.body);

            // 设置组件配置选项
            this.setOptions(options);

            this._create();
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

                this.$container.append(this.$el);    // 将组件添加到DOM中
            }

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
})(Zepto, JMU);;;(function($){
    function bounceFix() {
        $.isBounceFix = true;

        // fix by jdochen
        // 为兼容后期生成的节点，使用委托方式绑定
        $(document)
        .on('touchmove', '[data-bouncefix],[data-scrollable]', function (e) {
            var el = e.currentTarget,
                clientHeight = el.clientHeight,
                scrollHeight = el.scrollHeight;

            if(scrollHeight <= clientHeight){
                e.preventDefault();
            }
        })
        .on('touchstart', '[data-scrollable]', function (e) {
            var el = e.currentTarget,
                scrollTop = el.scrollTop,
                clientHeight = el.clientHeight,
                scrollHeight = el.scrollHeight;

            if(scrollHeight > clientHeight){
                if ( scrollTop <= 0 ) {
                    el.scrollTop = 1;
                }

                if ( scrollTop >= scrollHeight - clientHeight ){
                    el.scrollTop = scrollHeight - clientHeight - 1;
                }
            }
        });
    }

    // only for ios6+
    if( $.os.ios && $.os.version >= '6' ) {
        $('body').addClass('jmu-bounce-fix');
        bounceFix();
    }
})(Zepto);
;;(function($){
    $.extend($, {
        holder: function(){
            var canvas = $('<canvas></canvas>')[0],
                context = canvas.getContext('2d'),
                imgs = $('img[data-holder]');

            for (var i = 0, len = imgs.length; i < len; i++) {
                var size = $(imgs[i]).data('holder'),
                    text = $(imgs[i]).data('holder-text') || $(imgs[i]).data('holder');
                textWidth = context.measureText(text).width,
                    width = size.split('x')[0],
                    height = size.split('x')[1],
                    textX = (width-textWidth) / 2,
                    textY = height / 2;

                canvas.width = +width;
                canvas.height = +height;

                context.fillStyle = getRandomColor(0, 255);
                context.fillRect(0,0,width,height);

                context.fillStyle = '#fff';
                context.fillText(text, textX, textY);

                $(imgs[i]).attr('src', canvas.toDataURL());
                $(imgs[i]).attr('alt', text);
            }

            function getRandomNumber(min, max) {
                return Math.round(Math.random() * (max - min)) +1;
            }
            function getRandomColor(min, max) {
                var r = getRandomNumber(min, max),
                    g = getRandomNumber(min, max),
                    b = getRandomNumber(min, max),
                    a = getRandomNumber(0.1, 0.5),
                    color = 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')';
                return color;
            }
        }
    });
})(Zepto);;(function( $, JMU ) {
    JMU.Component( 'Lazyload', {
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
                            $el.addClass('jmu-loaded');
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
})(Zepto, JMU);
;(function($){
    var domainPrefix = window.location.domain;
    $.extend($, {
        emptyFunction: function(){},
        preventDefault: function(e){
            e.preventDefault();
        },
        template: (function(){
            var cache = {};

            return function(str, data){
                // Figure out if we're getting a template, or if we need to
                // load the template - and be sure to cache the result.
                var fn = cache[str] ||
                        // Generate a reusable function that will serve as a template
                        // generator (and which will be cached).
                    new Function("obj",
                        "var p=[],print=function(){p.push.apply(p,arguments);};" +

                            // Introduce the data as local variables using with(){}
                        "with(obj){p.push('" +

                            // Convert the template into pure JavaScript
                        str
                            .replace(/[\r\t\n]/g, " ")
                            .split("<%").join("\t")
                            .replace(/((^|%>)[^\t]*)'/g, "$1\r")
                            .replace(/\t=(.*?)%>/g, "',$1,'")
                            .split("\t").join("');")
                            .split("%>").join("p.push('")
                            .split("\r").join("\\'") + "');}return p.join('');");

                // Provide some basic currying to the user
                return data ? fn( data ) : fn;
            };
        })(),
        insertStyleSheet: function() {
            var $el = $('<style type="text/css"></style>').appendTo('head');
            return $el[0].sheet;
        },
        debounce: function(func, wait, immediate){
            var timeout;

            return function() {
                var context = this,
                    args = arguments,
                    callNow = immediate && !timeout;

                var later = function() {
                    timeout = null;
                    if (!immediate) {
                        func.apply(context, args);
                    }
                };

                clearTimeout(timeout);

                timeout = setTimeout(later, wait);

                if (callNow) {
                    func.apply(context, args);
                }
            };
        }
    });

    $.extend($.fn, {
        isInView: function(viewWidth, viewHeight){
            var el = $(this)[0];
            if(!el){
                return false;
            }

            var rect = el.getBoundingClientRect();

            if((rect.left > -rect.width && rect.right < (viewWidth || window.innerWidth) + rect.width) &&
                (rect.top > -rect.height && rect.bottom < (viewHeight || window.innerHeight) + rect.height)){
                return true;
            }else{
                return false;
            }
        }
    });
})(Zepto);;;(function( $, JMU ) {
    /*底部浮层组件
    * 
    * 调用示例：by gctang
    * pro.actionSheet.show({
    *   content: ['value1','value2'], // 或以'<li>value1</li><li>value2</li>>'的字符串形式传入
    *   binHandle: [function(){}, function(){}]//需与content一一对应
    *})
    * or 高级配置用法：
    * pro.actionSheet.show({
    *   content: [
    *       {
    *           id: 'testId',//给节点添加自定义id
    *           className: 'jmu-clor-red',//添加自己的样式
    *           value: 'value1' //展示的值
    *           cmd: 'customEvent1' //自定义事件名
    *       },
    *       {
    *           value: 'value2',
    *           cmd: 'customEvent2' //自定义事件名
    *       }
    *    ],
    *    customEvent1: function(){
    *        //自定义事件 do something
    *    }
    * })
    */
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
;(function( $, JMU ) {
    /*底部浮层组件
    * 
    * 调用示例：by gctang
    * pro.actionSheet.show({
    *   content: ['value1','value2'], // 或以'<li>value1</li><li>value2</li>>'的字符串形式传入
    *   binHandle: [function(){}, function(){}]//需与content一一对应
    *})
    * or 高级配置用法：
    * pro.actionSheet.show({
    *   content: [
    *       {
    *           id: 'testId',//给节点添加自定义id
    *           className: 'jmu-clor-red',//添加自己的样式
    *           value: 'value1' //展示的值
    *           cmd: 'customEvent1' //自定义事件名
    *       },
    *       {
    *           value: 'value2',
    *           cmd: 'customEvent2' //自定义事件名
    *       }
    *    ],
    *    customEvent1: function(){
    *        //自定义事件 do something
    *    }
    * })
    */
    JMU.defineComponent( 'ActionSheet', {
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
                    <ul class="content"></ul>\
                    <div class="jmu-color-blue btn btn-cancel" data-cmd="as-cancel" data-dismiss="true">取消</div>\
                </div>',
            ul: '<% for(var i = 0, l = list.length; i < l; i++){\
                      if(typeof(list[i]) === "string"){\
                 %>\
                      <li class="jmu-color-blue jmu-border-1px btn" data-dismiss="true"><%=list[i]%></li>\
                      <% }else{ %>\
                      <li <%=list[i].id ? "id="+list[i].id : ""%> class="jmu-color-blue jmu-border-1px btn <%=list[i].className ? list[i].className : ""%>" data-dismiss="true" <%=list[i].cmd ? "data-cmd="+list[i].cmd : ""%> ><%=list[i].value ? list[i].value : ""%></li>\
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
;/**
 * by jdo
 * 20140625
 * summary : a slider depend on zetpo, which work for mobile
 */
;(function ($, JMU) {
    // 'use strict';

    // if exist
    if ( $([]).carousel ) return;

    // var slice = Array.prototype.slice;

    function slider ( element, options ) {

        var $wrap = this.$wrap = $(element);

        $.extend(this, {
            $inner : $wrap.find('.jmu-carousel-inner'),
            // son item 内部子节点
            $item : $wrap.find('.jmu-carousel-item'),
            // 容器宽度
            // TODO 如果有需要可以做成自适应
            width : $wrap.width(),
            // webkitTransitionDuration
            webkitTransitionDuration : 300,
            // 当前帧数
            current : 0,
            // 当前距离
            currentpos : 0,
            // 激活circle轮播方式，默认激活
            enableCircleLoop : !!1,
            // 激活自动轮播，默认激活
            // 自动轮播激活前提是激活了circle轮播方式
            enableAutoLoop : !!1,
            // 激活触点导航控件
            enableDots : !!1,
            // 自动轮换时长
            autoLoopDuration : 5e3
        }, options);

        // 少于等于一帧时
        // 不启动自动轮播&circle轮播
        if ( this.$item.length <= 1 ) this.enableCircleLoop = this.enableAutoLoop = !!0;
        // initialize ui
        _prepareForUI(this);
        // initialize event
        _prepareForEvt(this);
        //
        _autoLoop.start.call(this);
    }

    slider.prototype.to = function ( index, noanim ) {
        if ( this.current > this.$item.length ) return;
        var that = this;
        // 等待$inner渲染出来
        setTimeout(function() {

            that.$inner.css({
                '-webkitTransitionDuration' : (!noanim ? that.webkitTransitionDuration : 0)+ 'ms',
                '-webkitTransform' : 'translate3d('+-(that.width*(that.current=index))+'px, 0, 0)'
            });
            that.currentpos = -index * that.width;
            // 当无动画切换时，不会触发`webkitTransitionEnd`事件
            // 需在这里更新一下dots ui
            if ( noanim ) _updateDotsUI.call(that);

        }, 0);
    };
    slider.prototype.clear = function () {

        this.$inner.off();

        if ( this.enableDots ) {
            delete this.$dots;
            this.$wrap.find('.jmu-carousel-dots').remove();
        }

        if ( this.enableAutoLoop ) {
            _autoLoop.stop.call(this);
        }

        if ( this.enableCircleLoop ) {
            var len = this.$item.length;
            this.$item.eq(len-1).remove();
            this.$item.eq(len-2).remove();
        }

        this.$inner = null;
        this.$item = null;
        this.$wrap = null;
    };

    // 启动/关闭 自动轮换，便于其他地方调用
    var _autoLoop = function () {

        var timer;

        return {
            start : function () {
                var that = this;
                if (!timer && this.enableCircleLoop && this.enableAutoLoop) {
                    timer = setInterval(function() {
                        that.to(++that.current);
                    }, this.autoLoopDuration);
                }
            },
            stop : function () {
                if ( timer ) {
                    clearInterval(timer);
                    timer = null;
                }
            }
        };
    }();

    // 更新dots控点UI
    var _updateDotsUI = function () {

        var CALSS = 'jmu-carousel-dots-curr';
        return function () {
            this.enableDots && this.$dots.removeClass(CALSS).eq(this.current).addClass(CALSS);
        };

    }();

    // 初始化事件逻辑
    function _prepareForEvt ( that ) {

        var startpos,
            starttime,
            touchstartpos,
            speed = 0.4,
            framesLen = that.$item.length,
            max = that.width*(framesLen-1);

        that.$inner
            .on('touchstart', function (evt) {

                if ( that.current <= -1 || that.current >= framesLen ) return;
                var e = evt.touches[0];
                touchstartpos = startpos = e.pageX;
                starttime = +new Date();

            }, !!1)

            .on('touchmove', function (evt) {

                _autoLoop.stop.call(that);
                if ( that.current <= -1 || that.current >= framesLen ) return;
                var e = evt.touches[0];
                evt.preventDefault();

                if ( that.enableCircleLoop ) {
                    that.currentpos += e.pageX - startpos;
                } else {
                    that.currentpos += (e.pageX - startpos)/(that.currentpos > 0 || that.currentpos < -max ? 3 : 1);
                }

                startpos = e.pageX;

                that.$inner.css({
                    '-webkitTransform' : 'translate3d('+that.currentpos+'px, 0px, 0px)'
                });

            }, !!1)

            .on('touchend', function (evt) {

                if ( that.current <= -1 || that.current >= framesLen ) return;
                // 时间间隔
                ///var duration = +new Date + starttime;
                // 距离
                var distance = evt.changedTouches[0].pageX-touchstartpos;
                // 距离绝对值
                var absdistance = Math.abs(distance);
                // 方向
                var diration = distance/absdistance;
                // 滑动范围[0,lenght-1]
                // [注]当激活enableCircleLoop时
                // isInRange一直为true
                // 表示不受范围控制
                var isInRange = that.enableCircleLoop ? !!1 : diration > 0 ? that.current > 0 : that.current < framesLen-1;
                // 是否滚动过半
                var isHalf = absdistance >= Math.floor(that.width/2);
                // 手指滑动速度
                var ss = absdistance / (+new Date()-starttime);

                // log(that.width)
                // log(ss)
                that.to(function(){
                    var index = that.current - ((speed < ss || isHalf) && isInRange ? diration : 0);
                    // console.log(index)
                    // that.currentpos = -index * that.width;
                    return index;
                }());

            }, !!1)
            .on('webkitTransitionEnd', function () {

                _autoLoop.start.call(that);

                that.$inner.css({'-webkitTransitionDuration' : '0'});

                // 到了第一张的临时节点
                if ( that.current >= framesLen ) {
                    // setClass(delClass(that.$dots, "curr")[that.current = 0], "curr");
                    // that.currentpos = that.current = 0
                    that.$inner.css({
                        '-webkitTransform' : 'translate3d('+(that.currentpos = that.current = 0)+'px, 0px, 0px)'
                    });
                }
                // 到了最后一张的临时节点
                if ( that.current <= -1 ) {
                    // that.current = framesLen-1
                    // that.currentpos = (that.current = framesLen-1) * that.width
                    // setClass(delClass(that.$dots, "curr")[that.current = framesLen-1], "curr");
                    that.$inner.css({
                        '-webkitTransform' : 'translate3d('+(that.currentpos = -(that.current = framesLen-1) * that.width)+'px, 0px, 0px)'
                    });
                }

                _updateDotsUI.call(that);

            }, !!1);

    }

    // 初始化UI（样式/生成节点）
    function _prepareForUI ( that ) {

        var framesLen = that.$item.length;
        var realLen = framesLen+(that.enableCircleLoop?2:0);

        that.$inner.css({
            width : 100 * realLen + '%',
            // display : "-webkit-box"
            display : 'block'
        });

        that.$item.css({
            // width : (100 / realLen) + "%"
            width : that.width + 'px'
        });

        // console.log(that.$item)
        if ( that.enableCircleLoop ) {
            // 用于无限循环轮播
            var firstNode = that.$item[0].cloneNode(1);
            var lastNode = that.$item[framesLen-1].cloneNode(1);
            // IOS5.0+, android3.0+
            if ( lastNode.classList ) {
                lastNode.classList.add('jmu-carousel-item-last');
            } else {
                lastNode.className = 'jmu-carousel-item jmu-carousel-item-last';
            }

            // 插入复制的节点
            that.$inner.append([firstNode, lastNode]);
        }

        // 检测是否激活触点导航控件
        if ( that.enableDots ) {
            // create navigator
            var dotstmpl = '<p class="jmu-carousel-dots">';

            for ( var i = 0; i < framesLen; i++ ) {
                dotstmpl += '<a class="jmu-carousel-dots-i">'+ (i+1) +'</a>';
            }
            dotstmpl += '</p>';

            that.$wrap.append(dotstmpl);
            // collection dots node
            that.$dots = that.$wrap.find('.jmu-carousel-dots-i');
            that.$dots.eq(that.current).addClass('jmu-carousel-dots-curr');
        }
    }

    $.Carousel = slider;

    $.fn.carousel = function (option) {
        return this.each(function () {
            var $this   = $(this);
            var data    = $this.data('carousel');

            if ( option === 'clear' ) {
                if ( data ) {
                    $this.data('carousel', null);
                    data.clear();
                    data = null;
                }
            } else {

                var options = $.extend({}, $this.data(), typeof option == 'object' ? option : {});
                // console.log($this)
                // var action  = typeof option == 'string' ? option : options.slide;

                if ( !data ) {
                    $this.data('carousel', (data = new slider(this, options)));
                }

                if ( typeof option === 'number' ) data.to(option, !!1);
            }
        });
    };
})(Zepto, JMU);;/**
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
;(function( $, JMU ) {
    JMU.defineComponent( 'Dot', {
        options: {
            type: 'normal',   // normal, new, num
            color: 'red',   // red 或 blue
            content: '',    // New红点和数字红点需要指定content
            css: null   // 样式，可以自由控制红点的位置和大小，默认红点在容器的右上角
        },
        template: '<div></div>',
        _render: function(){
            var options = this.options;
            
            this.$el.removeClass().addClass('jmu-dot-' + options.type + ' ' + 'jmu-dot-' + options.color).text(options.content);

            if(options.css){
                this.$el.css(options.css);
            }else{
                this.$el.addClass('jmu-dot-tr');     // 位置默认在容器的右上角
            }
        }
    });
})(Zepto, JMU);
;;(function( $, JMU ) {
    var cssPrefix = '-webkit-';
    var ratio = window.devicePixelRatio == 1? 1 : 2;

    var sheet = $.insertStyleSheet();

    var cache = {}; /* Cache animation rules */
    
    JMU.defineComponent( 'Loading', {
        options: {
            size: 30,               // The width/ height of the spinner

            lineWidth : 2,         // The the width of each lines in px
            lines: 12,            // The number of lines to draw

            color : '158,158,158',      // Must be an RGB string

            roundDuration: 1.6        // Seconds per round
        },
        template: '<canvas></canvas>',
        _addAnimation: function(lines){
            var name = 'jmu-loading-' + lines;

            if (!cache[name] && lines > 0) {

                var rule = '',
                    percentage;

                rule += '@' + cssPrefix + 'keyframes ' + name + '{';
                for (var i = 0; i <= lines; i++) {
                    percentage = i/lines;
                    rule += percentage*100 + '%{' + cssPrefix + 'transform:rotate(' + percentage*360 + 'deg)}';
                }
                rule += '}';

                sheet.insertRule(rule, sheet.cssRules.length);
                
                cache[name] = true;     //缓存
            }

            return name;
        },
        _render: function(){
            if($.env && $.env.isPoorDevice){
                ratio = 1;
            }

            var options = this.options;

            var size = options.size * ratio,
                halfSize = size/2,
                inner = halfSize * (1/3) ,
                outer = halfSize * (2/3) ,
                lineWidth = options.lineWidth * ratio,
                lines = options.lines;

            this.$el.attr({ width: size, height: size });
            var ctx = this.$el[0].getContext('2d');

            ctx.lineWidth = lineWidth;
            ctx.lineCap = 'round';

            ctx.clearRect(0, 0, size, size);

            ctx.translate(halfSize, halfSize);

            for (var i = 0, l = lines; i < l; i++) {
                ctx.rotate(Math.PI * 2 / lines);

                ctx.strokeStyle = 'rgba(' + options.color + ',' + ( i < (1/4 * l) ? 1/4 : i/l )  + ')';

                ctx.beginPath();

                ctx.moveTo(0, inner);
                ctx.lineTo(0, outer);

                ctx.stroke();
            }

            this.$el.css(cssPrefix + 'animation', this._addAnimation(lines) + ' ' + options.roundDuration + 's step-start infinite');

            var style = { width: halfSize, height: halfSize };
            style[cssPrefix + 'transform-origin'] = '0 0';
            style[cssPrefix + 'transform'] = 'scale(0.5)';
            this.$container.css(style);

            // this.$el.appendTo(this.$container);
        }
    });
})(Zepto, JMU);

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
    });
})(Zepto, JMU);

(function( $, JMU ) {
    JMU.defineComponent( 'PageLoading', {
        options: {
            content: ''
        },
        template: '<div class="jmu-page-loading">\
                <div class="loading"></div>\
                <div class="content"></div>\
            </div>',
        _render: function(){
            var options = this.options;

            this.$el.find('.loading').loading('show');

            this.$el.find('.content').html(options.content);
        }
    });
})(Zepto, JMU);


(function( $, JMU ) {
    JMU.defineComponent( 'RichLoading', {
        options: {
            preventScroll: true,
            content: '',
            onClose: $.emptyFunction
        },
        template: '<div class="jmu-rich-loading">\
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
    });
})(Zepto, JMU);

;/**
 * Copyright (c) 2014 Tencent AlloyTeam, All rights reserved.
 * http://www.AlloyTeam.com/
 * Code licensed under the BSD License:
 * http://www.AlloyTeam.com/license.txt
 * 
 * @author  Yussicahe
 * @description mask组件
 */

;(function ($, JMU) {
	JMU.defineComponent('Mask', {
		options: {
			animation: true,
            tapHide: true,
			preventScroll: true,
		},
		template: '<div class="jmu-mask"></div>',
		_bindEvents: function(){
            var self = this;

            var options = this.options;

            this.$el.on('tap', function () {
            	if (options.tapHide !== false) {
                    var relatedComponent = options.relatedComponent;

					if (relatedComponent && $.isFunction(relatedComponent.hide)) {
						relatedWidget.hide();
					}

                    if ($.isFunction(options.tapHide)) {    // tapHide支持回调形式
                        options.tapHide();
                    }

					self.hide();
				}
			});
        }
	});
})(Zepto, JMU);;(function($, JMU) {
    JMU.defineComponent('Progress', {
        options: {
            type: 'normal',   
            color: 'green',   
            content: ''
        },

        _init: function (el, opts){
            this.$super('_init', el, opts);

            this._render();
        },
        _render: function(){
            var options = this.options;  
            this._setProgress(options);          
        },

        _setProgress: function (options){
            var deg = options.percentage / 100 * 360;
            this.$el.find('.progress-size-total').text(options.total);
            this.$el.find('.progress-size-curr').text((options.total * options.percentage / 100).toFixed(2));
            this.$el.find('.progress-bar').width(options.percentage + '%');
            this.$el.find('.progress-mask').height(100 - options.percentage + '%');
            this.$el.find('.progress-number').text(options.percentage);  

            if (deg <= 180) {
                // 小于 180 旋转右半圆
                 this.$el.find('.jmu-progress-right').css('transform', "rotate(" + deg + "deg)");
                 this.$el.find('.jmu-progress-left').css('transform', "rotate(0deg)");
            } else {
                // 大于 180 旋转左半圆
                 this.$el.find('.jmu-progress-right').css('transform', "rotate(180deg)");
                 this.$el.find('.jmu-progress-left').css('transform', "rotate(" + (deg - 180) + "deg)");
            }
        },

        _bindEvents: function(){
            var self = this;
            this.$el.on('tap', '.action-cancle', function(e){
                // TODO
                self.$el.find('.action-cancle').text('已取消');
            });
        },

        changeProgress: function (percentage){
            var options = this.options;
            options.percentage = percentage;

            this._setProgress(options);         
        }
    });
})(Zepto, JMU);
;(function($, JMU) {
    JMU.defineComponent('Range', {
        options: {
            min: 1,      // 最小
            max: 100,    // 最大
            step: 1,     // 步长
            value: 50,   // 默认值
            onChange: function (){}, // 鼠标拖动按钮结束后触发
            onInput: function (){}   // 鼠标拖动按钮时持续触发
        },

        _init: function (el, opts){
            this.$super('_init', el, opts);

            this._render();
        },
        _render: function(){
            var options = this.options;  
            this._setRange(options);          
        },

        _setRange: function (options){
            var $range = this.$el.find('input[type="range"]'); 
            $range.attr('min', options.min);
            $range.attr('max', options.max);
            $range.attr('step', options.step);
            $range.attr('value', options.value);
        },

        _bindEvents: function(){
            var self = this;
            var $range = this.$el.find('input[type="range"]');
            var $val =  this.$el.find('.jmu-range-val');
            $range.on('input', function(e){
                $val.text($range.val());
                self.options.onInput();
            });
             $range.on('change', function(e){
                self.options.value = $(this).val();
                self.options.onChange();
            });
        },

        changeRange: function (range){
            //                 
        }
    });
})(Zepto, JMU);
;;(function($){
  $.fn.scrollTo = function(position, animation){
      var $this = this;
      if(animation === false){
        $this.scrollTop(position);
        return;
      }
      var targetY = position || 0,
      initialY = $this.scrollTop(),
      lastY = initialY,
      delta = targetY - initialY,
      // duration in ms, make it a bit shorter for short distances
      // this is not scientific and you might want to adjust this for
      // your preferences
      speed = Math.min(750, Math.min(1500, Math.abs(initialY-targetY))),
      // temp variables (t will be a position between 0 and 1, y is the calculated scrollTop)
      start, t, y,
      lastTime = 0,
      scrollToTopInProgress = false,
      // use requestAnimationFrame or polyfill
      frame = window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        function(callback){
            //  make a timeStamp to callback,otherwise the arguments(now) will be undefined in ios4,5
            var currTime = new Date().getTime(),
                timeToCall = Math.max(0, 16 - (currTime - lastTime)),
                timeOutId = setTimeout(function() {
                    callback(currTime + timeToCall); 
                }, timeToCall);
            lastTime = currTime + timeToCall;
            return timeOutId;
        },
      cancelScroll = function(){ abort(); };

    // abort if already in progress or nothing to scroll 
    if (scrollToTopInProgress) return;
    if (delta === 0) return;

    // quint ease-in-out smoothing, from
    // https://github.com/madrobby/scripty2/blob/master/src/effects/transitions/penner.js#L127-L136
    function smooth(pos){
      if ((pos/=0.5) < 1) return 0.5*Math.pow(pos,5);
      return 0.5 * (Math.pow((pos-2),5) + 2);
    }

    function abort(){
      $this.off('touchstart', cancelScroll);
      scrollToTopInProgress = false;
    }

    // when there's a touch detected while scrolling is in progress, abort
    // the scrolling (emulates native scrolling behavior)
    $this.on('touchstart', cancelScroll);
    scrollToTopInProgress = true;

    // start rendering away! note the function given to frame
    // is named "render" so we can reference it again further down
    frame(function render(now){
      if (!scrollToTopInProgress) return;
      if (!start) start = now;
      // calculate t, position of animation in [0..1]
      t = Math.min(1, Math.max((now - start)/speed, 0));
      // calculate the new scrollTop position (don't forget to smooth)
      y = Math.round(initialY + delta * smooth(t));
      // bracket scrollTop so we're never over-scrolling
      if (delta > 0 && y > targetY) y = targetY;
      if (delta < 0 && y < targetY) y = targetY;
      // only actually set scrollTop if there was a change fromt he last frame
      if (lastY != y) $this.scrollTop(y);
      lastY = y;
      // if we're not done yet, queue up an other frame to render,
      // or clean up
      if (y !== targetY) frame(render);
        else abort();

      return this;
    });
  };
})(Zepto);;;(function($){
	$.extend($.fn, {
		// 有点击态的按钮
		active: function(fn, className){
			className = className || 'jmu-active';
			$.each( this, function( i, el ) {
				var $el = $(el);

				$el.addClass(className);
				$el[0].offsetWidth;		// repaint

				setTimeout(function(){
					$.isFunction( fn ) && fn.apply( $el, [].slice.call( arguments, 1 ) );
					$el.removeClass(className);
				}, 50);
			});
		},
		// 状态切换的按钮
		change: function(className, fn){
			$.each( this, function( i, el ) {
				var $el = $(el);

				$el.toggleClass(className);

				$.isFunction( fn ) && fn.apply( $el, [].slice.call( arguments, 1 ) );
			});
		}
	});
})(Zepto);;;(function ($, JMU) {
    function Swipe (options) {
        this._init(options);

        this.bindEvents();
    }
    Swipe.prototype = {
        swipeTipsEl: '<div class="jmu-swipe-tips"></div>',
        _init: function (options) {
            this.options = options || {};
            this.swipeDownTips = this.options.swipeDownTips || ['再用点力', '释放刷新', '正在刷新', '刷新成功'];
            this.swipeDownDistance = this.options.swipeDownDistance ? this.options.swipeDownDistance : 100;
            this.swipeDownTipsDistance = this.options.swipeDownTipsDistance ? this.options.swipeDownTipsDistance : (this.swipeDownDistance/2);
            this.$el = this.options.el ? $(this.options.el) : $('body');
            this.$scrollEl = $.os.ios ? $(this.$el) : $(window);

            this.isShow = false;
            this.touch = {
                y1: 0,
                y2: 0,
                dy: 0
            };

            this.state = -1;

            this.$parentEl = this.$el.parent();
            this.$swipeTipsEl = $(this.swipeTipsEl);
            this.$parentEl.css('position', 'relative');
            this.$parentEl.prepend(this.$swipeTipsEl);
        },
        getScrollTop: function () {
            return this.$scrollEl.scrollTop();
        },
        setScrollTop: function (top) {
            this.$scrollEl.scrollTop(top);
        },
        getAtanDistance: function (distance) {
            var self = this;
            return Math.atan(distance / self.swipeDownDistance) * self.swipeDownDistance;
        },
        swipeDown: function (distance) {
            var self = this;
            self.$el.css({
                'transform': 'translate3d(0, ' + distance + 'px, 0)',
                '-webkit-transform': 'translate3d(0, ' + distance + 'px, 0)'
            });

            // tougle swipe tips
            if (distance >= 0) {
                self.state = -1;
            }
            if (distance >= self.swipeDownTipsDistance) {
                self.state = 0;
            }
            if (distance >= self.swipeDownDistance) {
                self.state = 1;
            }
            self.showTips();
        },
        swipeUp: function (distance) {
            var self = this;
            self.$el.animate({
                'transform': 'translate3d(0, ' + distance + 'px, 0)',
                '-webkit-transform': 'translate3d(0, ' + distance + 'px, 0)'
            }, 1000, 'ease');

            if (distance <= self.swipeDownDistance) {
                self.state = 2;
            }
            if (distance === 0){
                self.state = -1;
            }
            self.showTips();
        },
        showTips: function () {
            var self = this;
            var state = self.state;
            if (state > -1) {
                var tips = self.swipeDownTips[state];
                self.$swipeTipsEl.text(tips).show();
                self.$swipeTipsEl.data('state', state);
            } else {
                self.$swipeTipsEl.text('').hide();
            }
        },
        bindEvents: function () {
            var self = this;
            var $el = this.$el;
            $el.on('touchstart', function (e) {
                self.touch.y1 = e.touches[0].pageY;
                self.touch.dy = 0;

                if (self.getScrollTop() === 0) {
                    $el.on('touchmove', moveHandle);
                }
            });
            function moveHandle (e) {
                self.touch.y2 = e.touches[0].pageY;
                self.touch.dy = self.touch.y2 - self.touch.y1;

                if (self.touch.dy > 0) {
                    e.preventDefault();
                }

                // swipe down with finger
                if (self.touch.dy > 0) {
                    // swiping down
                    var distance = self.isShow ? (self.swipeDownDistance + self.touch.dy) : self.touch.dy;

                    // recalculate the distance
                    distance = self.getAtanDistance(distance);

                    self.swipeDown(distance);
                }


            }
            $el.on('touchend', function () {
                $el.off('touchmove', moveHandle);

                self.isShow = (self.touch.dy >= self.swipeDownDistance);

                var distance = self.isShow ? self.swipeDownDistance : 0;

                // recalculate the distance
                distance = self.getAtanDistance(distance);

                self.swipeUp(distance);

                if (self.isShow) {
                    // TODO change state to 3

                    var refreshFunc = self.options.refreshFunc;
                    refreshFunc(function () {
                        // 刷新成功
                        self.state = 3;
                        self.showTips();

                        // 刷新完成
                        setTimeout(function () {
                            self.state = -1;
                            self.swipeUp(0);
                            self.isShow = false;
                        }, 1000);
                    });
                }

            });
        }
    };

    JMU.SwipeDownRefresh = Swipe;
})(Zepto, JMU);;(function( $, JMU ) {
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
    var activeClass = 'jmu-active';

    JMU.defineComponent( 'Tab', {
        options: {
            content: [],
            currentIndex: 0,
            relateSelector: [],
            onSwitchTab: $.emptyFunction
        },
        template: {
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
            // if(this.options.relateSelector.length === 0){
            //     var tabItems = this.$el.children();
            //     $.each(tabItems, function(index, item){
            //         var relateItem = $($(item).data('target') || '');
            //         self.options.relateSelector[index] = relateItem;
            //     });

            // }else{
                $.each(this.options.relateSelector, function(index, item){
                    if(typeof item === 'string'){
                        self.options.relateSelector[index] = $(item);
                    }
                });
            // }

        }, 
        _render: function(){
            var options = this.options;

            //兼容固定内容的tab，用于优先展示tab的情景，此时可不传content
            if(options.content.length > 0){
                this.$el.html($.template(this.template.ul, { list : options.content }));
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
})(Zepto, JMU);
;(function( $, JMU ) {
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
;/**
 * Copyright (c) 2014 Tencent AlloyTeam, All rights reserved.
 * http://www.AlloyTeam.com/
 * Code licensed under the BSD License:
 * http://www.AlloyTeam.com/license.txt
 * 
 * @author  Yussicahe
 * @description toast组件
 */

;(function ($, JMU) {
	JMU.defineComponent('Toast', {
		options: {
			animation: true,
			preventScroll: true,
			state: 'warning',    // 三种状态 warning|tips|success，参见 http://waltz.cdc.com/mqq.html#3539
			content: '',
			duration: 2000
		},
		template: '<div class="jmu-toast jmu-no-wrap">\
				       <i class="jmu-icon-warning"></i>\
				       <span class="jmu-content"></span>\
				   </div>',
		state: 'warning',
		_render: function(){
			var options = this.options;

			this.$el.find('.jmu-icon-' + this.state).removeClass('jmu-icon-' + this.state).addClass('jmu-icon-' + options.state);
			this.$el.find('.jmu-content').text(options.content);

			this.state = options.state;
		}
	});
})(Zepto, JMU);

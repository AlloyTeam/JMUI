;(function($){
	var PREFIX = 'pro';		// data存储前缀

	// Read all "data-*" attributes from a node
	function attributeData(node) {
		var store = {};
		$.each(node.attributes || [], function(i, attr){
		  	if (parseInt(attr.name.indexOf('data-'), 10) === 0)
		    	store[$.camelCase(attr.name.replace('data-', ''))] =
		      		$.zepto.deserializeValue(attr.value);
		});
		return store;
	}

	// 将组件挂到$.fn上
	function zeptolize( name ) {
	    var key = name.substring( 0, 1 ).toLowerCase() + name.substring( 1 ),
	        old = $.fn[ key ];

	    $.fn[ key ] = function( opts, fuc ) {
	        var args = [].slice.call( arguments, (typeof opts === 'string'? 1 : 2)),
	            method = (typeof opts === 'string' && opts) || (typeof fuc === 'string' && fuc),
	            ret,
	            obj;

	        $.each( this, function( i, el ) {
	        	var $el = $( el ),
	        		attr = attributeData( el );

	            // 从data中取，没有则创建一个
	            obj = $el.data( PREFIX + '-' + name );

	            if( obj === undefined ) {
	            	obj = new pro[ name ]( el, $.isPlainObject( opts ) ? $.extend( opts, attr ) : attr );
	            	$el.data( PREFIX + '-' + name, obj );
	            }else {
	            	obj.setOption( opts );
	            }

	            // 取实例
	            if ( method === false ) {
	                ret = obj;
	                return false;    // 断开each循环
	            } else if ( method ) {

	                // 当取的方法不存在时，抛出错误信息
	                if ( !$.isFunction( obj[ method ] ) ) {
	                    throw new Error( 'no such method' );
	                }

	                ret = obj[ method ].apply( obj, args );

	                // 断定它是getter性质的方法，所以需要断开each循环，把结果返回
	                if ( ret !== undefined && ret !== obj ) {
	                    return false;
	                }

	                // ret为obj时为无效值，为了不影响后面的返回
	                ret = undefined;
	            }
	        } );

	        return ret !== undefined ? ret : this;
	    };

	    /*
	     * NO CONFLICT
	     */
	    $.fn[ key ].noConflict = function() {
	        $.fn[ key ] = old;
	        return this;
	    };
	}

    window.pro = {
    	
    	// 创建组件
	    createWidget: function ( name, object, isSingleton, superClass ) {
	        if ( !$.isFunction(superClass) ) {
	            superClass = Widget;	// 默认基类为Widget
	        }

	        function subClass( el, opts ) {
	            this._init( el, opts );
	        }

	        subClass.superClass = superClass;
	        subClass.prototype = Object.create( superClass.prototype );

	        object.$super = function( name ) {
	            var fn = superClass.prototype[ name ];
	            return $.isFunction( fn ) && fn.apply( this, [].slice.call( arguments, 1 ) );
	        };

	        $.extend( subClass.prototype, object );

	        if( isSingleton ) {
	        	pro[ name.substring( 0, 1 ).toLowerCase() + name.substring( 1 ) ] = new subClass();		// 单例的组件直接实例化
	        }else {
	        	pro[ name ] = subClass;
	        	zeptolize( name );
	        } 

	        return subClass;
	    }
    };

    /*
     * @class 基类Widget
     */
    function Widget() {}

    Widget.prototype = {
    	options: {},
    	tpl: '',
    	/*
         * @method _init
         * @desc 组件初始化
         */
    	_init: function( el, opts) {
    		this.$container = $( el || document.body);

    		this.options = $.extend( {}, this.options, opts );

            if(opts && opts.$el){
                //处理已有内容的类型，不需要调用show方法来绑定事件，如Tab 
                /* this.$el = typeof opts.$el === 'string' ? $(opts.$el) : opts.$el; */
                this.$el = $(opts.$el, this.$container);

                this._bindEvents();
            }
    	},
    	/*
         * @method setOption
         * @desc 设置options
         */
    	setOption: function( opts ) {
    		this.options = $.extend( this.options, opts );
    	},
    	/*
         * @method _create
         * @desc 创建组件相应的dom
         */
    	_create: function(){
    		this.$el = $($.isPlainObject(this.tpl)? this.tpl.main : this.tpl).appendTo(this.$container);
    		this._bindEvents();

			if(this.options.preventScroll){
				// fix by jdochen
				// 这里改为是否阻止该wedget默认行为比较合适
				this.$el.on('touchmove', $.preventDefault);
			}
    	},
    	/*
         * @method _render
         * @desc 根据配置项渲染相应的dom
         */
    	_render: $.emptyFunction,
    	/*
         * @method _bindEvents
         * @desc 给组件绑定相应的事件
         */
    	_bindEvents: $.emptyFunction,
    	/*
         * @method show
         * @desc show组件
         */
    	show: function( opts ){
			// var self = this;
			this.setOption( opts );

			if(!this.$el){
				this._create();
				this._render();
			}else if(opts){
				this._render();
			}else if(this.isShow){
				return;
			}

			this.isShow = true;

			// 是否出遮罩
			this.options.mask && pro.mask.show({
				tapHide: this.options.tapHide,
				relatedWidget: this
			});

			// 是否有动画
			if(this.options.animation){
				this.$el.show().addClass('js-effect');
				this.$el[0].offsetWidth;	// repaint
			}else{
				this.$el.removeClass('js-effect').show();
			}

			this.$el.off('webkitTransitionEnd');
			this.$el.addClass('js-show');

			// 是否需要阻止页面滚动
			/*if(this.options.preventScroll){
				$(document).on('touchmove', $.preventDefault);
			}*/
		},
		/*
         * @method hide
         * @desc hide组件
         */
		hide: function(){
			var self = this;

			if(!this.isShow){
				return;
			}

			this.isShow = false;

			if(this.options.animation){
				this.$el.one('webkitTransitionEnd', function(){
					self.$el.hide();
				});
			}else{
				this.$el.hide();
			}

			this.$el.removeClass('js-show');

			this.options.mask && pro.mask.hide();

			/*if(this.options.preventScroll){
				$(document).off('touchmove', $.preventDefault);
			}*/
		}
    };


	// TODO $.env 为业务代码, 需要抽离
	$.env = {};
})(Zepto);



;(function( $, pro ) {
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
    *           className: 'ui-clor-red',//添加自己的样式
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
    pro.createWidget( 'ActionShare', {
        options: {
            mask: true,
            animation: true,
            tapHide: true,
            preventScroll: true,
            content: '',
            btnHandle: []
        },
        tpl: {
            main: '<div class="ui-action-sheet">\
                    <div class="sheet-title ui-border-b">分享到:</div>\
                    <ul class="content"></ul>\
                    <div class="ui-color-blue btn btn-cancel" data-cmd="as-cancel" data-dismiss="true">取消</div>\
                </div>',
            ul: '<% for(var i = 0, l = list.length; i < l; i++){\
                      if(typeof(list[i]) === "string"){\
                 %>\
                      <li class="ui-color-blue btn" data-dismiss="true"><%=list[i]%></li>\
                      <% }else{ %>\
                      <li <%=list[i].id ? "id="+list[i].id : ""%> class="ui-color-blue btn <%=list[i].className ? list[i].className : ""%>" data-dismiss="true" <%=list[i].cmd ? "data-cmd="+list[i].cmd : ""%> ><%=list[i].value ? list[i].value : ""%></li>\
                      <% }\
                } %>'
        }, 
        _render: function(){
            var options = this.options;

            if($.isArray(options.content)){
                this.$el.find('.content').html($.template(this.tpl.ul, { list : options.content }));
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
    }, true);
})(Zepto, pro);

;(function( $, pro ) {
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
    *           className: 'ui-clor-red',//添加自己的样式
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
    pro.createWidget( 'ActionSheet', {
        options: {
            mask: true,
            animation: true,
            tapHide: true,
            preventScroll: true,
            content: '',
            btnHandle: []
        },
        tpl: {
            main: '<div class="ui-action-sheet">\
                    <ul class="content"></ul>\
                    <div class="ui-color-blue btn btn-cancel" data-cmd="as-cancel" data-dismiss="true">取消</div>\
                </div>',
            ul: '<% for(var i = 0, l = list.length; i < l; i++){\
                      if(typeof(list[i]) === "string"){\
                 %>\
                      <li class="ui-color-blue ui-border-1px btn" data-dismiss="true"><%=list[i]%></li>\
                      <% }else{ %>\
                      <li <%=list[i].id ? "id="+list[i].id : ""%> class="ui-color-blue ui-border-1px btn <%=list[i].className ? list[i].className : ""%>" data-dismiss="true" <%=list[i].cmd ? "data-cmd="+list[i].cmd : ""%> ><%=list[i].value ? list[i].value : ""%></li>\
                      <% }\
                } %>'
        }, 
        _render: function(){
            var options = this.options;

            if($.isArray(options.content)){
                this.$el.find('.content').html($.template(this.tpl.ul, { list : options.content }));
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
    }, true);
})(Zepto, pro);

;(function($){
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
        $('body').addClass('js-bounce-fix');
        bounceFix();
    }
})(Zepto);

/**
 * by jdo
 * 20140625
 * summary: a slider depend on zetpo, which work for mobile
 * update: by felixqslai on 20141215
 */


function slider ( element, options ) {

    var $wrap = this.$wrap = $(element);

    $.extend(this, {
        $inner : $wrap.find('.ui-carousel-inner'),
        // son item 内部子节点
        $item : $wrap.find('.ui-carousel-item'),
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
        this.$wrap.find('.ui-carousel-dots').remove();
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

    var CALSS = 'ui-carousel-dots-curr';
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
            lastNode.classList.add('ui-carousel-item-last');
        } else {
            lastNode.className = 'ui-carousel-item ui-carousel-item-last';
        }

        // 插入复制的节点
        that.$inner.append([firstNode, lastNode]);
    }

    // 检测是否激活触点导航控件
    if ( that.enableDots ) {
        // create navigator
        var dotstmpl = '<p class="ui-carousel-dots">';

        for ( var i = 0; i < framesLen; i++ ) {
            dotstmpl += '<a class="ui-carousel-dots-i">'+ (i+1) +'</a>';
        }
        dotstmpl += '</p>';

        that.$wrap.append(dotstmpl);
        // collection dots node
        that.$dots = that.$wrap.find('.ui-carousel-dots-i');
        that.$dots.eq(that.current).addClass('ui-carousel-dots-curr');
    }
}

$.Carousel = slider;

// $.fn.carousel = function (option) {
//     return this.each(function () {
//         var $this   = $(this);
//         var data    = $this.data('carousel');

//         if ( option === 'clear' ) {
//             if ( data ) {
//                 $this.data('carousel', null);
//                 data.clear();
//                 data = null;
//             }
//         } else {
//             var options = $.extend({}, $this.data(), typeof option == 'object' ? option : {});
//             if ( !data ) {
//                 $this.data('carousel', (data = new slider(this, options)));
//             }
//             if ( typeof option === 'number' ) data.to(option, !!1);
//         }
//     });
// };

;(function($){
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
})(Zepto);
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

;(function( $, pro ) {
    pro.createWidget( 'Dot', {
        options: {
            type: 'normal',   // normal, new, num
            color: 'red',   // red 或 blue
            content: '',    // New红点和数字红点需要指定content
            css: null   // 样式，可以自由控制红点的位置和大小，默认红点在容器的右上角
        },
        tpl: '<div></div>',
        _render: function(){
            var options = this.options;
            
            this.$el.removeClass().addClass('ui-dot-' + options.type + ' ' + 'ui-dot-' + options.color).text(options.content);

            if(options.css){
                this.$el.css(options.css);
            }else{
                this.$el.addClass('ui-dot-tr');     // 位置默认在容器的右上角
            }
        }
    });
})(Zepto, pro);

;(function($){
	var PREFIX = 'pro';		// data存储前缀

	// Read all "data-*" attributes from a node
	function attributeData(node) {
		var store = {};
		$.each(node.attributes || [], function(i, attr){
		  	if (parseInt(attr.name.indexOf('data-'), 10) === 0)
		    	store[$.camelCase(attr.name.replace('data-', ''))] =
		      		$.zepto.deserializeValue(attr.value);
		});
		return store;
	}

	// 将组件挂到$.fn上
	function zeptolize( name ) {
	    var key = name.substring( 0, 1 ).toLowerCase() + name.substring( 1 ),
	        old = $.fn[ key ];

	    $.fn[ key ] = function( opts, fuc ) {
	        var args = [].slice.call( arguments, (typeof opts === 'string'? 1 : 2)),
	            method = (typeof opts === 'string' && opts) || (typeof fuc === 'string' && fuc),
	            ret,
	            obj;

	        $.each( this, function( i, el ) {
	        	var $el = $( el ),
	        		attr = attributeData( el );

	            // 从data中取，没有则创建一个
	            obj = $el.data( PREFIX + '-' + name );

	            if( obj === undefined ) {
	            	obj = new pro[ name ]( el, $.isPlainObject( opts ) ? $.extend( opts, attr ) : attr );
	            	$el.data( PREFIX + '-' + name, obj );
	            }else {
	            	obj.setOption( opts );
	            }

	            // 取实例
	            if ( method === false ) {
	                ret = obj;
	                return false;    // 断开each循环
	            } else if ( method ) {

	                // 当取的方法不存在时，抛出错误信息
	                if ( !$.isFunction( obj[ method ] ) ) {
	                    throw new Error( 'no such method' );
	                }

	                ret = obj[ method ].apply( obj, args );

	                // 断定它是getter性质的方法，所以需要断开each循环，把结果返回
	                if ( ret !== undefined && ret !== obj ) {
	                    return false;
	                }

	                // ret为obj时为无效值，为了不影响后面的返回
	                ret = undefined;
	            }
	        } );

	        return ret !== undefined ? ret : this;
	    };

	    /*
	     * NO CONFLICT
	     */
	    $.fn[ key ].noConflict = function() {
	        $.fn[ key ] = old;
	        return this;
	    };
	}

    window.pro = {
    	
    	// 创建组件
	    createWidget: function ( name, object, isSingleton, superClass ) {
	        if ( !$.isFunction(superClass) ) {
	            superClass = Widget;	// 默认基类为Widget
	        }

	        function subClass( el, opts ) {
	            this._init( el, opts );
	        }

	        subClass.superClass = superClass;
	        subClass.prototype = Object.create( superClass.prototype );

	        object.$super = function( name ) {
	            var fn = superClass.prototype[ name ];
	            return $.isFunction( fn ) && fn.apply( this, [].slice.call( arguments, 1 ) );
	        };

	        $.extend( subClass.prototype, object );

	        if( isSingleton ) {
	        	pro[ name.substring( 0, 1 ).toLowerCase() + name.substring( 1 ) ] = new subClass();		// 单例的组件直接实例化
	        }else {
	        	pro[ name ] = subClass;
	        	zeptolize( name );
	        } 

	        return subClass;
	    }
    };

    /*
     * @class 基类Widget
     */
    function Widget() {}

    Widget.prototype = {
    	options: {},
    	tpl: '',
    	/*
         * @method _init
         * @desc 组件初始化
         */
    	_init: function( el, opts) {
    		this.$container = $( el || document.body);

    		this.options = $.extend( {}, this.options, opts );

            if(opts && opts.$el){
                //处理已有内容的类型，不需要调用show方法来绑定事件，如Tab 
                /* this.$el = typeof opts.$el === 'string' ? $(opts.$el) : opts.$el; */
                this.$el = $(opts.$el, this.$container);

                this._bindEvents();
            }
    	},
    	/*
         * @method setOption
         * @desc 设置options
         */
    	setOption: function( opts ) {
    		this.options = $.extend( this.options, opts );
    	},
    	/*
         * @method _create
         * @desc 创建组件相应的dom
         */
    	_create: function(){
    		this.$el = $($.isPlainObject(this.tpl)? this.tpl.main : this.tpl).appendTo(this.$container);
    		this._bindEvents();

			if(this.options.preventScroll){
				// fix by jdochen
				// 这里改为是否阻止该wedget默认行为比较合适
				this.$el.on('touchmove', $.preventDefault);
			}
    	},
    	/*
         * @method _render
         * @desc 根据配置项渲染相应的dom
         */
    	_render: $.emptyFunction,
    	/*
         * @method _bindEvents
         * @desc 给组件绑定相应的事件
         */
    	_bindEvents: $.emptyFunction,
    	/*
         * @method show
         * @desc show组件
         */
    	show: function( opts ){
			// var self = this;
			this.setOption( opts );

			if(!this.$el){
				this._create();
				this._render();
			}else if(opts){
				this._render();
			}else if(this.isShow){
				return;
			}

			this.isShow = true;

			// 是否出遮罩
			this.options.mask && pro.mask.show({
				tapHide: this.options.tapHide,
				relatedWidget: this
			});

			// 是否有动画
			if(this.options.animation){
				this.$el.show().addClass('js-effect');
				this.$el[0].offsetWidth;	// repaint
			}else{
				this.$el.removeClass('js-effect').show();
			}

			this.$el.off('webkitTransitionEnd');
			this.$el.addClass('js-show');

			// 是否需要阻止页面滚动
			/*if(this.options.preventScroll){
				$(document).on('touchmove', $.preventDefault);
			}*/
		},
		/*
         * @method hide
         * @desc hide组件
         */
		hide: function(){
			var self = this;

			if(!this.isShow){
				return;
			}

			this.isShow = false;

			if(this.options.animation){
				this.$el.one('webkitTransitionEnd', function(){
					self.$el.hide();
				});
			}else{
				this.$el.hide();
			}

			this.$el.removeClass('js-show');

			this.options.mask && pro.mask.hide();

			/*if(this.options.preventScroll){
				$(document).off('touchmove', $.preventDefault);
			}*/
		}
    };


	// TODO $.env 为业务代码, 需要抽离
	$.env = {};
})(Zepto);



;(function( $, pro ) {
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
    *           className: 'ui-clor-red',//添加自己的样式
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
    pro.createWidget( 'ActionShare', {
        options: {
            mask: true,
            animation: true,
            tapHide: true,
            preventScroll: true,
            content: '',
            btnHandle: []
        },
        tpl: {
            main: '<div class="ui-action-sheet">\
                    <div class="sheet-title ui-border-b">分享到:</div>\
                    <ul class="content"></ul>\
                    <div class="ui-color-blue btn btn-cancel" data-cmd="as-cancel" data-dismiss="true">取消</div>\
                </div>',
            ul: '<% for(var i = 0, l = list.length; i < l; i++){\
                      if(typeof(list[i]) === "string"){\
                 %>\
                      <li class="ui-color-blue btn" data-dismiss="true"><%=list[i]%></li>\
                      <% }else{ %>\
                      <li <%=list[i].id ? "id="+list[i].id : ""%> class="ui-color-blue btn <%=list[i].className ? list[i].className : ""%>" data-dismiss="true" <%=list[i].cmd ? "data-cmd="+list[i].cmd : ""%> ><%=list[i].value ? list[i].value : ""%></li>\
                      <% }\
                } %>'
        }, 
        _render: function(){
            var options = this.options;

            if($.isArray(options.content)){
                this.$el.find('.content').html($.template(this.tpl.ul, { list : options.content }));
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
    }, true);
})(Zepto, pro);

;(function( $, pro ) {
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
    *           className: 'ui-clor-red',//添加自己的样式
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
    pro.createWidget( 'ActionSheet', {
        options: {
            mask: true,
            animation: true,
            tapHide: true,
            preventScroll: true,
            content: '',
            btnHandle: []
        },
        tpl: {
            main: '<div class="ui-action-sheet">\
                    <ul class="content"></ul>\
                    <div class="ui-color-blue btn btn-cancel" data-cmd="as-cancel" data-dismiss="true">取消</div>\
                </div>',
            ul: '<% for(var i = 0, l = list.length; i < l; i++){\
                      if(typeof(list[i]) === "string"){\
                 %>\
                      <li class="ui-color-blue ui-border-1px btn" data-dismiss="true"><%=list[i]%></li>\
                      <% }else{ %>\
                      <li <%=list[i].id ? "id="+list[i].id : ""%> class="ui-color-blue ui-border-1px btn <%=list[i].className ? list[i].className : ""%>" data-dismiss="true" <%=list[i].cmd ? "data-cmd="+list[i].cmd : ""%> ><%=list[i].value ? list[i].value : ""%></li>\
                      <% }\
                } %>'
        }, 
        _render: function(){
            var options = this.options;

            if($.isArray(options.content)){
                this.$el.find('.content').html($.template(this.tpl.ul, { list : options.content }));
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
    }, true);
})(Zepto, pro);

;(function($){
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
        $('body').addClass('js-bounce-fix');
        bounceFix();
    }
})(Zepto);

/**
 * by jdo
 * 20140625
 * summary: a slider depend on zetpo, which work for mobile
 * update: by felixqslai on 20141215
 */


function slider ( element, options ) {

    var $wrap = this.$wrap = $(element);

    $.extend(this, {
        $inner : $wrap.find('.ui-carousel-inner'),
        // son item 内部子节点
        $item : $wrap.find('.ui-carousel-item'),
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
        this.$wrap.find('.ui-carousel-dots').remove();
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

    var CALSS = 'ui-carousel-dots-curr';
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
            lastNode.classList.add('ui-carousel-item-last');
        } else {
            lastNode.className = 'ui-carousel-item ui-carousel-item-last';
        }

        // 插入复制的节点
        that.$inner.append([firstNode, lastNode]);
    }

    // 检测是否激活触点导航控件
    if ( that.enableDots ) {
        // create navigator
        var dotstmpl = '<p class="ui-carousel-dots">';

        for ( var i = 0; i < framesLen; i++ ) {
            dotstmpl += '<a class="ui-carousel-dots-i">'+ (i+1) +'</a>';
        }
        dotstmpl += '</p>';

        that.$wrap.append(dotstmpl);
        // collection dots node
        that.$dots = that.$wrap.find('.ui-carousel-dots-i');
        that.$dots.eq(that.current).addClass('ui-carousel-dots-curr');
    }
}

$.Carousel = slider;

// $.fn.carousel = function (option) {
//     return this.each(function () {
//         var $this   = $(this);
//         var data    = $this.data('carousel');

//         if ( option === 'clear' ) {
//             if ( data ) {
//                 $this.data('carousel', null);
//                 data.clear();
//                 data = null;
//             }
//         } else {
//             var options = $.extend({}, $this.data(), typeof option == 'object' ? option : {});
//             if ( !data ) {
//                 $this.data('carousel', (data = new slider(this, options)));
//             }
//             if ( typeof option === 'number' ) data.to(option, !!1);
//         }
//     });
// };

;(function($){
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
})(Zepto);
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

;(function( $, pro ) {
    pro.createWidget( 'Dot', {
        options: {
            type: 'normal',   // normal, new, num
            color: 'red',   // red 或 blue
            content: '',    // New红点和数字红点需要指定content
            css: null   // 样式，可以自由控制红点的位置和大小，默认红点在容器的右上角
        },
        tpl: '<div></div>',
        _render: function(){
            var options = this.options;
            
            this.$el.removeClass().addClass('ui-dot-' + options.type + ' ' + 'ui-dot-' + options.color).text(options.content);

            if(options.css){
                this.$el.css(options.css);
            }else{
                this.$el.addClass('ui-dot-tr');     // 位置默认在容器的右上角
            }
        }
    });
})(Zepto, pro);

;(function($){
	var PREFIX = 'pro';		// data存储前缀

	// Read all "data-*" attributes from a node
	function attributeData(node) {
		var store = {};
		$.each(node.attributes || [], function(i, attr){
		  	if (parseInt(attr.name.indexOf('data-'), 10) === 0)
		    	store[$.camelCase(attr.name.replace('data-', ''))] =
		      		$.zepto.deserializeValue(attr.value);
		});
		return store;
	}

	// 将组件挂到$.fn上
	function zeptolize( name ) {
	    var key = name.substring( 0, 1 ).toLowerCase() + name.substring( 1 ),
	        old = $.fn[ key ];

	    $.fn[ key ] = function( opts, fuc ) {
	        var args = [].slice.call( arguments, (typeof opts === 'string'? 1 : 2)),
	            method = (typeof opts === 'string' && opts) || (typeof fuc === 'string' && fuc),
	            ret,
	            obj;

	        $.each( this, function( i, el ) {
	        	var $el = $( el ),
	        		attr = attributeData( el );

	            // 从data中取，没有则创建一个
	            obj = $el.data( PREFIX + '-' + name );

	            if( obj === undefined ) {
	            	obj = new pro[ name ]( el, $.isPlainObject( opts ) ? $.extend( opts, attr ) : attr );
	            	$el.data( PREFIX + '-' + name, obj );
	            }else {
	            	obj.setOption( opts );
	            }

	            // 取实例
	            if ( method === false ) {
	                ret = obj;
	                return false;    // 断开each循环
	            } else if ( method ) {

	                // 当取的方法不存在时，抛出错误信息
	                if ( !$.isFunction( obj[ method ] ) ) {
	                    throw new Error( 'no such method' );
	                }

	                ret = obj[ method ].apply( obj, args );

	                // 断定它是getter性质的方法，所以需要断开each循环，把结果返回
	                if ( ret !== undefined && ret !== obj ) {
	                    return false;
	                }

	                // ret为obj时为无效值，为了不影响后面的返回
	                ret = undefined;
	            }
	        } );

	        return ret !== undefined ? ret : this;
	    };

	    /*
	     * NO CONFLICT
	     */
	    $.fn[ key ].noConflict = function() {
	        $.fn[ key ] = old;
	        return this;
	    };
	}

    window.pro = {
    	
    	// 创建组件
	    createWidget: function ( name, object, isSingleton, superClass ) {
	        if ( !$.isFunction(superClass) ) {
	            superClass = Widget;	// 默认基类为Widget
	        }

	        function subClass( el, opts ) {
	            this._init( el, opts );
	        }

	        subClass.superClass = superClass;
	        subClass.prototype = Object.create( superClass.prototype );

	        object.$super = function( name ) {
	            var fn = superClass.prototype[ name ];
	            return $.isFunction( fn ) && fn.apply( this, [].slice.call( arguments, 1 ) );
	        };

	        $.extend( subClass.prototype, object );

	        if( isSingleton ) {
	        	pro[ name.substring( 0, 1 ).toLowerCase() + name.substring( 1 ) ] = new subClass();		// 单例的组件直接实例化
	        }else {
	        	pro[ name ] = subClass;
	        	zeptolize( name );
	        } 

	        return subClass;
	    }
    };

    /*
     * @class 基类Widget
     */
    function Widget() {}

    Widget.prototype = {
    	options: {},
    	tpl: '',
    	/*
         * @method _init
         * @desc 组件初始化
         */
    	_init: function( el, opts) {
    		this.$container = $( el || document.body);

    		this.options = $.extend( {}, this.options, opts );

            if(opts && opts.$el){
                //处理已有内容的类型，不需要调用show方法来绑定事件，如Tab 
                /* this.$el = typeof opts.$el === 'string' ? $(opts.$el) : opts.$el; */
                this.$el = $(opts.$el, this.$container);

                this._bindEvents();
            }
    	},
    	/*
         * @method setOption
         * @desc 设置options
         */
    	setOption: function( opts ) {
    		this.options = $.extend( this.options, opts );
    	},
    	/*
         * @method _create
         * @desc 创建组件相应的dom
         */
    	_create: function(){
    		this.$el = $($.isPlainObject(this.tpl)? this.tpl.main : this.tpl).appendTo(this.$container);
    		this._bindEvents();

			if(this.options.preventScroll){
				// fix by jdochen
				// 这里改为是否阻止该wedget默认行为比较合适
				this.$el.on('touchmove', $.preventDefault);
			}
    	},
    	/*
         * @method _render
         * @desc 根据配置项渲染相应的dom
         */
    	_render: $.emptyFunction,
    	/*
         * @method _bindEvents
         * @desc 给组件绑定相应的事件
         */
    	_bindEvents: $.emptyFunction,
    	/*
         * @method show
         * @desc show组件
         */
    	show: function( opts ){
			// var self = this;
			this.setOption( opts );

			if(!this.$el){
				this._create();
				this._render();
			}else if(opts){
				this._render();
			}else if(this.isShow){
				return;
			}

			this.isShow = true;

			// 是否出遮罩
			this.options.mask && pro.mask.show({
				tapHide: this.options.tapHide,
				relatedWidget: this
			});

			// 是否有动画
			if(this.options.animation){
				this.$el.show().addClass('js-effect');
				this.$el[0].offsetWidth;	// repaint
			}else{
				this.$el.removeClass('js-effect').show();
			}

			this.$el.off('webkitTransitionEnd');
			this.$el.addClass('js-show');

			// 是否需要阻止页面滚动
			/*if(this.options.preventScroll){
				$(document).on('touchmove', $.preventDefault);
			}*/
		},
		/*
         * @method hide
         * @desc hide组件
         */
		hide: function(){
			var self = this;

			if(!this.isShow){
				return;
			}

			this.isShow = false;

			if(this.options.animation){
				this.$el.one('webkitTransitionEnd', function(){
					self.$el.hide();
				});
			}else{
				this.$el.hide();
			}

			this.$el.removeClass('js-show');

			this.options.mask && pro.mask.hide();

			/*if(this.options.preventScroll){
				$(document).off('touchmove', $.preventDefault);
			}*/
		}
    };


	// TODO $.env 为业务代码, 需要抽离
	$.env = {};
})(Zepto);



;(function( $, pro ) {
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
    *           className: 'ui-clor-red',//添加自己的样式
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
    pro.createWidget( 'ActionShare', {
        options: {
            mask: true,
            animation: true,
            tapHide: true,
            preventScroll: true,
            content: '',
            btnHandle: []
        },
        tpl: {
            main: '<div class="ui-action-sheet">\
                    <div class="sheet-title ui-border-b">分享到:</div>\
                    <ul class="content"></ul>\
                    <div class="ui-color-blue btn btn-cancel" data-cmd="as-cancel" data-dismiss="true">取消</div>\
                </div>',
            ul: '<% for(var i = 0, l = list.length; i < l; i++){\
                      if(typeof(list[i]) === "string"){\
                 %>\
                      <li class="ui-color-blue btn" data-dismiss="true"><%=list[i]%></li>\
                      <% }else{ %>\
                      <li <%=list[i].id ? "id="+list[i].id : ""%> class="ui-color-blue btn <%=list[i].className ? list[i].className : ""%>" data-dismiss="true" <%=list[i].cmd ? "data-cmd="+list[i].cmd : ""%> ><%=list[i].value ? list[i].value : ""%></li>\
                      <% }\
                } %>'
        }, 
        _render: function(){
            var options = this.options;

            if($.isArray(options.content)){
                this.$el.find('.content').html($.template(this.tpl.ul, { list : options.content }));
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
    }, true);
})(Zepto, pro);

;(function( $, pro ) {
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
    *           className: 'ui-clor-red',//添加自己的样式
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
    pro.createWidget( 'ActionSheet', {
        options: {
            mask: true,
            animation: true,
            tapHide: true,
            preventScroll: true,
            content: '',
            btnHandle: []
        },
        tpl: {
            main: '<div class="ui-action-sheet">\
                    <ul class="content"></ul>\
                    <div class="ui-color-blue btn btn-cancel" data-cmd="as-cancel" data-dismiss="true">取消</div>\
                </div>',
            ul: '<% for(var i = 0, l = list.length; i < l; i++){\
                      if(typeof(list[i]) === "string"){\
                 %>\
                      <li class="ui-color-blue ui-border-1px btn" data-dismiss="true"><%=list[i]%></li>\
                      <% }else{ %>\
                      <li <%=list[i].id ? "id="+list[i].id : ""%> class="ui-color-blue ui-border-1px btn <%=list[i].className ? list[i].className : ""%>" data-dismiss="true" <%=list[i].cmd ? "data-cmd="+list[i].cmd : ""%> ><%=list[i].value ? list[i].value : ""%></li>\
                      <% }\
                } %>'
        }, 
        _render: function(){
            var options = this.options;

            if($.isArray(options.content)){
                this.$el.find('.content').html($.template(this.tpl.ul, { list : options.content }));
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
    }, true);
})(Zepto, pro);

;(function($){
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
        $('body').addClass('js-bounce-fix');
        bounceFix();
    }
})(Zepto);

/**
 * by jdo
 * 20140625
 * summary: a slider depend on zetpo, which work for mobile
 * update: by felixqslai on 20141215
 */


function slider ( element, options ) {

    var $wrap = this.$wrap = $(element);

    $.extend(this, {
        $inner : $wrap.find('.ui-carousel-inner'),
        // son item 内部子节点
        $item : $wrap.find('.ui-carousel-item'),
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
        this.$wrap.find('.ui-carousel-dots').remove();
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

    var CALSS = 'ui-carousel-dots-curr';
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
            lastNode.classList.add('ui-carousel-item-last');
        } else {
            lastNode.className = 'ui-carousel-item ui-carousel-item-last';
        }

        // 插入复制的节点
        that.$inner.append([firstNode, lastNode]);
    }

    // 检测是否激活触点导航控件
    if ( that.enableDots ) {
        // create navigator
        var dotstmpl = '<p class="ui-carousel-dots">';

        for ( var i = 0; i < framesLen; i++ ) {
            dotstmpl += '<a class="ui-carousel-dots-i">'+ (i+1) +'</a>';
        }
        dotstmpl += '</p>';

        that.$wrap.append(dotstmpl);
        // collection dots node
        that.$dots = that.$wrap.find('.ui-carousel-dots-i');
        that.$dots.eq(that.current).addClass('ui-carousel-dots-curr');
    }
}

$.Carousel = slider;

// $.fn.carousel = function (option) {
//     return this.each(function () {
//         var $this   = $(this);
//         var data    = $this.data('carousel');

//         if ( option === 'clear' ) {
//             if ( data ) {
//                 $this.data('carousel', null);
//                 data.clear();
//                 data = null;
//             }
//         } else {
//             var options = $.extend({}, $this.data(), typeof option == 'object' ? option : {});
//             if ( !data ) {
//                 $this.data('carousel', (data = new slider(this, options)));
//             }
//             if ( typeof option === 'number' ) data.to(option, !!1);
//         }
//     });
// };

;(function($){
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
})(Zepto);
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

;(function( $, pro ) {
    pro.createWidget( 'Dot', {
        options: {
            type: 'normal',   // normal, new, num
            color: 'red',   // red 或 blue
            content: '',    // New红点和数字红点需要指定content
            css: null   // 样式，可以自由控制红点的位置和大小，默认红点在容器的右上角
        },
        tpl: '<div></div>',
        _render: function(){
            var options = this.options;
            
            this.$el.removeClass().addClass('ui-dot-' + options.type + ' ' + 'ui-dot-' + options.color).text(options.content);

            if(options.css){
                this.$el.css(options.css);
            }else{
                this.$el.addClass('ui-dot-tr');     // 位置默认在容器的右上角
            }
        }
    });
})(Zepto, pro);

;(function($){
	var PREFIX = 'pro';		// data存储前缀

	// Read all "data-*" attributes from a node
	function attributeData(node) {
		var store = {};
		$.each(node.attributes || [], function(i, attr){
		  	if (parseInt(attr.name.indexOf('data-'), 10) === 0)
		    	store[$.camelCase(attr.name.replace('data-', ''))] =
		      		$.zepto.deserializeValue(attr.value);
		});
		return store;
	}

	// 将组件挂到$.fn上
	function zeptolize( name ) {
	    var key = name.substring( 0, 1 ).toLowerCase() + name.substring( 1 ),
	        old = $.fn[ key ];

	    $.fn[ key ] = function( opts, fuc ) {
	        var args = [].slice.call( arguments, (typeof opts === 'string'? 1 : 2)),
	            method = (typeof opts === 'string' && opts) || (typeof fuc === 'string' && fuc),
	            ret,
	            obj;

	        $.each( this, function( i, el ) {
	        	var $el = $( el ),
	        		attr = attributeData( el );

	            // 从data中取，没有则创建一个
	            obj = $el.data( PREFIX + '-' + name );

	            if( obj === undefined ) {
	            	obj = new pro[ name ]( el, $.isPlainObject( opts ) ? $.extend( opts, attr ) : attr );
	            	$el.data( PREFIX + '-' + name, obj );
	            }else {
	            	obj.setOption( opts );
	            }

	            // 取实例
	            if ( method === false ) {
	                ret = obj;
	                return false;    // 断开each循环
	            } else if ( method ) {

	                // 当取的方法不存在时，抛出错误信息
	                if ( !$.isFunction( obj[ method ] ) ) {
	                    throw new Error( 'no such method' );
	                }

	                ret = obj[ method ].apply( obj, args );

	                // 断定它是getter性质的方法，所以需要断开each循环，把结果返回
	                if ( ret !== undefined && ret !== obj ) {
	                    return false;
	                }

	                // ret为obj时为无效值，为了不影响后面的返回
	                ret = undefined;
	            }
	        } );

	        return ret !== undefined ? ret : this;
	    };

	    /*
	     * NO CONFLICT
	     */
	    $.fn[ key ].noConflict = function() {
	        $.fn[ key ] = old;
	        return this;
	    };
	}

    window.pro = {
    	
    	// 创建组件
	    createWidget: function ( name, object, isSingleton, superClass ) {
	        if ( !$.isFunction(superClass) ) {
	            superClass = Widget;	// 默认基类为Widget
	        }

	        function subClass( el, opts ) {
	            this._init( el, opts );
	        }

	        subClass.superClass = superClass;
	        subClass.prototype = Object.create( superClass.prototype );

	        object.$super = function( name ) {
	            var fn = superClass.prototype[ name ];
	            return $.isFunction( fn ) && fn.apply( this, [].slice.call( arguments, 1 ) );
	        };

	        $.extend( subClass.prototype, object );

	        if( isSingleton ) {
	        	pro[ name.substring( 0, 1 ).toLowerCase() + name.substring( 1 ) ] = new subClass();		// 单例的组件直接实例化
	        }else {
	        	pro[ name ] = subClass;
	        	zeptolize( name );
	        } 

	        return subClass;
	    }
    };

    /*
     * @class 基类Widget
     */
    function Widget() {}

    Widget.prototype = {
    	options: {},
    	tpl: '',
    	/*
         * @method _init
         * @desc 组件初始化
         */
    	_init: function( el, opts) {
    		this.$container = $( el || document.body);

    		this.options = $.extend( {}, this.options, opts );

            if(opts && opts.$el){
                //处理已有内容的类型，不需要调用show方法来绑定事件，如Tab 
                /* this.$el = typeof opts.$el === 'string' ? $(opts.$el) : opts.$el; */
                this.$el = $(opts.$el, this.$container);

                this._bindEvents();
            }
    	},
    	/*
         * @method setOption
         * @desc 设置options
         */
    	setOption: function( opts ) {
    		this.options = $.extend( this.options, opts );
    	},
    	/*
         * @method _create
         * @desc 创建组件相应的dom
         */
    	_create: function(){
    		this.$el = $($.isPlainObject(this.tpl)? this.tpl.main : this.tpl).appendTo(this.$container);
    		this._bindEvents();

			if(this.options.preventScroll){
				// fix by jdochen
				// 这里改为是否阻止该wedget默认行为比较合适
				this.$el.on('touchmove', $.preventDefault);
			}
    	},
    	/*
         * @method _render
         * @desc 根据配置项渲染相应的dom
         */
    	_render: $.emptyFunction,
    	/*
         * @method _bindEvents
         * @desc 给组件绑定相应的事件
         */
    	_bindEvents: $.emptyFunction,
    	/*
         * @method show
         * @desc show组件
         */
    	show: function( opts ){
			// var self = this;
			this.setOption( opts );

			if(!this.$el){
				this._create();
				this._render();
			}else if(opts){
				this._render();
			}else if(this.isShow){
				return;
			}

			this.isShow = true;

			// 是否出遮罩
			this.options.mask && pro.mask.show({
				tapHide: this.options.tapHide,
				relatedWidget: this
			});

			// 是否有动画
			if(this.options.animation){
				this.$el.show().addClass('js-effect');
				this.$el[0].offsetWidth;	// repaint
			}else{
				this.$el.removeClass('js-effect').show();
			}

			this.$el.off('webkitTransitionEnd');
			this.$el.addClass('js-show');

			// 是否需要阻止页面滚动
			/*if(this.options.preventScroll){
				$(document).on('touchmove', $.preventDefault);
			}*/
		},
		/*
         * @method hide
         * @desc hide组件
         */
		hide: function(){
			var self = this;

			if(!this.isShow){
				return;
			}

			this.isShow = false;

			if(this.options.animation){
				this.$el.one('webkitTransitionEnd', function(){
					self.$el.hide();
				});
			}else{
				this.$el.hide();
			}

			this.$el.removeClass('js-show');

			this.options.mask && pro.mask.hide();

			/*if(this.options.preventScroll){
				$(document).off('touchmove', $.preventDefault);
			}*/
		}
    };


	// TODO $.env 为业务代码, 需要抽离
	$.env = {};
})(Zepto);



;(function( $, pro ) {
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
    *           className: 'ui-clor-red',//添加自己的样式
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
    pro.createWidget( 'ActionShare', {
        options: {
            mask: true,
            animation: true,
            tapHide: true,
            preventScroll: true,
            content: '',
            btnHandle: []
        },
        tpl: {
            main: '<div class="ui-action-sheet">\
                    <div class="sheet-title ui-border-b">分享到:</div>\
                    <ul class="content"></ul>\
                    <div class="ui-color-blue btn btn-cancel" data-cmd="as-cancel" data-dismiss="true">取消</div>\
                </div>',
            ul: '<% for(var i = 0, l = list.length; i < l; i++){\
                      if(typeof(list[i]) === "string"){\
                 %>\
                      <li class="ui-color-blue btn" data-dismiss="true"><%=list[i]%></li>\
                      <% }else{ %>\
                      <li <%=list[i].id ? "id="+list[i].id : ""%> class="ui-color-blue btn <%=list[i].className ? list[i].className : ""%>" data-dismiss="true" <%=list[i].cmd ? "data-cmd="+list[i].cmd : ""%> ><%=list[i].value ? list[i].value : ""%></li>\
                      <% }\
                } %>'
        }, 
        _render: function(){
            var options = this.options;

            if($.isArray(options.content)){
                this.$el.find('.content').html($.template(this.tpl.ul, { list : options.content }));
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
    }, true);
})(Zepto, pro);

;(function( $, pro ) {
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
    *           className: 'ui-clor-red',//添加自己的样式
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
    pro.createWidget( 'ActionSheet', {
        options: {
            mask: true,
            animation: true,
            tapHide: true,
            preventScroll: true,
            content: '',
            btnHandle: []
        },
        tpl: {
            main: '<div class="ui-action-sheet">\
                    <ul class="content"></ul>\
                    <div class="ui-color-blue btn btn-cancel" data-cmd="as-cancel" data-dismiss="true">取消</div>\
                </div>',
            ul: '<% for(var i = 0, l = list.length; i < l; i++){\
                      if(typeof(list[i]) === "string"){\
                 %>\
                      <li class="ui-color-blue ui-border-1px btn" data-dismiss="true"><%=list[i]%></li>\
                      <% }else{ %>\
                      <li <%=list[i].id ? "id="+list[i].id : ""%> class="ui-color-blue ui-border-1px btn <%=list[i].className ? list[i].className : ""%>" data-dismiss="true" <%=list[i].cmd ? "data-cmd="+list[i].cmd : ""%> ><%=list[i].value ? list[i].value : ""%></li>\
                      <% }\
                } %>'
        }, 
        _render: function(){
            var options = this.options;

            if($.isArray(options.content)){
                this.$el.find('.content').html($.template(this.tpl.ul, { list : options.content }));
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
    }, true);
})(Zepto, pro);

;(function($){
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
        $('body').addClass('js-bounce-fix');
        bounceFix();
    }
})(Zepto);

/**
 * by jdo
 * 20140625
 * summary: a slider depend on zetpo, which work for mobile
 * update: by felixqslai on 20141215
 */


function slider ( element, options ) {

    var $wrap = this.$wrap = $(element);

    $.extend(this, {
        $inner : $wrap.find('.ui-carousel-inner'),
        // son item 内部子节点
        $item : $wrap.find('.ui-carousel-item'),
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
        this.$wrap.find('.ui-carousel-dots').remove();
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

    var CALSS = 'ui-carousel-dots-curr';
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
            lastNode.classList.add('ui-carousel-item-last');
        } else {
            lastNode.className = 'ui-carousel-item ui-carousel-item-last';
        }

        // 插入复制的节点
        that.$inner.append([firstNode, lastNode]);
    }

    // 检测是否激活触点导航控件
    if ( that.enableDots ) {
        // create navigator
        var dotstmpl = '<p class="ui-carousel-dots">';

        for ( var i = 0; i < framesLen; i++ ) {
            dotstmpl += '<a class="ui-carousel-dots-i">'+ (i+1) +'</a>';
        }
        dotstmpl += '</p>';

        that.$wrap.append(dotstmpl);
        // collection dots node
        that.$dots = that.$wrap.find('.ui-carousel-dots-i');
        that.$dots.eq(that.current).addClass('ui-carousel-dots-curr');
    }
}

$.Carousel = slider;

// $.fn.carousel = function (option) {
//     return this.each(function () {
//         var $this   = $(this);
//         var data    = $this.data('carousel');

//         if ( option === 'clear' ) {
//             if ( data ) {
//                 $this.data('carousel', null);
//                 data.clear();
//                 data = null;
//             }
//         } else {
//             var options = $.extend({}, $this.data(), typeof option == 'object' ? option : {});
//             if ( !data ) {
//                 $this.data('carousel', (data = new slider(this, options)));
//             }
//             if ( typeof option === 'number' ) data.to(option, !!1);
//         }
//     });
// };

;(function($){
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
})(Zepto);
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

;(function( $, pro ) {
    pro.createWidget( 'Dot', {
        options: {
            type: 'normal',   // normal, new, num
            color: 'red',   // red 或 blue
            content: '',    // New红点和数字红点需要指定content
            css: null   // 样式，可以自由控制红点的位置和大小，默认红点在容器的右上角
        },
        tpl: '<div></div>',
        _render: function(){
            var options = this.options;
            
            this.$el.removeClass().addClass('ui-dot-' + options.type + ' ' + 'ui-dot-' + options.color).text(options.content);

            if(options.css){
                this.$el.css(options.css);
            }else{
                this.$el.addClass('ui-dot-tr');     // 位置默认在容器的右上角
            }
        }
    });
})(Zepto, pro);

;(function($){
	var PREFIX = 'pro';		// data存储前缀

	// Read all "data-*" attributes from a node
	function attributeData(node) {
		var store = {};
		$.each(node.attributes || [], function(i, attr){
		  	if (parseInt(attr.name.indexOf('data-'), 10) === 0)
		    	store[$.camelCase(attr.name.replace('data-', ''))] =
		      		$.zepto.deserializeValue(attr.value);
		});
		return store;
	}

	// 将组件挂到$.fn上
	function zeptolize( name ) {
	    var key = name.substring( 0, 1 ).toLowerCase() + name.substring( 1 ),
	        old = $.fn[ key ];

	    $.fn[ key ] = function( opts, fuc ) {
	        var args = [].slice.call( arguments, (typeof opts === 'string'? 1 : 2)),
	            method = (typeof opts === 'string' && opts) || (typeof fuc === 'string' && fuc),
	            ret,
	            obj;

	        $.each( this, function( i, el ) {
	        	var $el = $( el ),
	        		attr = attributeData( el );

	            // 从data中取，没有则创建一个
	            obj = $el.data( PREFIX + '-' + name );

	            if( obj === undefined ) {
	            	obj = new pro[ name ]( el, $.isPlainObject( opts ) ? $.extend( opts, attr ) : attr );
	            	$el.data( PREFIX + '-' + name, obj );
	            }else {
	            	obj.setOption( opts );
	            }

	            // 取实例
	            if ( method === false ) {
	                ret = obj;
	                return false;    // 断开each循环
	            } else if ( method ) {

	                // 当取的方法不存在时，抛出错误信息
	                if ( !$.isFunction( obj[ method ] ) ) {
	                    throw new Error( 'no such method' );
	                }

	                ret = obj[ method ].apply( obj, args );

	                // 断定它是getter性质的方法，所以需要断开each循环，把结果返回
	                if ( ret !== undefined && ret !== obj ) {
	                    return false;
	                }

	                // ret为obj时为无效值，为了不影响后面的返回
	                ret = undefined;
	            }
	        } );

	        return ret !== undefined ? ret : this;
	    };

	    /*
	     * NO CONFLICT
	     */
	    $.fn[ key ].noConflict = function() {
	        $.fn[ key ] = old;
	        return this;
	    };
	}

    window.pro = {
    	
    	// 创建组件
	    createWidget: function ( name, object, isSingleton, superClass ) {
	        if ( !$.isFunction(superClass) ) {
	            superClass = Widget;	// 默认基类为Widget
	        }

	        function subClass( el, opts ) {
	            this._init( el, opts );
	        }

	        subClass.superClass = superClass;
	        subClass.prototype = Object.create( superClass.prototype );

	        object.$super = function( name ) {
	            var fn = superClass.prototype[ name ];
	            return $.isFunction( fn ) && fn.apply( this, [].slice.call( arguments, 1 ) );
	        };

	        $.extend( subClass.prototype, object );

	        if( isSingleton ) {
	        	pro[ name.substring( 0, 1 ).toLowerCase() + name.substring( 1 ) ] = new subClass();		// 单例的组件直接实例化
	        }else {
	        	pro[ name ] = subClass;
	        	zeptolize( name );
	        } 

	        return subClass;
	    }
    };

    /*
     * @class 基类Widget
     */
    function Widget() {}

    Widget.prototype = {
    	options: {},
    	tpl: '',
    	/*
         * @method _init
         * @desc 组件初始化
         */
    	_init: function( el, opts) {
    		this.$container = $( el || document.body);

    		this.options = $.extend( {}, this.options, opts );

            if(opts && opts.$el){
                //处理已有内容的类型，不需要调用show方法来绑定事件，如Tab 
                /* this.$el = typeof opts.$el === 'string' ? $(opts.$el) : opts.$el; */
                this.$el = $(opts.$el, this.$container);

                this._bindEvents();
            }
    	},
    	/*
         * @method setOption
         * @desc 设置options
         */
    	setOption: function( opts ) {
    		this.options = $.extend( this.options, opts );
    	},
    	/*
         * @method _create
         * @desc 创建组件相应的dom
         */
    	_create: function(){
    		this.$el = $($.isPlainObject(this.tpl)? this.tpl.main : this.tpl).appendTo(this.$container);
    		this._bindEvents();

			if(this.options.preventScroll){
				// fix by jdochen
				// 这里改为是否阻止该wedget默认行为比较合适
				this.$el.on('touchmove', $.preventDefault);
			}
    	},
    	/*
         * @method _render
         * @desc 根据配置项渲染相应的dom
         */
    	_render: $.emptyFunction,
    	/*
         * @method _bindEvents
         * @desc 给组件绑定相应的事件
         */
    	_bindEvents: $.emptyFunction,
    	/*
         * @method show
         * @desc show组件
         */
    	show: function( opts ){
			// var self = this;
			this.setOption( opts );

			if(!this.$el){
				this._create();
				this._render();
			}else if(opts){
				this._render();
			}else if(this.isShow){
				return;
			}

			this.isShow = true;

			// 是否出遮罩
			this.options.mask && pro.mask.show({
				tapHide: this.options.tapHide,
				relatedWidget: this
			});

			// 是否有动画
			if(this.options.animation){
				this.$el.show().addClass('js-effect');
				this.$el[0].offsetWidth;	// repaint
			}else{
				this.$el.removeClass('js-effect').show();
			}

			this.$el.off('webkitTransitionEnd');
			this.$el.addClass('js-show');

			// 是否需要阻止页面滚动
			/*if(this.options.preventScroll){
				$(document).on('touchmove', $.preventDefault);
			}*/
		},
		/*
         * @method hide
         * @desc hide组件
         */
		hide: function(){
			var self = this;

			if(!this.isShow){
				return;
			}

			this.isShow = false;

			if(this.options.animation){
				this.$el.one('webkitTransitionEnd', function(){
					self.$el.hide();
				});
			}else{
				this.$el.hide();
			}

			this.$el.removeClass('js-show');

			this.options.mask && pro.mask.hide();

			/*if(this.options.preventScroll){
				$(document).off('touchmove', $.preventDefault);
			}*/
		}
    };


	// TODO $.env 为业务代码, 需要抽离
	$.env = {};
})(Zepto);



;(function( $, pro ) {
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
    *           className: 'ui-clor-red',//添加自己的样式
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
    pro.createWidget( 'ActionShare', {
        options: {
            mask: true,
            animation: true,
            tapHide: true,
            preventScroll: true,
            content: '',
            btnHandle: []
        },
        tpl: {
            main: '<div class="ui-action-sheet">\
                    <div class="sheet-title ui-border-b">分享到:</div>\
                    <ul class="content"></ul>\
                    <div class="ui-color-blue btn btn-cancel" data-cmd="as-cancel" data-dismiss="true">取消</div>\
                </div>',
            ul: '<% for(var i = 0, l = list.length; i < l; i++){\
                      if(typeof(list[i]) === "string"){\
                 %>\
                      <li class="ui-color-blue btn" data-dismiss="true"><%=list[i]%></li>\
                      <% }else{ %>\
                      <li <%=list[i].id ? "id="+list[i].id : ""%> class="ui-color-blue btn <%=list[i].className ? list[i].className : ""%>" data-dismiss="true" <%=list[i].cmd ? "data-cmd="+list[i].cmd : ""%> ><%=list[i].value ? list[i].value : ""%></li>\
                      <% }\
                } %>'
        }, 
        _render: function(){
            var options = this.options;

            if($.isArray(options.content)){
                this.$el.find('.content').html($.template(this.tpl.ul, { list : options.content }));
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
    }, true);
})(Zepto, pro);

;(function( $, pro ) {
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
    *           className: 'ui-clor-red',//添加自己的样式
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
    pro.createWidget( 'ActionSheet', {
        options: {
            mask: true,
            animation: true,
            tapHide: true,
            preventScroll: true,
            content: '',
            btnHandle: []
        },
        tpl: {
            main: '<div class="ui-action-sheet">\
                    <ul class="content"></ul>\
                    <div class="ui-color-blue btn btn-cancel" data-cmd="as-cancel" data-dismiss="true">取消</div>\
                </div>',
            ul: '<% for(var i = 0, l = list.length; i < l; i++){\
                      if(typeof(list[i]) === "string"){\
                 %>\
                      <li class="ui-color-blue ui-border-1px btn" data-dismiss="true"><%=list[i]%></li>\
                      <% }else{ %>\
                      <li <%=list[i].id ? "id="+list[i].id : ""%> class="ui-color-blue ui-border-1px btn <%=list[i].className ? list[i].className : ""%>" data-dismiss="true" <%=list[i].cmd ? "data-cmd="+list[i].cmd : ""%> ><%=list[i].value ? list[i].value : ""%></li>\
                      <% }\
                } %>'
        }, 
        _render: function(){
            var options = this.options;

            if($.isArray(options.content)){
                this.$el.find('.content').html($.template(this.tpl.ul, { list : options.content }));
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
    }, true);
})(Zepto, pro);

;(function($){
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
        $('body').addClass('js-bounce-fix');
        bounceFix();
    }
})(Zepto);

/**
 * by jdo
 * 20140625
 * summary: a slider depend on zetpo, which work for mobile
 * update: by felixqslai on 20141215
 */


function slider ( element, options ) {

    var $wrap = this.$wrap = $(element);

    $.extend(this, {
        $inner : $wrap.find('.ui-carousel-inner'),
        // son item 内部子节点
        $item : $wrap.find('.ui-carousel-item'),
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
        this.$wrap.find('.ui-carousel-dots').remove();
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

    var CALSS = 'ui-carousel-dots-curr';
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
            lastNode.classList.add('ui-carousel-item-last');
        } else {
            lastNode.className = 'ui-carousel-item ui-carousel-item-last';
        }

        // 插入复制的节点
        that.$inner.append([firstNode, lastNode]);
    }

    // 检测是否激活触点导航控件
    if ( that.enableDots ) {
        // create navigator
        var dotstmpl = '<p class="ui-carousel-dots">';

        for ( var i = 0; i < framesLen; i++ ) {
            dotstmpl += '<a class="ui-carousel-dots-i">'+ (i+1) +'</a>';
        }
        dotstmpl += '</p>';

        that.$wrap.append(dotstmpl);
        // collection dots node
        that.$dots = that.$wrap.find('.ui-carousel-dots-i');
        that.$dots.eq(that.current).addClass('ui-carousel-dots-curr');
    }
}

$.Carousel = slider;

// $.fn.carousel = function (option) {
//     return this.each(function () {
//         var $this   = $(this);
//         var data    = $this.data('carousel');

//         if ( option === 'clear' ) {
//             if ( data ) {
//                 $this.data('carousel', null);
//                 data.clear();
//                 data = null;
//             }
//         } else {
//             var options = $.extend({}, $this.data(), typeof option == 'object' ? option : {});
//             if ( !data ) {
//                 $this.data('carousel', (data = new slider(this, options)));
//             }
//             if ( typeof option === 'number' ) data.to(option, !!1);
//         }
//     });
// };

;(function($){
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
})(Zepto);
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

;(function( $, pro ) {
    pro.createWidget( 'Dot', {
        options: {
            type: 'normal',   // normal, new, num
            color: 'red',   // red 或 blue
            content: '',    // New红点和数字红点需要指定content
            css: null   // 样式，可以自由控制红点的位置和大小，默认红点在容器的右上角
        },
        tpl: '<div></div>',
        _render: function(){
            var options = this.options;
            
            this.$el.removeClass().addClass('ui-dot-' + options.type + ' ' + 'ui-dot-' + options.color).text(options.content);

            if(options.css){
                this.$el.css(options.css);
            }else{
                this.$el.addClass('ui-dot-tr');     // 位置默认在容器的右上角
            }
        }
    });
})(Zepto, pro);

;(function($){
	var PREFIX = 'pro';		// data存储前缀

	// Read all "data-*" attributes from a node
	function attributeData(node) {
		var store = {};
		$.each(node.attributes || [], function(i, attr){
		  	if (parseInt(attr.name.indexOf('data-'), 10) === 0)
		    	store[$.camelCase(attr.name.replace('data-', ''))] =
		      		$.zepto.deserializeValue(attr.value);
		});
		return store;
	}

	// 将组件挂到$.fn上
	function zeptolize( name ) {
	    var key = name.substring( 0, 1 ).toLowerCase() + name.substring( 1 ),
	        old = $.fn[ key ];

	    $.fn[ key ] = function( opts, fuc ) {
	        var args = [].slice.call( arguments, (typeof opts === 'string'? 1 : 2)),
	            method = (typeof opts === 'string' && opts) || (typeof fuc === 'string' && fuc),
	            ret,
	            obj;

	        $.each( this, function( i, el ) {
	        	var $el = $( el ),
	        		attr = attributeData( el );

	            // 从data中取，没有则创建一个
	            obj = $el.data( PREFIX + '-' + name );

	            if( obj === undefined ) {
	            	obj = new pro[ name ]( el, $.isPlainObject( opts ) ? $.extend( opts, attr ) : attr );
	            	$el.data( PREFIX + '-' + name, obj );
	            }else {
	            	obj.setOption( opts );
	            }

	            // 取实例
	            if ( method === false ) {
	                ret = obj;
	                return false;    // 断开each循环
	            } else if ( method ) {

	                // 当取的方法不存在时，抛出错误信息
	                if ( !$.isFunction( obj[ method ] ) ) {
	                    throw new Error( 'no such method' );
	                }

	                ret = obj[ method ].apply( obj, args );

	                // 断定它是getter性质的方法，所以需要断开each循环，把结果返回
	                if ( ret !== undefined && ret !== obj ) {
	                    return false;
	                }

	                // ret为obj时为无效值，为了不影响后面的返回
	                ret = undefined;
	            }
	        } );

	        return ret !== undefined ? ret : this;
	    };

	    /*
	     * NO CONFLICT
	     */
	    $.fn[ key ].noConflict = function() {
	        $.fn[ key ] = old;
	        return this;
	    };
	}

    window.pro = {
    	
    	// 创建组件
	    createWidget: function ( name, object, isSingleton, superClass ) {
	        if ( !$.isFunction(superClass) ) {
	            superClass = Widget;	// 默认基类为Widget
	        }

	        function subClass( el, opts ) {
	            this._init( el, opts );
	        }

	        subClass.superClass = superClass;
	        subClass.prototype = Object.create( superClass.prototype );

	        object.$super = function( name ) {
	            var fn = superClass.prototype[ name ];
	            return $.isFunction( fn ) && fn.apply( this, [].slice.call( arguments, 1 ) );
	        };

	        $.extend( subClass.prototype, object );

	        if( isSingleton ) {
	        	pro[ name.substring( 0, 1 ).toLowerCase() + name.substring( 1 ) ] = new subClass();		// 单例的组件直接实例化
	        }else {
	        	pro[ name ] = subClass;
	        	zeptolize( name );
	        } 

	        return subClass;
	    }
    };

    /*
     * @class 基类Widget
     */
    function Widget() {}

    Widget.prototype = {
    	options: {},
    	tpl: '',
    	/*
         * @method _init
         * @desc 组件初始化
         */
    	_init: function( el, opts) {
    		this.$container = $( el || document.body);

    		this.options = $.extend( {}, this.options, opts );

            if(opts && opts.$el){
                //处理已有内容的类型，不需要调用show方法来绑定事件，如Tab 
                /* this.$el = typeof opts.$el === 'string' ? $(opts.$el) : opts.$el; */
                this.$el = $(opts.$el, this.$container);

                this._bindEvents();
            }
    	},
    	/*
         * @method setOption
         * @desc 设置options
         */
    	setOption: function( opts ) {
    		this.options = $.extend( this.options, opts );
    	},
    	/*
         * @method _create
         * @desc 创建组件相应的dom
         */
    	_create: function(){
    		this.$el = $($.isPlainObject(this.tpl)? this.tpl.main : this.tpl).appendTo(this.$container);
    		this._bindEvents();

			if(this.options.preventScroll){
				// fix by jdochen
				// 这里改为是否阻止该wedget默认行为比较合适
				this.$el.on('touchmove', $.preventDefault);
			}
    	},
    	/*
         * @method _render
         * @desc 根据配置项渲染相应的dom
         */
    	_render: $.emptyFunction,
    	/*
         * @method _bindEvents
         * @desc 给组件绑定相应的事件
         */
    	_bindEvents: $.emptyFunction,
    	/*
         * @method show
         * @desc show组件
         */
    	show: function( opts ){
			// var self = this;
			this.setOption( opts );

			if(!this.$el){
				this._create();
				this._render();
			}else if(opts){
				this._render();
			}else if(this.isShow){
				return;
			}

			this.isShow = true;

			// 是否出遮罩
			this.options.mask && pro.mask.show({
				tapHide: this.options.tapHide,
				relatedWidget: this
			});

			// 是否有动画
			if(this.options.animation){
				this.$el.show().addClass('js-effect');
				this.$el[0].offsetWidth;	// repaint
			}else{
				this.$el.removeClass('js-effect').show();
			}

			this.$el.off('webkitTransitionEnd');
			this.$el.addClass('js-show');

			// 是否需要阻止页面滚动
			/*if(this.options.preventScroll){
				$(document).on('touchmove', $.preventDefault);
			}*/
		},
		/*
         * @method hide
         * @desc hide组件
         */
		hide: function(){
			var self = this;

			if(!this.isShow){
				return;
			}

			this.isShow = false;

			if(this.options.animation){
				this.$el.one('webkitTransitionEnd', function(){
					self.$el.hide();
				});
			}else{
				this.$el.hide();
			}

			this.$el.removeClass('js-show');

			this.options.mask && pro.mask.hide();

			/*if(this.options.preventScroll){
				$(document).off('touchmove', $.preventDefault);
			}*/
		}
    };


	// TODO $.env 为业务代码, 需要抽离
	$.env = {};
})(Zepto);



;(function( $, pro ) {
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
    *           className: 'ui-clor-red',//添加自己的样式
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
    pro.createWidget( 'ActionShare', {
        options: {
            mask: true,
            animation: true,
            tapHide: true,
            preventScroll: true,
            content: '',
            btnHandle: []
        },
        tpl: {
            main: '<div class="ui-action-sheet">\
                    <div class="sheet-title ui-border-b">分享到:</div>\
                    <ul class="content"></ul>\
                    <div class="ui-color-blue btn btn-cancel" data-cmd="as-cancel" data-dismiss="true">取消</div>\
                </div>',
            ul: '<% for(var i = 0, l = list.length; i < l; i++){\
                      if(typeof(list[i]) === "string"){\
                 %>\
                      <li class="ui-color-blue btn" data-dismiss="true"><%=list[i]%></li>\
                      <% }else{ %>\
                      <li <%=list[i].id ? "id="+list[i].id : ""%> class="ui-color-blue btn <%=list[i].className ? list[i].className : ""%>" data-dismiss="true" <%=list[i].cmd ? "data-cmd="+list[i].cmd : ""%> ><%=list[i].value ? list[i].value : ""%></li>\
                      <% }\
                } %>'
        }, 
        _render: function(){
            var options = this.options;

            if($.isArray(options.content)){
                this.$el.find('.content').html($.template(this.tpl.ul, { list : options.content }));
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
    }, true);
})(Zepto, pro);

;(function( $, pro ) {
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
    *           className: 'ui-clor-red',//添加自己的样式
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
    pro.createWidget( 'ActionSheet', {
        options: {
            mask: true,
            animation: true,
            tapHide: true,
            preventScroll: true,
            content: '',
            btnHandle: []
        },
        tpl: {
            main: '<div class="ui-action-sheet">\
                    <ul class="content"></ul>\
                    <div class="ui-color-blue btn btn-cancel" data-cmd="as-cancel" data-dismiss="true">取消</div>\
                </div>',
            ul: '<% for(var i = 0, l = list.length; i < l; i++){\
                      if(typeof(list[i]) === "string"){\
                 %>\
                      <li class="ui-color-blue ui-border-1px btn" data-dismiss="true"><%=list[i]%></li>\
                      <% }else{ %>\
                      <li <%=list[i].id ? "id="+list[i].id : ""%> class="ui-color-blue ui-border-1px btn <%=list[i].className ? list[i].className : ""%>" data-dismiss="true" <%=list[i].cmd ? "data-cmd="+list[i].cmd : ""%> ><%=list[i].value ? list[i].value : ""%></li>\
                      <% }\
                } %>'
        }, 
        _render: function(){
            var options = this.options;

            if($.isArray(options.content)){
                this.$el.find('.content').html($.template(this.tpl.ul, { list : options.content }));
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
    }, true);
})(Zepto, pro);

;(function($){
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
        $('body').addClass('js-bounce-fix');
        bounceFix();
    }
})(Zepto);

/**
 * by jdo
 * 20140625
 * summary: a slider depend on zetpo, which work for mobile
 * update: by felixqslai on 20141215
 */


function slider ( element, options ) {

    var $wrap = this.$wrap = $(element);

    $.extend(this, {
        $inner : $wrap.find('.ui-carousel-inner'),
        // son item 内部子节点
        $item : $wrap.find('.ui-carousel-item'),
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
        this.$wrap.find('.ui-carousel-dots').remove();
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

    var CALSS = 'ui-carousel-dots-curr';
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
            lastNode.classList.add('ui-carousel-item-last');
        } else {
            lastNode.className = 'ui-carousel-item ui-carousel-item-last';
        }

        // 插入复制的节点
        that.$inner.append([firstNode, lastNode]);
    }

    // 检测是否激活触点导航控件
    if ( that.enableDots ) {
        // create navigator
        var dotstmpl = '<p class="ui-carousel-dots">';

        for ( var i = 0; i < framesLen; i++ ) {
            dotstmpl += '<a class="ui-carousel-dots-i">'+ (i+1) +'</a>';
        }
        dotstmpl += '</p>';

        that.$wrap.append(dotstmpl);
        // collection dots node
        that.$dots = that.$wrap.find('.ui-carousel-dots-i');
        that.$dots.eq(that.current).addClass('ui-carousel-dots-curr');
    }
}

$.Carousel = slider;

// $.fn.carousel = function (option) {
//     return this.each(function () {
//         var $this   = $(this);
//         var data    = $this.data('carousel');

//         if ( option === 'clear' ) {
//             if ( data ) {
//                 $this.data('carousel', null);
//                 data.clear();
//                 data = null;
//             }
//         } else {
//             var options = $.extend({}, $this.data(), typeof option == 'object' ? option : {});
//             if ( !data ) {
//                 $this.data('carousel', (data = new slider(this, options)));
//             }
//             if ( typeof option === 'number' ) data.to(option, !!1);
//         }
//     });
// };

;(function($){
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
})(Zepto);
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

;(function( $, pro ) {
    pro.createWidget( 'Dot', {
        options: {
            type: 'normal',   // normal, new, num
            color: 'red',   // red 或 blue
            content: '',    // New红点和数字红点需要指定content
            css: null   // 样式，可以自由控制红点的位置和大小，默认红点在容器的右上角
        },
        tpl: '<div></div>',
        _render: function(){
            var options = this.options;
            
            this.$el.removeClass().addClass('ui-dot-' + options.type + ' ' + 'ui-dot-' + options.color).text(options.content);

            if(options.css){
                this.$el.css(options.css);
            }else{
                this.$el.addClass('ui-dot-tr');     // 位置默认在容器的右上角
            }
        }
    });
})(Zepto, pro);

;(function($){
	var PREFIX = 'pro';		// data存储前缀

	// Read all "data-*" attributes from a node
	function attributeData(node) {
		var store = {};
		$.each(node.attributes || [], function(i, attr){
		  	if (parseInt(attr.name.indexOf('data-'), 10) === 0)
		    	store[$.camelCase(attr.name.replace('data-', ''))] =
		      		$.zepto.deserializeValue(attr.value);
		});
		return store;
	}

	// 将组件挂到$.fn上
	function zeptolize( name ) {
	    var key = name.substring( 0, 1 ).toLowerCase() + name.substring( 1 ),
	        old = $.fn[ key ];

	    $.fn[ key ] = function( opts, fuc ) {
	        var args = [].slice.call( arguments, (typeof opts === 'string'? 1 : 2)),
	            method = (typeof opts === 'string' && opts) || (typeof fuc === 'string' && fuc),
	            ret,
	            obj;

	        $.each( this, function( i, el ) {
	        	var $el = $( el ),
	        		attr = attributeData( el );

	            // 从data中取，没有则创建一个
	            obj = $el.data( PREFIX + '-' + name );

	            if( obj === undefined ) {
	            	obj = new pro[ name ]( el, $.isPlainObject( opts ) ? $.extend( opts, attr ) : attr );
	            	$el.data( PREFIX + '-' + name, obj );
	            }else {
	            	obj.setOption( opts );
	            }

	            // 取实例
	            if ( method === false ) {
	                ret = obj;
	                return false;    // 断开each循环
	            } else if ( method ) {

	                // 当取的方法不存在时，抛出错误信息
	                if ( !$.isFunction( obj[ method ] ) ) {
	                    throw new Error( 'no such method' );
	                }

	                ret = obj[ method ].apply( obj, args );

	                // 断定它是getter性质的方法，所以需要断开each循环，把结果返回
	                if ( ret !== undefined && ret !== obj ) {
	                    return false;
	                }

	                // ret为obj时为无效值，为了不影响后面的返回
	                ret = undefined;
	            }
	        } );

	        return ret !== undefined ? ret : this;
	    };

	    /*
	     * NO CONFLICT
	     */
	    $.fn[ key ].noConflict = function() {
	        $.fn[ key ] = old;
	        return this;
	    };
	}

    window.pro = {
    	
    	// 创建组件
	    createWidget: function ( name, object, isSingleton, superClass ) {
	        if ( !$.isFunction(superClass) ) {
	            superClass = Widget;	// 默认基类为Widget
	        }

	        function subClass( el, opts ) {
	            this._init( el, opts );
	        }

	        subClass.superClass = superClass;
	        subClass.prototype = Object.create( superClass.prototype );

	        object.$super = function( name ) {
	            var fn = superClass.prototype[ name ];
	            return $.isFunction( fn ) && fn.apply( this, [].slice.call( arguments, 1 ) );
	        };

	        $.extend( subClass.prototype, object );

	        if( isSingleton ) {
	        	pro[ name.substring( 0, 1 ).toLowerCase() + name.substring( 1 ) ] = new subClass();		// 单例的组件直接实例化
	        }else {
	        	pro[ name ] = subClass;
	        	zeptolize( name );
	        } 

	        return subClass;
	    }
    };

    /*
     * @class 基类Widget
     */
    function Widget() {}

    Widget.prototype = {
    	options: {},
    	tpl: '',
    	/*
         * @method _init
         * @desc 组件初始化
         */
    	_init: function( el, opts) {
    		this.$container = $( el || document.body);

    		this.options = $.extend( {}, this.options, opts );

            if(opts && opts.$el){
                //处理已有内容的类型，不需要调用show方法来绑定事件，如Tab 
                /* this.$el = typeof opts.$el === 'string' ? $(opts.$el) : opts.$el; */
                this.$el = $(opts.$el, this.$container);

                this._bindEvents();
            }
    	},
    	/*
         * @method setOption
         * @desc 设置options
         */
    	setOption: function( opts ) {
    		this.options = $.extend( this.options, opts );
    	},
    	/*
         * @method _create
         * @desc 创建组件相应的dom
         */
    	_create: function(){
    		this.$el = $($.isPlainObject(this.tpl)? this.tpl.main : this.tpl).appendTo(this.$container);
    		this._bindEvents();

			if(this.options.preventScroll){
				// fix by jdochen
				// 这里改为是否阻止该wedget默认行为比较合适
				this.$el.on('touchmove', $.preventDefault);
			}
    	},
    	/*
         * @method _render
         * @desc 根据配置项渲染相应的dom
         */
    	_render: $.emptyFunction,
    	/*
         * @method _bindEvents
         * @desc 给组件绑定相应的事件
         */
    	_bindEvents: $.emptyFunction,
    	/*
         * @method show
         * @desc show组件
         */
    	show: function( opts ){
			// var self = this;
			this.setOption( opts );

			if(!this.$el){
				this._create();
				this._render();
			}else if(opts){
				this._render();
			}else if(this.isShow){
				return;
			}

			this.isShow = true;

			// 是否出遮罩
			this.options.mask && pro.mask.show({
				tapHide: this.options.tapHide,
				relatedWidget: this
			});

			// 是否有动画
			if(this.options.animation){
				this.$el.show().addClass('js-effect');
				this.$el[0].offsetWidth;	// repaint
			}else{
				this.$el.removeClass('js-effect').show();
			}

			this.$el.off('webkitTransitionEnd');
			this.$el.addClass('js-show');

			// 是否需要阻止页面滚动
			/*if(this.options.preventScroll){
				$(document).on('touchmove', $.preventDefault);
			}*/
		},
		/*
         * @method hide
         * @desc hide组件
         */
		hide: function(){
			var self = this;

			if(!this.isShow){
				return;
			}

			this.isShow = false;

			if(this.options.animation){
				this.$el.one('webkitTransitionEnd', function(){
					self.$el.hide();
				});
			}else{
				this.$el.hide();
			}

			this.$el.removeClass('js-show');

			this.options.mask && pro.mask.hide();

			/*if(this.options.preventScroll){
				$(document).off('touchmove', $.preventDefault);
			}*/
		}
    };


	// TODO $.env 为业务代码, 需要抽离
	$.env = {};
})(Zepto);



;(function( $, pro ) {
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
    *           className: 'ui-clor-red',//添加自己的样式
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
    pro.createWidget( 'ActionShare', {
        options: {
            mask: true,
            animation: true,
            tapHide: true,
            preventScroll: true,
            content: '',
            btnHandle: []
        },
        tpl: {
            main: '<div class="ui-action-sheet">\
                    <div class="sheet-title ui-border-b">分享到:</div>\
                    <ul class="content"></ul>\
                    <div class="ui-color-blue btn btn-cancel" data-cmd="as-cancel" data-dismiss="true">取消</div>\
                </div>',
            ul: '<% for(var i = 0, l = list.length; i < l; i++){\
                      if(typeof(list[i]) === "string"){\
                 %>\
                      <li class="ui-color-blue btn" data-dismiss="true"><%=list[i]%></li>\
                      <% }else{ %>\
                      <li <%=list[i].id ? "id="+list[i].id : ""%> class="ui-color-blue btn <%=list[i].className ? list[i].className : ""%>" data-dismiss="true" <%=list[i].cmd ? "data-cmd="+list[i].cmd : ""%> ><%=list[i].value ? list[i].value : ""%></li>\
                      <% }\
                } %>'
        }, 
        _render: function(){
            var options = this.options;

            if($.isArray(options.content)){
                this.$el.find('.content').html($.template(this.tpl.ul, { list : options.content }));
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
    }, true);
})(Zepto, pro);

;(function( $, pro ) {
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
    *           className: 'ui-clor-red',//添加自己的样式
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
    pro.createWidget( 'ActionSheet', {
        options: {
            mask: true,
            animation: true,
            tapHide: true,
            preventScroll: true,
            content: '',
            btnHandle: []
        },
        tpl: {
            main: '<div class="ui-action-sheet">\
                    <ul class="content"></ul>\
                    <div class="ui-color-blue btn btn-cancel" data-cmd="as-cancel" data-dismiss="true">取消</div>\
                </div>',
            ul: '<% for(var i = 0, l = list.length; i < l; i++){\
                      if(typeof(list[i]) === "string"){\
                 %>\
                      <li class="ui-color-blue ui-border-1px btn" data-dismiss="true"><%=list[i]%></li>\
                      <% }else{ %>\
                      <li <%=list[i].id ? "id="+list[i].id : ""%> class="ui-color-blue ui-border-1px btn <%=list[i].className ? list[i].className : ""%>" data-dismiss="true" <%=list[i].cmd ? "data-cmd="+list[i].cmd : ""%> ><%=list[i].value ? list[i].value : ""%></li>\
                      <% }\
                } %>'
        }, 
        _render: function(){
            var options = this.options;

            if($.isArray(options.content)){
                this.$el.find('.content').html($.template(this.tpl.ul, { list : options.content }));
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
    }, true);
})(Zepto, pro);

;(function($){
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
        $('body').addClass('js-bounce-fix');
        bounceFix();
    }
})(Zepto);

/**
 * by jdo
 * 20140625
 * summary: a slider depend on zetpo, which work for mobile
 * update: by felixqslai on 20141215
 */


function slider ( element, options ) {

    var $wrap = this.$wrap = $(element);

    $.extend(this, {
        $inner : $wrap.find('.ui-carousel-inner'),
        // son item 内部子节点
        $item : $wrap.find('.ui-carousel-item'),
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
        this.$wrap.find('.ui-carousel-dots').remove();
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

    var CALSS = 'ui-carousel-dots-curr';
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
            lastNode.classList.add('ui-carousel-item-last');
        } else {
            lastNode.className = 'ui-carousel-item ui-carousel-item-last';
        }

        // 插入复制的节点
        that.$inner.append([firstNode, lastNode]);
    }

    // 检测是否激活触点导航控件
    if ( that.enableDots ) {
        // create navigator
        var dotstmpl = '<p class="ui-carousel-dots">';

        for ( var i = 0; i < framesLen; i++ ) {
            dotstmpl += '<a class="ui-carousel-dots-i">'+ (i+1) +'</a>';
        }
        dotstmpl += '</p>';

        that.$wrap.append(dotstmpl);
        // collection dots node
        that.$dots = that.$wrap.find('.ui-carousel-dots-i');
        that.$dots.eq(that.current).addClass('ui-carousel-dots-curr');
    }
}

$.Carousel = slider;

// $.fn.carousel = function (option) {
//     return this.each(function () {
//         var $this   = $(this);
//         var data    = $this.data('carousel');

//         if ( option === 'clear' ) {
//             if ( data ) {
//                 $this.data('carousel', null);
//                 data.clear();
//                 data = null;
//             }
//         } else {
//             var options = $.extend({}, $this.data(), typeof option == 'object' ? option : {});
//             if ( !data ) {
//                 $this.data('carousel', (data = new slider(this, options)));
//             }
//             if ( typeof option === 'number' ) data.to(option, !!1);
//         }
//     });
// };

;(function($){
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
})(Zepto);
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

;(function( $, pro ) {
    pro.createWidget( 'Dot', {
        options: {
            type: 'normal',   // normal, new, num
            color: 'red',   // red 或 blue
            content: '',    // New红点和数字红点需要指定content
            css: null   // 样式，可以自由控制红点的位置和大小，默认红点在容器的右上角
        },
        tpl: '<div></div>',
        _render: function(){
            var options = this.options;
            
            this.$el.removeClass().addClass('ui-dot-' + options.type + ' ' + 'ui-dot-' + options.color).text(options.content);

            if(options.css){
                this.$el.css(options.css);
            }else{
                this.$el.addClass('ui-dot-tr');     // 位置默认在容器的右上角
            }
        }
    });
})(Zepto, pro);

;(function( $, pro ) {
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

;(function( $, pro ) {
    var cssPrefix = '-webkit-';
    var ratio = window.devicePixelRatio == 1? 1 : 2;

    var sheet = $.insertStyleSheet();

    var cache = {}; /* Cache animation rules */
    
    pro.createWidget( 'Loading', {
        options: {
            size: 30,               // The width/ height of the spinner

            lineWidth : 2,         // The the width of each lines in px
            lines: 12,            // The number of lines to draw

            color : '158,158,158',      // Must be an RGB string

            duration: 1.6        // Seconds per round
        },
        tpl: '<canvas></canvas>',
        _addAnimation: function(lines){
            var name = 'js-loading-' + lines;

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

            this.$el.css(cssPrefix + 'animation', this._addAnimation(lines) + ' ' + options.duration + 's step-start infinite');

            var style = { width: halfSize, height: halfSize };
            style[cssPrefix + 'transform-origin'] = '0 0';
            style[cssPrefix + 'transform'] = 'scale(0.5)';
            this.$container.css(style);

            this.$el.appendTo(this.$container);
        }
    });
})(Zepto, pro);

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


(function( $, pro ) {
    pro.createWidget( 'RichLoading', {
        options: {
            preventScroll: true,
            content: '',
            onClose: $.emptyFunction
        },
        tpl: '<div class="ui-rich-loading">\
                <div class="loading" data-color="255,255,255" data-size="36"></div>\
                <div class="ui-no-wrap content"></div>\
                <div class="ui-icon-close btn"></div>\
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


;(function( $, pro ) {
	pro.createWidget( 'Mask', {
		options: {
			animation: true,
			preventScroll: true
		},
		tpl: '<div class="ui-mask"></div>',
		_bindEvents: function(){
            var self = this;

            var options = this.options;

            this.$el.on('tap', function(){
            	if(options.tapHide === true){
					if(options.relatedWidget){
						$.isFunction(options.relatedWidget.hide) && options.relatedWidget.hide();
					}
					self.hide();
				}else if($.isFunction(options.tapHide)){
					options.tapHide();
				}
			});
        }
	}, true);
})(Zepto, pro);

/**
 * by jdo
 * 
 * summary : 多级下拉菜单，最多支持3级
 */
;(function ($, pro, undefined){

	// var _initialize = 0;
    // android 4, 4.4
    // 页面滚动触发时，不触发`touchmove`事件
    // 暂无更好办法，先列为低端设备，做最原始的功能支持
    var ver = parseFloat($.env.systemVersion);
    var isPoorDevice = $.isPoorDevice || $.os.android && (ver === 4.4 || ver === 4);

    // alert(isPoorDevice)
	
	pro.createWidget('MultSelector', {

		options : {
			mask: true,
            animation: true,
            tapHide: true,
            selected: [],
            option: [],
            effect: 'from-top',
            maxRoot: 4,
            onShowChild : function () {},
            onChangeChild : function () {},
            onSelect : function () {}
		},

		$roots : null,
		$body : $(document.body),

		currShowing : null,

		tpl : {
			main: '<div class="ui-border-1px ui-multselect"></div>',

			selected : '<% \
						for ( var i = 0, len = Math.min(dat.length, maxRoot); i < len; i++ ) {\
					%>\
						<div class="ui-multselect-selected ui-multselect-<%= len %>grid">\
                            <div class="ui-selected-text-wrap<%= i+1 === len ? "":" ui-border-1px" %>">\
    				            <span class="ui-selected-text ui-no-wrap"><%= dat[i] %></span>\
    				            <i class="ui-icon-arrow ui-arrow-down"></i>\
                            </div>\
				        </div>\
					<% } %>',

			option : '<div class="ui-multselect-panel ui-border-1px <%= effect %> <%= cla %>">\
							<div class="ui-multselect-child left" data-panel="left">\
								<ul>\
								<%\
									var hasThirdPanel, currChild, slSecond, isActive = "";\
									defaultParent = defaultParent || tree[1][0];\
									for ( var i = 0, len = tree.length; i < len; i++ ) {\
										var item = tree[i], text, third;\
										if ( $.isArray(item) ) {\
											text = item[0];\
											third = item[1];\
											var hasThird = $.isArray(third) && third.length;\
											if ( !hasThirdPanel && hasThird ) hasThirdPanel = true;\
										} else {\
											text = item;\
											hasThird = hasThirdPanel = false;\
										}\
                                        var roots = text.split("&"), icon = "";\
                                        if ( roots.length === 2 ) {\
                                            text  = roots[0];\
                                            icon = roots[1];\
                                            third ? tree[i][0] = text : tree[i] = text\
                                        }\
										if ( defaultParent === text ) {\
											isActive = "active";\
											slSecond = i;\
											currChild = third;\
										} else {\
											isActive = "";\
										}\
								%>\
									<li class="ui-border-1px ui-multselect-child-li <%= isActive %><%= hasThird ? "" : " no-more" %>" data-index="<%=i%>">\
					            		<% if (icon) { %>\
                                            <div class="ui-multselect-child-li-icon <%= icon %>"></div>\
                                        <% } %>\
                                        <div class="ui-multselect-child-text ui-no-wrap"><%= text %></div>\
					            		<i class="ui-icon-arrow ui-arrow-right"></i>\
					            	</li>\
				            	<% } %>\
				            	</ul>\
       						</div>\
       						<div class="ui-multselect-child right" data-panel="right"><ul></ul></div>\
			            	<%\
                            var slThird = $.isArray(currChild) && currChild.length ? currChild.indexOf(defaultChild) : -1;\
                            slThird = slThird === -1 ? undefined : slThird;\
			            	bridging({\
			            		slSecond : slSecond,\
                                slThird : slThird,\
			            		tmpSecond : slSecond,\
                                tmpThird : slThird,\
			            		hasThirdPanel : hasThirdPanel\
			            	});\
			            	%>\
   						</div>'

		},
		_init: function (el, opts) {

            this.$super('_init', el, opts);
            this._create();

            if ( opts.selected && opts.selected.length ) this._renderRoot();
            if ( opts.option &&  opts.option.length) this._initPullDown();

		},
		_renderRoot: function(){
			var opts = this.options;
			var selected = opts.selected;

			if ( selected && selected.length ) {
				this.$roots = this.$el.html($.template(this.tpl.selected, { dat : selected, maxRoot : opts.maxRoot })).find('.ui-multselect-selected');
			}
        },
        _initPullDown : function () {
        	var opts = this.options;
        	var $roots = this.$roots;

			$.each(opts.option, function (k, child) {
				// 检查子节点是否存在
                // console.log(child)
				if ( child.tree && child.tree.length ) {
					$roots.eq(k).addClass('ui-multselect-root-more');
				}
			});
        },
        _bindEvents: function () {
        	var that = this;

        	this.$el
            .on('touchmove', function (e) {
                e.preventDefault();
            })
            .on('tap', '.ui-multselect-selected', function () {
        		var $elem = $(this);

        		if ( $elem.hasClass('ui-multselect-root-more') ) {
        			if ( $elem.hasClass('active') ) {
                        that.hide();
        				that.currShowing = null;
        			} else {
        				var index = parseInt($elem.index());
	        			var children = that.options.option;
	        			var child;

	        			if ( that.currShowing !== null ) {
                            that.$roots[that.currShowing].$panel.css('display', 'none');
	        				that.hide();
	        			}

	        			if ( children && (child = children[index]) ) {
	        				that.currShowing = index;
	        				that.showSubPanel(this, child);
	        			}
        			}
        		}
        	});

            // var that = this;
            this.$body.on('tap', '.ui-multselect-panel li', function () {
                if ( this.currShowing !== null ) {
                    var $this = $(this);
                    var $parent = $this.parents('.ui-multselect-child');

                    var child = that.options.option[that.currShowing];
                    var index = parseInt($this.data('index'));
                    var panel = $parent.hasClass('left') ? 'tmpSecond' : 'tmpThird';
                    var slChildIndex = child[panel];
                    // 触发onSelect标识
                    var isSelect;

                    // 存在子节点
                    if ( panel === 'tmpSecond' ) {

                        var curr = child.tree[index][1] || [];
                        // 非选中状态，即可更新面板
                        if ( index != slChildIndex ) {
                            that._renderThirdPanel($parent.next(), curr);
                        }
                        // 不存在三级菜单
                        if ($this.hasClass('no-more')) {
                            // 这里要清空三级选中状态
                            // 主要避免上一次选择遗留的数据
                            delete child.tmpThird;
                            that.hide();
                            isSelect = true;
                        }
                    } else {
                        that.hide();
                        isSelect = true;
                    }

                    // 更新选择状态
                    if ( index != slChildIndex ) {
                        // 初始化选中索引有可能为undefined
                        if ( slChildIndex !== undefined ) {
                            $parent.find('li:nth-child('+ (slChildIndex+1) +')').removeClass('active');
                        }
                        $parent.find('li:nth-child('+ (index+1) +')').addClass('active');
                        child[panel] = index;
                    }

                    isSelect && that._onSelect();
                }
            });
            // hack for android
            if ( $.os.android ) {
                // var $uisearchinput = $(".ui-search-input")[0];
                var currY, startScrollTop;

                this.$body.on('touchstart', '.ui-multselect-child[data-bouncefix]', function (e) {
                    e.preventDefault();
                })
                .on('touchstart', '.ui-multselect-child[data-scrollable]', function (e) {
                    var touch = e.touches[0];
                    var el = e.currentTarget;

                    currY = touch.pageY;
                    startScrollTop = el.scrollTop;
                })
                .on('touchmove', '.ui-multselect-child[data-scrollable]', function (e) {
                    var touch = e.touches[0];
                    var dis = touch.pageY - currY;

                    var el = e.currentTarget,
                        curPos = el.scrollTop,
                        height = el.clientHeight,
                        scroll = el.scrollHeight;

                    // alert(el.className);
                    // $uisearchinput.value = Math.random();

                    if ( curPos === 0 && dis > 0 || curPos === scroll - height && dis < 0 ) {
                        e.preventDefault();
                    }

                    // hack for poor device - andriod 3.0-
                    if ( isPoorDevice ) {
                        el.scrollTop = startScrollTop-dis;
                        e.preventDefault();
                    }

                });
            }
        },
        showSubPanel : function (root, child) {
            // render tree panel
        	this._renderSubPanel(root, child);
        	// undate root's status
            $(root).addClass('active');
            // 是否出遮罩
            this.options.mask && pro.mask.show({
                tapHide: this.options.tapHide,
                relatedWidget: this
            });
        	var that = this;
        	setTimeout(function () {
        		$( root.$panel ).removeClass(that.options.effect);
        	}, 30);
        },
        hide : function () {
            var root = this.$roots[this.currShowing];
            if ( root ) {

                $(root).removeClass('active');
                
                if ( root.$panel ) {
                    $( root.$panel )
                        .css('top', 0)
                        .addClass(this.options.effect);
                }

                this.options.mask && pro.mask.hide();
            }
        },
        add : function (index, root) {
            var opts = this.options;
            var option = opts.option;
            var max = opts.selected.length;
            var curr = option.length;

            // 指定强制更新某一节点
            if ( typeof index === 'number' && $.isArray(root) && root.length ) {

                var child;

                if ( index < max && (child = option[index]) ) {
                    child.tree = root;
                    child.refresh = true;
                }
                // call _initPullDown
                this._initPullDown();


            } else if ( $.isArray(index) ) {
                if ( curr < max ) {
                    // 复制节点数据
                    var tree = Array.prototype.slice.call(arguments, 0, max - curr);
                    
                    for ( var i = 0, len = tree.length; i < len; i++ ) {
                        option.tree.push( tree[i] );
                    }
                    // call _initPullDown
                    this._initPullDown();
                }
            }
        },
        reset : function (index, opt) {
            if ( typeof index === 'number' && opt ) {

                // var child;
                var options = this.options;
                var max = options.selected.length;

                if ( index < max ) {
                    opt.refresh = true;
                    options.option[index] = opt;
                    var selected = opt.defaultChild || opt.defaultParent;
                    // 更新selected字段
                    if ( selected !== options.selected[index] ) {
                        this.$roots.eq(index).find('.ui-selected-text').text(options.selected[index] = selected);
                    }
                }
                // call _initPullDown
                this._initPullDown();
            }
        },
        _renderSubPanel : function (root, child) {

            var force = false;
            var that = this;

            // 选项子集有变动，重新生成选择面板
            if ( child.refresh ) {
                // release panel node
                if ( root.$panel ) {
                    // 移除android端兼容事件
                    if ( $.os.android ) root.$panel.find('.ui-multselect-child').off();
                    // 移除节点
                    root.$panel.remove();
                    delete root.$panel;
                }
                delete child.refresh;
            }

        	if ( !root.$panel ) {
                var opts = this.options;

        		child.effect = opts.effect;
                child.cla = 'js-multselect-panel-'+this.currShowing;
                // child.top = opts.panelOffsetTop;
        		// 从模版中提取变量
        		// 省去重新遍历
        		child.bridging = function (dat) {
        			$.extend(child, dat);
        		};
        		root.$panel = $($.template(this.tpl.option, child)).appendTo(this.$body);

        		// 不存在第三级面板
        		if ( !child.hasThirdPanel ) root.$panel.addClass('no-third');

        		// this._bindSubEvents(root.$panel);
                // 初始化强制刷新标识
                force = true;
                // 初始化二级菜单滚动条
                setTimeout( function () {
                    that._initScroll(root.$panel.find('.ui-multselect-child.left'));
                }, 0 );
        	}

            var $panel = root.$panel;

            var clientRect = that.$el[0].getBoundingClientRect();

            $panel.css({
                // hack for poor equipment
                'top': clientRect.bottom + ($.env.isPoorDevice ? document.body.scrollTop : 0),
                'display': '-webkit-box'
            });

            var slSecond = child.slSecond;
            var slThird  = child.slThird;

            if ( this._need2Refresh(child, force) ) {

                // 更新临时选中字段
                child.tmpSecond = slSecond;
                child.tmpThird  = slThird;

                // 渲染第三级子菜单
                // `hasThirdPanel`由模版内部遍历检查
                // 这边不再重复对数据类型检查
                if ( child.hasThirdPanel ) {
                    var hasThird = child.tree[slSecond];
                    this._renderThirdPanel($panel.find('.ui-multselect-child.right'), hasThird[1] || []);
                }
                
            }

            // 初始化下拉菜单选择状态
            $panel.find('.ui-multselect-child.left li').removeClass('active').eq(slSecond).addClass('active');

            if ( slThird !== undefined )
                $panel.find('.ui-multselect-child.right li').removeClass('active').eq(slThird).addClass('active');

        },
        _renderThirdPanel : function ($parent, children) {
        	$parent.html('<ul>'+$.map(children, function (child, k) {
        		return '<li class="ui-border-1px ui-multselect-child-li" data-index="'+ k +'"><div class="ui-multselect-child-text ui-no-wrap">'+ child +'</div></li>';
        	}).join('')+'</ul>');

            var that = this;
            setTimeout(function () {
                that._initScroll($parent);
            }, 0);
        },
        _initScroll : function ($node) {
            var node = $node[0];
            node.scrollTop = 0;
            $node
                .attr( 'data-bouncefix', null )
                .attr( 'data-scrollable', null )
                .attr( node.clientHeight >= node.scrollHeight ? 'data-bouncefix' : 'data-scrollable', '');
        },
        _onSelect : function () {

            var child = this.options.option[this.currShowing];
            var tree = child.tree;

            if ( this._need2Refresh(child) ) {

                var tmpSecond = child.tmpSecond;
                var tmpThird = child.tmpThird;
                // 更新选中字段
                child.slSecond = tmpSecond;
                child.slThird = tmpThird;

                // 更新文案字段
                var parent = tree[tmpSecond];

                child.defaultParent = $.isArray(parent) ? parent[0] : parent;
                child.defaultChild  = tmpThird !== undefined ? parent[1][tmpThird] : '';

                // call onSelect function
                this.options.onSelect(this.options.option);
                // console.log(this.options.option)

                // refresh root's text
                this.$roots.eq(this.currShowing).find('.ui-selected-text').text(child.defaultChild || child.defaultParent);
            }

        },
        _need2Refresh : function (child, isForce) {

            var slSecond = child.slSecond;
            var slThird = child.slThird;

            var tmpSecond = child.tmpSecond;
            var tmpThird = child.tmpThird;

            var hadChange = false;

            // 初始状态`slThird` `tmpThird` 都为undefined
            // 但初始化时候需要生成第三级菜单
            // `isForce`用于初始化时候强制生成
            if ( isForce || slSecond !== tmpSecond || slThird !== tmpThird ) {
                hadChange = true;
            }

            return hadChange;
        }
	});

})(Zepto, pro);
;(function($, pro) {
    pro.createWidget('Progress', {
        options: {
            percentage: 0, // 0% 当前进度   
            total: 100, // 100MB 总大小  
            content: '下载中' // 提示文字
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
            this.$el.find('.progress-text').text(options.content);
            this.$el.find('.progress-size-total').text(options.total);
            this.$el.find('.progress-size-curr').text((options.total * options.percentage / 100).toFixed(2));
            this.$el.find('.progress-bar').width(options.percentage + '%');
            this.$el.find('.progress-mask').height(100 - options.percentage + '%');
            this.$el.find('.progress-number').text(options.percentage);  

            if (deg <= 180) {
                // 小于 180 旋转右半圆
                 this.$el.find('.ui-progress-right').css('transform', "rotate(" + deg + "deg)");
                 this.$el.find('.ui-progress-left').css('transform', "rotate(0deg)");
            } else {
                // 大于 180 旋转左半圆
                 this.$el.find('.ui-progress-right').css('transform', "rotate(180deg)");
                 this.$el.find('.ui-progress-left').css('transform', "rotate(" + (deg - 180) + "deg)");
            }
        },

        _bindEvents: function(){
            this.$el.on('tap', '.action-cancle', function(e){
                // TODO
                console.log('cancle');
            });
        },

        changeProgress: function (percentage){
            var options = this.options;
            options.percentage = percentage;

            this._setProgress(options);         
        }
    });
})(Zepto, pro);

;(function($, pro) {
    pro.createWidget('Range', {
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
            var $val =  this.$el.find('.ui-range-val');
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
})(Zepto, pro);

;(function($){
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
})(Zepto);
;(function($){
	$.extend($.fn, {
		// 有点击态的按钮
		active: function(fn, className){
			className = className || 'js-active';
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
})(Zepto);
;(function( $, pro ) {
    /*
    *   Tab 组件
    *
    *   使用示例：
    *    $("#id").tab({
    *       $el: '.ui-tab',//tab item 父层通常为ul
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
            main: '<ul class="ui-tab"></ul>',
            ul: '<% for(var i = 0, l = list.length; i < l; i++){ %>\
                    <li class="ui-border-1px item"><%=list[i]%></li>\
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

;(function( $, pro ) {
	pro.createWidget( 'Toast', {
		options: {
			animation: true,
			preventScroll: true,
			state: 'warning',	// 三种状态 warning，tips，success，参见 http://waltz.cdc.com/mqq.html#3539
			content: '',
			duration: 2000
		},
		tpl: '<div class="ui-toast">\
			  	<i></i>\
			  	<span class="ui-color-white"></span>\
			  </div>',
		_render: function(){
			this.$el.find('i').removeClass().addClass('ui-icon-' + this.options.state);
			this.$el.find('span').text(this.options.content);
		},
		show: function( opts ){
			var self = this;

			this.$super('show', opts);

			if(this.options.duration){
				clearTimeout(this.timer);
				
				this.timer = setTimeout(function(){
					self.hide();
				}, this.options.duration);
			}
		},
	}, true);
})(Zepto, pro);

;(function( $, pro ) {
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

;(function( $, pro ) {
    var cssPrefix = '-webkit-';
    var ratio = window.devicePixelRatio == 1? 1 : 2;

    var sheet = $.insertStyleSheet();

    var cache = {}; /* Cache animation rules */
    
    pro.createWidget( 'Loading', {
        options: {
            size: 30,               // The width/ height of the spinner

            lineWidth : 2,         // The the width of each lines in px
            lines: 12,            // The number of lines to draw

            color : '158,158,158',      // Must be an RGB string

            duration: 1.6        // Seconds per round
        },
        tpl: '<canvas></canvas>',
        _addAnimation: function(lines){
            var name = 'js-loading-' + lines;

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

            this.$el.css(cssPrefix + 'animation', this._addAnimation(lines) + ' ' + options.duration + 's step-start infinite');

            var style = { width: halfSize, height: halfSize };
            style[cssPrefix + 'transform-origin'] = '0 0';
            style[cssPrefix + 'transform'] = 'scale(0.5)';
            this.$container.css(style);

            this.$el.appendTo(this.$container);
        }
    });
})(Zepto, pro);

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


(function( $, pro ) {
    pro.createWidget( 'RichLoading', {
        options: {
            preventScroll: true,
            content: '',
            onClose: $.emptyFunction
        },
        tpl: '<div class="ui-rich-loading">\
                <div class="loading" data-color="255,255,255" data-size="36"></div>\
                <div class="ui-no-wrap content"></div>\
                <div class="ui-icon-close btn"></div>\
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


;(function( $, pro ) {
	pro.createWidget( 'Mask', {
		options: {
			animation: true,
			preventScroll: true
		},
		tpl: '<div class="ui-mask"></div>',
		_bindEvents: function(){
            var self = this;

            var options = this.options;

            this.$el.on('tap', function(){
            	if(options.tapHide === true){
					if(options.relatedWidget){
						$.isFunction(options.relatedWidget.hide) && options.relatedWidget.hide();
					}
					self.hide();
				}else if($.isFunction(options.tapHide)){
					options.tapHide();
				}
			});
        }
	}, true);
})(Zepto, pro);

/**
 * by jdo
 * 
 * summary : 多级下拉菜单，最多支持3级
 */
;(function ($, pro, undefined){

	// var _initialize = 0;
    // android 4, 4.4
    // 页面滚动触发时，不触发`touchmove`事件
    // 暂无更好办法，先列为低端设备，做最原始的功能支持
    var ver = parseFloat($.env.systemVersion);
    var isPoorDevice = $.isPoorDevice || $.os.android && (ver === 4.4 || ver === 4);

    // alert(isPoorDevice)
	
	pro.createWidget('MultSelector', {

		options : {
			mask: true,
            animation: true,
            tapHide: true,
            selected: [],
            option: [],
            effect: 'from-top',
            maxRoot: 4,
            onShowChild : function () {},
            onChangeChild : function () {},
            onSelect : function () {}
		},

		$roots : null,
		$body : $(document.body),

		currShowing : null,

		tpl : {
			main: '<div class="ui-border-1px ui-multselect"></div>',

			selected : '<% \
						for ( var i = 0, len = Math.min(dat.length, maxRoot); i < len; i++ ) {\
					%>\
						<div class="ui-multselect-selected ui-multselect-<%= len %>grid">\
                            <div class="ui-selected-text-wrap<%= i+1 === len ? "":" ui-border-1px" %>">\
    				            <span class="ui-selected-text ui-no-wrap"><%= dat[i] %></span>\
    				            <i class="ui-icon-arrow ui-arrow-down"></i>\
                            </div>\
				        </div>\
					<% } %>',

			option : '<div class="ui-multselect-panel ui-border-1px <%= effect %> <%= cla %>">\
							<div class="ui-multselect-child left" data-panel="left">\
								<ul>\
								<%\
									var hasThirdPanel, currChild, slSecond, isActive = "";\
									defaultParent = defaultParent || tree[1][0];\
									for ( var i = 0, len = tree.length; i < len; i++ ) {\
										var item = tree[i], text, third;\
										if ( $.isArray(item) ) {\
											text = item[0];\
											third = item[1];\
											var hasThird = $.isArray(third) && third.length;\
											if ( !hasThirdPanel && hasThird ) hasThirdPanel = true;\
										} else {\
											text = item;\
											hasThird = hasThirdPanel = false;\
										}\
                                        var roots = text.split("&"), icon = "";\
                                        if ( roots.length === 2 ) {\
                                            text  = roots[0];\
                                            icon = roots[1];\
                                            third ? tree[i][0] = text : tree[i] = text\
                                        }\
										if ( defaultParent === text ) {\
											isActive = "active";\
											slSecond = i;\
											currChild = third;\
										} else {\
											isActive = "";\
										}\
								%>\
									<li class="ui-border-1px ui-multselect-child-li <%= isActive %><%= hasThird ? "" : " no-more" %>" data-index="<%=i%>">\
					            		<% if (icon) { %>\
                                            <div class="ui-multselect-child-li-icon <%= icon %>"></div>\
                                        <% } %>\
                                        <div class="ui-multselect-child-text ui-no-wrap"><%= text %></div>\
					            		<i class="ui-icon-arrow ui-arrow-right"></i>\
					            	</li>\
				            	<% } %>\
				            	</ul>\
       						</div>\
       						<div class="ui-multselect-child right" data-panel="right"><ul></ul></div>\
			            	<%\
                            var slThird = $.isArray(currChild) && currChild.length ? currChild.indexOf(defaultChild) : -1;\
                            slThird = slThird === -1 ? undefined : slThird;\
			            	bridging({\
			            		slSecond : slSecond,\
                                slThird : slThird,\
			            		tmpSecond : slSecond,\
                                tmpThird : slThird,\
			            		hasThirdPanel : hasThirdPanel\
			            	});\
			            	%>\
   						</div>'

		},
		_init: function (el, opts) {

            this.$super('_init', el, opts);
            this._create();

            if ( opts.selected && opts.selected.length ) this._renderRoot();
            if ( opts.option &&  opts.option.length) this._initPullDown();

		},
		_renderRoot: function(){
			var opts = this.options;
			var selected = opts.selected;

			if ( selected && selected.length ) {
				this.$roots = this.$el.html($.template(this.tpl.selected, { dat : selected, maxRoot : opts.maxRoot })).find('.ui-multselect-selected');
			}
        },
        _initPullDown : function () {
        	var opts = this.options;
        	var $roots = this.$roots;

			$.each(opts.option, function (k, child) {
				// 检查子节点是否存在
                // console.log(child)
				if ( child.tree && child.tree.length ) {
					$roots.eq(k).addClass('ui-multselect-root-more');
				}
			});
        },
        _bindEvents: function () {
        	var that = this;

        	this.$el
            .on('touchmove', function (e) {
                e.preventDefault();
            })
            .on('tap', '.ui-multselect-selected', function () {
        		var $elem = $(this);

        		if ( $elem.hasClass('ui-multselect-root-more') ) {
        			if ( $elem.hasClass('active') ) {
                        that.hide();
        				that.currShowing = null;
        			} else {
        				var index = parseInt($elem.index());
	        			var children = that.options.option;
	        			var child;

	        			if ( that.currShowing !== null ) {
                            that.$roots[that.currShowing].$panel.css('display', 'none');
	        				that.hide();
	        			}

	        			if ( children && (child = children[index]) ) {
	        				that.currShowing = index;
	        				that.showSubPanel(this, child);
	        			}
        			}
        		}
        	});

            // var that = this;
            this.$body.on('tap', '.ui-multselect-panel li', function () {
                if ( this.currShowing !== null ) {
                    var $this = $(this);
                    var $parent = $this.parents('.ui-multselect-child');

                    var child = that.options.option[that.currShowing];
                    var index = parseInt($this.data('index'));
                    var panel = $parent.hasClass('left') ? 'tmpSecond' : 'tmpThird';
                    var slChildIndex = child[panel];
                    // 触发onSelect标识
                    var isSelect;

                    // 存在子节点
                    if ( panel === 'tmpSecond' ) {

                        var curr = child.tree[index][1] || [];
                        // 非选中状态，即可更新面板
                        if ( index != slChildIndex ) {
                            that._renderThirdPanel($parent.next(), curr);
                        }
                        // 不存在三级菜单
                        if ($this.hasClass('no-more')) {
                            // 这里要清空三级选中状态
                            // 主要避免上一次选择遗留的数据
                            delete child.tmpThird;
                            that.hide();
                            isSelect = true;
                        }
                    } else {
                        that.hide();
                        isSelect = true;
                    }

                    // 更新选择状态
                    if ( index != slChildIndex ) {
                        // 初始化选中索引有可能为undefined
                        if ( slChildIndex !== undefined ) {
                            $parent.find('li:nth-child('+ (slChildIndex+1) +')').removeClass('active');
                        }
                        $parent.find('li:nth-child('+ (index+1) +')').addClass('active');
                        child[panel] = index;
                    }

                    isSelect && that._onSelect();
                }
            });
            // hack for android
            if ( $.os.android ) {
                // var $uisearchinput = $(".ui-search-input")[0];
                var currY, startScrollTop;

                this.$body.on('touchstart', '.ui-multselect-child[data-bouncefix]', function (e) {
                    e.preventDefault();
                })
                .on('touchstart', '.ui-multselect-child[data-scrollable]', function (e) {
                    var touch = e.touches[0];
                    var el = e.currentTarget;

                    currY = touch.pageY;
                    startScrollTop = el.scrollTop;
                })
                .on('touchmove', '.ui-multselect-child[data-scrollable]', function (e) {
                    var touch = e.touches[0];
                    var dis = touch.pageY - currY;

                    var el = e.currentTarget,
                        curPos = el.scrollTop,
                        height = el.clientHeight,
                        scroll = el.scrollHeight;

                    // alert(el.className);
                    // $uisearchinput.value = Math.random();

                    if ( curPos === 0 && dis > 0 || curPos === scroll - height && dis < 0 ) {
                        e.preventDefault();
                    }

                    // hack for poor device - andriod 3.0-
                    if ( isPoorDevice ) {
                        el.scrollTop = startScrollTop-dis;
                        e.preventDefault();
                    }

                });
            }
        },
        showSubPanel : function (root, child) {
            // render tree panel
        	this._renderSubPanel(root, child);
        	// undate root's status
            $(root).addClass('active');
            // 是否出遮罩
            this.options.mask && pro.mask.show({
                tapHide: this.options.tapHide,
                relatedWidget: this
            });
        	var that = this;
        	setTimeout(function () {
        		$( root.$panel ).removeClass(that.options.effect);
        	}, 30);
        },
        hide : function () {
            var root = this.$roots[this.currShowing];
            if ( root ) {

                $(root).removeClass('active');
                
                if ( root.$panel ) {
                    $( root.$panel )
                        .css('top', 0)
                        .addClass(this.options.effect);
                }

                this.options.mask && pro.mask.hide();
            }
        },
        add : function (index, root) {
            var opts = this.options;
            var option = opts.option;
            var max = opts.selected.length;
            var curr = option.length;

            // 指定强制更新某一节点
            if ( typeof index === 'number' && $.isArray(root) && root.length ) {

                var child;

                if ( index < max && (child = option[index]) ) {
                    child.tree = root;
                    child.refresh = true;
                }
                // call _initPullDown
                this._initPullDown();


            } else if ( $.isArray(index) ) {
                if ( curr < max ) {
                    // 复制节点数据
                    var tree = Array.prototype.slice.call(arguments, 0, max - curr);
                    
                    for ( var i = 0, len = tree.length; i < len; i++ ) {
                        option.tree.push( tree[i] );
                    }
                    // call _initPullDown
                    this._initPullDown();
                }
            }
        },
        reset : function (index, opt) {
            if ( typeof index === 'number' && opt ) {

                // var child;
                var options = this.options;
                var max = options.selected.length;

                if ( index < max ) {
                    opt.refresh = true;
                    options.option[index] = opt;
                    var selected = opt.defaultChild || opt.defaultParent;
                    // 更新selected字段
                    if ( selected !== options.selected[index] ) {
                        this.$roots.eq(index).find('.ui-selected-text').text(options.selected[index] = selected);
                    }
                }
                // call _initPullDown
                this._initPullDown();
            }
        },
        _renderSubPanel : function (root, child) {

            var force = false;
            var that = this;

            // 选项子集有变动，重新生成选择面板
            if ( child.refresh ) {
                // release panel node
                if ( root.$panel ) {
                    // 移除android端兼容事件
                    if ( $.os.android ) root.$panel.find('.ui-multselect-child').off();
                    // 移除节点
                    root.$panel.remove();
                    delete root.$panel;
                }
                delete child.refresh;
            }

        	if ( !root.$panel ) {
                var opts = this.options;

        		child.effect = opts.effect;
                child.cla = 'js-multselect-panel-'+this.currShowing;
                // child.top = opts.panelOffsetTop;
        		// 从模版中提取变量
        		// 省去重新遍历
        		child.bridging = function (dat) {
        			$.extend(child, dat);
        		};
        		root.$panel = $($.template(this.tpl.option, child)).appendTo(this.$body);

        		// 不存在第三级面板
        		if ( !child.hasThirdPanel ) root.$panel.addClass('no-third');

        		// this._bindSubEvents(root.$panel);
                // 初始化强制刷新标识
                force = true;
                // 初始化二级菜单滚动条
                setTimeout( function () {
                    that._initScroll(root.$panel.find('.ui-multselect-child.left'));
                }, 0 );
        	}

            var $panel = root.$panel;

            var clientRect = that.$el[0].getBoundingClientRect();

            $panel.css({
                // hack for poor equipment
                'top': clientRect.bottom + ($.env.isPoorDevice ? document.body.scrollTop : 0),
                'display': '-webkit-box'
            });

            var slSecond = child.slSecond;
            var slThird  = child.slThird;

            if ( this._need2Refresh(child, force) ) {

                // 更新临时选中字段
                child.tmpSecond = slSecond;
                child.tmpThird  = slThird;

                // 渲染第三级子菜单
                // `hasThirdPanel`由模版内部遍历检查
                // 这边不再重复对数据类型检查
                if ( child.hasThirdPanel ) {
                    var hasThird = child.tree[slSecond];
                    this._renderThirdPanel($panel.find('.ui-multselect-child.right'), hasThird[1] || []);
                }
                
            }

            // 初始化下拉菜单选择状态
            $panel.find('.ui-multselect-child.left li').removeClass('active').eq(slSecond).addClass('active');

            if ( slThird !== undefined )
                $panel.find('.ui-multselect-child.right li').removeClass('active').eq(slThird).addClass('active');

        },
        _renderThirdPanel : function ($parent, children) {
        	$parent.html('<ul>'+$.map(children, function (child, k) {
        		return '<li class="ui-border-1px ui-multselect-child-li" data-index="'+ k +'"><div class="ui-multselect-child-text ui-no-wrap">'+ child +'</div></li>';
        	}).join('')+'</ul>');

            var that = this;
            setTimeout(function () {
                that._initScroll($parent);
            }, 0);
        },
        _initScroll : function ($node) {
            var node = $node[0];
            node.scrollTop = 0;
            $node
                .attr( 'data-bouncefix', null )
                .attr( 'data-scrollable', null )
                .attr( node.clientHeight >= node.scrollHeight ? 'data-bouncefix' : 'data-scrollable', '');
        },
        _onSelect : function () {

            var child = this.options.option[this.currShowing];
            var tree = child.tree;

            if ( this._need2Refresh(child) ) {

                var tmpSecond = child.tmpSecond;
                var tmpThird = child.tmpThird;
                // 更新选中字段
                child.slSecond = tmpSecond;
                child.slThird = tmpThird;

                // 更新文案字段
                var parent = tree[tmpSecond];

                child.defaultParent = $.isArray(parent) ? parent[0] : parent;
                child.defaultChild  = tmpThird !== undefined ? parent[1][tmpThird] : '';

                // call onSelect function
                this.options.onSelect(this.options.option);
                // console.log(this.options.option)

                // refresh root's text
                this.$roots.eq(this.currShowing).find('.ui-selected-text').text(child.defaultChild || child.defaultParent);
            }

        },
        _need2Refresh : function (child, isForce) {

            var slSecond = child.slSecond;
            var slThird = child.slThird;

            var tmpSecond = child.tmpSecond;
            var tmpThird = child.tmpThird;

            var hadChange = false;

            // 初始状态`slThird` `tmpThird` 都为undefined
            // 但初始化时候需要生成第三级菜单
            // `isForce`用于初始化时候强制生成
            if ( isForce || slSecond !== tmpSecond || slThird !== tmpThird ) {
                hadChange = true;
            }

            return hadChange;
        }
	});

})(Zepto, pro);
;(function($, pro) {
    pro.createWidget('Progress', {
        options: {
            percentage: 0, // 0% 当前进度   
            total: 100, // 100MB 总大小  
            content: '下载中' // 提示文字
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
            this.$el.find('.progress-text').text(options.content);
            this.$el.find('.progress-size-total').text(options.total);
            this.$el.find('.progress-size-curr').text((options.total * options.percentage / 100).toFixed(2));
            this.$el.find('.progress-bar').width(options.percentage + '%');
            this.$el.find('.progress-mask').height(100 - options.percentage + '%');
            this.$el.find('.progress-number').text(options.percentage);  

            if (deg <= 180) {
                // 小于 180 旋转右半圆
                 this.$el.find('.ui-progress-right').css('transform', "rotate(" + deg + "deg)");
                 this.$el.find('.ui-progress-left').css('transform', "rotate(0deg)");
            } else {
                // 大于 180 旋转左半圆
                 this.$el.find('.ui-progress-right').css('transform', "rotate(180deg)");
                 this.$el.find('.ui-progress-left').css('transform', "rotate(" + (deg - 180) + "deg)");
            }
        },

        _bindEvents: function(){
            this.$el.on('tap', '.action-cancle', function(e){
                // TODO
                console.log('cancle');
            });
        },

        changeProgress: function (percentage){
            var options = this.options;
            options.percentage = percentage;

            this._setProgress(options);         
        }
    });
})(Zepto, pro);

;(function($, pro) {
    pro.createWidget('Range', {
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
            var $val =  this.$el.find('.ui-range-val');
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
})(Zepto, pro);

;(function($){
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
})(Zepto);
;(function($){
	$.extend($.fn, {
		// 有点击态的按钮
		active: function(fn, className){
			className = className || 'js-active';
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
})(Zepto);
;(function( $, pro ) {
    /*
    *   Tab 组件
    *
    *   使用示例：
    *    $("#id").tab({
    *       $el: '.ui-tab',//tab item 父层通常为ul
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
            main: '<ul class="ui-tab"></ul>',
            ul: '<% for(var i = 0, l = list.length; i < l; i++){ %>\
                    <li class="ui-border-1px item"><%=list[i]%></li>\
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

;(function( $, pro ) {
	pro.createWidget( 'Toast', {
		options: {
			animation: true,
			preventScroll: true,
			state: 'warning',	// 三种状态 warning，tips，success，参见 http://waltz.cdc.com/mqq.html#3539
			content: '',
			duration: 2000
		},
		tpl: '<div class="ui-toast">\
			  	<i></i>\
			  	<span class="ui-color-white"></span>\
			  </div>',
		_render: function(){
			this.$el.find('i').removeClass().addClass('ui-icon-' + this.options.state);
			this.$el.find('span').text(this.options.content);
		},
		show: function( opts ){
			var self = this;

			this.$super('show', opts);

			if(this.options.duration){
				clearTimeout(this.timer);
				
				this.timer = setTimeout(function(){
					self.hide();
				}, this.options.duration);
			}
		},
	}, true);
})(Zepto, pro);

;(function( $, pro ) {
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

;(function( $, pro ) {
    var cssPrefix = '-webkit-';
    var ratio = window.devicePixelRatio == 1? 1 : 2;

    var sheet = $.insertStyleSheet();

    var cache = {}; /* Cache animation rules */
    
    pro.createWidget( 'Loading', {
        options: {
            size: 30,               // The width/ height of the spinner

            lineWidth : 2,         // The the width of each lines in px
            lines: 12,            // The number of lines to draw

            color : '158,158,158',      // Must be an RGB string

            duration: 1.6        // Seconds per round
        },
        tpl: '<canvas></canvas>',
        _addAnimation: function(lines){
            var name = 'js-loading-' + lines;

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

            this.$el.css(cssPrefix + 'animation', this._addAnimation(lines) + ' ' + options.duration + 's step-start infinite');

            var style = { width: halfSize, height: halfSize };
            style[cssPrefix + 'transform-origin'] = '0 0';
            style[cssPrefix + 'transform'] = 'scale(0.5)';
            this.$container.css(style);

            this.$el.appendTo(this.$container);
        }
    });
})(Zepto, pro);

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


(function( $, pro ) {
    pro.createWidget( 'RichLoading', {
        options: {
            preventScroll: true,
            content: '',
            onClose: $.emptyFunction
        },
        tpl: '<div class="ui-rich-loading">\
                <div class="loading" data-color="255,255,255" data-size="36"></div>\
                <div class="ui-no-wrap content"></div>\
                <div class="ui-icon-close btn"></div>\
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


;(function( $, pro ) {
	pro.createWidget( 'Mask', {
		options: {
			animation: true,
			preventScroll: true
		},
		tpl: '<div class="ui-mask"></div>',
		_bindEvents: function(){
            var self = this;

            var options = this.options;

            this.$el.on('tap', function(){
            	if(options.tapHide === true){
					if(options.relatedWidget){
						$.isFunction(options.relatedWidget.hide) && options.relatedWidget.hide();
					}
					self.hide();
				}else if($.isFunction(options.tapHide)){
					options.tapHide();
				}
			});
        }
	}, true);
})(Zepto, pro);

/**
 * by jdo
 * 
 * summary : 多级下拉菜单，最多支持3级
 */
;(function ($, pro, undefined){

	// var _initialize = 0;
    // android 4, 4.4
    // 页面滚动触发时，不触发`touchmove`事件
    // 暂无更好办法，先列为低端设备，做最原始的功能支持
    var ver = parseFloat($.env.systemVersion);
    var isPoorDevice = $.isPoorDevice || $.os.android && (ver === 4.4 || ver === 4);

    // alert(isPoorDevice)
	
	pro.createWidget('MultSelector', {

		options : {
			mask: true,
            animation: true,
            tapHide: true,
            selected: [],
            option: [],
            effect: 'from-top',
            maxRoot: 4,
            onShowChild : function () {},
            onChangeChild : function () {},
            onSelect : function () {}
		},

		$roots : null,
		$body : $(document.body),

		currShowing : null,

		tpl : {
			main: '<div class="ui-border-1px ui-multselect"></div>',

			selected : '<% \
						for ( var i = 0, len = Math.min(dat.length, maxRoot); i < len; i++ ) {\
					%>\
						<div class="ui-multselect-selected ui-multselect-<%= len %>grid">\
                            <div class="ui-selected-text-wrap<%= i+1 === len ? "":" ui-border-1px" %>">\
    				            <span class="ui-selected-text ui-no-wrap"><%= dat[i] %></span>\
    				            <i class="ui-icon-arrow ui-arrow-down"></i>\
                            </div>\
				        </div>\
					<% } %>',

			option : '<div class="ui-multselect-panel ui-border-1px <%= effect %> <%= cla %>">\
							<div class="ui-multselect-child left" data-panel="left">\
								<ul>\
								<%\
									var hasThirdPanel, currChild, slSecond, isActive = "";\
									defaultParent = defaultParent || tree[1][0];\
									for ( var i = 0, len = tree.length; i < len; i++ ) {\
										var item = tree[i], text, third;\
										if ( $.isArray(item) ) {\
											text = item[0];\
											third = item[1];\
											var hasThird = $.isArray(third) && third.length;\
											if ( !hasThirdPanel && hasThird ) hasThirdPanel = true;\
										} else {\
											text = item;\
											hasThird = hasThirdPanel = false;\
										}\
                                        var roots = text.split("&"), icon = "";\
                                        if ( roots.length === 2 ) {\
                                            text  = roots[0];\
                                            icon = roots[1];\
                                            third ? tree[i][0] = text : tree[i] = text\
                                        }\
										if ( defaultParent === text ) {\
											isActive = "active";\
											slSecond = i;\
											currChild = third;\
										} else {\
											isActive = "";\
										}\
								%>\
									<li class="ui-border-1px ui-multselect-child-li <%= isActive %><%= hasThird ? "" : " no-more" %>" data-index="<%=i%>">\
					            		<% if (icon) { %>\
                                            <div class="ui-multselect-child-li-icon <%= icon %>"></div>\
                                        <% } %>\
                                        <div class="ui-multselect-child-text ui-no-wrap"><%= text %></div>\
					            		<i class="ui-icon-arrow ui-arrow-right"></i>\
					            	</li>\
				            	<% } %>\
				            	</ul>\
       						</div>\
       						<div class="ui-multselect-child right" data-panel="right"><ul></ul></div>\
			            	<%\
                            var slThird = $.isArray(currChild) && currChild.length ? currChild.indexOf(defaultChild) : -1;\
                            slThird = slThird === -1 ? undefined : slThird;\
			            	bridging({\
			            		slSecond : slSecond,\
                                slThird : slThird,\
			            		tmpSecond : slSecond,\
                                tmpThird : slThird,\
			            		hasThirdPanel : hasThirdPanel\
			            	});\
			            	%>\
   						</div>'

		},
		_init: function (el, opts) {

            this.$super('_init', el, opts);
            this._create();

            if ( opts.selected && opts.selected.length ) this._renderRoot();
            if ( opts.option &&  opts.option.length) this._initPullDown();

		},
		_renderRoot: function(){
			var opts = this.options;
			var selected = opts.selected;

			if ( selected && selected.length ) {
				this.$roots = this.$el.html($.template(this.tpl.selected, { dat : selected, maxRoot : opts.maxRoot })).find('.ui-multselect-selected');
			}
        },
        _initPullDown : function () {
        	var opts = this.options;
        	var $roots = this.$roots;

			$.each(opts.option, function (k, child) {
				// 检查子节点是否存在
                // console.log(child)
				if ( child.tree && child.tree.length ) {
					$roots.eq(k).addClass('ui-multselect-root-more');
				}
			});
        },
        _bindEvents: function () {
        	var that = this;

        	this.$el
            .on('touchmove', function (e) {
                e.preventDefault();
            })
            .on('tap', '.ui-multselect-selected', function () {
        		var $elem = $(this);

        		if ( $elem.hasClass('ui-multselect-root-more') ) {
        			if ( $elem.hasClass('active') ) {
                        that.hide();
        				that.currShowing = null;
        			} else {
        				var index = parseInt($elem.index());
	        			var children = that.options.option;
	        			var child;

	        			if ( that.currShowing !== null ) {
                            that.$roots[that.currShowing].$panel.css('display', 'none');
	        				that.hide();
	        			}

	        			if ( children && (child = children[index]) ) {
	        				that.currShowing = index;
	        				that.showSubPanel(this, child);
	        			}
        			}
        		}
        	});

            // var that = this;
            this.$body.on('tap', '.ui-multselect-panel li', function () {
                if ( this.currShowing !== null ) {
                    var $this = $(this);
                    var $parent = $this.parents('.ui-multselect-child');

                    var child = that.options.option[that.currShowing];
                    var index = parseInt($this.data('index'));
                    var panel = $parent.hasClass('left') ? 'tmpSecond' : 'tmpThird';
                    var slChildIndex = child[panel];
                    // 触发onSelect标识
                    var isSelect;

                    // 存在子节点
                    if ( panel === 'tmpSecond' ) {

                        var curr = child.tree[index][1] || [];
                        // 非选中状态，即可更新面板
                        if ( index != slChildIndex ) {
                            that._renderThirdPanel($parent.next(), curr);
                        }
                        // 不存在三级菜单
                        if ($this.hasClass('no-more')) {
                            // 这里要清空三级选中状态
                            // 主要避免上一次选择遗留的数据
                            delete child.tmpThird;
                            that.hide();
                            isSelect = true;
                        }
                    } else {
                        that.hide();
                        isSelect = true;
                    }

                    // 更新选择状态
                    if ( index != slChildIndex ) {
                        // 初始化选中索引有可能为undefined
                        if ( slChildIndex !== undefined ) {
                            $parent.find('li:nth-child('+ (slChildIndex+1) +')').removeClass('active');
                        }
                        $parent.find('li:nth-child('+ (index+1) +')').addClass('active');
                        child[panel] = index;
                    }

                    isSelect && that._onSelect();
                }
            });
            // hack for android
            if ( $.os.android ) {
                // var $uisearchinput = $(".ui-search-input")[0];
                var currY, startScrollTop;

                this.$body.on('touchstart', '.ui-multselect-child[data-bouncefix]', function (e) {
                    e.preventDefault();
                })
                .on('touchstart', '.ui-multselect-child[data-scrollable]', function (e) {
                    var touch = e.touches[0];
                    var el = e.currentTarget;

                    currY = touch.pageY;
                    startScrollTop = el.scrollTop;
                })
                .on('touchmove', '.ui-multselect-child[data-scrollable]', function (e) {
                    var touch = e.touches[0];
                    var dis = touch.pageY - currY;

                    var el = e.currentTarget,
                        curPos = el.scrollTop,
                        height = el.clientHeight,
                        scroll = el.scrollHeight;

                    // alert(el.className);
                    // $uisearchinput.value = Math.random();

                    if ( curPos === 0 && dis > 0 || curPos === scroll - height && dis < 0 ) {
                        e.preventDefault();
                    }

                    // hack for poor device - andriod 3.0-
                    if ( isPoorDevice ) {
                        el.scrollTop = startScrollTop-dis;
                        e.preventDefault();
                    }

                });
            }
        },
        showSubPanel : function (root, child) {
            // render tree panel
        	this._renderSubPanel(root, child);
        	// undate root's status
            $(root).addClass('active');
            // 是否出遮罩
            this.options.mask && pro.mask.show({
                tapHide: this.options.tapHide,
                relatedWidget: this
            });
        	var that = this;
        	setTimeout(function () {
        		$( root.$panel ).removeClass(that.options.effect);
        	}, 30);
        },
        hide : function () {
            var root = this.$roots[this.currShowing];
            if ( root ) {

                $(root).removeClass('active');
                
                if ( root.$panel ) {
                    $( root.$panel )
                        .css('top', 0)
                        .addClass(this.options.effect);
                }

                this.options.mask && pro.mask.hide();
            }
        },
        add : function (index, root) {
            var opts = this.options;
            var option = opts.option;
            var max = opts.selected.length;
            var curr = option.length;

            // 指定强制更新某一节点
            if ( typeof index === 'number' && $.isArray(root) && root.length ) {

                var child;

                if ( index < max && (child = option[index]) ) {
                    child.tree = root;
                    child.refresh = true;
                }
                // call _initPullDown
                this._initPullDown();


            } else if ( $.isArray(index) ) {
                if ( curr < max ) {
                    // 复制节点数据
                    var tree = Array.prototype.slice.call(arguments, 0, max - curr);
                    
                    for ( var i = 0, len = tree.length; i < len; i++ ) {
                        option.tree.push( tree[i] );
                    }
                    // call _initPullDown
                    this._initPullDown();
                }
            }
        },
        reset : function (index, opt) {
            if ( typeof index === 'number' && opt ) {

                // var child;
                var options = this.options;
                var max = options.selected.length;

                if ( index < max ) {
                    opt.refresh = true;
                    options.option[index] = opt;
                    var selected = opt.defaultChild || opt.defaultParent;
                    // 更新selected字段
                    if ( selected !== options.selected[index] ) {
                        this.$roots.eq(index).find('.ui-selected-text').text(options.selected[index] = selected);
                    }
                }
                // call _initPullDown
                this._initPullDown();
            }
        },
        _renderSubPanel : function (root, child) {

            var force = false;
            var that = this;

            // 选项子集有变动，重新生成选择面板
            if ( child.refresh ) {
                // release panel node
                if ( root.$panel ) {
                    // 移除android端兼容事件
                    if ( $.os.android ) root.$panel.find('.ui-multselect-child').off();
                    // 移除节点
                    root.$panel.remove();
                    delete root.$panel;
                }
                delete child.refresh;
            }

        	if ( !root.$panel ) {
                var opts = this.options;

        		child.effect = opts.effect;
                child.cla = 'js-multselect-panel-'+this.currShowing;
                // child.top = opts.panelOffsetTop;
        		// 从模版中提取变量
        		// 省去重新遍历
        		child.bridging = function (dat) {
        			$.extend(child, dat);
        		};
        		root.$panel = $($.template(this.tpl.option, child)).appendTo(this.$body);

        		// 不存在第三级面板
        		if ( !child.hasThirdPanel ) root.$panel.addClass('no-third');

        		// this._bindSubEvents(root.$panel);
                // 初始化强制刷新标识
                force = true;
                // 初始化二级菜单滚动条
                setTimeout( function () {
                    that._initScroll(root.$panel.find('.ui-multselect-child.left'));
                }, 0 );
        	}

            var $panel = root.$panel;

            var clientRect = that.$el[0].getBoundingClientRect();

            $panel.css({
                // hack for poor equipment
                'top': clientRect.bottom + ($.env.isPoorDevice ? document.body.scrollTop : 0),
                'display': '-webkit-box'
            });

            var slSecond = child.slSecond;
            var slThird  = child.slThird;

            if ( this._need2Refresh(child, force) ) {

                // 更新临时选中字段
                child.tmpSecond = slSecond;
                child.tmpThird  = slThird;

                // 渲染第三级子菜单
                // `hasThirdPanel`由模版内部遍历检查
                // 这边不再重复对数据类型检查
                if ( child.hasThirdPanel ) {
                    var hasThird = child.tree[slSecond];
                    this._renderThirdPanel($panel.find('.ui-multselect-child.right'), hasThird[1] || []);
                }
                
            }

            // 初始化下拉菜单选择状态
            $panel.find('.ui-multselect-child.left li').removeClass('active').eq(slSecond).addClass('active');

            if ( slThird !== undefined )
                $panel.find('.ui-multselect-child.right li').removeClass('active').eq(slThird).addClass('active');

        },
        _renderThirdPanel : function ($parent, children) {
        	$parent.html('<ul>'+$.map(children, function (child, k) {
        		return '<li class="ui-border-1px ui-multselect-child-li" data-index="'+ k +'"><div class="ui-multselect-child-text ui-no-wrap">'+ child +'</div></li>';
        	}).join('')+'</ul>');

            var that = this;
            setTimeout(function () {
                that._initScroll($parent);
            }, 0);
        },
        _initScroll : function ($node) {
            var node = $node[0];
            node.scrollTop = 0;
            $node
                .attr( 'data-bouncefix', null )
                .attr( 'data-scrollable', null )
                .attr( node.clientHeight >= node.scrollHeight ? 'data-bouncefix' : 'data-scrollable', '');
        },
        _onSelect : function () {

            var child = this.options.option[this.currShowing];
            var tree = child.tree;

            if ( this._need2Refresh(child) ) {

                var tmpSecond = child.tmpSecond;
                var tmpThird = child.tmpThird;
                // 更新选中字段
                child.slSecond = tmpSecond;
                child.slThird = tmpThird;

                // 更新文案字段
                var parent = tree[tmpSecond];

                child.defaultParent = $.isArray(parent) ? parent[0] : parent;
                child.defaultChild  = tmpThird !== undefined ? parent[1][tmpThird] : '';

                // call onSelect function
                this.options.onSelect(this.options.option);
                // console.log(this.options.option)

                // refresh root's text
                this.$roots.eq(this.currShowing).find('.ui-selected-text').text(child.defaultChild || child.defaultParent);
            }

        },
        _need2Refresh : function (child, isForce) {

            var slSecond = child.slSecond;
            var slThird = child.slThird;

            var tmpSecond = child.tmpSecond;
            var tmpThird = child.tmpThird;

            var hadChange = false;

            // 初始状态`slThird` `tmpThird` 都为undefined
            // 但初始化时候需要生成第三级菜单
            // `isForce`用于初始化时候强制生成
            if ( isForce || slSecond !== tmpSecond || slThird !== tmpThird ) {
                hadChange = true;
            }

            return hadChange;
        }
	});

})(Zepto, pro);
;(function($, pro) {
    pro.createWidget('Progress', {
        options: {
            percentage: 0, // 0% 当前进度   
            total: 100, // 100MB 总大小  
            content: '下载中' // 提示文字
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
            this.$el.find('.progress-text').text(options.content);
            this.$el.find('.progress-size-total').text(options.total);
            this.$el.find('.progress-size-curr').text((options.total * options.percentage / 100).toFixed(2));
            this.$el.find('.progress-bar').width(options.percentage + '%');
            this.$el.find('.progress-mask').height(100 - options.percentage + '%');
            this.$el.find('.progress-number').text(options.percentage);  

            if (deg <= 180) {
                // 小于 180 旋转右半圆
                 this.$el.find('.ui-progress-right').css('transform', "rotate(" + deg + "deg)");
                 this.$el.find('.ui-progress-left').css('transform', "rotate(0deg)");
            } else {
                // 大于 180 旋转左半圆
                 this.$el.find('.ui-progress-right').css('transform', "rotate(180deg)");
                 this.$el.find('.ui-progress-left').css('transform', "rotate(" + (deg - 180) + "deg)");
            }
        },

        _bindEvents: function(){
            this.$el.on('tap', '.action-cancle', function(e){
                // TODO
                console.log('cancle');
            });
        },

        changeProgress: function (percentage){
            var options = this.options;
            options.percentage = percentage;

            this._setProgress(options);         
        }
    });
})(Zepto, pro);

;(function($, pro) {
    pro.createWidget('Range', {
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
            var $val =  this.$el.find('.ui-range-val');
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
})(Zepto, pro);

;(function($){
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
})(Zepto);
;(function($){
	$.extend($.fn, {
		// 有点击态的按钮
		active: function(fn, className){
			className = className || 'js-active';
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
})(Zepto);
;(function( $, pro ) {
    /*
    *   Tab 组件
    *
    *   使用示例：
    *    $("#id").tab({
    *       $el: '.ui-tab',//tab item 父层通常为ul
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
            main: '<ul class="ui-tab"></ul>',
            ul: '<% for(var i = 0, l = list.length; i < l; i++){ %>\
                    <li class="ui-border-1px item"><%=list[i]%></li>\
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

;(function( $, pro ) {
	pro.createWidget( 'Toast', {
		options: {
			animation: true,
			preventScroll: true,
			state: 'warning',	// 三种状态 warning，tips，success，参见 http://waltz.cdc.com/mqq.html#3539
			content: '',
			duration: 2000
		},
		tpl: '<div class="ui-toast">\
			  	<i></i>\
			  	<span class="ui-color-white"></span>\
			  </div>',
		_render: function(){
			this.$el.find('i').removeClass().addClass('ui-icon-' + this.options.state);
			this.$el.find('span').text(this.options.content);
		},
		show: function( opts ){
			var self = this;

			this.$super('show', opts);

			if(this.options.duration){
				clearTimeout(this.timer);
				
				this.timer = setTimeout(function(){
					self.hide();
				}, this.options.duration);
			}
		},
	}, true);
})(Zepto, pro);

;(function( $, pro ) {
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

;(function( $, pro ) {
    var cssPrefix = '-webkit-';
    var ratio = window.devicePixelRatio == 1? 1 : 2;

    var sheet = $.insertStyleSheet();

    var cache = {}; /* Cache animation rules */
    
    pro.createWidget( 'Loading', {
        options: {
            size: 30,               // The width/ height of the spinner

            lineWidth : 2,         // The the width of each lines in px
            lines: 12,            // The number of lines to draw

            color : '158,158,158',      // Must be an RGB string

            duration: 1.6        // Seconds per round
        },
        tpl: '<canvas></canvas>',
        _addAnimation: function(lines){
            var name = 'js-loading-' + lines;

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

            this.$el.css(cssPrefix + 'animation', this._addAnimation(lines) + ' ' + options.duration + 's step-start infinite');

            var style = { width: halfSize, height: halfSize };
            style[cssPrefix + 'transform-origin'] = '0 0';
            style[cssPrefix + 'transform'] = 'scale(0.5)';
            this.$container.css(style);

            this.$el.appendTo(this.$container);
        }
    });
})(Zepto, pro);

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


(function( $, pro ) {
    pro.createWidget( 'RichLoading', {
        options: {
            preventScroll: true,
            content: '',
            onClose: $.emptyFunction
        },
        tpl: '<div class="ui-rich-loading">\
                <div class="loading" data-color="255,255,255" data-size="36"></div>\
                <div class="ui-no-wrap content"></div>\
                <div class="ui-icon-close btn"></div>\
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


;(function( $, pro ) {
	pro.createWidget( 'Mask', {
		options: {
			animation: true,
			preventScroll: true
		},
		tpl: '<div class="ui-mask"></div>',
		_bindEvents: function(){
            var self = this;

            var options = this.options;

            this.$el.on('tap', function(){
            	if(options.tapHide === true){
					if(options.relatedWidget){
						$.isFunction(options.relatedWidget.hide) && options.relatedWidget.hide();
					}
					self.hide();
				}else if($.isFunction(options.tapHide)){
					options.tapHide();
				}
			});
        }
	}, true);
})(Zepto, pro);

/**
 * by jdo
 * 
 * summary : 多级下拉菜单，最多支持3级
 */
;(function ($, pro, undefined){

	// var _initialize = 0;
    // android 4, 4.4
    // 页面滚动触发时，不触发`touchmove`事件
    // 暂无更好办法，先列为低端设备，做最原始的功能支持
    var ver = parseFloat($.env.systemVersion);
    var isPoorDevice = $.isPoorDevice || $.os.android && (ver === 4.4 || ver === 4);

    // alert(isPoorDevice)
	
	pro.createWidget('MultSelector', {

		options : {
			mask: true,
            animation: true,
            tapHide: true,
            selected: [],
            option: [],
            effect: 'from-top',
            maxRoot: 4,
            onShowChild : function () {},
            onChangeChild : function () {},
            onSelect : function () {}
		},

		$roots : null,
		$body : $(document.body),

		currShowing : null,

		tpl : {
			main: '<div class="ui-border-1px ui-multselect"></div>',

			selected : '<% \
						for ( var i = 0, len = Math.min(dat.length, maxRoot); i < len; i++ ) {\
					%>\
						<div class="ui-multselect-selected ui-multselect-<%= len %>grid">\
                            <div class="ui-selected-text-wrap<%= i+1 === len ? "":" ui-border-1px" %>">\
    				            <span class="ui-selected-text ui-no-wrap"><%= dat[i] %></span>\
    				            <i class="ui-icon-arrow ui-arrow-down"></i>\
                            </div>\
				        </div>\
					<% } %>',

			option : '<div class="ui-multselect-panel ui-border-1px <%= effect %> <%= cla %>">\
							<div class="ui-multselect-child left" data-panel="left">\
								<ul>\
								<%\
									var hasThirdPanel, currChild, slSecond, isActive = "";\
									defaultParent = defaultParent || tree[1][0];\
									for ( var i = 0, len = tree.length; i < len; i++ ) {\
										var item = tree[i], text, third;\
										if ( $.isArray(item) ) {\
											text = item[0];\
											third = item[1];\
											var hasThird = $.isArray(third) && third.length;\
											if ( !hasThirdPanel && hasThird ) hasThirdPanel = true;\
										} else {\
											text = item;\
											hasThird = hasThirdPanel = false;\
										}\
                                        var roots = text.split("&"), icon = "";\
                                        if ( roots.length === 2 ) {\
                                            text  = roots[0];\
                                            icon = roots[1];\
                                            third ? tree[i][0] = text : tree[i] = text\
                                        }\
										if ( defaultParent === text ) {\
											isActive = "active";\
											slSecond = i;\
											currChild = third;\
										} else {\
											isActive = "";\
										}\
								%>\
									<li class="ui-border-1px ui-multselect-child-li <%= isActive %><%= hasThird ? "" : " no-more" %>" data-index="<%=i%>">\
					            		<% if (icon) { %>\
                                            <div class="ui-multselect-child-li-icon <%= icon %>"></div>\
                                        <% } %>\
                                        <div class="ui-multselect-child-text ui-no-wrap"><%= text %></div>\
					            		<i class="ui-icon-arrow ui-arrow-right"></i>\
					            	</li>\
				            	<% } %>\
				            	</ul>\
       						</div>\
       						<div class="ui-multselect-child right" data-panel="right"><ul></ul></div>\
			            	<%\
                            var slThird = $.isArray(currChild) && currChild.length ? currChild.indexOf(defaultChild) : -1;\
                            slThird = slThird === -1 ? undefined : slThird;\
			            	bridging({\
			            		slSecond : slSecond,\
                                slThird : slThird,\
			            		tmpSecond : slSecond,\
                                tmpThird : slThird,\
			            		hasThirdPanel : hasThirdPanel\
			            	});\
			            	%>\
   						</div>'

		},
		_init: function (el, opts) {

            this.$super('_init', el, opts);
            this._create();

            if ( opts.selected && opts.selected.length ) this._renderRoot();
            if ( opts.option &&  opts.option.length) this._initPullDown();

		},
		_renderRoot: function(){
			var opts = this.options;
			var selected = opts.selected;

			if ( selected && selected.length ) {
				this.$roots = this.$el.html($.template(this.tpl.selected, { dat : selected, maxRoot : opts.maxRoot })).find('.ui-multselect-selected');
			}
        },
        _initPullDown : function () {
        	var opts = this.options;
        	var $roots = this.$roots;

			$.each(opts.option, function (k, child) {
				// 检查子节点是否存在
                // console.log(child)
				if ( child.tree && child.tree.length ) {
					$roots.eq(k).addClass('ui-multselect-root-more');
				}
			});
        },
        _bindEvents: function () {
        	var that = this;

        	this.$el
            .on('touchmove', function (e) {
                e.preventDefault();
            })
            .on('tap', '.ui-multselect-selected', function () {
        		var $elem = $(this);

        		if ( $elem.hasClass('ui-multselect-root-more') ) {
        			if ( $elem.hasClass('active') ) {
                        that.hide();
        				that.currShowing = null;
        			} else {
        				var index = parseInt($elem.index());
	        			var children = that.options.option;
	        			var child;

	        			if ( that.currShowing !== null ) {
                            that.$roots[that.currShowing].$panel.css('display', 'none');
	        				that.hide();
	        			}

	        			if ( children && (child = children[index]) ) {
	        				that.currShowing = index;
	        				that.showSubPanel(this, child);
	        			}
        			}
        		}
        	});

            // var that = this;
            this.$body.on('tap', '.ui-multselect-panel li', function () {
                if ( this.currShowing !== null ) {
                    var $this = $(this);
                    var $parent = $this.parents('.ui-multselect-child');

                    var child = that.options.option[that.currShowing];
                    var index = parseInt($this.data('index'));
                    var panel = $parent.hasClass('left') ? 'tmpSecond' : 'tmpThird';
                    var slChildIndex = child[panel];
                    // 触发onSelect标识
                    var isSelect;

                    // 存在子节点
                    if ( panel === 'tmpSecond' ) {

                        var curr = child.tree[index][1] || [];
                        // 非选中状态，即可更新面板
                        if ( index != slChildIndex ) {
                            that._renderThirdPanel($parent.next(), curr);
                        }
                        // 不存在三级菜单
                        if ($this.hasClass('no-more')) {
                            // 这里要清空三级选中状态
                            // 主要避免上一次选择遗留的数据
                            delete child.tmpThird;
                            that.hide();
                            isSelect = true;
                        }
                    } else {
                        that.hide();
                        isSelect = true;
                    }

                    // 更新选择状态
                    if ( index != slChildIndex ) {
                        // 初始化选中索引有可能为undefined
                        if ( slChildIndex !== undefined ) {
                            $parent.find('li:nth-child('+ (slChildIndex+1) +')').removeClass('active');
                        }
                        $parent.find('li:nth-child('+ (index+1) +')').addClass('active');
                        child[panel] = index;
                    }

                    isSelect && that._onSelect();
                }
            });
            // hack for android
            if ( $.os.android ) {
                // var $uisearchinput = $(".ui-search-input")[0];
                var currY, startScrollTop;

                this.$body.on('touchstart', '.ui-multselect-child[data-bouncefix]', function (e) {
                    e.preventDefault();
                })
                .on('touchstart', '.ui-multselect-child[data-scrollable]', function (e) {
                    var touch = e.touches[0];
                    var el = e.currentTarget;

                    currY = touch.pageY;
                    startScrollTop = el.scrollTop;
                })
                .on('touchmove', '.ui-multselect-child[data-scrollable]', function (e) {
                    var touch = e.touches[0];
                    var dis = touch.pageY - currY;

                    var el = e.currentTarget,
                        curPos = el.scrollTop,
                        height = el.clientHeight,
                        scroll = el.scrollHeight;

                    // alert(el.className);
                    // $uisearchinput.value = Math.random();

                    if ( curPos === 0 && dis > 0 || curPos === scroll - height && dis < 0 ) {
                        e.preventDefault();
                    }

                    // hack for poor device - andriod 3.0-
                    if ( isPoorDevice ) {
                        el.scrollTop = startScrollTop-dis;
                        e.preventDefault();
                    }

                });
            }
        },
        showSubPanel : function (root, child) {
            // render tree panel
        	this._renderSubPanel(root, child);
        	// undate root's status
            $(root).addClass('active');
            // 是否出遮罩
            this.options.mask && pro.mask.show({
                tapHide: this.options.tapHide,
                relatedWidget: this
            });
        	var that = this;
        	setTimeout(function () {
        		$( root.$panel ).removeClass(that.options.effect);
        	}, 30);
        },
        hide : function () {
            var root = this.$roots[this.currShowing];
            if ( root ) {

                $(root).removeClass('active');
                
                if ( root.$panel ) {
                    $( root.$panel )
                        .css('top', 0)
                        .addClass(this.options.effect);
                }

                this.options.mask && pro.mask.hide();
            }
        },
        add : function (index, root) {
            var opts = this.options;
            var option = opts.option;
            var max = opts.selected.length;
            var curr = option.length;

            // 指定强制更新某一节点
            if ( typeof index === 'number' && $.isArray(root) && root.length ) {

                var child;

                if ( index < max && (child = option[index]) ) {
                    child.tree = root;
                    child.refresh = true;
                }
                // call _initPullDown
                this._initPullDown();


            } else if ( $.isArray(index) ) {
                if ( curr < max ) {
                    // 复制节点数据
                    var tree = Array.prototype.slice.call(arguments, 0, max - curr);
                    
                    for ( var i = 0, len = tree.length; i < len; i++ ) {
                        option.tree.push( tree[i] );
                    }
                    // call _initPullDown
                    this._initPullDown();
                }
            }
        },
        reset : function (index, opt) {
            if ( typeof index === 'number' && opt ) {

                // var child;
                var options = this.options;
                var max = options.selected.length;

                if ( index < max ) {
                    opt.refresh = true;
                    options.option[index] = opt;
                    var selected = opt.defaultChild || opt.defaultParent;
                    // 更新selected字段
                    if ( selected !== options.selected[index] ) {
                        this.$roots.eq(index).find('.ui-selected-text').text(options.selected[index] = selected);
                    }
                }
                // call _initPullDown
                this._initPullDown();
            }
        },
        _renderSubPanel : function (root, child) {

            var force = false;
            var that = this;

            // 选项子集有变动，重新生成选择面板
            if ( child.refresh ) {
                // release panel node
                if ( root.$panel ) {
                    // 移除android端兼容事件
                    if ( $.os.android ) root.$panel.find('.ui-multselect-child').off();
                    // 移除节点
                    root.$panel.remove();
                    delete root.$panel;
                }
                delete child.refresh;
            }

        	if ( !root.$panel ) {
                var opts = this.options;

        		child.effect = opts.effect;
                child.cla = 'js-multselect-panel-'+this.currShowing;
                // child.top = opts.panelOffsetTop;
        		// 从模版中提取变量
        		// 省去重新遍历
        		child.bridging = function (dat) {
        			$.extend(child, dat);
        		};
        		root.$panel = $($.template(this.tpl.option, child)).appendTo(this.$body);

        		// 不存在第三级面板
        		if ( !child.hasThirdPanel ) root.$panel.addClass('no-third');

        		// this._bindSubEvents(root.$panel);
                // 初始化强制刷新标识
                force = true;
                // 初始化二级菜单滚动条
                setTimeout( function () {
                    that._initScroll(root.$panel.find('.ui-multselect-child.left'));
                }, 0 );
        	}

            var $panel = root.$panel;

            var clientRect = that.$el[0].getBoundingClientRect();

            $panel.css({
                // hack for poor equipment
                'top': clientRect.bottom + ($.env.isPoorDevice ? document.body.scrollTop : 0),
                'display': '-webkit-box'
            });

            var slSecond = child.slSecond;
            var slThird  = child.slThird;

            if ( this._need2Refresh(child, force) ) {

                // 更新临时选中字段
                child.tmpSecond = slSecond;
                child.tmpThird  = slThird;

                // 渲染第三级子菜单
                // `hasThirdPanel`由模版内部遍历检查
                // 这边不再重复对数据类型检查
                if ( child.hasThirdPanel ) {
                    var hasThird = child.tree[slSecond];
                    this._renderThirdPanel($panel.find('.ui-multselect-child.right'), hasThird[1] || []);
                }
                
            }

            // 初始化下拉菜单选择状态
            $panel.find('.ui-multselect-child.left li').removeClass('active').eq(slSecond).addClass('active');

            if ( slThird !== undefined )
                $panel.find('.ui-multselect-child.right li').removeClass('active').eq(slThird).addClass('active');

        },
        _renderThirdPanel : function ($parent, children) {
        	$parent.html('<ul>'+$.map(children, function (child, k) {
        		return '<li class="ui-border-1px ui-multselect-child-li" data-index="'+ k +'"><div class="ui-multselect-child-text ui-no-wrap">'+ child +'</div></li>';
        	}).join('')+'</ul>');

            var that = this;
            setTimeout(function () {
                that._initScroll($parent);
            }, 0);
        },
        _initScroll : function ($node) {
            var node = $node[0];
            node.scrollTop = 0;
            $node
                .attr( 'data-bouncefix', null )
                .attr( 'data-scrollable', null )
                .attr( node.clientHeight >= node.scrollHeight ? 'data-bouncefix' : 'data-scrollable', '');
        },
        _onSelect : function () {

            var child = this.options.option[this.currShowing];
            var tree = child.tree;

            if ( this._need2Refresh(child) ) {

                var tmpSecond = child.tmpSecond;
                var tmpThird = child.tmpThird;
                // 更新选中字段
                child.slSecond = tmpSecond;
                child.slThird = tmpThird;

                // 更新文案字段
                var parent = tree[tmpSecond];

                child.defaultParent = $.isArray(parent) ? parent[0] : parent;
                child.defaultChild  = tmpThird !== undefined ? parent[1][tmpThird] : '';

                // call onSelect function
                this.options.onSelect(this.options.option);
                // console.log(this.options.option)

                // refresh root's text
                this.$roots.eq(this.currShowing).find('.ui-selected-text').text(child.defaultChild || child.defaultParent);
            }

        },
        _need2Refresh : function (child, isForce) {

            var slSecond = child.slSecond;
            var slThird = child.slThird;

            var tmpSecond = child.tmpSecond;
            var tmpThird = child.tmpThird;

            var hadChange = false;

            // 初始状态`slThird` `tmpThird` 都为undefined
            // 但初始化时候需要生成第三级菜单
            // `isForce`用于初始化时候强制生成
            if ( isForce || slSecond !== tmpSecond || slThird !== tmpThird ) {
                hadChange = true;
            }

            return hadChange;
        }
	});

})(Zepto, pro);
;(function($, pro) {
    pro.createWidget('Progress', {
        options: {
            percentage: 0, // 0% 当前进度   
            total: 100, // 100MB 总大小  
            content: '下载中' // 提示文字
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
            this.$el.find('.progress-text').text(options.content);
            this.$el.find('.progress-size-total').text(options.total);
            this.$el.find('.progress-size-curr').text((options.total * options.percentage / 100).toFixed(2));
            this.$el.find('.progress-bar').width(options.percentage + '%');
            this.$el.find('.progress-mask').height(100 - options.percentage + '%');
            this.$el.find('.progress-number').text(options.percentage);  

            if (deg <= 180) {
                // 小于 180 旋转右半圆
                 this.$el.find('.ui-progress-right').css('transform', "rotate(" + deg + "deg)");
                 this.$el.find('.ui-progress-left').css('transform', "rotate(0deg)");
            } else {
                // 大于 180 旋转左半圆
                 this.$el.find('.ui-progress-right').css('transform', "rotate(180deg)");
                 this.$el.find('.ui-progress-left').css('transform', "rotate(" + (deg - 180) + "deg)");
            }
        },

        _bindEvents: function(){
            this.$el.on('tap', '.action-cancle', function(e){
                // TODO
                console.log('cancle');
            });
        },

        changeProgress: function (percentage){
            var options = this.options;
            options.percentage = percentage;

            this._setProgress(options);         
        }
    });
})(Zepto, pro);

;(function($, pro) {
    pro.createWidget('Range', {
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
            var $val =  this.$el.find('.ui-range-val');
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
})(Zepto, pro);

;(function($){
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
})(Zepto);
;(function($){
	$.extend($.fn, {
		// 有点击态的按钮
		active: function(fn, className){
			className = className || 'js-active';
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
})(Zepto);
;(function( $, pro ) {
    /*
    *   Tab 组件
    *
    *   使用示例：
    *    $("#id").tab({
    *       $el: '.ui-tab',//tab item 父层通常为ul
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
            main: '<ul class="ui-tab"></ul>',
            ul: '<% for(var i = 0, l = list.length; i < l; i++){ %>\
                    <li class="ui-border-1px item"><%=list[i]%></li>\
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

;(function( $, pro ) {
	pro.createWidget( 'Toast', {
		options: {
			animation: true,
			preventScroll: true,
			state: 'warning',	// 三种状态 warning，tips，success，参见 http://waltz.cdc.com/mqq.html#3539
			content: '',
			duration: 2000
		},
		tpl: '<div class="ui-toast">\
			  	<i></i>\
			  	<span class="ui-color-white"></span>\
			  </div>',
		_render: function(){
			this.$el.find('i').removeClass().addClass('ui-icon-' + this.options.state);
			this.$el.find('span').text(this.options.content);
		},
		show: function( opts ){
			var self = this;

			this.$super('show', opts);

			if(this.options.duration){
				clearTimeout(this.timer);
				
				this.timer = setTimeout(function(){
					self.hide();
				}, this.options.duration);
			}
		},
	}, true);
})(Zepto, pro);

;(function( $, pro ) {
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

;(function( $, pro ) {
    var cssPrefix = '-webkit-';
    var ratio = window.devicePixelRatio == 1? 1 : 2;

    var sheet = $.insertStyleSheet();

    var cache = {}; /* Cache animation rules */
    
    pro.createWidget( 'Loading', {
        options: {
            size: 30,               // The width/ height of the spinner

            lineWidth : 2,         // The the width of each lines in px
            lines: 12,            // The number of lines to draw

            color : '158,158,158',      // Must be an RGB string

            duration: 1.6        // Seconds per round
        },
        tpl: '<canvas></canvas>',
        _addAnimation: function(lines){
            var name = 'js-loading-' + lines;

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

            this.$el.css(cssPrefix + 'animation', this._addAnimation(lines) + ' ' + options.duration + 's step-start infinite');

            var style = { width: halfSize, height: halfSize };
            style[cssPrefix + 'transform-origin'] = '0 0';
            style[cssPrefix + 'transform'] = 'scale(0.5)';
            this.$container.css(style);

            this.$el.appendTo(this.$container);
        }
    });
})(Zepto, pro);

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


(function( $, pro ) {
    pro.createWidget( 'RichLoading', {
        options: {
            preventScroll: true,
            content: '',
            onClose: $.emptyFunction
        },
        tpl: '<div class="ui-rich-loading">\
                <div class="loading" data-color="255,255,255" data-size="36"></div>\
                <div class="ui-no-wrap content"></div>\
                <div class="ui-icon-close btn"></div>\
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


;(function( $, pro ) {
	pro.createWidget( 'Mask', {
		options: {
			animation: true,
			preventScroll: true
		},
		tpl: '<div class="ui-mask"></div>',
		_bindEvents: function(){
            var self = this;

            var options = this.options;

            this.$el.on('tap', function(){
            	if(options.tapHide === true){
					if(options.relatedWidget){
						$.isFunction(options.relatedWidget.hide) && options.relatedWidget.hide();
					}
					self.hide();
				}else if($.isFunction(options.tapHide)){
					options.tapHide();
				}
			});
        }
	}, true);
})(Zepto, pro);

/**
 * by jdo
 * 
 * summary : 多级下拉菜单，最多支持3级
 */
;(function ($, pro, undefined){

	// var _initialize = 0;
    // android 4, 4.4
    // 页面滚动触发时，不触发`touchmove`事件
    // 暂无更好办法，先列为低端设备，做最原始的功能支持
    var ver = parseFloat($.env.systemVersion);
    var isPoorDevice = $.isPoorDevice || $.os.android && (ver === 4.4 || ver === 4);

    // alert(isPoorDevice)
	
	pro.createWidget('MultSelector', {

		options : {
			mask: true,
            animation: true,
            tapHide: true,
            selected: [],
            option: [],
            effect: 'from-top',
            maxRoot: 4,
            onShowChild : function () {},
            onChangeChild : function () {},
            onSelect : function () {}
		},

		$roots : null,
		$body : $(document.body),

		currShowing : null,

		tpl : {
			main: '<div class="ui-border-1px ui-multselect"></div>',

			selected : '<% \
						for ( var i = 0, len = Math.min(dat.length, maxRoot); i < len; i++ ) {\
					%>\
						<div class="ui-multselect-selected ui-multselect-<%= len %>grid">\
                            <div class="ui-selected-text-wrap<%= i+1 === len ? "":" ui-border-1px" %>">\
    				            <span class="ui-selected-text ui-no-wrap"><%= dat[i] %></span>\
    				            <i class="ui-icon-arrow ui-arrow-down"></i>\
                            </div>\
				        </div>\
					<% } %>',

			option : '<div class="ui-multselect-panel ui-border-1px <%= effect %> <%= cla %>">\
							<div class="ui-multselect-child left" data-panel="left">\
								<ul>\
								<%\
									var hasThirdPanel, currChild, slSecond, isActive = "";\
									defaultParent = defaultParent || tree[1][0];\
									for ( var i = 0, len = tree.length; i < len; i++ ) {\
										var item = tree[i], text, third;\
										if ( $.isArray(item) ) {\
											text = item[0];\
											third = item[1];\
											var hasThird = $.isArray(third) && third.length;\
											if ( !hasThirdPanel && hasThird ) hasThirdPanel = true;\
										} else {\
											text = item;\
											hasThird = hasThirdPanel = false;\
										}\
                                        var roots = text.split("&"), icon = "";\
                                        if ( roots.length === 2 ) {\
                                            text  = roots[0];\
                                            icon = roots[1];\
                                            third ? tree[i][0] = text : tree[i] = text\
                                        }\
										if ( defaultParent === text ) {\
											isActive = "active";\
											slSecond = i;\
											currChild = third;\
										} else {\
											isActive = "";\
										}\
								%>\
									<li class="ui-border-1px ui-multselect-child-li <%= isActive %><%= hasThird ? "" : " no-more" %>" data-index="<%=i%>">\
					            		<% if (icon) { %>\
                                            <div class="ui-multselect-child-li-icon <%= icon %>"></div>\
                                        <% } %>\
                                        <div class="ui-multselect-child-text ui-no-wrap"><%= text %></div>\
					            		<i class="ui-icon-arrow ui-arrow-right"></i>\
					            	</li>\
				            	<% } %>\
				            	</ul>\
       						</div>\
       						<div class="ui-multselect-child right" data-panel="right"><ul></ul></div>\
			            	<%\
                            var slThird = $.isArray(currChild) && currChild.length ? currChild.indexOf(defaultChild) : -1;\
                            slThird = slThird === -1 ? undefined : slThird;\
			            	bridging({\
			            		slSecond : slSecond,\
                                slThird : slThird,\
			            		tmpSecond : slSecond,\
                                tmpThird : slThird,\
			            		hasThirdPanel : hasThirdPanel\
			            	});\
			            	%>\
   						</div>'

		},
		_init: function (el, opts) {

            this.$super('_init', el, opts);
            this._create();

            if ( opts.selected && opts.selected.length ) this._renderRoot();
            if ( opts.option &&  opts.option.length) this._initPullDown();

		},
		_renderRoot: function(){
			var opts = this.options;
			var selected = opts.selected;

			if ( selected && selected.length ) {
				this.$roots = this.$el.html($.template(this.tpl.selected, { dat : selected, maxRoot : opts.maxRoot })).find('.ui-multselect-selected');
			}
        },
        _initPullDown : function () {
        	var opts = this.options;
        	var $roots = this.$roots;

			$.each(opts.option, function (k, child) {
				// 检查子节点是否存在
                // console.log(child)
				if ( child.tree && child.tree.length ) {
					$roots.eq(k).addClass('ui-multselect-root-more');
				}
			});
        },
        _bindEvents: function () {
        	var that = this;

        	this.$el
            .on('touchmove', function (e) {
                e.preventDefault();
            })
            .on('tap', '.ui-multselect-selected', function () {
        		var $elem = $(this);

        		if ( $elem.hasClass('ui-multselect-root-more') ) {
        			if ( $elem.hasClass('active') ) {
                        that.hide();
        				that.currShowing = null;
        			} else {
        				var index = parseInt($elem.index());
	        			var children = that.options.option;
	        			var child;

	        			if ( that.currShowing !== null ) {
                            that.$roots[that.currShowing].$panel.css('display', 'none');
	        				that.hide();
	        			}

	        			if ( children && (child = children[index]) ) {
	        				that.currShowing = index;
	        				that.showSubPanel(this, child);
	        			}
        			}
        		}
        	});

            // var that = this;
            this.$body.on('tap', '.ui-multselect-panel li', function () {
                if ( this.currShowing !== null ) {
                    var $this = $(this);
                    var $parent = $this.parents('.ui-multselect-child');

                    var child = that.options.option[that.currShowing];
                    var index = parseInt($this.data('index'));
                    var panel = $parent.hasClass('left') ? 'tmpSecond' : 'tmpThird';
                    var slChildIndex = child[panel];
                    // 触发onSelect标识
                    var isSelect;

                    // 存在子节点
                    if ( panel === 'tmpSecond' ) {

                        var curr = child.tree[index][1] || [];
                        // 非选中状态，即可更新面板
                        if ( index != slChildIndex ) {
                            that._renderThirdPanel($parent.next(), curr);
                        }
                        // 不存在三级菜单
                        if ($this.hasClass('no-more')) {
                            // 这里要清空三级选中状态
                            // 主要避免上一次选择遗留的数据
                            delete child.tmpThird;
                            that.hide();
                            isSelect = true;
                        }
                    } else {
                        that.hide();
                        isSelect = true;
                    }

                    // 更新选择状态
                    if ( index != slChildIndex ) {
                        // 初始化选中索引有可能为undefined
                        if ( slChildIndex !== undefined ) {
                            $parent.find('li:nth-child('+ (slChildIndex+1) +')').removeClass('active');
                        }
                        $parent.find('li:nth-child('+ (index+1) +')').addClass('active');
                        child[panel] = index;
                    }

                    isSelect && that._onSelect();
                }
            });
            // hack for android
            if ( $.os.android ) {
                // var $uisearchinput = $(".ui-search-input")[0];
                var currY, startScrollTop;

                this.$body.on('touchstart', '.ui-multselect-child[data-bouncefix]', function (e) {
                    e.preventDefault();
                })
                .on('touchstart', '.ui-multselect-child[data-scrollable]', function (e) {
                    var touch = e.touches[0];
                    var el = e.currentTarget;

                    currY = touch.pageY;
                    startScrollTop = el.scrollTop;
                })
                .on('touchmove', '.ui-multselect-child[data-scrollable]', function (e) {
                    var touch = e.touches[0];
                    var dis = touch.pageY - currY;

                    var el = e.currentTarget,
                        curPos = el.scrollTop,
                        height = el.clientHeight,
                        scroll = el.scrollHeight;

                    // alert(el.className);
                    // $uisearchinput.value = Math.random();

                    if ( curPos === 0 && dis > 0 || curPos === scroll - height && dis < 0 ) {
                        e.preventDefault();
                    }

                    // hack for poor device - andriod 3.0-
                    if ( isPoorDevice ) {
                        el.scrollTop = startScrollTop-dis;
                        e.preventDefault();
                    }

                });
            }
        },
        showSubPanel : function (root, child) {
            // render tree panel
        	this._renderSubPanel(root, child);
        	// undate root's status
            $(root).addClass('active');
            // 是否出遮罩
            this.options.mask && pro.mask.show({
                tapHide: this.options.tapHide,
                relatedWidget: this
            });
        	var that = this;
        	setTimeout(function () {
        		$( root.$panel ).removeClass(that.options.effect);
        	}, 30);
        },
        hide : function () {
            var root = this.$roots[this.currShowing];
            if ( root ) {

                $(root).removeClass('active');
                
                if ( root.$panel ) {
                    $( root.$panel )
                        .css('top', 0)
                        .addClass(this.options.effect);
                }

                this.options.mask && pro.mask.hide();
            }
        },
        add : function (index, root) {
            var opts = this.options;
            var option = opts.option;
            var max = opts.selected.length;
            var curr = option.length;

            // 指定强制更新某一节点
            if ( typeof index === 'number' && $.isArray(root) && root.length ) {

                var child;

                if ( index < max && (child = option[index]) ) {
                    child.tree = root;
                    child.refresh = true;
                }
                // call _initPullDown
                this._initPullDown();


            } else if ( $.isArray(index) ) {
                if ( curr < max ) {
                    // 复制节点数据
                    var tree = Array.prototype.slice.call(arguments, 0, max - curr);
                    
                    for ( var i = 0, len = tree.length; i < len; i++ ) {
                        option.tree.push( tree[i] );
                    }
                    // call _initPullDown
                    this._initPullDown();
                }
            }
        },
        reset : function (index, opt) {
            if ( typeof index === 'number' && opt ) {

                // var child;
                var options = this.options;
                var max = options.selected.length;

                if ( index < max ) {
                    opt.refresh = true;
                    options.option[index] = opt;
                    var selected = opt.defaultChild || opt.defaultParent;
                    // 更新selected字段
                    if ( selected !== options.selected[index] ) {
                        this.$roots.eq(index).find('.ui-selected-text').text(options.selected[index] = selected);
                    }
                }
                // call _initPullDown
                this._initPullDown();
            }
        },
        _renderSubPanel : function (root, child) {

            var force = false;
            var that = this;

            // 选项子集有变动，重新生成选择面板
            if ( child.refresh ) {
                // release panel node
                if ( root.$panel ) {
                    // 移除android端兼容事件
                    if ( $.os.android ) root.$panel.find('.ui-multselect-child').off();
                    // 移除节点
                    root.$panel.remove();
                    delete root.$panel;
                }
                delete child.refresh;
            }

        	if ( !root.$panel ) {
                var opts = this.options;

        		child.effect = opts.effect;
                child.cla = 'js-multselect-panel-'+this.currShowing;
                // child.top = opts.panelOffsetTop;
        		// 从模版中提取变量
        		// 省去重新遍历
        		child.bridging = function (dat) {
        			$.extend(child, dat);
        		};
        		root.$panel = $($.template(this.tpl.option, child)).appendTo(this.$body);

        		// 不存在第三级面板
        		if ( !child.hasThirdPanel ) root.$panel.addClass('no-third');

        		// this._bindSubEvents(root.$panel);
                // 初始化强制刷新标识
                force = true;
                // 初始化二级菜单滚动条
                setTimeout( function () {
                    that._initScroll(root.$panel.find('.ui-multselect-child.left'));
                }, 0 );
        	}

            var $panel = root.$panel;

            var clientRect = that.$el[0].getBoundingClientRect();

            $panel.css({
                // hack for poor equipment
                'top': clientRect.bottom + ($.env.isPoorDevice ? document.body.scrollTop : 0),
                'display': '-webkit-box'
            });

            var slSecond = child.slSecond;
            var slThird  = child.slThird;

            if ( this._need2Refresh(child, force) ) {

                // 更新临时选中字段
                child.tmpSecond = slSecond;
                child.tmpThird  = slThird;

                // 渲染第三级子菜单
                // `hasThirdPanel`由模版内部遍历检查
                // 这边不再重复对数据类型检查
                if ( child.hasThirdPanel ) {
                    var hasThird = child.tree[slSecond];
                    this._renderThirdPanel($panel.find('.ui-multselect-child.right'), hasThird[1] || []);
                }
                
            }

            // 初始化下拉菜单选择状态
            $panel.find('.ui-multselect-child.left li').removeClass('active').eq(slSecond).addClass('active');

            if ( slThird !== undefined )
                $panel.find('.ui-multselect-child.right li').removeClass('active').eq(slThird).addClass('active');

        },
        _renderThirdPanel : function ($parent, children) {
        	$parent.html('<ul>'+$.map(children, function (child, k) {
        		return '<li class="ui-border-1px ui-multselect-child-li" data-index="'+ k +'"><div class="ui-multselect-child-text ui-no-wrap">'+ child +'</div></li>';
        	}).join('')+'</ul>');

            var that = this;
            setTimeout(function () {
                that._initScroll($parent);
            }, 0);
        },
        _initScroll : function ($node) {
            var node = $node[0];
            node.scrollTop = 0;
            $node
                .attr( 'data-bouncefix', null )
                .attr( 'data-scrollable', null )
                .attr( node.clientHeight >= node.scrollHeight ? 'data-bouncefix' : 'data-scrollable', '');
        },
        _onSelect : function () {

            var child = this.options.option[this.currShowing];
            var tree = child.tree;

            if ( this._need2Refresh(child) ) {

                var tmpSecond = child.tmpSecond;
                var tmpThird = child.tmpThird;
                // 更新选中字段
                child.slSecond = tmpSecond;
                child.slThird = tmpThird;

                // 更新文案字段
                var parent = tree[tmpSecond];

                child.defaultParent = $.isArray(parent) ? parent[0] : parent;
                child.defaultChild  = tmpThird !== undefined ? parent[1][tmpThird] : '';

                // call onSelect function
                this.options.onSelect(this.options.option);
                // console.log(this.options.option)

                // refresh root's text
                this.$roots.eq(this.currShowing).find('.ui-selected-text').text(child.defaultChild || child.defaultParent);
            }

        },
        _need2Refresh : function (child, isForce) {

            var slSecond = child.slSecond;
            var slThird = child.slThird;

            var tmpSecond = child.tmpSecond;
            var tmpThird = child.tmpThird;

            var hadChange = false;

            // 初始状态`slThird` `tmpThird` 都为undefined
            // 但初始化时候需要生成第三级菜单
            // `isForce`用于初始化时候强制生成
            if ( isForce || slSecond !== tmpSecond || slThird !== tmpThird ) {
                hadChange = true;
            }

            return hadChange;
        }
	});

})(Zepto, pro);
;(function($, pro) {
    pro.createWidget('Progress', {
        options: {
            percentage: 0, // 0% 当前进度   
            total: 100, // 100MB 总大小  
            content: '下载中' // 提示文字
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
            this.$el.find('.progress-text').text(options.content);
            this.$el.find('.progress-size-total').text(options.total);
            this.$el.find('.progress-size-curr').text((options.total * options.percentage / 100).toFixed(2));
            this.$el.find('.progress-bar').width(options.percentage + '%');
            this.$el.find('.progress-mask').height(100 - options.percentage + '%');
            this.$el.find('.progress-number').text(options.percentage);  

            if (deg <= 180) {
                // 小于 180 旋转右半圆
                 this.$el.find('.ui-progress-right').css('transform', "rotate(" + deg + "deg)");
                 this.$el.find('.ui-progress-left').css('transform', "rotate(0deg)");
            } else {
                // 大于 180 旋转左半圆
                 this.$el.find('.ui-progress-right').css('transform', "rotate(180deg)");
                 this.$el.find('.ui-progress-left').css('transform', "rotate(" + (deg - 180) + "deg)");
            }
        },

        _bindEvents: function(){
            this.$el.on('tap', '.action-cancle', function(e){
                // TODO
                console.log('cancle');
            });
        },

        changeProgress: function (percentage){
            var options = this.options;
            options.percentage = percentage;

            this._setProgress(options);         
        }
    });
})(Zepto, pro);

;(function($, pro) {
    pro.createWidget('Range', {
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
            var $val =  this.$el.find('.ui-range-val');
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
})(Zepto, pro);

;(function($){
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
})(Zepto);
;(function($){
	$.extend($.fn, {
		// 有点击态的按钮
		active: function(fn, className){
			className = className || 'js-active';
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
})(Zepto);
;(function( $, pro ) {
    /*
    *   Tab 组件
    *
    *   使用示例：
    *    $("#id").tab({
    *       $el: '.ui-tab',//tab item 父层通常为ul
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
            main: '<ul class="ui-tab"></ul>',
            ul: '<% for(var i = 0, l = list.length; i < l; i++){ %>\
                    <li class="ui-border-1px item"><%=list[i]%></li>\
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

;(function( $, pro ) {
	pro.createWidget( 'Toast', {
		options: {
			animation: true,
			preventScroll: true,
			state: 'warning',	// 三种状态 warning，tips，success，参见 http://waltz.cdc.com/mqq.html#3539
			content: '',
			duration: 2000
		},
		tpl: '<div class="ui-toast">\
			  	<i></i>\
			  	<span class="ui-color-white"></span>\
			  </div>',
		_render: function(){
			this.$el.find('i').removeClass().addClass('ui-icon-' + this.options.state);
			this.$el.find('span').text(this.options.content);
		},
		show: function( opts ){
			var self = this;

			this.$super('show', opts);

			if(this.options.duration){
				clearTimeout(this.timer);
				
				this.timer = setTimeout(function(){
					self.hide();
				}, this.options.duration);
			}
		},
	}, true);
})(Zepto, pro);

;(function( $, pro ) {
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

;(function( $, pro ) {
    var cssPrefix = '-webkit-';
    var ratio = window.devicePixelRatio == 1? 1 : 2;

    var sheet = $.insertStyleSheet();

    var cache = {}; /* Cache animation rules */
    
    pro.createWidget( 'Loading', {
        options: {
            size: 30,               // The width/ height of the spinner

            lineWidth : 2,         // The the width of each lines in px
            lines: 12,            // The number of lines to draw

            color : '158,158,158',      // Must be an RGB string

            duration: 1.6        // Seconds per round
        },
        tpl: '<canvas></canvas>',
        _addAnimation: function(lines){
            var name = 'js-loading-' + lines;

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

            this.$el.css(cssPrefix + 'animation', this._addAnimation(lines) + ' ' + options.duration + 's step-start infinite');

            var style = { width: halfSize, height: halfSize };
            style[cssPrefix + 'transform-origin'] = '0 0';
            style[cssPrefix + 'transform'] = 'scale(0.5)';
            this.$container.css(style);

            this.$el.appendTo(this.$container);
        }
    });
})(Zepto, pro);

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


(function( $, pro ) {
    pro.createWidget( 'RichLoading', {
        options: {
            preventScroll: true,
            content: '',
            onClose: $.emptyFunction
        },
        tpl: '<div class="ui-rich-loading">\
                <div class="loading" data-color="255,255,255" data-size="36"></div>\
                <div class="ui-no-wrap content"></div>\
                <div class="ui-icon-close btn"></div>\
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


;(function( $, pro ) {
	pro.createWidget( 'Mask', {
		options: {
			animation: true,
			preventScroll: true
		},
		tpl: '<div class="ui-mask"></div>',
		_bindEvents: function(){
            var self = this;

            var options = this.options;

            this.$el.on('tap', function(){
            	if(options.tapHide === true){
					if(options.relatedWidget){
						$.isFunction(options.relatedWidget.hide) && options.relatedWidget.hide();
					}
					self.hide();
				}else if($.isFunction(options.tapHide)){
					options.tapHide();
				}
			});
        }
	}, true);
})(Zepto, pro);

/**
 * by jdo
 * 
 * summary : 多级下拉菜单，最多支持3级
 */
;(function ($, pro, undefined){

	// var _initialize = 0;
    // android 4, 4.4
    // 页面滚动触发时，不触发`touchmove`事件
    // 暂无更好办法，先列为低端设备，做最原始的功能支持
    var ver = parseFloat($.env.systemVersion);
    var isPoorDevice = $.isPoorDevice || $.os.android && (ver === 4.4 || ver === 4);

    // alert(isPoorDevice)
	
	pro.createWidget('MultSelector', {

		options : {
			mask: true,
            animation: true,
            tapHide: true,
            selected: [],
            option: [],
            effect: 'from-top',
            maxRoot: 4,
            onShowChild : function () {},
            onChangeChild : function () {},
            onSelect : function () {}
		},

		$roots : null,
		$body : $(document.body),

		currShowing : null,

		tpl : {
			main: '<div class="ui-border-1px ui-multselect"></div>',

			selected : '<% \
						for ( var i = 0, len = Math.min(dat.length, maxRoot); i < len; i++ ) {\
					%>\
						<div class="ui-multselect-selected ui-multselect-<%= len %>grid">\
                            <div class="ui-selected-text-wrap<%= i+1 === len ? "":" ui-border-1px" %>">\
    				            <span class="ui-selected-text ui-no-wrap"><%= dat[i] %></span>\
    				            <i class="ui-icon-arrow ui-arrow-down"></i>\
                            </div>\
				        </div>\
					<% } %>',

			option : '<div class="ui-multselect-panel ui-border-1px <%= effect %> <%= cla %>">\
							<div class="ui-multselect-child left" data-panel="left">\
								<ul>\
								<%\
									var hasThirdPanel, currChild, slSecond, isActive = "";\
									defaultParent = defaultParent || tree[1][0];\
									for ( var i = 0, len = tree.length; i < len; i++ ) {\
										var item = tree[i], text, third;\
										if ( $.isArray(item) ) {\
											text = item[0];\
											third = item[1];\
											var hasThird = $.isArray(third) && third.length;\
											if ( !hasThirdPanel && hasThird ) hasThirdPanel = true;\
										} else {\
											text = item;\
											hasThird = hasThirdPanel = false;\
										}\
                                        var roots = text.split("&"), icon = "";\
                                        if ( roots.length === 2 ) {\
                                            text  = roots[0];\
                                            icon = roots[1];\
                                            third ? tree[i][0] = text : tree[i] = text\
                                        }\
										if ( defaultParent === text ) {\
											isActive = "active";\
											slSecond = i;\
											currChild = third;\
										} else {\
											isActive = "";\
										}\
								%>\
									<li class="ui-border-1px ui-multselect-child-li <%= isActive %><%= hasThird ? "" : " no-more" %>" data-index="<%=i%>">\
					            		<% if (icon) { %>\
                                            <div class="ui-multselect-child-li-icon <%= icon %>"></div>\
                                        <% } %>\
                                        <div class="ui-multselect-child-text ui-no-wrap"><%= text %></div>\
					            		<i class="ui-icon-arrow ui-arrow-right"></i>\
					            	</li>\
				            	<% } %>\
				            	</ul>\
       						</div>\
       						<div class="ui-multselect-child right" data-panel="right"><ul></ul></div>\
			            	<%\
                            var slThird = $.isArray(currChild) && currChild.length ? currChild.indexOf(defaultChild) : -1;\
                            slThird = slThird === -1 ? undefined : slThird;\
			            	bridging({\
			            		slSecond : slSecond,\
                                slThird : slThird,\
			            		tmpSecond : slSecond,\
                                tmpThird : slThird,\
			            		hasThirdPanel : hasThirdPanel\
			            	});\
			            	%>\
   						</div>'

		},
		_init: function (el, opts) {

            this.$super('_init', el, opts);
            this._create();

            if ( opts.selected && opts.selected.length ) this._renderRoot();
            if ( opts.option &&  opts.option.length) this._initPullDown();

		},
		_renderRoot: function(){
			var opts = this.options;
			var selected = opts.selected;

			if ( selected && selected.length ) {
				this.$roots = this.$el.html($.template(this.tpl.selected, { dat : selected, maxRoot : opts.maxRoot })).find('.ui-multselect-selected');
			}
        },
        _initPullDown : function () {
        	var opts = this.options;
        	var $roots = this.$roots;

			$.each(opts.option, function (k, child) {
				// 检查子节点是否存在
                // console.log(child)
				if ( child.tree && child.tree.length ) {
					$roots.eq(k).addClass('ui-multselect-root-more');
				}
			});
        },
        _bindEvents: function () {
        	var that = this;

        	this.$el
            .on('touchmove', function (e) {
                e.preventDefault();
            })
            .on('tap', '.ui-multselect-selected', function () {
        		var $elem = $(this);

        		if ( $elem.hasClass('ui-multselect-root-more') ) {
        			if ( $elem.hasClass('active') ) {
                        that.hide();
        				that.currShowing = null;
        			} else {
        				var index = parseInt($elem.index());
	        			var children = that.options.option;
	        			var child;

	        			if ( that.currShowing !== null ) {
                            that.$roots[that.currShowing].$panel.css('display', 'none');
	        				that.hide();
	        			}

	        			if ( children && (child = children[index]) ) {
	        				that.currShowing = index;
	        				that.showSubPanel(this, child);
	        			}
        			}
        		}
        	});

            // var that = this;
            this.$body.on('tap', '.ui-multselect-panel li', function () {
                if ( this.currShowing !== null ) {
                    var $this = $(this);
                    var $parent = $this.parents('.ui-multselect-child');

                    var child = that.options.option[that.currShowing];
                    var index = parseInt($this.data('index'));
                    var panel = $parent.hasClass('left') ? 'tmpSecond' : 'tmpThird';
                    var slChildIndex = child[panel];
                    // 触发onSelect标识
                    var isSelect;

                    // 存在子节点
                    if ( panel === 'tmpSecond' ) {

                        var curr = child.tree[index][1] || [];
                        // 非选中状态，即可更新面板
                        if ( index != slChildIndex ) {
                            that._renderThirdPanel($parent.next(), curr);
                        }
                        // 不存在三级菜单
                        if ($this.hasClass('no-more')) {
                            // 这里要清空三级选中状态
                            // 主要避免上一次选择遗留的数据
                            delete child.tmpThird;
                            that.hide();
                            isSelect = true;
                        }
                    } else {
                        that.hide();
                        isSelect = true;
                    }

                    // 更新选择状态
                    if ( index != slChildIndex ) {
                        // 初始化选中索引有可能为undefined
                        if ( slChildIndex !== undefined ) {
                            $parent.find('li:nth-child('+ (slChildIndex+1) +')').removeClass('active');
                        }
                        $parent.find('li:nth-child('+ (index+1) +')').addClass('active');
                        child[panel] = index;
                    }

                    isSelect && that._onSelect();
                }
            });
            // hack for android
            if ( $.os.android ) {
                // var $uisearchinput = $(".ui-search-input")[0];
                var currY, startScrollTop;

                this.$body.on('touchstart', '.ui-multselect-child[data-bouncefix]', function (e) {
                    e.preventDefault();
                })
                .on('touchstart', '.ui-multselect-child[data-scrollable]', function (e) {
                    var touch = e.touches[0];
                    var el = e.currentTarget;

                    currY = touch.pageY;
                    startScrollTop = el.scrollTop;
                })
                .on('touchmove', '.ui-multselect-child[data-scrollable]', function (e) {
                    var touch = e.touches[0];
                    var dis = touch.pageY - currY;

                    var el = e.currentTarget,
                        curPos = el.scrollTop,
                        height = el.clientHeight,
                        scroll = el.scrollHeight;

                    // alert(el.className);
                    // $uisearchinput.value = Math.random();

                    if ( curPos === 0 && dis > 0 || curPos === scroll - height && dis < 0 ) {
                        e.preventDefault();
                    }

                    // hack for poor device - andriod 3.0-
                    if ( isPoorDevice ) {
                        el.scrollTop = startScrollTop-dis;
                        e.preventDefault();
                    }

                });
            }
        },
        showSubPanel : function (root, child) {
            // render tree panel
        	this._renderSubPanel(root, child);
        	// undate root's status
            $(root).addClass('active');
            // 是否出遮罩
            this.options.mask && pro.mask.show({
                tapHide: this.options.tapHide,
                relatedWidget: this
            });
        	var that = this;
        	setTimeout(function () {
        		$( root.$panel ).removeClass(that.options.effect);
        	}, 30);
        },
        hide : function () {
            var root = this.$roots[this.currShowing];
            if ( root ) {

                $(root).removeClass('active');
                
                if ( root.$panel ) {
                    $( root.$panel )
                        .css('top', 0)
                        .addClass(this.options.effect);
                }

                this.options.mask && pro.mask.hide();
            }
        },
        add : function (index, root) {
            var opts = this.options;
            var option = opts.option;
            var max = opts.selected.length;
            var curr = option.length;

            // 指定强制更新某一节点
            if ( typeof index === 'number' && $.isArray(root) && root.length ) {

                var child;

                if ( index < max && (child = option[index]) ) {
                    child.tree = root;
                    child.refresh = true;
                }
                // call _initPullDown
                this._initPullDown();


            } else if ( $.isArray(index) ) {
                if ( curr < max ) {
                    // 复制节点数据
                    var tree = Array.prototype.slice.call(arguments, 0, max - curr);
                    
                    for ( var i = 0, len = tree.length; i < len; i++ ) {
                        option.tree.push( tree[i] );
                    }
                    // call _initPullDown
                    this._initPullDown();
                }
            }
        },
        reset : function (index, opt) {
            if ( typeof index === 'number' && opt ) {

                // var child;
                var options = this.options;
                var max = options.selected.length;

                if ( index < max ) {
                    opt.refresh = true;
                    options.option[index] = opt;
                    var selected = opt.defaultChild || opt.defaultParent;
                    // 更新selected字段
                    if ( selected !== options.selected[index] ) {
                        this.$roots.eq(index).find('.ui-selected-text').text(options.selected[index] = selected);
                    }
                }
                // call _initPullDown
                this._initPullDown();
            }
        },
        _renderSubPanel : function (root, child) {

            var force = false;
            var that = this;

            // 选项子集有变动，重新生成选择面板
            if ( child.refresh ) {
                // release panel node
                if ( root.$panel ) {
                    // 移除android端兼容事件
                    if ( $.os.android ) root.$panel.find('.ui-multselect-child').off();
                    // 移除节点
                    root.$panel.remove();
                    delete root.$panel;
                }
                delete child.refresh;
            }

        	if ( !root.$panel ) {
                var opts = this.options;

        		child.effect = opts.effect;
                child.cla = 'js-multselect-panel-'+this.currShowing;
                // child.top = opts.panelOffsetTop;
        		// 从模版中提取变量
        		// 省去重新遍历
        		child.bridging = function (dat) {
        			$.extend(child, dat);
        		};
        		root.$panel = $($.template(this.tpl.option, child)).appendTo(this.$body);

        		// 不存在第三级面板
        		if ( !child.hasThirdPanel ) root.$panel.addClass('no-third');

        		// this._bindSubEvents(root.$panel);
                // 初始化强制刷新标识
                force = true;
                // 初始化二级菜单滚动条
                setTimeout( function () {
                    that._initScroll(root.$panel.find('.ui-multselect-child.left'));
                }, 0 );
        	}

            var $panel = root.$panel;

            var clientRect = that.$el[0].getBoundingClientRect();

            $panel.css({
                // hack for poor equipment
                'top': clientRect.bottom + ($.env.isPoorDevice ? document.body.scrollTop : 0),
                'display': '-webkit-box'
            });

            var slSecond = child.slSecond;
            var slThird  = child.slThird;

            if ( this._need2Refresh(child, force) ) {

                // 更新临时选中字段
                child.tmpSecond = slSecond;
                child.tmpThird  = slThird;

                // 渲染第三级子菜单
                // `hasThirdPanel`由模版内部遍历检查
                // 这边不再重复对数据类型检查
                if ( child.hasThirdPanel ) {
                    var hasThird = child.tree[slSecond];
                    this._renderThirdPanel($panel.find('.ui-multselect-child.right'), hasThird[1] || []);
                }
                
            }

            // 初始化下拉菜单选择状态
            $panel.find('.ui-multselect-child.left li').removeClass('active').eq(slSecond).addClass('active');

            if ( slThird !== undefined )
                $panel.find('.ui-multselect-child.right li').removeClass('active').eq(slThird).addClass('active');

        },
        _renderThirdPanel : function ($parent, children) {
        	$parent.html('<ul>'+$.map(children, function (child, k) {
        		return '<li class="ui-border-1px ui-multselect-child-li" data-index="'+ k +'"><div class="ui-multselect-child-text ui-no-wrap">'+ child +'</div></li>';
        	}).join('')+'</ul>');

            var that = this;
            setTimeout(function () {
                that._initScroll($parent);
            }, 0);
        },
        _initScroll : function ($node) {
            var node = $node[0];
            node.scrollTop = 0;
            $node
                .attr( 'data-bouncefix', null )
                .attr( 'data-scrollable', null )
                .attr( node.clientHeight >= node.scrollHeight ? 'data-bouncefix' : 'data-scrollable', '');
        },
        _onSelect : function () {

            var child = this.options.option[this.currShowing];
            var tree = child.tree;

            if ( this._need2Refresh(child) ) {

                var tmpSecond = child.tmpSecond;
                var tmpThird = child.tmpThird;
                // 更新选中字段
                child.slSecond = tmpSecond;
                child.slThird = tmpThird;

                // 更新文案字段
                var parent = tree[tmpSecond];

                child.defaultParent = $.isArray(parent) ? parent[0] : parent;
                child.defaultChild  = tmpThird !== undefined ? parent[1][tmpThird] : '';

                // call onSelect function
                this.options.onSelect(this.options.option);
                // console.log(this.options.option)

                // refresh root's text
                this.$roots.eq(this.currShowing).find('.ui-selected-text').text(child.defaultChild || child.defaultParent);
            }

        },
        _need2Refresh : function (child, isForce) {

            var slSecond = child.slSecond;
            var slThird = child.slThird;

            var tmpSecond = child.tmpSecond;
            var tmpThird = child.tmpThird;

            var hadChange = false;

            // 初始状态`slThird` `tmpThird` 都为undefined
            // 但初始化时候需要生成第三级菜单
            // `isForce`用于初始化时候强制生成
            if ( isForce || slSecond !== tmpSecond || slThird !== tmpThird ) {
                hadChange = true;
            }

            return hadChange;
        }
	});

})(Zepto, pro);
;(function($, pro) {
    pro.createWidget('Progress', {
        options: {
            percentage: 0, // 0% 当前进度   
            total: 100, // 100MB 总大小  
            content: '下载中' // 提示文字
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
            this.$el.find('.progress-text').text(options.content);
            this.$el.find('.progress-size-total').text(options.total);
            this.$el.find('.progress-size-curr').text((options.total * options.percentage / 100).toFixed(2));
            this.$el.find('.progress-bar').width(options.percentage + '%');
            this.$el.find('.progress-mask').height(100 - options.percentage + '%');
            this.$el.find('.progress-number').text(options.percentage);  

            if (deg <= 180) {
                // 小于 180 旋转右半圆
                 this.$el.find('.ui-progress-right').css('transform', "rotate(" + deg + "deg)");
                 this.$el.find('.ui-progress-left').css('transform', "rotate(0deg)");
            } else {
                // 大于 180 旋转左半圆
                 this.$el.find('.ui-progress-right').css('transform', "rotate(180deg)");
                 this.$el.find('.ui-progress-left').css('transform', "rotate(" + (deg - 180) + "deg)");
            }
        },

        _bindEvents: function(){
            this.$el.on('tap', '.action-cancle', function(e){
                // TODO
                console.log('cancle');
            });
        },

        changeProgress: function (percentage){
            var options = this.options;
            options.percentage = percentage;

            this._setProgress(options);         
        }
    });
})(Zepto, pro);

;(function($, pro) {
    pro.createWidget('Range', {
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
            var $val =  this.$el.find('.ui-range-val');
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
})(Zepto, pro);

;(function($){
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
})(Zepto);
;(function($){
	$.extend($.fn, {
		// 有点击态的按钮
		active: function(fn, className){
			className = className || 'js-active';
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
})(Zepto);
;(function( $, pro ) {
    /*
    *   Tab 组件
    *
    *   使用示例：
    *    $("#id").tab({
    *       $el: '.ui-tab',//tab item 父层通常为ul
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
            main: '<ul class="ui-tab"></ul>',
            ul: '<% for(var i = 0, l = list.length; i < l; i++){ %>\
                    <li class="ui-border-1px item"><%=list[i]%></li>\
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

;(function( $, pro ) {
	pro.createWidget( 'Toast', {
		options: {
			animation: true,
			preventScroll: true,
			state: 'warning',	// 三种状态 warning，tips，success，参见 http://waltz.cdc.com/mqq.html#3539
			content: '',
			duration: 2000
		},
		tpl: '<div class="ui-toast">\
			  	<i></i>\
			  	<span class="ui-color-white"></span>\
			  </div>',
		_render: function(){
			this.$el.find('i').removeClass().addClass('ui-icon-' + this.options.state);
			this.$el.find('span').text(this.options.content);
		},
		show: function( opts ){
			var self = this;

			this.$super('show', opts);

			if(this.options.duration){
				clearTimeout(this.timer);
				
				this.timer = setTimeout(function(){
					self.hide();
				}, this.options.duration);
			}
		},
	}, true);
})(Zepto, pro);

;(function( $, pro ) {
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

;(function( $, pro ) {
    var cssPrefix = '-webkit-';
    var ratio = window.devicePixelRatio == 1? 1 : 2;

    var sheet = $.insertStyleSheet();

    var cache = {}; /* Cache animation rules */
    
    pro.createWidget( 'Loading', {
        options: {
            size: 30,               // The width/ height of the spinner

            lineWidth : 2,         // The the width of each lines in px
            lines: 12,            // The number of lines to draw

            color : '158,158,158',      // Must be an RGB string

            duration: 1.6        // Seconds per round
        },
        tpl: '<canvas></canvas>',
        _addAnimation: function(lines){
            var name = 'js-loading-' + lines;

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

            this.$el.css(cssPrefix + 'animation', this._addAnimation(lines) + ' ' + options.duration + 's step-start infinite');

            var style = { width: halfSize, height: halfSize };
            style[cssPrefix + 'transform-origin'] = '0 0';
            style[cssPrefix + 'transform'] = 'scale(0.5)';
            this.$container.css(style);

            this.$el.appendTo(this.$container);
        }
    });
})(Zepto, pro);

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


(function( $, pro ) {
    pro.createWidget( 'RichLoading', {
        options: {
            preventScroll: true,
            content: '',
            onClose: $.emptyFunction
        },
        tpl: '<div class="ui-rich-loading">\
                <div class="loading" data-color="255,255,255" data-size="36"></div>\
                <div class="ui-no-wrap content"></div>\
                <div class="ui-icon-close btn"></div>\
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


;(function( $, pro ) {
	pro.createWidget( 'Mask', {
		options: {
			animation: true,
			preventScroll: true
		},
		tpl: '<div class="ui-mask"></div>',
		_bindEvents: function(){
            var self = this;

            var options = this.options;

            this.$el.on('tap', function(){
            	if(options.tapHide === true){
					if(options.relatedWidget){
						$.isFunction(options.relatedWidget.hide) && options.relatedWidget.hide();
					}
					self.hide();
				}else if($.isFunction(options.tapHide)){
					options.tapHide();
				}
			});
        }
	}, true);
})(Zepto, pro);

/**
 * by jdo
 * 
 * summary : 多级下拉菜单，最多支持3级
 */
;(function ($, pro, undefined){

	// var _initialize = 0;
    // android 4, 4.4
    // 页面滚动触发时，不触发`touchmove`事件
    // 暂无更好办法，先列为低端设备，做最原始的功能支持
    var ver = parseFloat($.env.systemVersion);
    var isPoorDevice = $.isPoorDevice || $.os.android && (ver === 4.4 || ver === 4);

    // alert(isPoorDevice)
	
	pro.createWidget('MultSelector', {

		options : {
			mask: true,
            animation: true,
            tapHide: true,
            selected: [],
            option: [],
            effect: 'from-top',
            maxRoot: 4,
            onShowChild : function () {},
            onChangeChild : function () {},
            onSelect : function () {}
		},

		$roots : null,
		$body : $(document.body),

		currShowing : null,

		tpl : {
			main: '<div class="ui-border-1px ui-multselect"></div>',

			selected : '<% \
						for ( var i = 0, len = Math.min(dat.length, maxRoot); i < len; i++ ) {\
					%>\
						<div class="ui-multselect-selected ui-multselect-<%= len %>grid">\
                            <div class="ui-selected-text-wrap<%= i+1 === len ? "":" ui-border-1px" %>">\
    				            <span class="ui-selected-text ui-no-wrap"><%= dat[i] %></span>\
    				            <i class="ui-icon-arrow ui-arrow-down"></i>\
                            </div>\
				        </div>\
					<% } %>',

			option : '<div class="ui-multselect-panel ui-border-1px <%= effect %> <%= cla %>">\
							<div class="ui-multselect-child left" data-panel="left">\
								<ul>\
								<%\
									var hasThirdPanel, currChild, slSecond, isActive = "";\
									defaultParent = defaultParent || tree[1][0];\
									for ( var i = 0, len = tree.length; i < len; i++ ) {\
										var item = tree[i], text, third;\
										if ( $.isArray(item) ) {\
											text = item[0];\
											third = item[1];\
											var hasThird = $.isArray(third) && third.length;\
											if ( !hasThirdPanel && hasThird ) hasThirdPanel = true;\
										} else {\
											text = item;\
											hasThird = hasThirdPanel = false;\
										}\
                                        var roots = text.split("&"), icon = "";\
                                        if ( roots.length === 2 ) {\
                                            text  = roots[0];\
                                            icon = roots[1];\
                                            third ? tree[i][0] = text : tree[i] = text\
                                        }\
										if ( defaultParent === text ) {\
											isActive = "active";\
											slSecond = i;\
											currChild = third;\
										} else {\
											isActive = "";\
										}\
								%>\
									<li class="ui-border-1px ui-multselect-child-li <%= isActive %><%= hasThird ? "" : " no-more" %>" data-index="<%=i%>">\
					            		<% if (icon) { %>\
                                            <div class="ui-multselect-child-li-icon <%= icon %>"></div>\
                                        <% } %>\
                                        <div class="ui-multselect-child-text ui-no-wrap"><%= text %></div>\
					            		<i class="ui-icon-arrow ui-arrow-right"></i>\
					            	</li>\
				            	<% } %>\
				            	</ul>\
       						</div>\
       						<div class="ui-multselect-child right" data-panel="right"><ul></ul></div>\
			            	<%\
                            var slThird = $.isArray(currChild) && currChild.length ? currChild.indexOf(defaultChild) : -1;\
                            slThird = slThird === -1 ? undefined : slThird;\
			            	bridging({\
			            		slSecond : slSecond,\
                                slThird : slThird,\
			            		tmpSecond : slSecond,\
                                tmpThird : slThird,\
			            		hasThirdPanel : hasThirdPanel\
			            	});\
			            	%>\
   						</div>'

		},
		_init: function (el, opts) {

            this.$super('_init', el, opts);
            this._create();

            if ( opts.selected && opts.selected.length ) this._renderRoot();
            if ( opts.option &&  opts.option.length) this._initPullDown();

		},
		_renderRoot: function(){
			var opts = this.options;
			var selected = opts.selected;

			if ( selected && selected.length ) {
				this.$roots = this.$el.html($.template(this.tpl.selected, { dat : selected, maxRoot : opts.maxRoot })).find('.ui-multselect-selected');
			}
        },
        _initPullDown : function () {
        	var opts = this.options;
        	var $roots = this.$roots;

			$.each(opts.option, function (k, child) {
				// 检查子节点是否存在
                // console.log(child)
				if ( child.tree && child.tree.length ) {
					$roots.eq(k).addClass('ui-multselect-root-more');
				}
			});
        },
        _bindEvents: function () {
        	var that = this;

        	this.$el
            .on('touchmove', function (e) {
                e.preventDefault();
            })
            .on('tap', '.ui-multselect-selected', function () {
        		var $elem = $(this);

        		if ( $elem.hasClass('ui-multselect-root-more') ) {
        			if ( $elem.hasClass('active') ) {
                        that.hide();
        				that.currShowing = null;
        			} else {
        				var index = parseInt($elem.index());
	        			var children = that.options.option;
	        			var child;

	        			if ( that.currShowing !== null ) {
                            that.$roots[that.currShowing].$panel.css('display', 'none');
	        				that.hide();
	        			}

	        			if ( children && (child = children[index]) ) {
	        				that.currShowing = index;
	        				that.showSubPanel(this, child);
	        			}
        			}
        		}
        	});

            // var that = this;
            this.$body.on('tap', '.ui-multselect-panel li', function () {
                if ( this.currShowing !== null ) {
                    var $this = $(this);
                    var $parent = $this.parents('.ui-multselect-child');

                    var child = that.options.option[that.currShowing];
                    var index = parseInt($this.data('index'));
                    var panel = $parent.hasClass('left') ? 'tmpSecond' : 'tmpThird';
                    var slChildIndex = child[panel];
                    // 触发onSelect标识
                    var isSelect;

                    // 存在子节点
                    if ( panel === 'tmpSecond' ) {

                        var curr = child.tree[index][1] || [];
                        // 非选中状态，即可更新面板
                        if ( index != slChildIndex ) {
                            that._renderThirdPanel($parent.next(), curr);
                        }
                        // 不存在三级菜单
                        if ($this.hasClass('no-more')) {
                            // 这里要清空三级选中状态
                            // 主要避免上一次选择遗留的数据
                            delete child.tmpThird;
                            that.hide();
                            isSelect = true;
                        }
                    } else {
                        that.hide();
                        isSelect = true;
                    }

                    // 更新选择状态
                    if ( index != slChildIndex ) {
                        // 初始化选中索引有可能为undefined
                        if ( slChildIndex !== undefined ) {
                            $parent.find('li:nth-child('+ (slChildIndex+1) +')').removeClass('active');
                        }
                        $parent.find('li:nth-child('+ (index+1) +')').addClass('active');
                        child[panel] = index;
                    }

                    isSelect && that._onSelect();
                }
            });
            // hack for android
            if ( $.os.android ) {
                // var $uisearchinput = $(".ui-search-input")[0];
                var currY, startScrollTop;

                this.$body.on('touchstart', '.ui-multselect-child[data-bouncefix]', function (e) {
                    e.preventDefault();
                })
                .on('touchstart', '.ui-multselect-child[data-scrollable]', function (e) {
                    var touch = e.touches[0];
                    var el = e.currentTarget;

                    currY = touch.pageY;
                    startScrollTop = el.scrollTop;
                })
                .on('touchmove', '.ui-multselect-child[data-scrollable]', function (e) {
                    var touch = e.touches[0];
                    var dis = touch.pageY - currY;

                    var el = e.currentTarget,
                        curPos = el.scrollTop,
                        height = el.clientHeight,
                        scroll = el.scrollHeight;

                    // alert(el.className);
                    // $uisearchinput.value = Math.random();

                    if ( curPos === 0 && dis > 0 || curPos === scroll - height && dis < 0 ) {
                        e.preventDefault();
                    }

                    // hack for poor device - andriod 3.0-
                    if ( isPoorDevice ) {
                        el.scrollTop = startScrollTop-dis;
                        e.preventDefault();
                    }

                });
            }
        },
        showSubPanel : function (root, child) {
            // render tree panel
        	this._renderSubPanel(root, child);
        	// undate root's status
            $(root).addClass('active');
            // 是否出遮罩
            this.options.mask && pro.mask.show({
                tapHide: this.options.tapHide,
                relatedWidget: this
            });
        	var that = this;
        	setTimeout(function () {
        		$( root.$panel ).removeClass(that.options.effect);
        	}, 30);
        },
        hide : function () {
            var root = this.$roots[this.currShowing];
            if ( root ) {

                $(root).removeClass('active');
                
                if ( root.$panel ) {
                    $( root.$panel )
                        .css('top', 0)
                        .addClass(this.options.effect);
                }

                this.options.mask && pro.mask.hide();
            }
        },
        add : function (index, root) {
            var opts = this.options;
            var option = opts.option;
            var max = opts.selected.length;
            var curr = option.length;

            // 指定强制更新某一节点
            if ( typeof index === 'number' && $.isArray(root) && root.length ) {

                var child;

                if ( index < max && (child = option[index]) ) {
                    child.tree = root;
                    child.refresh = true;
                }
                // call _initPullDown
                this._initPullDown();


            } else if ( $.isArray(index) ) {
                if ( curr < max ) {
                    // 复制节点数据
                    var tree = Array.prototype.slice.call(arguments, 0, max - curr);
                    
                    for ( var i = 0, len = tree.length; i < len; i++ ) {
                        option.tree.push( tree[i] );
                    }
                    // call _initPullDown
                    this._initPullDown();
                }
            }
        },
        reset : function (index, opt) {
            if ( typeof index === 'number' && opt ) {

                // var child;
                var options = this.options;
                var max = options.selected.length;

                if ( index < max ) {
                    opt.refresh = true;
                    options.option[index] = opt;
                    var selected = opt.defaultChild || opt.defaultParent;
                    // 更新selected字段
                    if ( selected !== options.selected[index] ) {
                        this.$roots.eq(index).find('.ui-selected-text').text(options.selected[index] = selected);
                    }
                }
                // call _initPullDown
                this._initPullDown();
            }
        },
        _renderSubPanel : function (root, child) {

            var force = false;
            var that = this;

            // 选项子集有变动，重新生成选择面板
            if ( child.refresh ) {
                // release panel node
                if ( root.$panel ) {
                    // 移除android端兼容事件
                    if ( $.os.android ) root.$panel.find('.ui-multselect-child').off();
                    // 移除节点
                    root.$panel.remove();
                    delete root.$panel;
                }
                delete child.refresh;
            }

        	if ( !root.$panel ) {
                var opts = this.options;

        		child.effect = opts.effect;
                child.cla = 'js-multselect-panel-'+this.currShowing;
                // child.top = opts.panelOffsetTop;
        		// 从模版中提取变量
        		// 省去重新遍历
        		child.bridging = function (dat) {
        			$.extend(child, dat);
        		};
        		root.$panel = $($.template(this.tpl.option, child)).appendTo(this.$body);

        		// 不存在第三级面板
        		if ( !child.hasThirdPanel ) root.$panel.addClass('no-third');

        		// this._bindSubEvents(root.$panel);
                // 初始化强制刷新标识
                force = true;
                // 初始化二级菜单滚动条
                setTimeout( function () {
                    that._initScroll(root.$panel.find('.ui-multselect-child.left'));
                }, 0 );
        	}

            var $panel = root.$panel;

            var clientRect = that.$el[0].getBoundingClientRect();

            $panel.css({
                // hack for poor equipment
                'top': clientRect.bottom + ($.env.isPoorDevice ? document.body.scrollTop : 0),
                'display': '-webkit-box'
            });

            var slSecond = child.slSecond;
            var slThird  = child.slThird;

            if ( this._need2Refresh(child, force) ) {

                // 更新临时选中字段
                child.tmpSecond = slSecond;
                child.tmpThird  = slThird;

                // 渲染第三级子菜单
                // `hasThirdPanel`由模版内部遍历检查
                // 这边不再重复对数据类型检查
                if ( child.hasThirdPanel ) {
                    var hasThird = child.tree[slSecond];
                    this._renderThirdPanel($panel.find('.ui-multselect-child.right'), hasThird[1] || []);
                }
                
            }

            // 初始化下拉菜单选择状态
            $panel.find('.ui-multselect-child.left li').removeClass('active').eq(slSecond).addClass('active');

            if ( slThird !== undefined )
                $panel.find('.ui-multselect-child.right li').removeClass('active').eq(slThird).addClass('active');

        },
        _renderThirdPanel : function ($parent, children) {
        	$parent.html('<ul>'+$.map(children, function (child, k) {
        		return '<li class="ui-border-1px ui-multselect-child-li" data-index="'+ k +'"><div class="ui-multselect-child-text ui-no-wrap">'+ child +'</div></li>';
        	}).join('')+'</ul>');

            var that = this;
            setTimeout(function () {
                that._initScroll($parent);
            }, 0);
        },
        _initScroll : function ($node) {
            var node = $node[0];
            node.scrollTop = 0;
            $node
                .attr( 'data-bouncefix', null )
                .attr( 'data-scrollable', null )
                .attr( node.clientHeight >= node.scrollHeight ? 'data-bouncefix' : 'data-scrollable', '');
        },
        _onSelect : function () {

            var child = this.options.option[this.currShowing];
            var tree = child.tree;

            if ( this._need2Refresh(child) ) {

                var tmpSecond = child.tmpSecond;
                var tmpThird = child.tmpThird;
                // 更新选中字段
                child.slSecond = tmpSecond;
                child.slThird = tmpThird;

                // 更新文案字段
                var parent = tree[tmpSecond];

                child.defaultParent = $.isArray(parent) ? parent[0] : parent;
                child.defaultChild  = tmpThird !== undefined ? parent[1][tmpThird] : '';

                // call onSelect function
                this.options.onSelect(this.options.option);
                // console.log(this.options.option)

                // refresh root's text
                this.$roots.eq(this.currShowing).find('.ui-selected-text').text(child.defaultChild || child.defaultParent);
            }

        },
        _need2Refresh : function (child, isForce) {

            var slSecond = child.slSecond;
            var slThird = child.slThird;

            var tmpSecond = child.tmpSecond;
            var tmpThird = child.tmpThird;

            var hadChange = false;

            // 初始状态`slThird` `tmpThird` 都为undefined
            // 但初始化时候需要生成第三级菜单
            // `isForce`用于初始化时候强制生成
            if ( isForce || slSecond !== tmpSecond || slThird !== tmpThird ) {
                hadChange = true;
            }

            return hadChange;
        }
	});

})(Zepto, pro);
;(function($, pro) {
    pro.createWidget('Progress', {
        options: {
            percentage: 0, // 0% 当前进度   
            total: 100, // 100MB 总大小  
            content: '下载中' // 提示文字
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
            this.$el.find('.progress-text').text(options.content);
            this.$el.find('.progress-size-total').text(options.total);
            this.$el.find('.progress-size-curr').text((options.total * options.percentage / 100).toFixed(2));
            this.$el.find('.progress-bar').width(options.percentage + '%');
            this.$el.find('.progress-mask').height(100 - options.percentage + '%');
            this.$el.find('.progress-number').text(options.percentage);  

            if (deg <= 180) {
                // 小于 180 旋转右半圆
                 this.$el.find('.ui-progress-right').css('transform', "rotate(" + deg + "deg)");
                 this.$el.find('.ui-progress-left').css('transform', "rotate(0deg)");
            } else {
                // 大于 180 旋转左半圆
                 this.$el.find('.ui-progress-right').css('transform', "rotate(180deg)");
                 this.$el.find('.ui-progress-left').css('transform', "rotate(" + (deg - 180) + "deg)");
            }
        },

        _bindEvents: function(){
            this.$el.on('tap', '.action-cancle', function(e){
                // TODO
                console.log('cancle');
            });
        },

        changeProgress: function (percentage){
            var options = this.options;
            options.percentage = percentage;

            this._setProgress(options);         
        }
    });
})(Zepto, pro);

;(function($, pro) {
    pro.createWidget('Range', {
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
            var $val =  this.$el.find('.ui-range-val');
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
})(Zepto, pro);

;(function($){
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
})(Zepto);
;(function($){
	$.extend($.fn, {
		// 有点击态的按钮
		active: function(fn, className){
			className = className || 'js-active';
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
})(Zepto);
;(function( $, pro ) {
    /*
    *   Tab 组件
    *
    *   使用示例：
    *    $("#id").tab({
    *       $el: '.ui-tab',//tab item 父层通常为ul
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
            main: '<ul class="ui-tab"></ul>',
            ul: '<% for(var i = 0, l = list.length; i < l; i++){ %>\
                    <li class="ui-border-1px item"><%=list[i]%></li>\
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

;(function( $, pro ) {
	pro.createWidget( 'Toast', {
		options: {
			animation: true,
			preventScroll: true,
			state: 'warning',	// 三种状态 warning，tips，success，参见 http://waltz.cdc.com/mqq.html#3539
			content: '',
			duration: 2000
		},
		tpl: '<div class="ui-toast">\
			  	<i></i>\
			  	<span class="ui-color-white"></span>\
			  </div>',
		_render: function(){
			this.$el.find('i').removeClass().addClass('ui-icon-' + this.options.state);
			this.$el.find('span').text(this.options.content);
		},
		show: function( opts ){
			var self = this;

			this.$super('show', opts);

			if(this.options.duration){
				clearTimeout(this.timer);
				
				this.timer = setTimeout(function(){
					self.hide();
				}, this.options.duration);
			}
		},
	}, true);
})(Zepto, pro);

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
})(Zepto);

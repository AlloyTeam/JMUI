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

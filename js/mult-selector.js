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
            effect: "from-top",
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
				this.$roots = this.$el.html($.template(this.tpl.selected, { dat : selected, maxRoot : opts.maxRoot })).find(".ui-multselect-selected");
			}
        },
        _initPullDown : function () {
        	var opts = this.options;
        	var $roots = this.$roots;

			$.each(opts.option, function (k, child) {
				// 检查子节点是否存在
                // console.log(child)
				if ( child.tree && child.tree.length ) {
					$roots.eq(k).addClass("ui-multselect-root-more")
				}
			});
        },
        _bindEvents: function () {
        	var that = this;

        	this.$el
            .on("touchmove", function (e) {
                e.preventDefault()
            })
            .on("tap", ".ui-multselect-selected", function () {
        		var $elem = $(this);

        		if ( $elem.hasClass("ui-multselect-root-more") ) {
        			if ( $elem.hasClass("active") ) {
                        that.hide()
        				that.currShowing = null
        			} else {
        				var index = parseInt($elem.index());
	        			var children = that.options.option;
	        			var child;

	        			if ( that.currShowing !== null ) {
                            that.$roots[that.currShowing].$panel.css("display", "none")
	        				that.hide()
	        			}

	        			if ( children && (child = children[index]) ) {
	        				that.currShowing = index
	        				that.showSubPanel(this, child)
	        			}
        			}
        		}
        	});

            // var that = this;
            this.$body.on("tap", ".ui-multselect-panel li", function () {
                if ( this.currShowing !== null ) {
                    var $this = $(this);
                    var $parent = $this.parents(".ui-multselect-child");

                    var child = that.options.option[that.currShowing];
                    var index = parseInt($this.data("index"));
                    var panel = $parent.hasClass("left") ? "tmpSecond" : "tmpThird";
                    var slChildIndex = child[panel];
                    // 触发onSelect标识
                    var isSelect;

                    // 存在子节点
                    if ( panel === "tmpSecond" ) {

                        var curr = child.tree[index][1] || [];
                        // 非选中状态，即可更新面板
                        if ( index != slChildIndex ) {
                            that._renderThirdPanel($parent.next(), curr);
                        }
                        // 不存在三级菜单
                        if ($this.hasClass("no-more")) {
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
                            $parent.find("li:nth-child("+ (slChildIndex+1) +")").removeClass("active");
                        }
                        $parent.find("li:nth-child("+ (index+1) +")").addClass("active");
                        child[panel] = index;
                    }

                    isSelect && that._onSelect();
                }
            });
            // hack for android
            if ( $.os.android ) {
                // var $uisearchinput = $(".ui-search-input")[0];
                var currY, startScrollTop;

                this.$body.on("touchstart", ".ui-multselect-child[data-bouncefix]", function (e) {
                    e.preventDefault();
                })
                .on("touchstart", ".ui-multselect-child[data-scrollable]", function (e) {
                    var touch = e.touches[0];
                    var el = e.currentTarget;

                    currY = touch.pageY;
                    startScrollTop = el.scrollTop;
                })
                .on("touchmove", ".ui-multselect-child[data-scrollable]", function (e) {
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
            $(root).addClass("active");
            // 是否出遮罩
            this.options.mask && pro.mask.show({
                tapHide: this.options.tapHide,
                relatedWidget: this
            });
        	var that = this;
        	setTimeout(function () {
        		$( root.$panel ).removeClass(that.options.effect)
        	}, 30);
        },
        hide : function () {
            var root = this.$roots[this.currShowing];
            if ( root ) {

                $(root).removeClass("active");
                
                if ( root.$panel ) {
                    $( root.$panel )
                        .css("top", 0)
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
            if ( typeof index === "number" && $.isArray(root) && root.length ) {

                var child;

                if ( index < max && (child = option[index]) ) {
                    child.tree = root;
                    child.refresh = true
                }
                // call _initPullDown
                this._initPullDown();


            } else if ( $.isArray(index) ) {
                if ( curr < max ) {
                    // 复制节点数据
                    var tree = Array.prototype.slice.call(arguments, 0, max - curr);
                    
                    for ( var i = 0, len = tree.length; i < len; i++ ) {
                        option.tree.push( tree[i] )
                    }
                    // call _initPullDown
                    this._initPullDown();
                }
            }
        },
        reset : function (index, opt) {
            if ( typeof index === "number" && opt ) {

                var child;
                var options = this.options;
                var max = options.selected.length;

                if ( index < max ) {
                    opt.refresh = true
                    options.option[index] = opt;
                    var selected = opt.defaultChild || opt.defaultParent;
                    // 更新selected字段
                    if ( selected !== options.selected[index] ) {
                        this.$roots.eq(index).find(".ui-selected-text").text(options.selected[index] = selected);
                    }
                }
                // call _initPullDown
                this._initPullDown();
            }
        },
        _renderSubPanel : function (root, child) {

            var force = false;

            // 选项子集有变动，重新生成选择面板
            if ( child.refresh ) {
                // release panel node
                if ( root.$panel ) {
                    // 移除android端兼容事件
                    if ( $.os.android ) root.$panel.find(".ui-multselect-child").off();
                    // 移除节点
                    root.$panel.remove();
                    delete root.$panel;
                }
                delete child.refresh;
            }

        	if ( !root.$panel ) {
                var opts = this.options;
                var that = this;

        		child.effect = opts.effect;
                child.cla = "js-multselect-panel-"+this.currShowing;
                // child.top = opts.panelOffsetTop;
        		// 从模版中提取变量
        		// 省去重新遍历
        		child.bridging = function (dat) {
        			$.extend(child, dat)
        		}
        		root.$panel = $($.template(this.tpl.option, child)).appendTo(this.$body);

        		// 不存在第三级面板
        		if ( !child.hasThirdPanel ) root.$panel.addClass("no-third");

        		// this._bindSubEvents(root.$panel);
                // 初始化强制刷新标识
                force = true;
                // 初始化二级菜单滚动条
                setTimeout( function () {
                    that._initScroll(root.$panel.find(".ui-multselect-child.left"));
                }, 0 )
        	}

            var $panel = root.$panel;
            var that = this;

            var clientRect = that.$el[0].getBoundingClientRect();

            $panel.css({
                // hack for poor equipment
                "top": clientRect.bottom + ($.env.isPoorDevice ? document.body.scrollTop : 0),
                "display": "-webkit-box"
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
                    this._renderThirdPanel($panel.find(".ui-multselect-child.right"), hasThird[1] || []);
                }
                
            }

            // 初始化下拉菜单选择状态
            $panel.find(".ui-multselect-child.left li").removeClass("active").eq(slSecond).addClass("active");

            if ( slThird !== undefined )
                $panel.find(".ui-multselect-child.right li").removeClass("active").eq(slThird).addClass("active");

        },
        _renderThirdPanel : function ($parent, children) {
        	$parent.html('<ul>'+$.map(children, function (child, k) {
        		return '<li class="ui-border-1px ui-multselect-child-li" data-index="'+ k +'"><div class="ui-multselect-child-text ui-no-wrap">'+ child +'</div></li>'
        	}).join("")+'</ul>');

            var that = this;
            setTimeout(function () {
                that._initScroll($parent);
            }, 0)
        },
        _initScroll : function ($node) {
            var node = $node[0];
            node.scrollTop = 0;
            $node
                .attr( "data-bouncefix", null )
                .attr( "data-scrollable", null )
                .attr( node.clientHeight >= node.scrollHeight ? "data-bouncefix" : "data-scrollable", "")
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
                child.defaultChild  = tmpThird !== undefined ? parent[1][tmpThird] : "";

                // call onSelect function
                this.options.onSelect(this.options.option);
                // console.log(this.options.option)

                // refresh root's text
                this.$roots.eq(this.currShowing).find(".ui-selected-text").text(child.defaultChild || child.defaultParent);
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

            return hadChange
        }
	});

})(Zepto, pro);
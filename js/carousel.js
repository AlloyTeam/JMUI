/**
 * by jdo
 * 20140625
 * summary: a slider depend on zetpo, which work for mobile
 * update: by felixqslai on 20141215
 */


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

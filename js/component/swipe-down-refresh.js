;(function ($, JMU) {
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
})(Zepto, JMU);
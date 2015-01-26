;(function( $, JMU ) {
    var cssPrefix = '-webkit-';
    var ratio = window.devicePixelRatio == 1? 1 : 2;

    var sheet = $.insertStyleSheet();

    var cache = {}; /* Cache animation rules */
    
    JMU.Component( 'Loading', {
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
})(Zepto, JMU);

(function( $, JMU ) {
    JMU.Component( 'TextLoading', {
        options: {
            preventScroll: true,
            content: ''
        },
        tpl: '<div class="jmu-text-loading">\
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

(function( $, JMU ) {
    JMU.Component( 'PageLoading', {
        options: {
            content: ''
        },
        tpl: '<div class="jmu-page-loading">\
                <div class="loading"></div>\
                <div class="content"></div>\
            </div>',
        _render: function(){
            var options = this.options;

            this.$el.find('.loading').loading('show');

            this.$el.find('.content').html(options.content);
        }
    }, true);
})(Zepto, JMU);


(function( $, JMU ) {
    JMU.Component( 'RichLoading', {
        options: {
            preventScroll: true,
            content: '',
            onClose: $.emptyFunction
        },
        tpl: '<div class="jmu-rich-loading">\
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
    }, true);
})(Zepto, JMU);


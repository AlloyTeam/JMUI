;(function($){
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
})(Zepto);
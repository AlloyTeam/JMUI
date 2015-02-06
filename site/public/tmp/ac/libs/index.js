window.onload =  function() {
    var canvas = document.querySelector('canvas')
    canvas.width = document.documentElement.offsetWidth
    canvas.height = 500
    var times = 0
    function draw(ctx, pxs) {
        times ++
        for (var i = 0; i < pxs.length; i++) {
            if (times > 50) {
                pxs[i].move();
                pxs[i].fade();
            }
            // pxs[i].setOptions({
            //     blink: times > 50
            // })
            pxs[i].draw();
        }
    }
    pxxl("libs/test.bdf", "AC 2015", function(pixels) {
        var $can = $('canvas');
        var ctx = $can[0].getContext('2d');
        var rint = 60;
        var width = $can.width();
        var height = $can.height();

        var pxs = new Array(pixels.length);
        pixels.forEach(function (item, i) {
            pxs[i] = new Circle({
                random: false,
                xdef: item.x * 20 + 240,
                ydef: item.y * 20 + 100,
                width: width,
                height: height,
                ctx: ctx,
                xdrift: 0,
                ydrift: 0,
                rmax: 12,
                rmin: 5,
                blink: true,
                color_begin: '255, 255, 255',
                color_end: '248, 248, 248'
            });
            pxs[i].reset();
        })
        // animation in batch
        setInterval(function () {
            ctx.clearRect(0, 0, width, height);
            draw(ctx, pxs)
        }, rint);
    });

}

function Circle(options) {
    var rint = options.rint || 60;
    var WIDTH = options.width || window.innerWidth;
    var HEIGHT = options.height || window.innerHeight;
    var con = options.ctx;

    this.s = util.extend({
        ttl: 8000, // time_to_live – used to calculate hl–or the half-life–of each particle
        xmax: 5, // x_maxspeed – defines the maximum number of pixels a particle can move each frame
        ymax: 2, // y_maxspeed – defines the maximum number of pixels a particle can move each frame
        rmax: 10, // radius_max – maximum radius a particle can achieve
        rmin: 1, // radius_min – minium radius a particle can achieve
        rt: 1, // rt – used in conjunction with hl to determine how the ratio of maximum speed and full opacity of each particle in each frame
        xdef: 100,
        ydef: 100,
        xdrift: 4, // x偏移
        ydrift: 4, // y偏移
        random: true,
        blink: true,
        color_begin: '255, 255, 255', // rgb color for point radial gradient background begin
        color_end: '234, 234, 234' // rgb color for point radial gradient background end
    }, options);

    this.setOptions = function (opts) {
        this.s = util.extend(this.s, opts)
    }

    this.reset = function() {
        this.x = (this.s.random ? WIDTH * Math.random() : this.s.xdef);
        this.y = (this.s.random ? HEIGHT * Math.random() : this.s.ydef);
        this.r = ((this.s.rmax - 1) * Math.random()) + this.s.rmin;
        this.dx = (Math.random() * this.s.xmax) * (Math.random() < .5 ? -1 : 1);
        this.dy = (Math.random() * this.s.ymax) * (Math.random() < .5 ? -1 : 1);
        this.hl = (this.s.ttl / rint) * (this.r / this.s.rmax);
        this.rt = 5;
        this.s.rt = Math.random() + 1;
        this.stop = Math.random() * .2 + .4;
        this.s.xdrift *= Math.random() * (Math.random() < .5 ? -1 : 1);
        this.s.ydrift *= Math.random() * (Math.random() < .5 ? -1 : 1);
    }

    this.fade = function() {
        this.rt += this.s.rt;
    }

    this.draw = function() {
        if (this.s.blink && (this.rt <= 0 || this.rt >= this.hl)) this.s.rt = this.s.rt * -1;
        else if (this.rt >= this.hl) this.reset();
        var newo = 1 - (this.rt / this.hl); // opacity 透明度

        con.beginPath();
        con.arc(this.x, this.y, this.r, 0, Math.PI * 2, true);
        con.closePath();
        var cr = this.r * newo;
        grad = con.createRadialGradient(this.x, this.y, 0, this.x, this.y, (cr <= 0 ? 1 : cr));
        grad.addColorStop(0.0, 'rgba(' + this.s.color_begin + ',' + newo + ')');
        grad.addColorStop(this.stop, 'rgba(' + this.s.color_end + ',' + (newo * .8) + ')');
        grad.addColorStop(1.0, 'rgba(77,101,181,0)');
        con.fillStyle = grad;
        con.fill();
    }

    this.move = function() {
        this.x += (this.rt / this.hl) * this.dx;
        this.y += (this.rt / this.hl) * this.dy;
        if (this.x > WIDTH || this.x < 0) this.dx *= -1;
        if (this.y > HEIGHT || this.y < 0) this.dy *= -1;
    }

    this.getX = function() {
        return this.x;
    }
    this.getY = function() {
        return this.y;
    }
}

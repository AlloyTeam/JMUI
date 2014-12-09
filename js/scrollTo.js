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
;(function($){
    function bounceFix() {
        $.isBounceFix = true;

        // fix by jdochen
        // 为兼容后期生成的节点，使用委托方式绑定
        $(document)
        .on('touchmove', '[data-bouncefix],[data-scrollable]', function (e) {
            var el = e.currentTarget,
                clientHeight = el.clientHeight,
                scrollHeight = el.scrollHeight;

            if(scrollHeight <= clientHeight){
                e.preventDefault();
            }
        })
        .on('touchstart', '[data-scrollable]', function (e) {
            var el = e.currentTarget,
                scrollTop = el.scrollTop,
                clientHeight = el.clientHeight,
                scrollHeight = el.scrollHeight;

            if(scrollHeight > clientHeight){
                if ( scrollTop <= 0 ) {
                    el.scrollTop = 1;
                }

                if ( scrollTop >= scrollHeight - clientHeight ){
                    el.scrollTop = scrollHeight - clientHeight - 1;
                }
            }
        });
    }

    // only for ios6+
    if( $.os.ios && $.os.version >= '6' ) {
        $('body').addClass('jmu-bounce-fix');
        bounceFix();
    }
})(Zepto);

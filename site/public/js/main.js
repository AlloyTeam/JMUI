$(function () {
    function changeDemo(id) {
        if (!id) return;
        // 修改 iframe 中的链接
        var oldSrc = $('.demo-iframe').attr('src');
        var pathname = window.location.pathname.split('/').pop();
        if (pathname.indexOf('.html') === -1) {
            var newSrc = 'http://alloyteam.github.io/JMUI//demo/_'+ pathname + '.html#' + id;
        } else {
            var newSrc = 'http://alloyteam.github.io/JMUI//demo/_'+ pathname + '#' + id;
        }

        if (newSrc !== oldSrc) {
            window.location.hash = id;
            $('.demo-iframe').attr('src', newSrc);
            $('li[data-hash]').removeClass('active');
            $('li[data-hash='+ id+']').addClass('active');
        }
    }

    //  初始化剪贴板功能
    function initCopyToBoard(element) {
        $(element).each(function () {
            var element = $(this);
            var client = new ZeroClipboard(element);
            $(element).tooltip({
                title: '已复制',
                trigger: 'manual',
                placement: 'right'
            });
            client.on( "ready", function( readyEvent ) {
                client.on( "aftercopy", function( event ) {
                    console.log("成功复制到剪贴板: " + event.data["text/plain"] );
                    $(element).tooltip('show');
                    setTimeout(function () {
                        $(element).tooltip('hide');
                    }, 2000);
                } );
            } );
        });
    }

    // 初始化拖拽
    function initDraggable (element) {
        var $element = $(element);
        var isDraggable = false;
        var diffX = 0;
        var diffY = 0;
        function mousemoveHandle (e) {
            if (isDraggable) {
                var left = e.clientX - diffX;
                var top = e.clientY - diffY;
                $element.css({
                    left: left
                });
            }
        }
        $element.on('mousedown', function (e) {
            isDraggable = true;
            diffX = e.clientX - $element.offset().left;
            diffY = e.clientY - $element.offset().top;

            $element.on('mousemove', mousemoveHandle);
        });
        $element.on('mouseup', function (e) {
            isDraggable = false;
            diffX = 0;
            diffY = 0;

            $element.off('mousemove', mousemoveHandle);
        });
        $element.on('mouseout', function (e) {
            isDraggable = false;
            $element.off('mousemove', mousemoveHandle);
        });
    }

    // 初始化代码高亮
    function initHighlight () {
        hljs.configure({
            tabReplace: '  '
        });
        hljs.initHighlightingOnLoad();
    }

    // 初始化滚动监听
    function initAfix () {
        var bannerAffixTop = $('.doc-body').offset().top;
        var docBodyRight = $('.doc-body')[0].getBoundingClientRect().right;

        $('.hide-demo-btn, .scroll-top-btn').css({
            //left: docBodyRight
        });

        if ($('.demo-iframe-wrap').length > 0) {
            var right = docBodyRight - $('.demo-iframe-wrap')[0].getBoundingClientRect().width;
            $('.demo-iframe-wrap').css({
                left: right - 70
            });
            $('.demo-iframe-wrap').affix({
                offset: {
                    top: bannerAffixTop
                }
            });
        }
        $('.doc-nav').affix({
            offset: {
                top: bannerAffixTop
            }
        });
    }

    function bindEvents () {
        // 导航
        // 滚动监听
        $('body').scrollspy({ target: '.js-scroll-spy' })
            .on('activate.bs.scrollspy', function (e) {
                var id = $(e.target).data('hash');
                changeDemo(id);
            });

        // 滚动监听
        var timmer;
        $(window).on('scroll', function () {
            clearTimeout(timmer);
            timmer = setTimeout(function () {
                if ($(window).scrollTop() > 300) {
                    $('.scroll-top-btn, .hide-demo-btn').fadeIn();
                } else {
                    $('.scroll-top-btn, .hide-demo-btn').hide();
                }
            }, 50);
        });

        // 隐藏手机
        $('.hide-demo-btn').on('click', function (e) {
            e.preventDefault();
            var display = $('.demo-iframe-wrap').css('display');
            $('.demo-iframe-wrap').toggle();
            var text = (display === 'none') ? '隐藏 Demo' : '显示 Demo';
            $(this).text(text);
        });

        // 扫描二维码
        $('.doc-qrcode-btn').on('click', function (e) {
            e.preventDefault();
            var href =  $(this)[0].href;
            $('#qrcode').empty().qrcode({width: 300,height: 300,text: href});
            $('#qrcode-link').attr('href', href);
            $('#qrcode-modal').modal('show');
        });

        $('.doc-demo-link').on('mouseover', function (e) {
            e.preventDefault();
            var href =  $(this)[0].href; // 原生js 的 href 才是绝对路径
            var panelHeight  = $(this).parents('.panel').height();
            var height = (panelHeight < 300) ? panelHeight : 300;
            $(this).siblings('.doc-qrcode').empty().qrcode({width: height,height: height,text: href});
            $('.demo-iframe-wrap').hide();
            $(this).siblings('.doc-qrcode').show();
        });
        $('.doc-demo-link').on('mouseout', function (e) {
            $(this).siblings('.doc-qrcode').hide();
            $('.demo-iframe-wrap').show();
        });

        // 打开源码面板
        $('.doc-demo-css-link, .doc-demo-js-link').on('click', function (e) {
            e.preventDefault();
            var title = $(this).text();
            var href =  $(this)[0].href; // 原生js 的 href 才是绝对路径
            var type = href.split('.')[1];
            $('#sourcecode-modal .modal-body').scrollTop(0);
            $('#sourcecode-modal code').removeClass('css js');
            $("#sourcecode-modal code").load(href, function( response, status, xhr ) {
                if ( status == "error" ) {
                    //$( "#sourcecode-modal code" ).html( "Sorry but there was an error: " + xhr.status + " " + xhr.statusText );
                } else {
                    $('#sourcecode-modal .modal-title').text(href);
                    $('#sourcecode-modal .doc-demo-file-link').attr('href', href);
                    $('#sourcecode-modal code').text(response);
                    $('#sourcecode-modal code').addClass(type);
                    $('#sourcecode-modal code').each(function(i, block) {
                        hljs.highlightBlock(block);
                    });
                    $('#sourcecode-modal').modal('show');
                }
            });
        });

        // 提交反馈
        $('#feedback-form').on('submit', function (e) {
            var form = this;
            e.preventDefault();
            $('#feedback-form-submit-btn').prop('disabled', true);
            $('#feedback-form-submit-btn').text('提交中');
            var data = $(this).serialize();
            var action = $(this).attr('action');
            $.post(action, data, function (data) {
                if (data.retcode === 0) {
                    $('#feedback-modal').modal('hide');
                    $('#feedback-form').find('[name="feedback"]').val('');
                    alert(data.msg);
                } else {
                    alert(data.msg);
                }
            }).done(function () {
                $('#feedback-form-submit-btn').prop('disabled', false);
                $('#feedback-form-submit-btn').text('提交');
            });
        });
    }

    function pageInit () {
        $('.navbar-nav').find('a[href="'+ window.location.pathname +'"]').parent('li').addClass('active');

        initAfix();
        initHighlight();
        initCopyToBoard('.doc-copy-code-btn');
        initDraggable('.demo-iframe-wrap');
        bindEvents();
    }

    pageInit();
});

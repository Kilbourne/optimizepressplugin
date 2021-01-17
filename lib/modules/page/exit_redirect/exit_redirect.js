;(function($){
    var exit_disabled = false;
    $(document).ready(function(){
        var els = document.getElementsByName('form');
        for(var i=0,il=els.length;i<il;i++){
            if(!els[i].onclick){
                els[i].onclick = function(){
                    exit_disabled = true;
                };
            } else if(!els[i].onsubmit){
                els[i].onsubmit = function(){
                    exit_disabled = true;
                };
            }
        };
        els = document.getElementsByName('a');
        for(var i=0,il=els.length;i<il;i++){
            $(els[i]).click(function(){
                exit_disabled = false;
                if($(this).attr('target') != '_blank'){
                    exit_disabled = true;
                }
            });
        };

        //Don't trigger exit redirect if user clicks on button or submits a form.
        $('body').on('submit', 'form', function () {
            exit_disabled = true;
        });
        $('body').on('click', '.css-button, a, [class^="button-style"], button', function () {
            exit_disabled = true;
        });
    });

    //So that event won't be triggered immediately after redirect.
    setTimeout(function () {
        $(window).bind('beforeunload',unload_event);
    }, 200);

    function nl2br(str){
        str = str.replace(/(\r\n|\n)/g,'<br />');
        return str;
    }

    function unload_event(e){

        var $modal;
        var modalHeight;
        var modalWidth;

        if (exit_disabled === false) {
            //Only Firefox doesn't accept any parameters to onbeforeunload event, and therefore we can't display custom redirect message. Message is shown in alert.
            //IE11 returns $.browser.mozilla true, therefore an additional check to ensure that the browser isn't IE is needed.
            if ($.browser.mozilla && version_compare($.browser.version,'4.0') && !(!!navigator.userAgent.match(/Trident\/7\./)) ) {
                $('body').append('<div id="op-exit-redirect-modal" class="op-exit-redirect-modal">' + nl2br(OptimizePress.exit_redirect_message) + '</div>');
                $modal = $('#op-exit-redirect-modal');
                modalHeight = $('#op-exit-redirect-modal').outerHeight();
                modalWidth = $('#op-exit-redirect-modal').outerWidth();
                $modal.css({
                    'margin-top': '-' + modalHeight + 'px',
                    'margin-left': '-' + (modalWidth / 2) + 'px'
                });
            }

            if (e) {
                e.returnValue = OptimizePress.exit_redirect_message;
            }

            // This is placed in a timeout to ensure that actual redirect happens after user has seen browser confirm dialog.
            setTimeout(function () {
                var url = OptimizePress.exit_redirect_url;
                $(window).unbind('beforeunload',unload_event);
                if (url.indexOf('?') < 0) {
                    url += '?';
                } else {
                    url += '&';
                }
                url += 'op_exit_redirect=true';
                window.location = url;
            }, 200);

            return OptimizePress.exit_redirect_message;
        }

    }

    function version_compare(a,b){
        if(a === b){
            return 0;
        }
        a = a.split('.');
        b = b.split('.');
        for(var i=0,len=Math.min(a.length,b.length);i<len;i++){
            if(parseInt(a[i]) > parseInt(b[i]))
                return 1;
            if(parseInt(a[i]) < parseInt(b[i]))
                return -1;
        }
        if(a.length > b.length)
            return 1;
        if(a.length < b.length)
            return -1;
        return 0;
    };
}(opjq));
opjq(document).ready(function($){

    var $body = $('body');

    /**
     * Shows the loading indicator and blocks the UI
     */
    window.op_show_loading = function () {
        if (window.op_dont_show_loading || $('#op_overlay').length > 0) {
            //Loading is already showing
            return;
        }

        // if (window.top.opjq.fancybox) {
        //     window.top.opjq.fancybox.showLoading();
        //     $body.append('<div id="op_overlay" style="opacity:1;"></div>');
        // }
        $body.append('<div id="op_loading"></div><div id="op_overlay"></div>');
        setTimeout(function () {
            $('#op_overlay, #op_loading').css('opacity', 1);
        }, 100);
    }

    /**
     * Hides the OP loading indicator (invoked with op_show_loading)
     */
    window.op_hide_loading = function (notAnimated) {
        if (window.op_dont_hide_loading) {
            return;
        }

        if (notAnimated) {
            $('#op_overlay, #op_loading').remove();
        }

        if (window.top.opjq.fancybox) {
            window.top.opjq.fancybox.hideLoading();
        }

        $('#op_overlay, #op_loading').css('opacity', 0);
        setTimeout(function () {
            $('#op_overlay, #op_loading').remove();
        }, 200);
    }

});
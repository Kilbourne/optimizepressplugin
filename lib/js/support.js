;(function($){
    $.ready.promise().done(function() {

        ZeroClipboard.config({swfPath: OptimizePress.OP_JS + '/zeroclipboard/ZeroClipboard.swf'});

        $('.op-bsw-grey-panel-tabs li a').click(function() {

            var $openedTab = $('.tab-' + $(this).attr('href').replace('#', ''));

            if ($(this).attr('href') === '#disable_styles_scripts') {
                $('.op-disable-styles-scripts-button').show();
                $('.op-support-to-clipboard').hide();
            } else {
                $('.op-disable-styles-scripts-button').hide();
                $('.op-support-to-clipboard').show();
            }

            // If opened tab has class 'js-op-hide-form-actions', we should show form action buttons
            if ($openedTab.find('.op-bsw-grey-panel-content').hasClass('js-op-hide-form-actions')) {
                $('.form-actions').addClass('op-hidden');
            } else {
                $('.form-actions').removeClass('op-hidden');
            }

            return false;
        });

        var client = new ZeroClipboard($('.op-support-to-clipboard'));
        client.on('copy', function(event) {
            var text = [];
            $('.op-system-status-section').each(function(i, item) {
                text.push($(item).val());
            });
            alert(opSupportPageL10N.copied_to_clipboard);
            event.clipboardData.setData('text/plain', text.join(''));
            return false;
        });
        $('.op-support-to-clipboard').click(function() {
            return false;
        })
    });
}(opjq));
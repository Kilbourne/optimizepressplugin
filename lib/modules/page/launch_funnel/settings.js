opjq(document).ready(function ($) {

    $('body').on('click', '#funnel_switch_create_new', function (e) {
        e.preventDefault();
        $('#launch_funnel_select:visible').fadeOut('fast',function(){
            $('#launch_funnel_new').fadeIn('fast');
        });
    });

    $('body').on('click', '#funnel_switch_select', function (e) {
        e.preventDefault();
        $('#launch_funnel_new:visible').fadeOut('fast',function(){
            $('#launch_funnel_select').fadeIn('fast');
        });
    });

    $('body').on('click', '#add_new_funnel', function (e) {
        e.preventDefault();
        var waiting = $(this).next().find('img').fadeIn('fast'), name = $(this).prev().val(),
            data = {
                action: OptimizePress.SN+'-launch-suite-create',
                _wpnonce: $('#op_le_wpnonce').val(),
                funnel_name: name
            };
            if(typeof window.op_live_editor == 'boolean'){
                data.live_editor = 'Y';
            } else {
                data.pagebuilder = 'Y';
            }
        $.post(OptimizePress.ajaxurl,data,function(resp){
            waiting.fadeOut('fast');
            if(typeof resp.error != 'undefined'){
                alert(resp.error);
            } else {
                $('#launch_funnel_select').find('select').html(resp.html);
                $('#funnel_switch_select').trigger('click');
            }
        },'json');
    });

});
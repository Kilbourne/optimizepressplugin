;(function($){
    $(document).ready(function(){
        if(typeof OptimizePress.signup_form != 'undefined'){
            $.each(OptimizePress.signup_form,function(i,v){
                var form = $('.op-signup-form-'+i);
                $.each(v,function(field,value){
                    form.find(':input.'+field).data('default_val',value).focus(focus_field).blur(blur_field).trigger('blur');
                });
            })
        }
    });
    function focus_field(){
        var $t = $(this), v = $t.val(), d = $t.data('default_val');
        if(v == d){
            $t.val('');
        }
    };
    function blur_field(){
        var $t = $(this), v = $t.val(), d = $t.data('default_val');
        if(v == ''){
            $t.val(d);
        }
    };
}(opjq));
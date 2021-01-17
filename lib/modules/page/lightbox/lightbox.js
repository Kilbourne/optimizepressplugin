;(function($){
    var epicbox = [], showon;
    $(document).ready(function(){
        epicbox = [$('#epicbox-overlay'),$('#epicbox')];
        epicbox.push($('.epicbox-content',epicbox[1]));
        epicbox.push($('.epicbox-scroll',epicbox[2]));
        epicbox[0].css({ opacity: 0.8 });

        if(typeof OptimizePress !== 'undefined' && typeof OptimizePress.lightbox_show_on !== 'undefined'){
            showon = OptimizePress.lightbox_show_on;
        }
        if(!check_cookie()){
            resize_epicbox();
            if(showon == 'load'){
                show_lightbox();
            } else {
                $(window).bind('beforeunload',show_exit);
            }
            $('.close',epicbox[1]).click(function(e){
                e.preventDefault();
                hide_lightbox();
                set_cookie('op_module_hide_lightbox','Y');
            });
            epicbox[0].click(hide_lightbox);
        }
        $(window).resize(function(){
            resize_epicbox();
        });
    });
    function hide_lightbox(){
        epicbox[0].add(epicbox[1]).fadeOut();
    };
    function show_lightbox(){
        epicbox[0].add(epicbox[1]).fadeIn('fast');
    };

    function show_exit(e){
        setTimeout(show_lightbox,1000);
        $(window).unbind('beforeunload',show_exit);
        e = e || window.event;
        if(e){
            e.returnValue = '';
        }
        return '';
    };
    function resize_epicbox(){
        epicbox[1].height(epicbox[3].outerHeight());
        epicbox[2].height(epicbox[1].height());
        epicbox[1].css("margin-top","-" +  epicbox[1].innerHeight() / 2 + "px");
    };
    function get_cookie(cname){
        var cookie = window.document.cookie;
        if(cookie.length > 0){
            var c_start = cookie.indexOf(cname+'=');
            if(c_start !== -1){
                c_start = c_start + cname.length+1;
                var c_end = cookie.indexOf(';',c_start);
                if(c_end === -1)
                    c_end = cookie.length;
                return unescape(cookie.substring(c_start,c_end));
            }
        }
        return false;
    };
    function set_cookie(name,value){
        var date = new Date();
        date.setTime(date.getTime() + (365*86400*1000));
        window.document.cookie = [name+'='+escape(value),'expires='+date.toUTCString(),'path='+document.location.pathname].join('; ');
    };
    function check_cookie(){
        if(get_cookie('op_module_hide_lightbox') == 'Y')
            return true;
        return false;
    };
}(opjq));
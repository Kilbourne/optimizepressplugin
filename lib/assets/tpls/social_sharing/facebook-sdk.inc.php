<script>
(function ($) {

    <?php $fbAppId = op_default_attr('comments','facebook','id') ? 'appId: ' . op_default_attr('comments','facebook','id') . ',' : ''; ?>

    if (typeof window.fbAsyncInit === 'undefined') {
        window.fbAsyncInit = function() {
            FB.init({
                <?php echo $fbAppId; ?>
                xfbml      : true,
                version    : 'v2.7'
            });
            $(window).trigger("OptimizePress.fbAsyncInit");
        };

        (function(d, s, id){
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) {return;}
            js = d.createElement(s); js.id = id;
            js.src = "//connect.facebook.net/<?php echo $fb_lang; ?>/all.js";
            fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk'));
    }

    if (typeof FB !== 'undefined') {
        FB.XFBML.parse();
    }

}(opjq));
</script>
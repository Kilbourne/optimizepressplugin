<?php include('style.inc.php'); ?>

<script id="js_<?php echo $id; ?>">
(function ($) {

    if (typeof FB !== "undefined") {
        opSetFBEvents();
    } else {
        $(window).on('OptimizePress.fbAsyncInit', opSetFBEvents);
    }

    function opSetFBEvents() {
        FB.Event.subscribe('edge.create', function(response) {
            $('#<?php echo $id; ?> span:first-of-type').height(($('#<?php echo $id; ?> span:first-of-type').height() + 145) + 'px');
        });

        FB.Event.subscribe('message.send', function(response) {
            $('#<?php echo $id; ?> span:first-of-type').height(($('#<?php echo $id; ?> span:first-of-type').height() + 161) + 'px');
        });

        FB.XFBML.parse();
    }

    $('#js_<?php echo $id; ?>').remove();

}(opjq));
</script>

<?php require_once('facebook-sdk.inc.php'); ?>

<div id="<?php echo $id; ?>" class="social-sharing social-sharing-style-21">
    <div class="fb-like" data-href="<?php echo $fb_like_url; ?>" data-send="true" data-width="450" data-show-faces="true" data-colorscheme="<?php echo $fb_color; ?>"></div>
</div>
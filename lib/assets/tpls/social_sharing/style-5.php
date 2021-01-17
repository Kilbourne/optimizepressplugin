<?php include('style.inc.php'); ?>

<ul id="<?php echo $id; ?>" data-counter="false" class="social-sharing social-media-horizontal-bubble social-sharing-style-5">
    <li><div class="fb-like" data-href="<?php echo $fb_like_url; ?>" data-send="false" data-layout="box_count" data-width="450" data-show-faces="true" data-colorscheme="<?php echo $fb_color; ?>"></div></li>
    <li><div class="g-plusone" data-size="tall" data-href="<?php echo $g_url; ?>"></div></li>
</ul>

<?php require_once('facebook-sdk.inc.php'); ?>

<?php require_once('googleplus-sdk.inc.php'); ?>
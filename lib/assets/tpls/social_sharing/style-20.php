<?php include('style.inc.php'); ?>

<ul id="<?php echo $id; ?>" id="<?php echo $id; ?>" data-counter="true" class="social-sharing social-sharing-style-20">
    <li class="twitter" data-likes="<?php echo OptimizePress_Social_Count::getInstance()->getTwitterShareCount($tw_url); ?>" data-lang="<?php echo $tw_lang; ?>" data-url="<?php echo $tw_url; ?>"<?php echo (!empty($tw_button_text) ? ' data-title="'.$tw_button_text.'"' : ''); ?><?php echo (!empty($tw_button_text) ? ' data-text="'.$tw_button_text.'"' : ''); ?>></li>
    <li class="facebook" data-likes="<?php echo OptimizePress_Social_Count::getInstance()->getFacebookShareCount($fb_like_url); ?>" data-lang="<?php echo $fb_lang; ?>" data-url="<?php echo $fb_like_url; ?>"<?php echo (!empty($fb_button_text) ? ' data-title="'.$fb_button_text.'"' : ''); ?><?php echo (!empty($fb_text) ? ' data-text="'.$fb_text.'"' : ''); ?> data-colorscheme="<?php echo $fb_color; ?>"></li>
    <li class="googlePlus" data-lang="<?php echo $g_lang; ?>" data-url="<?php echo $g_url; ?>"<?php echo (!empty($g_button_text) ? ' data-title="'.$g_button_text.'"' : ''); ?><?php echo (!empty($g_button_text) ? ' data-text="'.$g_button_text.'"' : ''); ?>></li>
</ul>

<script>
if (typeof opjq === 'function') {
    opjq(window).trigger('op_init_sharrre');
}
</script>
<div class="op-bsw-grey-panel-content op-bsw-info-bar op-bsw-grey-panel-no-sidebar">
    <label for="op_info_bar_twitter" class="form-title"><?php _e('Twitter URL', 'optimizepress') ?></label>
    <p class="op-micro-copy"><?php _e('Enter your URL for your Twitter profile to add a link to the Info Bar. e.g. http://www.twitter.com/yourname', 'optimizepress')?></p>
    <input type="text" name="op[sections][info_bar][twitter]" id="op_info_bar_twitter" value="<?php op_default_attr_e('info_bar','twitter') ?>" />
    
    
    <label for="op_info_bar_email" class="form-title"><?php _e('Email', 'optimizepress') ?></label>
     <p class="op-micro-copy"><?php _e('Enter an email address to add a mailto link in the Info Bar', 'optimizepress')?></p>
    <input type="text" name="op[sections][info_bar][email]" id="op_info_bar_email" value="<?php op_default_attr_e('info_bar','email') ?>" />
   
    <label for="op_info_bar_rss" class="form-title"><?php _e('RSS', 'optimizepress') ?></label>
    <p class="op-micro-copy"><?php _e('Enter the address of your RSS feed for the Info Bar link. Click Default if you\'re not sure.', 'optimizepress')?></p>
    <input type="text" name="op[sections][info_bar][rss]" id="op_info_bar_rss" value="<?php op_default_attr_e('info_bar','rss') ?>" />
    <?php op_default_link('op_info_bar_rss',get_bloginfo('rss2_url')) ?>
    

</div>
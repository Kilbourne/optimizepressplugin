<div class="op-bsw-grey-panel-content op-bsw-grey-panel-no-sidebar cf">
    <?php if($error = $this->error('op_sections_social_integration_facebook_app_id')): ?>
    <span class="error"><?php echo $error ?></span>
    <?php endif; ?>
    
    <label for="op_sections_facebook_app_id" class="form-title"><?php _e('Facebook App ID', 'optimizepress') ?></label>
    <p class="op-micro-copy"><?php _e('If you would like to integrate Facebook services with your website, please enter your Facebook APP ID below. Follow our guide to setting up a Facebook APP ID ', 'optimizepress') ?><a target="_blank" href="https://optimizepress.zendesk.com/hc/en-us/articles/200874728-Setup-Facebook-Comments-Facebook-App-ID"><?php _e('here', 'optimizepress') ?></a></p>
    <?php op_text_field('op[sections][facebook_app_id]',op_default_option('comments', 'facebook', 'id')) ?>
    <div class="clear"></div>

    <label for="" class="form-title"><?php _e('Facebook App Secret', 'optimizepress') ?></label>
    <p class="op-micro-copy"><?php _e('If you would like to get number of shares for URL you need to enter Facebook APP secret ', 'optimizepress') ?></p>
    <?php op_text_field('op[sections][facebook_app_secret]',op_default_option('comments', 'facebook', 'secret')) ?>
    <div class="clear"></div>
</div>
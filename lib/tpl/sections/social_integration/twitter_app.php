<div class="op-bsw-grey-panel-content op-bsw-grey-panel-no-sidebar cf">
    <?php if($error = $this->error('op_sections_social_integration_facebook_app_id')): ?>
    <span class="error"><?php echo $error ?></span>
    <?php endif; ?>

    <p class="op-micro-copy"><?php _e('If you would like to get Twitter share count you need enter Twitter Application access'); ?> </p>
    
    <label for="op_sections_twitter_consumer_key" class="form-title"><?php _e('Twitter Consumer Key', 'optimizepress') ?></label>
    <?php op_text_field('op[sections][twitter_consumer_key]',op_default_option('comments', 'twitter', 'consumer_key')) ?>
    <div class="clear"></div>

    <label for="op_sections_twitter_consumer_secret" class="form-title"><?php _e('Twitter Consumer Secret', 'optimizepress') ?></label>
    <?php op_text_field('op[sections][twitter_consumer_secret]',op_default_option('comments', 'twitter', 'consumer_secret')) ?>
    <div class="clear"></div>

    <label for="op_sections_twitter_oauth_access_token" class="form-title"><?php _e('Twitter oAuth Access Token', 'optimizepress') ?></label>
    <?php op_text_field('op[sections][twitter_oauth_access_token]',op_default_option('comments', 'twitter', 'oauth_access_token')) ?>
    <div class="clear"></div>

    <label for="op_sections_twitter_oauth_access_token_secret" class="form-title"><?php _e('Twitter oAuth Access Token Secret', 'optimizepress') ?></label>
    <?php op_text_field('op[sections][twitter_oauth_access_token_secret]',op_default_option('comments', 'twitter', 'oauth_access_token_secret')) ?>
    <div class="clear"></div>
</div>
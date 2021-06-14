<div class="op-bsw-grey-panel-content op-bsw-grey-panel-no-sidebar cf">
<?php if (op_get_option('gotowebinar_api_key') === false) : ?>
	<label for="op_sections_email_marketing_services_gotowebinar_api_key" class="form-title"><?php _e('GoToWebinar Consumer key', 'optimizepress'); ?></label>
    <p class="op-micro-copy">
        <?php _e('In order to use GoToWebinar, you need to create an application in ', 'optimizepress'); ?>
        <a target="_blank" href="https://goto-developer.logmeininc.com"><?php _e('GoToWebinar Developer Center', 'optimizepress'); ?></a>
        and click <em>My Apps -> Add A New App</em>.
    </p>
    <p class="op-micro-copy">
        <?php _e('When creating an application, please use this return URL:', 'optimizepress'); ?><br>
        <strong><?php echo admin_url('admin.php?action=' . OP_GOTOWEBINAR_AUTH_URL); ?></strong>
    </p>
    <p class="op-micro-copy"><?php _e('After app is created, please copy GoToWebinar Consumer key and Consumer secret below and click Save Settings on the bottom of this screen.', 'optimizepress'); ?></p>
    <p class="op-micro-copy"><?php _e('You will get redirected back here, where you have to click Connect and follow the on-screen instructions.', 'optimizepress'); ?></p>
    <label>Consumer Key</label>
    <?php op_text_field('op[sections][email_marketing_services][gotowebinar_api_key]', op_get_option('gotowebinar_api_key')); ?>
    <label>Consumer Secret</label>
    <?php op_text_field('op[sections][email_marketing_services][gotowebinar_api_secret]', op_get_option('gotowebinar_api_secret')); ?>
<?php else : ?>
    <label for="op_sections_email_marketing_services_gotowebinar_access_token" class="form-title"><?php _e('GoToWebinar API connection', 'optimizepress'); ?></label>
    <?php if (op_get_option('gotowebinar_access_token') === false || op_get_option('gotowebinar_organizer_key') === false): ?>
    <p class="op-micro-copy">
    	<?php _e('GoToWebinar is disconnected.', 'optimizepress'); ?> <a href="<?php echo admin_url('admin.php?action=' . OP_GOTOWEBINAR_AUTH_URL); ?>&authorize=1"><?php _e('Connect', 'optimizepress'); ?></a>
    	<?php _e('or', 'optimizepress'); ?> <a href="<?php echo admin_url('admin.php?action=' . OP_GOTOWEBINAR_AUTH_URL); ?>&clean=1"><?php _e('Clean Consumer key', 'optimizepress'); ?></a>
    </p>
	<?php else: ?>
        <?php
        $accessToken = op_get_option('gotowebinar_access_token');
        $apiSecret = op_get_option('gotowebinar_api_secret');
        if (false !== $accessToken && false === $apiSecret) :
        ?>
            <p class="op-micro-copy"><?php _e('You are using a deprecated GoTowebinar API connection. Please Disconnect your connection below, enter your Client Id and Secret, then reconnect again.', 'optimizepress') ?></p>
        <?php endif; ?>
	<p class="op-micro-copy"><?php _e('GoToWebinar is connected.', 'optimizepress'); ?> <a href="<?php echo admin_url('admin.php?action=' . OP_GOTOWEBINAR_AUTH_URL); ?>&disconnect=1"><?php _e('Disconnect', 'optimizepress'); ?></a></p>
	<?php endif; ?>
<?php endif; ?>
</div>
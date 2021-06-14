<div class="op-bsw-grey-panel-content op-bsw-grey-panel-no-sidebar" id="op_gateway_key">
	<label class="form-title"><?php _e('Gateway Key', 'optimizepress') ?></label>
	<p class="op-micro-copy"><?php _e('Use this option to require a special access link for any of your launch funnel pages. Once activated, enter in a key below (use letters and numbers only). You will then need to ensure each of your funnel pages has a redirect page set (this would be your opt-in page) and you can use the special gateway URL for your thank you page link to ensure your subscribers get access', 'optimizepress') ?></p>
    <input type="text" id="op_launch_settings_gateway_key_key" name="op[gateway_key][key]" value="<?php echo op_launch_default_attr('gateway_key','key') ?>" />
</div>
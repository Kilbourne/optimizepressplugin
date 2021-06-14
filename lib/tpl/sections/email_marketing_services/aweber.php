<div class="op-bsw-grey-panel-content op-bsw-grey-panel-no-sidebar cf">
    <label class="form-title"><?php _e('AWeber API connection', 'optimizepress'); ?></label>
    <?php if (op_get_option('aweber_access_token') === false || op_get_option('aweber_access_secret') === false): ?>
    <p class="op-micro-copy"><?php _e('AWeber is disconnected.', 'optimizepress'); ?> <a href="<?php echo admin_url('admin.php?action=' . OP_AWEBER_AUTH_URL); ?>"><?php _e('Connect', 'optimizepress'); ?></a></p>
	<?php else: ?>
	<p class="op-micro-copy"><?php _e('AWeber is connected.', 'optimizepress'); ?> <a href="<?php echo admin_url('admin.php?action=' . OP_AWEBER_AUTH_URL); ?>&disconnect=1"><?php _e('Disconnect', 'optimizepress'); ?></a></p>
	<?php endif; ?>
	<p class="op-note"><em><?php _e('Note: The AWeber API only currently supports double-optin subscribe methods so all contacts will be required to confirm their email. Use the "Custom Form" integration method in your opt-in form options to integrate standard AWeber web forms with our system to retain your single-optin if you require it.', 'optimizepress'); ?></em></p>
</div>
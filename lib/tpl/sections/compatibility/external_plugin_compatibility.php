<div class="op-bsw-grey-panel-content op-bsw-grey-panel-no-sidebar cf">
	<p class="op-micro-copy">
		<?php _e('This section is intended to provide additional configuration settings for specific WordPress plugins that help reslove some compatibility issues.', 'optimizepress'); ?>
	</p>
	<p class="op-note"><em><?php _e("Note: If there are no plugins listed here that means that you don't have any of the plugins that cause compatibility issues installed and/or activated", "optimizepress"); ?></em></p>
	<?php if (is_plugin_active('DAP-WP-LiveLinks/DAP-WP-LiveLinks.php')) : ?>
	<h3><?php _e('DigitalAccessPass LiveLinks', 'optimizepress'); ?></h3>
	<label for="dap_redirect_url" class="form-title"><?php _e('Enter "Members Only" redirect page URL', 'optimizepress') ?></label>
    <input type="text" name="op[sections][dap_redirect_url]" id="dap_redirect_url" value="<?php echo op_get_option('dap_redirect_url'); ?>" />
    <p class="op-note"><em><?php _e('Note: Pages protected with DAP that are created with OP Live Editor will redirect to the URL specifed (if left empty, user will be redirected to home URL).', 'optimizepress') ?></em></p>
    <?php endif; ?>
    <?php if (is_plugin_active('fastmember/fastmember.php')) : ?>
	<h3><?php _e('Fast Member', 'optimizepress'); ?></h3>
	<label for="fast_member_redirect_url" class="form-title"><?php _e('Enter "Members Only" redirect page URL', 'optimizepress') ?></label>
    <input type="text" name="op[sections][fast_member_redirect_url]" id="fast_member_redirect_url" value="<?php echo op_get_option('fast_member_redirect_url'); ?>" />
    <p class="op-note"><em><?php _e('Note: Pages protected with Fast Member that are created with OP Live Editor will redirect to the URL specifed (if left empty, user will be redirected to home URL).', 'optimizepress') ?></em></p>
    <?php endif; ?>
    <?php if (class_exists('infusionWP')) : ?>
	<h3><?php _e('iMember360', 'optimizepress'); ?></h3>
	<label for="imember_redirect_url" class="form-title"><?php _e('Enter "Members Only" redirect page URL', 'optimizepress') ?></label>
    <input type="text" name="op[sections][imember_redirect_url]" id="imember_redirect_url" value="<?php echo op_get_option('imember_redirect_url'); ?>" />
    <p class="op-note"><em><?php _e('Note: Pages protected with iMember360 that are created with OP Live Editor will redirect to the URL specifed (if left empty, user will be redirected to home URL).', 'optimizepress') ?></em></p>
    <?php endif; ?>
    
    <?php if ('theme' === OP_TYPE) : ?>
	    <?php 
	    	$val = op_get_option('op_other_plugins');
	    	$checked = '';
	 		if ('on' === $val) {
				$checked = 'checked="checked"';
			}
	    ?>
	    <label for="op_favicon" class="form-title"><?php _e('Other plugins', 'optimizepress') ?></label>
	    <p class="op-micro-copy"><?php _e('If you experience a problem with "Blog Setup screen" seen, even when blog setup is finished, check this checkbox:', 'optimizepress') ?></p>
	    <input type ="checkbox" <?php echo $checked;?> name="op[sections][op_other_plugins]" id="op_other_plugins" /> <?php echo __('Fix blog setup issues caused by plugin incompatibility', 'optimizepress');?>
	    <div class="clear"></div>
    <?php endif; ?>
</div>
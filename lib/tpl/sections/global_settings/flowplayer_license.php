<div class="op-bsw-grey-panel-content op-bsw-grey-panel-no-sidebar cf">
    <?php if($error = $this->error('op_sections_flowplayer_license')): ?>
    <span class="error"><?php echo $error ?></span>
    <?php endif; ?>

	<p class="op-micro-copy"><?php _e('To be able to remove Flowplayer logo from the video player, you need to have it licensed for this domain. License key and commercial version files can be uploaded here.', 'optimizepress') ?></p>

	<label for="op_sections_flowplayer_license_license_key" class="form-title"><?php _e('License key', 'optimizepress'); ?></label>
	<?php op_text_field('op[sections][flowplayer_license][license_key]',op_default_option('flowplayer_license','license_key')); ?>

	<label for="op_sections_flowplayer_license_js_file" class="form-title"><?php _e('HTML5 commercial version file (JS)', 'optimizepress'); ?></label>
    <?php op_upload_field('op[sections][flowplayer_license][js_file]', op_default_option('flowplayer_license', 'js_file'));; ?>

    <label for="op_sections_flowplayer_license_swf_file" class="form-title"><?php _e('Flash commercial version file (SWF)', 'optimizepress'); ?></label>
    <?php op_upload_field('op[sections][flowplayer_license][swf_file]', op_default_option('flowplayer_license', 'swf_file'));; ?>

    <label for="op_sections_flowplayer_license_custom_logo" class="form-title"><?php _e('Custom logo', 'optimizepress'); ?></label>
    <?php op_upload_field('op[sections][flowplayer_license][custom_logo]', op_default_option('flowplayer_license', 'custom_logo'));; ?>

    <div class="clear"></div>
</div>
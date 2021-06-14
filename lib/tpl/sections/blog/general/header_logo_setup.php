<div class="op-bsw-grey-panel-content op-bsw-grey-panel-no-sidebar cf">
    <?php if($error = $this->error('op_sections_header_logo_setup')): ?>
    <span class="error"><?php echo $error ?></span>
    <?php endif; ?>
    <label for="op_sections_header_logo_setup" class="form-title"><?php _e('Upload a logo (optional)', 'optimizepress') ?></label>
    <p class="op-micro-copy"><?php _e('Upload a logo.  We recommend you size your logo to '.OP_HEADER_LOGO_WIDTH.'px by '.OP_HEADER_LOGO_HEIGHT.'px', 'optimizepress') ?></p>
    <?php op_upload_field('op[sections][header_logo_setup][logo]',op_default_option('header_logo_setup','logo')) ?>
    <div class="clear"></div>
    
    <label for="op_sections_header_logo_setup_repeatbgimg" class="form-title"><?php _e('Upload Repeating Header Image', 'optimizepress') ?></label>
    <p class="op-micro-copy"><?php _e('This would normally be a gradient.  Upload a repeating header background image which will be tiled horizontally on your header.  We recommend you use a gradient of your choice which is 1px by 250px or the same height as the banner image above if you have uploaded one', 'optimizepress') ?></p>
    <?php op_upload_field('op[sections][header_logo_setup][repeatbgimg]',op_default_option('header_logo_setup','repeatbgimg')) ?>
    <label><?php _e('or Choose a header background colour', 'optimizepress'); ?></label>
	<?php op_color_picker('op[sections][header_logo_setup][bgcolor]',op_default_attr('header_logo_setup', 'bgcolor'),'op_header_logo_setup');	?>
</div>
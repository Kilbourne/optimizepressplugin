<div class="op-bsw-grey-panel-content op-bsw-grey-panel-no-sidebar cf">
    <?php if($error = $this->error('op_sections_blog_header')): ?>
    <span class="error"><?php echo $error ?></span>
    <?php endif; ?>
    
    <?php
	$logo = op_default_option('blog_header','logo');
	$repeatbgimg = op_default_option('blog_header','repeatbgimg');
	$bgcolor = op_default_option('blog_header','bgcolor');
	if (empty($logo)) $logo = op_default_option('header_logo_setup', 'logo');
	if (empty($repeatbgimg)) $repeatbgimg = op_default_option('header_logo_setup', 'repeatbgimg');
	if (empty($bgcolor)) $bgcolor = op_default_option('header_logo_setup', 'bgcolor');
    ?>
    <label for="op_sections_blog_header_logo" class="form-title"><?php _e('Upload a logo (optional)', 'optimizepress') ?></label>
    <p class="op-micro-copy"><?php _e('Upload a logo image to show on your blog. We recommend you size your logo to '.OP_HEADER_LOGO_WIDTH.'px by '.OP_HEADER_LOGO_HEIGHT.'px', 'optimizepress') ?></p>
    <?php op_upload_field('op[sections][blog_header][logo]',$logo) ?>
    <div class="clear"></div>
   
    
   <!-- <div class="op-hr"><hr /></div> -->
    
    <label for="op_sections_blog_header_bgimg" class="form-title"><?php _e('Upload a Banner Image', 'optimizepress') ?></label>
    <p class="op-micro-copy"><?php _e('Recommended if you don\'t have a logo. Upload a header image up to 975px in width with any graphics on it, and we\'ll throw that on instead.', 'optimizepress') ?></p>
    <?php op_upload_field('op[sections][blog_header][bgimg]',op_default_option('blog_header','bgimg')) ?>
    
    
    <label for="op_sections_blog_header_repeatbgimg" class="form-title"><?php _e('Upload Repeating Header Background Image', 'optimizepress') ?></label>
    <p class="op-micro-copy"><?php _e('This would normally be a gradient. Upload a repeating header background image which will be tiled horizontally on your header.  We recommend you use a gradient of your choice which is 1px by 250px or the same height as the banner image above if you have uploaded one', 'optimizepress') ?></p>
    <?php op_upload_field('op[sections][blog_header][repeatbgimg]',$repeatbgimg) ?>
    <label><?php _e('or Choose a header background colour', 'optimizepress'); ?></label>
	<?php op_color_picker('op[sections][blog_header][bgcolor]',$bgcolor,'op_blog_header_bgcolor');	?>
</div>
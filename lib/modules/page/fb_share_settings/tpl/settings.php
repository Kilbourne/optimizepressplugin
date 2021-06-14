<div class="op-bsw-grey-panel-content op-bsw-grey-panel-no-sidebar">
	<?php /*
	<label for="<?php echo $fieldid ?>title" class="form-title"><?php _e('Facebook Share Title', 'optimizepress') ?></label>
    <p class="op-micro-copy"><?php _e('Enter the title to be used when your page is shared on Facebook', 'optimizepress') ?></p>
    <input type="text" name="<?php echo $fieldname ?>[title]" id="<?php echo $fieldid ?>title" value="<?php op_page_attr_e($section_name,'title') ?>" />
    
	<label for="<?php echo $fieldid ?>description" class="form-title"><?php _e('Facebook Share Description', 'optimizepress') ?></label>
    <p class="op-micro-copy"><?php _e('Enter the description of your page to be shown when your page is shared on Facebook', 'optimizepress') ?></p>
    <input type="text" name="<?php echo $fieldname ?>[description]" id="<?php echo $fieldid ?>description" value="<?php op_page_attr_e($section_name,'description') ?>" />
    
    <label for="<?php echo $fieldid ?>image" class="form-title"><?php _e('Facebook Share Image', 'optimizepress') ?></label>
    <p class="op-micro-copy"><?php _e('Select an image to be used when your page is shared on Facebook. Ensure the picture is appealing as this will increase click-thru rate to your site.', 'optimizepress') ?></p>
    <?php op_upload_field($fieldname.'[image]',op_page_option($section_name,'image')) ?>
    */ ?>
    
	<label for="<?php echo $fieldid ?>like_url" class="form-title"><?php _e('Facebook Like URL', 'optimizepress') ?></label>
    <p class="op-micro-copy"><?php _e('If you want any Facebook likes on the page to be attributed to a different page, or a Facebook Fan Page, enter the URL of that other page here. Please note that when this URL is changed that will also mean when the page is shared, this URL will be shared', 'optimizepress') ?></p>
    <input type="text" name="<?php echo $fieldname ?>[like_url]" id="<?php echo $fieldid ?>like_url" value="<?php op_page_attr_e($section_name,'like_url') ?>" />
    
</div>
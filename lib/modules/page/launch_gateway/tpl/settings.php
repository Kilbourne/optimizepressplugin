<div class="op-bsw-grey-panel-content op-bsw-grey-panel-no-sidebar">
	<p class="op-micro-copy"><?php _e('The launch gateway will redirect the user to a page of your choosing if they do not use the special access key for the page.', 'optimizepress') ?></p>

	<label for="<?php echo $fieldid ?>url" class="form-title"><?php _e('Redirect to URL') ?></label>
	<p class="op-micro-copy"><?php _e('Enter the URL that your users browser should be redirected to if they do not use the gateway code to access the page') ?></p>
    <input type="text" name="<?php echo $fieldname ?>[url]" id="<?php echo $fieldid ?>url" value="<?php op_page_attr_e($section_name,'url') ?>" />

	<label for="<?php echo $fieldid ?>code" class="form-title"><?php _e('Gateway Access Code') ?></label>
	<p class="op-micro-copy"><?php _e('<strong>Important:</strong> In order for your user to access your page they must use a special gateway code. You can see the gateway code in the box below. Please ensure you have setup a gateway code for your site in the main Launch settings (include link here to open in new window)') ?></p>
    <input type="text" name="<?php echo $fieldname ?>[code]" id="<?php echo $fieldid ?>code" value="<?php op_page_attr_e($section_name,'code') ?>" />
</div>
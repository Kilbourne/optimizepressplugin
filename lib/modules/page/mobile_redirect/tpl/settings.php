<div class="op-bsw-grey-panel-content op-bsw-grey-panel-no-sidebar">
	<label for="<?php echo $fieldid ?>url" class="form-title"><?php _e('Redirect to URL', 'optimizepress') ?></label>
	<p class="op-micro-copy"><?php _e('Enter the URL of your mobile optimized site if you want OptimizePress to redirect any visitors on mobile platforms to a separate site') ?></p>
    <input type="text" name="<?php echo $fieldname ?>[url]" id="<?php echo $fieldid ?>url" value="<?php op_page_attr_e($section_name,'url') ?>" />
</div>
<?php $file = ($item['type'] == 'file'); ?>
        	<li class="op-type-switcher-container">
            	<select name="<?php echo $fieldname ?>[type][]" class="op-type-switcher">
                	<option value="file"<?php echo $file ? ' selected="selected"':'' ?>><?php _e('File', 'optimizepress') ?></option>
                    <option value="url"<?php echo !$file ? ' selected="selected"':'' ?>><?php _e('URL', 'optimizepress') ?></option>
                </select>
                <div class="op-type op-type-file<?php echo !$file ? ' op-disabled-type' : '' ?>">
                	<?php op_upload_field($fieldname.'[file][]',op_get_var($item,'upload_img')) ?>
                </div>
                <div class="op-type op-type-url<?php echo $file ? ' op-disabled-type' : '' ?>">
	                <label for="<?php echo $id ?>imgurl_<?php echo $index ?>" class="form-title"><?php _e('URL:', 'optimizepress') ?></label>
                    <input type="text" name="<?php echo $fieldname ?>[imgurl][]" id="<?php echo $id ?>imgurl_<?php echo $index ?>" value="<?php echo esc_attr($item['imgurl']) ?>" />
                    <?php if($error = $this->error($id.'imgurl')): ?>
                    <span class="error op-multirow-remove"><?php echo $error ?></span>
                    <?php endif; ?>
                </div>
                <label for="<?php echo $id ?>href_<?php echo $index ?>" class="form-title"><?php _e('Link to:', 'optimizepress') ?></label>
                <input type="text" name="<?php echo $fieldname ?>[href][]" id="<?php echo $id ?>href_<?php echo $index ?>" value="<?php echo esc_attr($item['href']) ?>" />
                <div class="op-multirow-controls">
                	<a href="#move-up"><?php _e('Move Up', 'optimizepress') ?></a> | <a href="#move-down"><?php _e('Move Down', 'optimizepress') ?></a> | <a href="#remove"><?php _e('Remove', 'optimizepress') ?></a>
                </div>
            </li>
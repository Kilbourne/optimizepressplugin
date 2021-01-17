<?php $url = ($fields['type'] == 'url'); $youtube = ($fields['type'] == 'youtube');?><div class="op-type-switcher-container">
	<select name="<?php echo $fieldname ?>[type]" class="op-type-switcher" id="<?php echo $fieldid ?>type">
    	<option value="embed"<?php echo !$url ? ' selected="selected"':'' ?>><?php _e('Embed code', 'optimizepress') ?></option>
        <option value="url"<?php echo $url ? ' selected="selected"':'' ?>><?php _e('URL', 'optimizepress') ?></option>
        <option value="youtube"<?php echo $youtube ? ' selected="selected"':'' ?>><?php _e('YouTube Video', 'optimizepress') ?></option>
    </select>
    <div class="op-type op-type-embed<?php echo !$file ? ' op-disabled-type' : '' ?>">
    	<label for="<?php echo $fieldid ?>embed"><?php _e('Embed Code:', 'optimizepress') ?></label>
        <p class="op-micro-copy"><?php _e('Enter external video embed code here.  Enter codes from EVP, or any external hosts like YouTube here', 'optimizepress') ?></p>
        <textarea name="<?php echo $fieldname ?>[embed]" id="<?php echo $fieldid ?>embed" cols="30" rows="10"><?php echo $fields['embed'] ?></textarea>
    </div>
    <div class="op-type op-type-url<?php echo $file ? ' op-disabled-type' : '' ?>">
    	<label for="<?php echo $fieldid ?>url" class="form-title"><?php _e('URL:', 'optimizepress') ?></label>
        <p class="op-micro-copy"><?php _e('Enter your hosted video URL here.  We recommend using Amazon S3 or a similar professional video host.', 'optimizepress') ?></p>
        <input type="text" name="<?php echo $fieldname ?>[url]" id="<?php echo $fieldid ?>url" value="<?php echo $fields['url'] ?>" />

        <label for="<?php echo $fieldid ?>placeholder" class="form-title"><?php _e('Placeholder:', 'optimizepress') ?></label>
        <p class="op-micro-copy"><?php _e('Select an image to use as a placeholder in your video', 'optimizepress') ?></p>
        <?php op_upload_field($fieldname.'[placeholder]',$fields['placeholder']) ?>

        <div class="op-checkbox-container">
        	<input type="checkbox" name="<?php echo $fieldname ?>[hide_controls]" id="<?php echo $fieldid ?>hide_controls"<?php echo $fields['hide_controls']=='Y' ? ' checked="checked"':'' ?> value="Y" />
    		<label for="<?php echo $fieldid ?>hide_controls"><?php _e('Hide Controls:', 'optimizepress') ?></label>
	        <p class="op-micro-copy"><?php _e('Hide the video controls for your video (control bar etc)', 'optimizepress') ?></p>
        </div>

        <div class="op-checkbox-container">
    	    <input type="checkbox" name="<?php echo $fieldname ?>[auto_play]" id="<?php echo $fieldid ?>auto_play"<?php echo $fields['auto_play']=='Y' ? ' checked="checked"':'' ?> value="Y" />
	    	<label for="<?php echo $fieldid ?>auto_play"><?php _e('Auto Play:', 'optimizepress') ?></label>
        	<p class="op-micro-copy"><?php _e('Set your video to auto play on the load of the page', 'optimizepress') ?></p>
        </div>

        <div class="op-checkbox-container">
    	    <input type="checkbox" name="<?php echo $fieldname ?>[auto_buffer]" id="<?php echo $fieldid ?>auto_buffer"<?php echo $fields['auto_buffer']=='Y' ? ' checked="checked"':'' ?> value="Y" />
	    	<label for="<?php echo $fieldid ?>auto_buffer"><?php _e('Auto Buffering:', 'optimizepress') ?></label>
        	<p class="op-micro-copy"><?php _e('Enabling auto buffering will allow the video to be loaded before the user clicks play', 'optimizepress') ?></p>
        </div>
    </div>
    <div class="op-type op-type-youtube<?php echo $file ? ' op-disabled-type' : '' ?>">
    	<label for="<?php echo $fieldid ?>youtube_url" class="form-title"><?php _e('Youtube URL:', 'optimizepress') ?></label>
        <p class="op-micro-copy"><?php _e('Enter your YouTube video URL here.', 'optimizepress') ?></p>
        <input type="text" name="<?php echo $fieldname ?>[youtube_url]" id="<?php echo $fieldid ?>youtube_url" value="<?php echo $fields['youtube_url'] ?>" />

        <div class="op-checkbox-container">
    	    <input type="checkbox" name="<?php echo $fieldname ?>[youtube_auto_play]" id="<?php echo $fieldid ?>youtube_auto_play"<?php echo $fields['youtube_auto_play']=='Y' ? ' checked="checked"':'' ?> value="Y" />
	    	<label for="<?php echo $fieldid ?>youtube_auto_play"><?php _e('Auto Play:', 'optimizepress') ?></label>
        	<p class="op-micro-copy"><?php _e('Set your video to auto play on the load of the page', 'optimizepress') ?></p>
        </div>

        <div class="op-checkbox-container">
        	<input type="checkbox" name="<?php echo $fieldname ?>[youtube_hide_controls]" id="<?php echo $fieldid ?>youtube_hide_controls"<?php echo $fields['youtube_hide_controls']=='Y' ? ' checked="checked"':'' ?> value="Y" />
    		<label for="<?php echo $fieldid ?>youtube_hide_controls"><?php _e('Hide Controls:', 'optimizepress') ?></label>
	        <p class="op-micro-copy"><?php _e('Hide the video controls for your video (control bar etc)', 'optimizepress') ?></p>
        </div>

        <div class="op-checkbox-container">
    	    <input type="checkbox" name="<?php echo $fieldname ?>[youtube_remove_logo]" id="<?php echo $fieldid ?>youtube_remove_logo"<?php echo $fields['youtube_remove_logo']=='Y' ? ' checked="checked"':'' ?> value="Y" />
	    	<label for="<?php echo $fieldid ?>youtube_remove_logo"><?php _e('Hide YouTube logo:', 'optimizepress') ?></label>
        	<p class="op-micro-copy"><?php _e('Hide YouTube logo in control bar (will still show in corner of video on hover)', 'optimizepress') ?></p>
        </div>
        <div class="op-checkbox-container">
    	    <input type="checkbox" name="<?php echo $fieldname ?>[youtube_show_title_bar]" id="<?php echo $fieldid ?>youtube_show_title_bar"<?php echo $fields['youtube_show_title_bar']=='Y' ? ' checked="checked"':'' ?> value="N" />
	    	<label for="<?php echo $fieldid ?>youtube_show_title_bar"><?php _e('Show title bar:', 'optimizepress') ?></label>
        	<p class="op-micro-copy"><?php _e('Show the title bar.', 'optimizepress') ?></p>
        </div>
        <label for="<?php echo $fieldid ?>youtube_force_hd"><?php _e('Force HD mode:', 'optimizepress') ?></label>
        <select name="<?php echo $fieldname ?>[youtube_force_hd]" id="<?php echo $fieldid ?>youtube_force_hd">
	    	<option value="none"<?php echo $fields['youtube_force_hd'] == 'none' ? ' selected="selected"':'' ?>><?php _e('None', 'optimizepress') ?></option>
	        <option value="hd720"<?php echo $fields['youtube_force_hd'] == 'hd720' ? ' selected="selected"':'' ?>><?php _e('720p', 'optimizepress') ?></option>
	        <option value="hd1080"<?php echo $fields['youtube_force_hd'] == 'hd1080' ? ' selected="selected"':'' ?>><?php _e('1080p', 'optimizepress') ?></option>
	    </select>
    </div>

    <label for="<?php echo $fieldid ?>dimensions" class="form-title"><?php _e('Dimensions:', 'optimizepress') ?></label>
    <p class="op-micro-copy"><?php _e('Set the dimensions of your video', 'optimizepress') ?></p>
    <?php $dimensions = array('custom', '300x169', '460x259', '560x315', '640x360', '853x480'); ?>
    <select name="<?php echo $fieldname ?>[dimensions]" id="<?php echo $fieldid ?>dimensions">
	<?php
	foreach($dimensions as $dimension){
		?><option value="<?php echo $dimension?>"<?php selected($dimension, op_get_var($fields, 'dimension', null)); ?>><?php echo ucwords($dimension)?></option><?php
	}
	?>
    </select>

    <div id="dimensions-container"<?php echo (isset($fields['dimensions']) && $fields['dimensions']=='custom' ? ' style="display: none;"' : '')?>>
	<label for="<?php echo $fieldid ?>width" class="form-title"><?php _e('Width:', 'optimizepress') ?></label>
	<p class="op-micro-copy"><?php _e('Set the width of your video', 'optimizepress') ?></p>
	<input type="text" name="<?php echo $fieldname ?>[width]" id="<?php echo $fieldid ?>width" value="<?php echo empty($fields['width']) ? '511' : $fields['width']; ?>" />

	<label for="<?php echo $fieldid ?>height" class="form-title"><?php _e('Height:', 'optimizepress') ?></label>
	<p class="op-micro-copy"><?php _e('Set the height of your video', 'optimizepress') ?></p>
	<input type="text" name="<?php echo $fieldname ?>[height]" id="<?php echo $fieldid ?>height" value="<?php echo empty($fields['height']) ? '288' : $fields['height']; ?>" />
    </div>

    <label for="<?php echo $fieldid ?>margin_top" class="form-title"><?php _e('Top Margin:', 'optimizepress') ?></label>
    <p class="op-micro-copy"><?php _e('Set the top margin of your video', 'optimizepress') ?></p>
    <input type="text" name="<?php echo $fieldname ?>[margin_top]" id="<?php echo $fieldid ?>margin_top" value="<?php echo empty($fields['margin_top']) ? '0' : $fields['margin_top']; ?>" />

  	<label for="<?php echo $fieldid ?>margin_bottom" class="form-title"><?php _e('Bottom Margin:', 'optimizepress') ?></label>
    <p class="op-micro-copy"><?php _e('Set the bottom margin of your video', 'optimizepress') ?></p>
    <input type="text" name="<?php echo $fieldname ?>[margin_bottom]" id="<?php echo $fieldid ?>margin_bottom" value="<?php echo empty($fields['margin_bottom']) ? '0' : $fields['margin_bottom']; ?>" />
</div>
<script type="text/javascript">
	var dimensionsSel = opjq('#<?php echo $fieldid?>dimensions');
	var dimensionsContainer = opjq('#dimensions-container');
	dimensionsSel.change(function(){
		var dimOpt = opjq(this).find('option:selected').val();
		var wEl = opjq('#<?php echo $fieldid?>width');
		var hEl = opjq('#<?php echo $fieldid?>height');
		if (dimOpt=='custom'){
			dimensionsContainer.show();
		} else {
			var dimensions = dimOpt.split('x');
			wEl.val(dimensions[0]);
			hEl.val(dimensions[1]);
			dimensionsContainer.hide();
		}
	});
</script>
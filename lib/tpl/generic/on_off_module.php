
    <div class="module-entry <?php echo $module_name ?>-entry">
		<div class="entry-header">
	    	<label><?php echo $title; ?></label>
	        <?php $enabled = call_user_func_array('op_on_off_switch',$section_arr) ?>
    	</div>
	    <div class="entry-content<?php echo ($enabled ? '' : ' disabled-entry') ?>">
        	<?php
			echo $module_content
			?>
    	</div>
	</div>
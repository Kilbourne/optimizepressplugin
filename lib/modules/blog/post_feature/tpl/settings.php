
    <div class="module-entry post-feature-entry">
		<div class="entry-header">
	    	<label><?php _e('This box sits beneath posts and acts as a call to action', 'optimizepress') ?></label>
	        <?php $enabled = op_on_off_switch($section_name) ?>
    	</div>
	    <div class="entry-content<?php echo ($enabled ? '' : ' disabled-entry') ?>">
        	<?php
			echo $tabbed_content
			?>
    	</div>
	</div>
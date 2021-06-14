<div class="op-type-switcher-container">
    <div class="op-bsw-grey-panel-content op-bsw-grey-panel-no-sidebar">
	<select name="op[<?php echo $section_name ?>][type]" class="op-type-switcher">
	<?php
	    foreach($options as $name => $title){
		?>
		<option value="<?php echo $name; ?>"<?php echo ($feature_area_object->get_option($section_name,'type') == $name ? ' selected="selected"':''); ?>><?php echo $title; ?></option>
		<?php
	    }
	    ?>
	</select>
    </div>
    <div class="op-bsw-grey-panel-hide">
	<?php
	    foreach($content as $name => $content){
		echo '
		<div class="op-type op-type-'.$name.'">'.$content.'</div>';
	    }
	?>
    </div>
</div>
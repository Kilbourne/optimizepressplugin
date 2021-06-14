<?php
	$theme_option = op_page_option('feature_area','type');
	$size_color = op_page_option('size_color');
	if (is_array($size_color) && isset($size_color['box_color_start']) && isset($size_color['box_color_end']) && isset($size_color['box_width'])) {
		$box_color_start = $size_color['box_color_start'];
		$box_color_end = $size_color['box_color_end'];
		$box_width = $size_color['box_width'];
	} else {
		$box_color_start =  op_default_page_option($theme_option, 'size_color','box_color_start');
		$box_color_end = op_default_page_option($theme_option, 'size_color','box_color_end');	
		$box_width = op_default_page_option($theme_option, 'size_color','box_width');
	}	
?>
<div class="op-bsw-grey-panel-content op-bsw-grey-panel-no-sidebar cf" id="op_page_layout_size_color">
    <label for="op_header_layout_box_color_start" class="form-title"><?php _e('Box background start colour', 'optimizepress'); ?></label>
    <p class="op-micro-copy"><?php _e('Choose a box background start colour.', 'optimizepress'); ?></p>
    <?php op_color_picker('op[size_color][box_color_start]', $box_color_start, 'op_size_color_box_color_start'); ?>
    <label for="op_header_layout_box_color_end" class="form-title"><?php _e('Box background end colour', 'optimizepress'); ?></label>
    <p class="op-micro-copy"><?php _e('Choose a box background end colour.', 'optimizepress'); ?></p>
    <?php op_color_picker('op[size_color][box_color_end]', $box_color_end, 'op_size_color_box_color_end'); ?>
    <label for="op_header_layout_box_width" class="form-title"><?php _e('Box width', 'optimizepress'); ?></label>
    <p class="op-micro-copy"><?php _e('Enter box width in pixels.', 'optimizepress'); ?></p>
    <?php op_text_field('op[size_color][box_width]', $box_width); ?>
</div>
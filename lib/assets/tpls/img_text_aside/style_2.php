<div id="op_img_text_aside_<?php echo $id; ?>" class="image-text-style-<?php echo $style; ?>">
	<?php  echo ($image_alignment=='left' ? '<span class="image-text-style-img-container"><img src="'.$image.'" width="'.$img_width.'" height="'.$img_height.'" class="scale-with-grid" /></span>' : ''); ?>
	<span<?php echo (!empty($alignment) ? ' class="image-text-align-'.$alignment.'"' : ''); ?>>
		<h3><?php echo $headline; ?></h3>
		<span class="image-text-aside-text"><?php echo do_shortcode($text); ?></span>
	</span>
	<?php  echo ($image_alignment=='right' ? '<span class="image-text-style-img-container"><img src="'.$image.'" width="'.$img_width.'" height="'.$img_height.'" class="scale-with-grid" /></span>' : ''); ?>
</div>
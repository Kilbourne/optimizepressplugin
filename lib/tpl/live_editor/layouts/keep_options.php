<div id="content_layout_keep_options" class="cf">
<?php
$options = array(
	'header_layout' => __('Keep Existing Header', 'optimizepress'),
	'feature_area' => __('Keep Existing Feature Area', 'optimizepress'),
	'footer_area' => __('Keep Existing Footer', 'optimizepress'),
	'content' => __('Keep Existing Content', 'optimizepress'),
	'scripts' => __('Keep Existing Other Scripts', 'optimizepress'),
	'typography' => __('Keep Existing Typography', 'optimizepress'),
	'color_scheme' => __('Keep Existing Colour Scheme', 'optimizepress'),
);
foreach($options as $name => $title){
	echo '
	<div class="checkbox-row">
		<div class="checkbox-container">
			<input type="checkbox" name="keep_options[]" id="keep_options_'.$name.'" value="'.$name.'" />
			<label for="keep_options_'.$name.'">'.$title.'</label>
		</div>
	</div>';
}
?>
</div>
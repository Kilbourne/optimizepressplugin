<div class="cf img-radio-selector <?php echo isset($classextra) ? $classextra : '' ?>">
<?php
foreach($previews as $preview):
	$tooltip_html = '';
	if(isset($preview['tooltip_title']) || isset($preview['tooltip_description'])){
		$tooltip_title = (!empty($preview['tooltip_title']) && isset($preview['preview_content']) && !strpos($preview['preview_content'], 'fancybox') ? '<span class="tooltip-title">'.op_get_var($preview,'tooltip_title').'</span>' : '');
		$tooltip_description = (!empty($preview['tooltip_description']) ? '<span class="tooltip-description">'.op_get_var($preview,'tooltip_description').'</span>' : '');
		$tooltip_separator = (!empty($tooltip_title) && !empty($tooltip_description) ? '' : '');
		$tooltip_html = '
<div class="img-radio-item-tooltip">
	'.$tooltip_separator.'
	'.$tooltip_description.'
</div>';
	}
	$li_class = isset($preview['li_class']) ? ' '.$preview['li_class'] : '';
	echo '
    <div class="img-radio-item'.$li_class.'" style="width:196px">
        <div class="thumb img-radio-label" style="width:196px;height:196px">
        	<img src="'.$preview['image'].'" alt="thumb" width="166" height="166" />
        	<div class="thumb-overlay" style="width:196px;height:196px"></div>
        	<div class="thumb-check"></div>
        </div>
		'.$preview['input'].(isset($preview['preview_content'])?'
		<div class="preview-option cf">'.$preview['preview_content'].'<div class="clear"></div></div>':'').$tooltip_html.'
    </div>';
endforeach;
?>
</div>
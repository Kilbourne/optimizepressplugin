<div class="op-bsw-grey-panel-content op-bsw-grey-panel-no-sidebar" id="op_page_color_schemes_advanced">
    <?php foreach($color_options as $name => $options):
    if ($name =='feature_area') continue;?>
	<div class="op-bsw-grey-panel section-<?php echo $name; ?>" id="advanced_colors_<?php echo $name; ?>">
		<div class="op-bsw-grey-panel-header cf">
			<h3><a href="#"><?php echo $options['title'] ?></a></h3>
			<?php $help_vid = op_help_vid(array('page','color_schemes','advanced',$name),true); ?>
			<div class="op-bsw-panel-controls<?php echo $help_vid==''?'':' op-bsw-panel-controls-help' ?> cf">
				<div class="show-hide-panel"><a href="#"></a></div>
			</div>
		</div>
        <div class="op-bsw-grey-panel-content op-bsw-grey-panel-no-sidebar">
        <?php
		echo op_load_section('color_options',array('elements'=>$options['elements'],'opt_array'=>array('color_scheme_advanced',$name),'fieldname'=>'op[color_scheme_advanced]['.$name.']','fieldid'=>'op_color_scheme_advanced_'.$name.'_'),'page');
		?>
        </div>
    </div>
	<?php endforeach; ?>
</div>
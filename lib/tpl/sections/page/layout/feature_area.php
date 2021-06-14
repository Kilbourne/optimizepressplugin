<div class="op-bsw-grey-panel-content op-bsw-grey-panel-no-sidebar cf" id="op_page_layout_feature_area">
	<label class="form-title"><?php _e('Feature Area Content Template', 'optimizepress') ?></label>
    <p class="op-micro-copy"><?php _e('Select the layout for your feature area here. You can customize the content in the LiveEditor later', 'optimizepress') ?></p>
	<?php echo $this->load_tpl('generic/img_radio_selector',array('previews'=>$previews, 'classextra'=>'feature-area op-thumbnails '.op_page_option('theme','type').'-feature-area')); ?>
</div>
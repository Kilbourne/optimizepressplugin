<div class="op-bsw-grey-panel-content op-bsw-grey-panel-no-sidebar cf" id="op_page_content_layout_layouts">
	<h3><?php _e('Choose from our pre-made content layouts',OP_SN) ?></h3>
    <p class="op-micro-copy"><?php _e('Select from the content layouts below for your main page content. These pre-made layouts help you display your content effectively - just replace our sample content, images and video with your own content',OP_SN) ?></p>
	<?php 
	if(isset($previews)){
		echo op_tpl('generic/img_radio_selector',array('classextra'=>'content-layouts'));
	} else {
		echo '<h2>'.__('No content layouts found').'</h2>';
	}
	/*
	if(isset($layout_list)){
		echo '
	<ul class="layout-list">'.$layout_list.'</ul>';
	} else {
		echo '<h2>'.__('No content layouts found').'</h2>';
	}*/
	//echo $this->load_tpl('generic/img_radio_selector',array('previews'=>$previews, 'classextra'=>'content_layout')); 
	$checked = ' checked="checked"';
	if($has_layout): 
	$checked = ''; ?>
    <p class="blank-info"><?php _e('Keep your current layout',OP_SN) ?></p>
	<fieldset class="radio-field">
	    <input type="radio" name="op[content_layout][option]" id="op_content_layout_layouts_option_blank" value="current" checked="checked" />
	    <label for="op_content_layout_layouts_option_blank"><?php _e('Use current content layout',OP_SN) ?></label>
	</fieldset>
    <?php endif ?>
    <p class="blank-info"><?php _e('<span>or</span> Alternatively click below to use a blank content layout',OP_SN) ?></p>
	<fieldset class="radio-field">
	    <input type="radio" name="op[content_layout][option]" id="op_content_layout_layouts_option_blank" value="blank"<?php echo $checked ?> />
	    <label for="op_content_layout_layouts_option_blank"><?php _e('Use blank content layout',OP_SN) ?></label>
	</fieldset>
</div>
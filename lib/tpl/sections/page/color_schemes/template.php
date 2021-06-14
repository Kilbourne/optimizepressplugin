<div class="op-bsw-grey-panel-content op-bsw-grey-panel-no-sidebar op-thumbnails cf" id="op_page_color_schemes_template">
	<label class="form-title"><?php _e('Choose from our pre-made colour schemes', 'optimizepress') ?></label>
    <p class="op-micro-copy"><?php _e('Select an overall colour scheme for your page. You can customize individual element colours in the advanced colour options further down this page', 'optimizepress') ?></p>
	<?php
	if(isset($previews)){
		echo $this->load_tpl('generic/img_radio_selector',array('previews'=>$previews, 'classextra'=>'color-scheme'));
	}
	echo $color_scheme_js;
	?>
</div>
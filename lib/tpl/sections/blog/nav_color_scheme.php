<div class="op-bsw-grey-panel-content op-bsw-grey-panel-no-sidebar">
	<?php if($schemes = op_theme_config('nav_color_schemes')): ?>
    <h3><?php _e('Choose your Navigation Bar Colour Scheme', 'optimizepress') ?></h3>
    <?php
    $cur_scheme = op_default_option('nav_color_scheme');
    $cur_scheme = $cur_scheme == '' ? key($schemes) : $cur_scheme;
	$previews = array();
    foreach($schemes as $name => $preview){
        $field_id = 'op_sections_nav_color_scheme_'.$name;
        $selected = ($cur_scheme == $name);
        $li_class = $input_attr = '';
        if($selected){
            $li_class = ' img-radio-selected';
            $input_attr = ' checked="checked"';
        }
		$preview['input'] = '<input type="radio" name="op[sections][nav_color_scheme]" id="'.$field_id.'" value="'.$name.'"'.$input_attr.' />';
		$preview['li_class'] = $li_class;
		$previews[] = $preview;
	}
	echo $this->load_tpl('generic/img_radio_selector',array('previews'=>$previews,'classextra'=>'nav-color-schemes'));
	?>
    <?php endif; ?>
</div>
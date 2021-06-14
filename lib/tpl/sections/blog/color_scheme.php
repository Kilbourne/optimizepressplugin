<div class="op-bsw-grey-panel-content op-bsw-grey-panel-no-sidebar">
	<?php if($schemes = op_theme_config('color_schemes')):  /*?>
    <h3><?php _e('Choose From Our Pre-Existing Options', 'optimizepress') ?></h3>
    <p class="op-micro-copy"><?php _e('Select from the options available below to customise the colour schemes for your blog feature area and top navigation.', 'optimizepress') ?></p>
    <?php
	$cur_scheme = op_get_current_item($schemes,op_default_option('color_scheme'));
	$previews = array();
    foreach($schemes as $name => $scheme){
        $field_id = 'op_sections_color_scheme_'.$name;
        $selected = ($cur_scheme == $name);
        $li_class = $input_attr = '';
        if($selected){
            $li_class = ' img-radio-selected';
            $input_attr = ' checked="checked"';
        }
		$preview = $scheme['preview'];
		$preview['input'] = '<input type="radio" name="op[sections][color_scheme]" id="'.$field_id.'" value="'.$name.'"'.$input_attr.' />';
		$preview['li_class'] = $li_class;
		$previews[] = $preview;
	}*/
	//echo $this->load_tpl('generic/img_radio_selector',array('previews'=>$previews,'classextra'=>'color-schemes'));
	?>
    <script type="text/javascript">
    //var op_color_schemes = <?php echo json_encode($schemes) ?>;
    </script>
    <h3><?php _e('Choose Your Color Settings', 'optimizepress') ?></h3>
    <?php endif;
    if(count($color_fields) > 0): ?>
    <ul class="color-options">
    <?php foreach($color_fields as $name => $title):
	$help = '';
	$type = null;
	if(is_array($title)){
		$type = op_get_var($title,'type');
		$help = op_get_var($title,'help');
		$title = op_get_var($title,'name');
	}
	if ($type=='font'){
		?>
		<li>
			<label for="op_sections_<?php echo $name ?>" class="form-title"><?php echo $title; ?></label>
			<?php
				echo (empty($help) ? '':'<p class="op-micro-copy">'. $help .'</p>');
				$top_nav_font = op_default_attr('color_scheme_fields',$name);
				op_font_selector('op[sections][color_scheme_fields]['.$name.']', array('family' => $top_nav_font['font_family'], 'style' => $top_nav_font['font_weight'], 'size' => $top_nav_font['font_size'], 'shadow' => $top_nav_font['font_shadow']), '<div class="op-micro-copy-font-selector">', '</div>', false);
			?>
		</li>
		<?php
	} else {
		?>
		<li>
			<label for="op_sections_color_scheme_field_<?php echo $name ?>" class="form-title"><?php echo $title; ?></label>
			<?php echo (empty($help) ? '':'<p class="op-micro-copy">'. $help .'</p>'); op_color_picker('op[sections][color_scheme_fields]['.$name.']',op_default_attr('color_scheme_fields',$name),'op_sections_color_scheme_field_'.$name); ?>
		</li>
		<?php
	}
	?>
    <?php endforeach; ?>
    </ul>
    <?php endif ?>
</div>
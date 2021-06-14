<?php
$cur_style = op_default_option($section_name,'style');
$cur_style = $cur_style == '' ? key($styles) : $cur_style;
$previews = array();
foreach($styles as $name => $style){
	$li_class = $input_attr = '';
	if($cur_style == $name){
		$li_class = 'selected';
		$input_attr = ' checked="checked"';
	}
	$preview = $style['preview'];
	$preview['li_class'] = $li_class;
	$preview['input'] = '<input type="radio" id="op_'.$section_name.'_style_'.$name.'" name="op['.$section_name.'][style]" value="'.$name.'"'.$input_attr.' />';
	$previews[] = $preview;
}
echo $this->load_tpl('generic/img_radio_selector',array('previews'=>$previews));
?>
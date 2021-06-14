<?php echo $this->load_tpl('wizard/header'); 
if(($theme_dir = op_get_option('theme','dir')) === false && count($themes) > 0){
	$theme_dir = $themes[0]['dir'];
}
?>
<h2><?php _e('Theme Style', 'optimizepress') ?></h2>
<!--<?php op_help_vid('theme') ?>-->
<div class="clear"></div>
<p><?php _e('Use the options below to choose a look and feel for your blog.', 'optimizepress') ?></p>
<?php
$sel_text = __('Selected', 'optimizepress');
$prev_text = __('Preview', 'optimizepress');
$previews = array();
$img = op_img('',true);
foreach($themes as $theme){
	$field_id = 'op_theme_'.$theme['dir'];
	$selected = ($theme_dir == $theme['dir']);
	$li_class = $input_attr = '';
	if($selected){
		$li_class = ' img-radio-selected';
		$input_attr = ' checked="checked"';
	}
	$previews[] = array(
		'li_class' => $li_class,
		'image' => op_theme_url($theme['screenshot_thumbnail'],$theme['dir']),
		'width' => 246,
		'height' => 186,
		'tooltip_title' => $theme['name'],
		'tooltip_description' => $theme['description'],
		'input' => '<input type="radio" name="theme_id" id="'.$field_id.'" value="'.$theme['dir'].'"'.$input_attr.' />',
		'preview_content' => '<a href="'.op_theme_url($theme['screenshot'],$theme['dir']).'" class="fancybox"><img src="'.$img.'pagebuilder-preview.png" alt="Preview" width="70" height="70" border="0" /> '.$theme['name'].'</a>'
	);
}
echo $this->load_tpl('generic/img_radio_selector',array('previews'=>$previews,'classextra'=>'theme-select'));
echo $this->load_tpl('wizard/footer'); ?>
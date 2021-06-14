<?php
class OptimizePress_Sections_Layout {
	
	// Get the list of step 3 sections these can be overridden by the theme using the 'op_edit_sections_layout' filter
	function sections(){
		static $sections;
		if(!isset($sections)){
			$sections = array(
				'column_layout' => array(
					'title' => __('Sidebar Column Preferences', 'optimizepress'),
					'action' => array($this,'layout_columns'), 
					'save_action' => array($this,'save_layout_columns')
				),
				'header_prefs' => array(
					'title' => __('Header &amp; Navigation Preferences', 'optimizepress'),
					'action' => array($this,'header_prefs'),
					'save_action' => array($this,'save_header_prefs')
				),
				'footer_prefs' => array(
					'title' => __('Footer Preferences', 'optimizepress'),
					'action' => array($this,'footer_prefs'),
					'save_action' => array($this,'save_footer_prefs')
				),
			);
			$sections = apply_filters('op_edit_sections_layout',$sections);
		}
		return $sections;
	}
	
	
	
	function layout_columns(){
		echo op_load_section('column_layout');
	}
	
	function save_layout_columns($op){
		if(isset($op['column_layout'])){
			$op = op_get_var($op,'column_layout',array());
			$layouts = op_theme_config('layouts');
			$cur_layout = op_default_option('column_layout','option');
			$cur_layout = $cur_layout == '' ? key($layouts['layouts']) : $cur_layout;
			$new_layout = array(
				'option' => op_get_var($op,'option',$cur_layout),
				'widths' => array()
			);
			if(isset($layouts['layouts'][$new_layout['option']])){
				$def_widths = op_get_var($layouts['layouts'][$new_layout['option']],'widths',array());
				$new_widths = op_get_var($op,'widths',array());
				foreach($def_widths as $name => $options){
					$val = op_get_var($new_widths,$name,$options['width']);
					if(!($val >= $options['min'] && $val <= $options['max'])){
						op_tpl_error('op_sections_column_layout_withs_'.$name,sprintf(__('The %1$s column must be between %2$s and %3$s.', 'optimizepress'),$options['title'],$options['min'],$options['max']),'layout_column_layout');
					} else {
						$new_layout['widths'][$name] = $val;
					}
				}
			}
			op_update_option('column_layout',$new_layout);
		}
	}
	
	
	
	function header_prefs(){
		echo op_load_section('header_prefs');
	}
	
	function save_header_prefs($op){
		//First we process and save the top nav color scheme fields
		$current = op_default_option('color_scheme_fields');
		$current = is_array($current) ? $current : array();
		$fields = isset($op['color_scheme_fields']) ? $op['color_scheme_fields'] : array();
		/*$color_fields = $this->color_fields();
		if(count($color_fields) > 0){
			foreach($color_fields as $name => $title){
				if(isset($fields[$name])){
					$current[$name] = $fields[$name];
				}
			}
		}*/
		foreach($fields as $name=>$field){
			$current[$name] = $field;
		}
		op_update_option('color_scheme_fields',$current);
		
		//Now we process and save the original header prefs
		$op = isset($op['header_prefs']) ? $op['header_prefs'] : array();
		$header_prefs = op_get_option('header_prefs');
		$header_prefs = is_array($header_prefs) ? $header_prefs : array();
		foreach($op as $key=>$val){
			$header_prefs[$key] = $val;
		}
		if(isset($op['menu_position'])){
			$header_prefs['menu-position'] = $op['menu_position'];
		}
		if(isset($op['link_color'])){
			$header_prefs['link_color'] = $op['link_color'];
		}
		$header_prefs['color_dropdowns'] = 'N';
		if(isset($op['color_dropdowns']) && $op['color_dropdowns'] == 'Y'){
			$header_prefs['color_dropdowns'] = 'Y';
		}
		
		op_update_option('header_prefs',$header_prefs);
	}
	
	function color_fields(){
		$color_fields = array(
			'footer_bg' => __('Footer background colour', 'optimizepress'),
			'topbar_bg' => __('Topbar BG Colour', 'optimizepress'),
			'link_color' => __('Link Colour', 'optimizepress'),
		);
		return apply_filters('op_color_scheme_fields',$color_fields);
	}
	
	function footer_prefs(){
		echo op_load_section('footer_prefs',array('footer_prefs'=>$this->_footer_prefs()));		
	}
	
	function save_footer_prefs($op){
		$op = op_get_var($op,'footer_prefs',array());
		$footer_prefs = $this->_footer_prefs();
		$new_footer_prefs = op_get_option('footer_prefs');
		$new_footer_prefs = is_array($new_footer_prefs) ? $new_footer_prefs : array();
		if(isset($footer_prefs['columns'])){
			$cols = $footer_prefs['columns'];
			$new_footer_prefs['widths'] = array();
			$value = op_get_var($op,'value',$cols['min']);
			if($value < $cols['min']){
				$value = $cols['min'];
			}
			if($value > $cols['max']){
				$value = $cols['max'];
			}
			$new_footer_prefs['value'] = $value;
			$max = $cols['max']+1;
			$widths = op_get_var($op,'widths',array());
			for($i=1;$i<$max;$i++){
				$new_footer_prefs['widths'][$i] = op_get_var($widths,$i,0);
			}
		}
		op_update_option('footer_prefs',$new_footer_prefs);
	}
	
	function _footer_prefs(){
		$arr = array('columns' => array('min'=>1,'max'=>4));
		if($width = op_theme_config('footer_prefs','full_width')){
			$arr['full_width'] = $width;
		}
		if($margin = op_theme_config('footer_prefs','column_margin')){
			$arr['column_margin'] = $margin;
		}
		return apply_filters('op_footer_prefs_settings',$arr);
	}
}
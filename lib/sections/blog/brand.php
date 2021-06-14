<?php
class OptimizePress_Sections_Brand {
	
	// Get the list of step 2 sections these can be overridden by the theme using the 'op_edit_sections_brand' filter
	function sections(){
		static $sections;
		if(!isset($sections)){
			$sections = array(
				'blog_header' => array(
					'title' => __('Setup your Blog Header', 'optimizepress'),
					'action' => array($this,'blog_header'), 
					'save_action' => array($this,'save_blog_header')
				),
				'favicon' => array(
					'title' => __('Upload your Favicon', 'optimizepress'),
					'action' => array($this,'favicon'), 
					'save_action' => array($this,'save_favicon')
				),
				'color_scheme' => array(
					'title' => __('Choose your Color Settings', 'optimizepress'),
					'action' => array($this,'color_scheme'),
					'save_action' => array($this,'save_color_scheme')
				),
				'nav_color_scheme' => array(
					'title' => __('Choose your Navigation Bar Colour Scheme', 'optimizepress'),
					'action' => array($this,'nav_color_scheme'),
					'save_action' => array($this,'save_nav_color_scheme')
				),
				'copyright_notice' => array(
					'title' => __('Copyright Notice', 'optimizepress'),
					'action' => array($this,'copyright_notice'),
					'save_action' => array($this,'save_copyright_notice')
				),
				/*'info_bar' => array(
					'title' => __('Info Bar (RSS, etc)', 'optimizepress'),
					'action' => array($this,'info_bar'),
					'save_action' => array($this,'save_info_bar')
				),*/
				'typography' => array(
					'title' => __('Typography', 'optimizepress'),
					'action' => array($this,'typography'),
					'save_action' => array($this,'save_typography')
				),
			);
			$sections = apply_filters('op_edit_sections_brand',$sections);
		}
		return $sections;
	}

	/* Blog Header Section */
	function blog_header(){
		echo op_load_section('blog_header');
	}
	
	function save_blog_header($op){
		$blog_header = op_get_option('blog_header');
		$op = isset($op['blog_header']) ? $op['blog_header'] : array();
		$fields = array('logo','bgimg','repeatbgimg','bgcolor');
		$has_error = false;
		foreach($fields as $field){
			$default = op_default_option('blog_header',$field);
			$blog_header[$field] = op_get_var($op,$field,$default);
		}
		$blog_header['bgcolor'] = op_get_var($op,'bgcolor',($default?$default:''));
		$blog_header['site_title'] = stripslashes(op_get_var($op,'site_title'));
		op_update_option('blog_header',$blog_header);
	}
	
	
	
	/* Favicon Section */
	function favicon(){
		echo op_load_section('favicon');
	}
	
	function save_favicon($op){
		op_update_option('favicon',op_get_var($op,'favicon'));
	}
	
	
	
	
	/* Default colour scheme functionality can be overridden in the 'op_wizard_step2_sections' filter */
	function color_scheme(){
		echo op_load_section('color_scheme',array('color_fields'=>$this->color_fields()));
	}
	
	function save_color_scheme($op){
		if(isset($op['color_scheme'])){
			op_update_option('color_scheme',$op['color_scheme']);
		}
		$current = op_default_option('color_scheme_fields');
		$current = is_array($current) ? $current : array();
		$fields = isset($op['color_scheme_fields']) ? $op['color_scheme_fields'] : array();
		$color_fields = $this->color_fields();
		if(count($color_fields) > 0){
			foreach($color_fields as $name => $title){
				if(isset($fields[$name])){
					$current[$name] = $fields[$name];
				}
			}
		}
		op_update_option('color_scheme_fields',$current);
	}
	
	function color_fields(){
		$color_fields = array(
			'footer_bg' => __('Footer background colour', 'optimizepress'),
			'topbar_bg' => __('Topbar BG Colour', 'optimizepress'),
			'link_color' => __('Link Colour', 'optimizepress'),
		);
		return apply_filters('op_color_scheme_fields',$color_fields);
	}
	
	
	
	/* Default nav colour scheme functionality can be overridden in the 'op_wizard_step2_sections' filter */
	function nav_color_scheme(){
		echo op_load_section('nav_color_scheme');
	}
	
	function save_nav_color_scheme($op){
		if(isset($op['nav_color_scheme'])){
			op_update_option('nav_color_scheme',$op['nav_color_scheme']);
		}
	}
	
	/* Default nav colour scheme functionality can be overridden in the 'op_wizard_step2_sections' filter */
	function copyright_notice(){
		echo op_load_section('copyright_notice');
	}
	
	function save_copyright_notice($op){
		if(isset($op['copyright_notice'])){
			op_update_option('copyright_notice',$op['copyright_notice']);
		}
	}
	
	
	
	function info_bar(){
		echo op_load_section('info_bar');
	}
	
	function save_info_bar($op){
		if(isset($op['info_bar'])){
			$info_bar = array();
			$fields = array('twitter','email','rss');
			foreach($fields as $field){
				$val = op_get_var($op['info_bar'],$field);
				if(!empty($val)){
					$info_bar[$field] = $val;
				}
			}
			op_update_option('info_bar',$info_bar);
		}
	}
	
	
	function typography(){
		echo op_load_section('typography');
	}
	
	function save_typography($op){
		if(isset($op['typography'])){
			$op = $op['typography'];
			$typography = op_get_option('typography');
			$typography = is_array($typography) ? $typography : array();
			$typography_elements = op_typography_elements();
			$typography['font_elements'] = op_get_var($typography,'font_elements',array());
			$typography['color_elements'] = op_get_var($typography,'font_elements',array());
			if(isset($typography_elements['font_elements'])){
				foreach($typography_elements['font_elements'] as $name => $options){
					$tmp = op_get_var($op,$name,op_get_var($typography['font_elements'],$name,array()));
					$typography['font_elements'][$name] = array(
						'size' => op_get_var($tmp,'size'),
						'font' => op_get_var($tmp,'font'),
						'style' => op_get_var($tmp,'style'),
						'color' => op_get_var($tmp,'color'),
					);
				}
			}
			if(isset($typography_elements['color_elements'])){
				foreach($typography_elements['color_elements'] as $name => $options){
					$typography['color_elements'][$name] = op_get_var($op,$name,op_get_var($typography['color_elements'],$name,array()));
				}
			}
			op_update_option('typography',$typography);
		}
	}
}
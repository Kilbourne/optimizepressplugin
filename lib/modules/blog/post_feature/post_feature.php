<?php
class OptimizePress_Blog_Post_Feature_Module extends OptimizePress_Modules_Base {

	function display_settings($section_name,$config=array(),$return=false){
		$data = array(
			'module_name' => 'post_feature',
			'section_name' => $section_name,
			'styles' => $this->_get_styles(),
			'fields' => $this->_get_fields()
		);
		$data['tabs'] = array(
			'box_theme' => 'Box Theme',
			'content' => 'Content',
		);
		$data['tab_content'] = array(
			'box_theme' => $this->load_tpl('style_selector',$data),
			'content' => $this->load_tpl('content',$data)
		);
		echo $this->load_tpl('generic/tabbed_module',$data,false);
	}
	
	function save_settings($section_name,$config=array(),$op){
		$styles = $this->_get_styles();
		$fields = $this->_get_fields();
		$style = op_get_var($op,'style');
		$style = isset($styles[$style]) ? $style : key($styles);
		$post_feature = array(
			'enabled' => op_get_var($op,'enabled','N'),
			'style' => $style,
			'fields' => array()
		);
		$op_fields = op_get_var($op,'fields',array());
		foreach($fields as $name => $field){
			$post_feature['fields'][$name] = stripslashes(op_get_var($op_fields,$name));
		}
		$this->update_option($section_name,$post_feature);
	}
	
	function _get_fields(){
		static $fields;
		if(!isset($fields)){
			$fields = array(
				'content' => array(
					'type' => 'textarea',
					'name' => __('HTML Content', 'optimizepress'),
				)
			);
			$fields = apply_filters('op_post_feature_fields',$fields);
		}
		return $fields;
	}
	
	function _get_styles(){
		static $styles;
		if(!isset($styles)){
			$styles = array(
				'style_1' => array(
					'preview' => array(
						'image' => $this->url.'img/style1.png',
						'width' => 150,
						'height' => 113,
					)
				),
				'style_2' => array(
					'preview' => array(
						'image' => $this->url.'img/style2.png',
						'width' => 150,
						'height' => 113,
					)
				),
			);
			$styles = apply_filters('op_post_feature_styles',$styles);
		}
		return $styles;
	}
	
	
	function output($section_name,$config,$op,$return=false){
		if($return){
			return $op;
		}
		$style = op_get_current_item($this->_get_styles(),op_get_var($op,'style'));
		echo '
<div class="post-promo-box post-promo-'.$style.'">'.implode("\n",op_get_var($op,'fields',array())).'</div>';
	}
}
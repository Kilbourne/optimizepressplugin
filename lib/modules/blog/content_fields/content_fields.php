<?php
class OptimizePress_Blog_Content_Fields_Module extends OptimizePress_Modules_Base {
	
	var $wysiwygs;
	
	function display_settings($section_name,$config=array(),$return=false,$font_options=false,$fonts_array=array()){
		if(!$content_fields = $this->_check_fields($config)){
			return;
		}
		$content_fields = $this->_prep_fields($content_fields);
		$data = array(
			'id' => $this->get_fieldid($section_name),
			'fieldname' => $this->get_fieldname($section_name),
			'section_name' => $section_name
		);
		$data = array_merge($data,$config);
		op_tpl_assign($data);
		$values = $this->get_option($section_name);
		$values = is_array($values) ? $values : array();
		foreach($content_fields as $name => $field){
			$content_fields[$name]['value'] = isset($values[$name]) ? $values[$name] : $field['default'];
			if($field['type'] != 'wysiwyg' && $font_options && !$field['disable_font']){
				$content_fields[$name]['font_html'] = op_font_options_str($field['name'].' '.__('Font Options (Optional)', 'optimizepress'),$data['fieldname'].'['.$name.']',op_get_var($fonts_array,$name,array()));
			}
		}
		$out = $this->load_tpl('content_fields',array('content_fields'=>$content_fields));
		if($return){
			return $out;
		}
		echo $out;
	}
	
	function save_settings($section_name,$config=array(),$op,$return=false,$use_fonts=false){
		if(!$content_fields = $this->_check_fields($config)){
			return array();
		}
		//$section = is_array($section_name) ? array_pop($section_name) : $section_name;
		$content_fields = $this->_prep_fields($content_fields);
		$newdata = array();
		$fonts = array();
		$fieldid = $this->get_fieldid($section_name);
		foreach($content_fields as $name => $field){
			$tmp = op_get_var($op,$name);
			if($use_fonts && is_array($tmp) && isset($tmp['value'])){
				$newdata[$name] = $tmp['value'];
				unset($tmp['value']);
				$fonts[$name] = $tmp;
			} else {
				$newdata[$name] = stripslashes($tmp);
			}
		}
		if($return){
			if($use_fonts){
				return array($newdata,$fonts);
			} else {
				return $newdata;
			}
		}
		$this->update_option($section_name,$newdata);
	}
	
	function _check_fields($config=array()){
		if(!isset($config['fields']) || !is_array($config['fields']) || count($config['fields']) == 0){
			return false;
		}
		$fields = $config['fields'];
		$ignores = $this->_get_ignore_fields($config);
		foreach($ignores as $ignore){
			if(isset($fields[$ignore])){
				unset($fields[$ignore]);
			}
		}
		return $fields;
	}
	
	function _get_ignore_fields($config=array()){
		$ignore = array();
		if(isset($config['ignore_fields'])){
			$ignore = is_array($config['ignore_fields']) ? $config['ignore_fields'] : array_filter(explode('|',$config['ignore_fields']));
		}
		return $ignore;
	}
	
	function _prep_fields($fields){
		if(!isset($this->wysiwygs)){
			$this->wysiwygs = function_exists('wp_editor');
		}
		$default = array(
			'type' => 'text',
			'default' => '',
			'disable_font' => false
		);
		$newfields = array();
		foreach($fields as $name => $field){
			if(!is_array($field)){
				$field = array(
					'name' => $field
				);
			}
			$newfields[$name] = array_merge($default,$field);
			if($newfields[$name]['type'] == 'wysiwyg' && !$this->wysiwygs){
				$newfields[$name]['type'] = 'textarea';
			}
		}
		return $newfields;
	}
	
	
	function output($section_name,$config,$options,$return=false){
		if(!$content_fields = $this->_check_fields($config)){
			return false;
		}
		$content_fields = $this->_prep_fields($content_fields);
		$content = array();
		foreach($content_fields as $field => $field_options){
			$content[$field] = op_get_var($options,$field,op_get_var($field_options,'default'));
		}
		return $content;
	}
}
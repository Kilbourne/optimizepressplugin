<?php
class OptimizePress_Modules_Base {
	
	var $url 					= '';
	var $path 					= '';
	var $shortname				= '';
	var $_enabled_sections 		= array();
	var $_configs 				= array();
	var $_options 				= array();
	var $_option_func			= 'op_get_option';
	var $_update_func			= 'op_update_option';
	var $_default_func			= 'op_default_attr';
	var $_default_option_func	= 'op_default_option';
	var $_on_off				= 'op_on_off_switch';

	function __construct($config = array()){
		if(defined('OP_PAGEBUILDER')){
			$this->_option_func = 'op_page_option';
			$this->_update_func = 'op_update_page_option';
			$this->_default_func = 'op_page_attr';
			$this->_default_option_func = 'op_default_page_option';
			$this->_on_off = 'op_page_on_off_switch';
		}
		$this->url = $config['url'];
		$this->path = $config['path'];
		$this->shortname = $config['shortname'];
	}
	
	function get_option(){
		$args = func_get_args();
		return call_user_func_array($this->_option_func,$args);
	}
	
	function update_option(){
		$args = func_get_args();
		call_user_func_array($this->_update_func,$args);
	}
	
	function default_attr(){
		$args = func_get_args();
		return call_user_func_array($this->_default_func,$args);
	}
	
	function default_option(){
		$args = func_get_args();
		return call_user_func_array($this->_default_option_func,$args);
	}
	
	function on_off(){
		$args = func_get_args();
		return call_user_func_array($this->_on_off,$args);
	}
	
	function get_title(){
		return __($this->_title,OP_SN.'_'.$this->shortname);
	}
	
	function load_tpl($tpl,$data=array(),$mod_tpl=true){
		op_tpl_assign($this->shortname.'_object',$this);
		return op_tpl($tpl,$data,($mod_tpl?$this->path.'tpl/':null));
	}
	
	function get_fieldname(){
		$field = 'op';
		$args = func_get_args();
		$field .= call_user_func_array(array($this,'_get_recursive_field_name'),$args);
		return $field;
	}
	
	function _get_recursive_field_name(){
		$field = '';
		$args = func_get_args();
		foreach($args as $a){
			if(is_array($a)){
				$field .= call_user_func_array(array($this,'_get_recursive_field_name'),$a);
			} else {
				$field .= '['.$a.']';
			}
		}
		return $field;
	}
	
	function get_fieldid(){
		$field = 'op';
		$args = func_get_args();
		$field .= call_user_func_array(array($this,'_get_recursive_field_id'),$args);
		return $field.'_';
	}
	
	function _get_recursive_field_id(){
		$field = '';
		$args = func_get_args();
		foreach($args as $a){
			if(is_array($a)){
				$field .= call_user_func_array(array($this,'_get_recursive_field_id'),$a);
			} else {
				$field .= '_'.$a;
			}
		}
		return $field;
	}

	function display_settings($section_name,$config=array(),$return=false){
		$data = array(
			'fieldid' => $this->get_fieldid($section_name),
			'fieldname' => $this->get_fieldname($section_name),
			'section_name' => $section_name,
		);
		$out = $this->load_tpl('settings',$data);
		if($return){
			return $out;
		}
		echo $out;
	}
	
	function display($section_name,$return=false,$add_to_config=array()){
		if(!is_array($section_name)){
			$section_name = array($section_name);
		}
		if(is_array($return)){
			$add_to_config = $return;
			$return = false;
		}	
		if($this->is_enabled($section_name)){
			$fieldid = $this->get_fieldid($section_name);
			$config = $this->_configs[$fieldid];
			$config = array_merge($config,$add_to_config);
			$op = $this->_options[$fieldid];
			return $this->output($section_name,$config,$op,$return);
		}
	}
	
	function is_enabled($section_name){
		$id = $this->get_fieldid($section_name);
		if(isset($this->_enabled_sections[$id])){
			return $this->_enabled_sections[$id];
		}
		if(!is_array($section_name)){
			$section_name = array($section_name);
		}
		$config = array();
		$op = array();
		$enabled = false;
		if($section_config = op_section_config($section_name[0])){
			$config = op_get_var($section_config,'options',array());
			$enabled = true;
			if(!(isset($section_config['on_off']) && $section_config['on_off'] === false)){
				$enabled = false;
				if($this->get_option($section_name[0],'enabled') == 'Y'){
					$enabled = true;
				}
			}
			if(!$op = $this->get_option($section_name)){
				$op = array();
				$enabled = false;
			}
			if(!is_array($config)){
				$config = array();
			}
		}
		$this->_enabled_sections[$id] = $enabled;
		$this->_configs[$id] = $config;
		$this->_options[$id] = $op;
		return $enabled;
	}
}
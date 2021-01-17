<?php
class OptimizePress_Tpl {
	var $_template_vars 	= array();
	var $_errors 			= array();
	var $_error_groups		= array();
	var $_section_errors	= array();

	function assign($name,$value=null){
		if(is_array($name)){
			foreach($name as $n => $v){
				$this->assign($n,$v);
			}
		} else {
			$this->_template_vars[$name] = $value;
		}
	}

	function has_error(){
		if(count($this->_errors) > 0){
			return true;
		}
		return false;
	}

	function error($field){
		if(isset($this->_errors[$field])){
			return $this->_errors[$field];
		}
		return false;
	}

	function section_error($section){
		$this->_section_errors[$section] = true;
	}

	function add_error($field,$error,$group=''){
		$this->_errors[$field] = $error;
		if($group != ''){
			$this->_error_groups[$group] = isset($this->_error_groups[$group]) ? $this->_error_groups[$group]++ : 1;
		}
	}

	function has_section_error($section){
		if(isset($this->_section_errors[$section])){
			return true;
		}
		return false;
	}

	function has_group_error($group){
		if(isset($this->_error_groups[$group])){
			return true;
		}
		return false;
	}

	function group_error($group){
		$this->_error_groups[$group] = true;
	}

	function clear(){
		$this->_template_vars = array();
	}

	function load_tpl($tpl,$data=array(),$path=null){
		$path = is_null($path) ? OP_TPL : $path;
		return $this->_load_file($path.$tpl.'.php',$data);
	}

	function theme_tpl($tpl,$data=array()){
		static $tpl_dir;
		if(!isset($tpl_dir)){
			$tpl_dir = op_get_option('theme','dir');
		}
		if($tpl_dir){
			$data['theme_url'] = OP_URL.'themes/'.$tpl_dir.'/';
			$data['theme_path'] = OP_THEMES.$tpl_dir.'/';
			$data['img_url'] = $data['theme_url'].'img/';
			return $this->_load_file(OP_THEMES.$tpl_dir.'/'.$tpl.'.php',$data);
		}
		return '';
	}

	function page_tpl($tpl,$data=array()){
		static $tpl_dir, $tpl_type;
		if(!isset($tpl_dir)){
			$tpl_dir = op_page_option('theme','dir');
			$tpl_type = op_page_option('theme','type');
		}
		if($tpl_dir){
			$data['theme_url'] = OP_URL.'pages/'.$tpl_type.'/'.$tpl_dir.'/';
			$data['theme_path'] = OP_PAGES.$tpl_type.'/'.$tpl_dir.'/';
			$data['img_url'] = $data['theme_url'].'img/';
			return $this->_load_file($data['theme_path'].$tpl.'.php',$data);
		}
		return '';
	}


	function theme_file($tpl,$data=array()){
		static $tpl_dir;
		if(!isset($tpl_dir)){
			$tpl_dir = op_get_option('theme','dir');
		}
		if($tpl_dir){
			$data['theme_url'] 	=  OP_URL.'themes/'.$tpl_dir.'/';
			$data['theme_path'] = OP_THEMES.$tpl_dir.'/';
			$data['img_url'] 	= $data['theme_url'].'img/';
			return $this->_load_file($data['theme_path'].$tpl.'.php',$data,false);
		}
		return '';
	}

	function page_file($tpl,$data=array(),$path=null){
		static $tpl_dir, $tpl_type;
		if(!isset($tpl_dir)){
			$tpl_dir = op_page_option('theme','dir');
			$tpl_type = op_page_option('theme','type');
		}
		if($tpl_dir){
			$data['theme_url'] = OP_URL.'pages/'.$tpl_type.'/'.$tpl_dir.'/';
			$data['theme_path'] = OP_PAGES.$tpl_type.'/'.$tpl_dir.'/';
			$data['img_url'] = $data['theme_url'].'img/';
			$path = is_null($path) ? $data['theme_path'] : $path;
			return $this->_load_file($path.$tpl.'.php',$data,false);
		}
		return '';
	}

	function _load_file($file,$data=array(),$return=true){
		$this->assign($data);
		extract($this->_template_vars);
		$output = '';
		if(file_exists($file)){
			if($return){
				ob_start();
				include $file;
				$output = ob_get_contents();
				ob_end_clean();
				return $output;
			} else {
				require $file;
			}
		}
	}
}
function _op_tpl(){
	static $op_tpl;
	if(!isset($op_tpl)){
		$op_tpl = new OptimizePress_Tpl;
	}
	$args = func_get_args();
	$func = array_shift($args);
	return call_user_func_array(array($op_tpl,$func),$args);
}
function op_section_error($section){
	return _op_tpl('section_error',$section);
}
function op_group_error($group){
	return _op_tpl('group_error',$group);
}
function op_has_section_error($section){
	return _op_tpl('has_section_error',$section);
}
function op_tpl_error($field,$error,$group=''){
	return _op_tpl('add_error',$field,$error,$group);
}
function op_tpl_show_error($field){
	return _op_tpl('error',$field);
}
function op_tpl($file,$data=array(),$path=null){
	return _op_tpl('load_tpl',$file,$data,$path);
}
function op_theme_tpl($file,$data=array()){
	return _op_tpl('theme_tpl',$file,$data);
}
function op_theme_file($file,$data=array()){
	return _op_tpl('theme_file',$file,$data);
}
function op_page_tpl($file,$data=array()){
	return _op_tpl('page_tpl',$file,$data);
}
function op_page_file($file,$data=array(),$path=null){
	return _op_tpl('page_file',$file,$data,$path);
}
function op_tpl_assign($name,$value=null){
	return _op_tpl('assign',$name,$value);
}
function op_has_error(){
	return _op_tpl('has_error');
}
function op_has_group_error($group){
	return _op_tpl('has_group_error',$group);
}
function op_load_section($tpl,$data=array(),$type='blog'){
	if(is_string($data) && $type == 'blog'){
		$type = $data;
		$data = array();
	}
	return op_tpl('sections/'.$type.'/'.$tpl,$data);
}
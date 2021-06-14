<?php

class OptimizePress_Options {
	private $_options = array();
	private $_configs = array();
	
	function get($args=array()){
		if(count($args) == 0){
			return false;
		}
		if(is_array($args[0])){
			$key = array_shift($args[0]);
			if(count($args[0]) == 0){
				array_shift($args);
			}
		} else {
			$key = is_array($args) ? array_shift($args) : $args;
		}
		/*
		 * There was a PHP notice on the line #19 of array to string conversion ($key was an array). It was impossible to me (Luka) to figure out the what 
		 * would the correct thing to do is. The issue was with feature_area/optin(2)
		 */
		if (is_array($key)) {
			$key = $key[0];
		}
		$name = OP_SN.'_'.$key;
		if(!isset($this->_options[$name])){
			$this->_options[$name] = maybe_unserialize(get_option($name));
		}
		return _op_traverse_array($this->_options[$name],$args);
	}
	
	function delete($args=array()){
		if(count($args) == 0){
			return false;
		}
		$name = OP_SN.'_'.$args[0];
		if(count($args) > 1){
			$key = array_pop($args);
			if($opt = $this->get($args)){
				if(is_array($opt) && isset($opt[$key])){
					unset($opt[$key]);
				}
				array_push($args,$opt);
				$this->update($args);
			}
		} else {
			if(isset($this->_options[$name])){
				unset($this->_options[$name]);
			}
			delete_option($name);
		}
	}
	
	function update($args=array()){
		if(count($args) == 0){
			return false;
		}
		$name = OP_SN.'_'.$args[0];
		$val = array_pop($args);
		$cur = $this->get($args);
		$update_val = false;
		if(count($args) > 1){
			$option = array_shift($args);
			$options = $this->get($option);
			$options = $options ? $options : array();
			for($i=0,$al=count($args);$i<$al;$i++) {
                $is_array = ($i >= $al - 1);
                if (!isset($tmp)) {
                    $tmp =& $options;
                }
                if (!isset($tmp[$args[$i]])) {
                    $tmp[$args[$i]] = $is_array ? array() : false;
                }
                $tmp =& $tmp[$args[$i]];
            }
			$tmp = $val;
			$this->_options[$name] = $options;
			$update_val = $options;
		} else {
			$this->_options[$name] = $val;
			$update_val = $val;
		}
		if(isset($update_val)){
			update_option($name,maybe_serialize($update_val));
		}
	}
	
	function theme_config($args=array()){
		if(count($args) == 0){
			return false;
		}
		$found = false;
		$config = array();
		if(is_array($args[0])){
			$key = array_shift($args[0]);
			if(count($args[0]) == 0){
				array_shift($args);
			}
		} else {
			$key = array_shift($args);
		}
		if(!isset($this->_configs[$key])){
			$path = OP_THEMES.$key;
			$theme_url = OP_URL.'themes/'.$key.'/';
			if(file_exists($path.'/config.php')){
				op_textdomain(OP_SN.'_'.$key,$path.'/');
				require_once $path.'/config.php';
				$this->_configs[$key] = $config;
				return _op_traverse_array($this->_configs[$key],$args);
			}
		} else {
			return _op_traverse_array($this->_configs[$key],$args);
		}
		return false;
	}
	
	function _get_array_item($array,$args){
		if(count($args) == 0){
			return $array;
		} else {
			$found = true;
			for($i=0,$al=count($args);$i<$al;$i++){
				if(is_array($args[$i])){
					if(!$array = $this->_get_array_item($array,$args[$i])){
						$found = false;
						break;
					}
				} else {
					if(isset($array[$args[$i]])){
						$array = $array[$args[$i]];
					} else {
						$found = false;
						break;
					}
				}
			}
			return $found ? $array : false;
		}
	}
}
function _op_func(){
	static $op_ops;
	if(!isset($op_ops)){
		$op_ops = new OptimizePress_Options;
	}
	$args = func_get_args();
	$func = array_shift($args);
	return call_user_func_array(array($op_ops,$func),$args);
}
function op_get_option(){
	$args = func_get_args();
	return _op_func('get',$args);
}
function op_update_option(){
	$args = func_get_args();
	return _op_func('update',$args);
}
function op_load_theme_config(){
	$args = func_get_args();
	return _op_func('theme_config',$args);
}
function op_theme_config(){
	static $tpl_dir;
	if(!isset($tpl_dir)){
		$tpl_dir = op_get_option('theme','dir');
	}
	$args = func_get_args();
	array_unshift($args,$tpl_dir);
	return _op_func('theme_config',$args);
}
function op_default_option(){
	static $tpl_dir;
	if(!isset($tpl_dir)){
		$tpl_dir = op_get_option('theme','dir');
	}
	$args = func_get_args();
	if(($option = _op_func('get',$args)) === false){
		array_unshift($args,$tpl_dir,'default_config');
		$option = _op_func('theme_config',$args);
	}
	return $option === false ? '' : $option;
}
function op_default_attr(){
	$args = func_get_args();
	return op_attr(call_user_func_array('op_default_option',$args));
}
function op_default_attr_e(){
	$args = func_get_args();
	echo op_attr(call_user_func_array('op_default_option',$args));
}
function op_option(){
	$args = func_get_args();
	$option = call_user_func_array('op_get_option',$args);
	return ($option === false ? '' : $option);
}
function op_delete_option(){
	$args = func_get_args();
	return _op_func('delete',$args);	
}
function _op_launch_func($func,$args){
	if(defined('OP_LAUNCH_FUNNEL')){
		$first = array_shift($args);
		$first = 'launch_funnel_'.OP_LAUNCH_FUNNEL.'_'.$first;
		array_unshift($args,$first);
		return call_user_func_array($func,$args);
	}
}
function op_launch_option(){
	$args = func_get_args();
	return call_user_func_array('_op_launch_func',array('op_get_option',$args));
}
function op_launch_update_option(){
	$args = func_get_args();
	return call_user_func_array('_op_launch_func',array('op_update_option',$args));
}
function op_launch_default_option(){
	$args = func_get_args();
	return call_user_func_array('_op_launch_func',array('op_default_option',$args));
}
function op_launch_default_attr(){
	$args = func_get_args();
	return call_user_func_array('_op_launch_func',array('op_default_attr',$args));
}
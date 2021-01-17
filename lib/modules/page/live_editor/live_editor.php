<?php
class OptimizePress_Page_Live_Editor_Module extends OptimizePress_Modules_Base {
	
	function output($section_name,$config,$op,$return=false){
		$id = rtrim($this->get_fieldid($section_name),'_');
		$id = ltrim($id,'op_');
		$one_col = op_get_var($config,'one_col',false);
		$add_class = op_get_var($config,'container_class');
		if(!empty($add_class)){
			$add_class = ' '.$add_class;
		}
		$default = op_get_var($config,'default_layout',array());
		if(!is_array($default)){
			$default = unserialize(base64_decode($default));
		}
		return op_page_layout($id,false,$id.'_area','editable-area'.$add_class,$default,$one_col);
	}
	
	function save_settings(){
		return array();
	}
	
}
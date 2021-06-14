<?php
class OptimizePress_Page_Launch_Gateway_Module extends OptimizePress_Modules_Base {

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
	
	function save_settings($section_name,$config=array(),$op,$return=false){
		$data = array(
			'enabled' => op_get_var($op,'enabled','N'),
			'url' => op_get_var($op,'url'),
			'code' => op_get_var($op,'code')
		);
		if($return){
			return $data;
		}
		$this->update_option($section_name,$data);
	}
}
?>
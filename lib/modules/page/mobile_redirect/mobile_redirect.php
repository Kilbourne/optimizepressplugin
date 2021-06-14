<?php
class OptimizePress_Page_Mobile_Redirect_Module extends OptimizePress_Modules_Base {
	
	function __construct($config = array()){
		parent::__construct($config);
		add_action('op_page_module_init',array($this,'check_redirect'));
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
	
	function save_settings($section_name,$config=array(),$op,$return=false){
		$data = array(
			'enabled' => op_get_var($op,'enabled','N'),
			'url' => op_get_var($op,'url'),
		);
		if($return){
			return $data;
		}
		$this->update_option($section_name,$data);
	}
	
	function is_mobile(){
		$regex_match="/(nokia|iphone|android|motorola|^mot\-|softbank|foma|docomo|kddi|up\.browser|up\.link|";
		$regex_match.="htc|dopod|blazer|netfront|helio|hosin|huawei|novarra|CoolPad|webos|techfaith|palmsource|";
		$regex_match.="blackberry|alcatel|amoi|ktouch|nexian|samsung|^sam\-|s[cg]h|^lge|ericsson|philips|sagem|wellcom|bunjalloo|maui|";	
		$regex_match.="symbian|smartphone|midp|wap|phone|windows ce|iemobile|^spice|^bird|^zte\-|longcos|pantech|gionee|^sie\-|portalmmm|";
		$regex_match.="jig\s browser|hiptop|^ucweb|^benq|haier|^lct|opera\s*mobi|opera\*mini|320x320|240x320|176x220";
		$regex_match.=")/i";		
		return isset($_SERVER['HTTP_X_WAP_PROFILE']) or isset($_SERVER['HTTP_PROFILE']) or preg_match($regex_match, strtolower($_SERVER['HTTP_USER_AGENT']));
	}
	
	function check_redirect(){
		$options = op_page_option('mobile_redirect');
		$url = op_get_var($options,'url');
		if(op_get_var($options,'enabled','N') == 'Y' && !empty($url)){
			if(wp_is_mobile()){
				header('Location: '.$url);
				exit;
			}
		}
	}
}
?>
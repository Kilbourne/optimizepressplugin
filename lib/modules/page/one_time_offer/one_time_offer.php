<?php
class OptimizePress_Page_One_Time_Offer_Module extends OptimizePress_Modules_Base {
	
	function __construct($config=array()){
		parent::__construct($config);
		if($this->is_enabled('one_time_offer')){
			add_action('op_page_module_init',array($this,'check_cookie'));
		}
	}
	
	function check_cookie(){
		if(is_admin() || defined('OP_LIVEEDITOR')){
			return;
		}
		$cookie_name = OP_SN.'-one-time-offer';
		$options = op_get_var($this->_options,'op_one_time_offer_',array());
		$url = op_get_var($options,'url');
		if(!empty($url)){
			if(isset($_COOKIE[$cookie_name])){
				if(time() >= $_COOKIE[$cookie_name]){
					header('Location: '.$url);
					exit;
				}
			} else {
				$chks = array('days','hours','minutes','seconds');
				$error = true;
				$fields = array();
				$cur = array();
				$time = op_get_var($options,'time');
				list($cur['year'],$cur['month'],$cur['days'],$cur['hours'],$cur['minutes'],$cur['seconds']) = explode('-',date('Y-m-d-H-i-s'));
				foreach($chks as $chk){
					$val = op_get_var($time,$chk);
					if(!empty($val) || $val > 0){
						$error = false;
						$fields[$chk] = $cur[$chk]+$val;
					} else {
						$fields[$chk] = $cur[$chk];
					}
				}
				if(!$error){
					$newtime = mktime($fields['hours'],$fields['minutes'],$fields['seconds'],$cur['month'],$fields['days'],$cur['year']);
					setcookie($cookie_name,$newtime,time()+47335389,$_SERVER['REQUEST_URI'],COOKIE_DOMAIN);
					$_COOKIE[$cookie_name] = $newtime;
				}
			}
		}
	}
	
	function get_time_left(){
		if(is_admin() || defined('OP_LIVEEDITOR')){
			return;
		}
		if($this->is_enabled('one_time_offer')){
			$cookie_name = OP_SN.'-one-time-offer';
			$options = op_get_var($this->_options,'op_one_time_offer_',array());
			$url = op_get_var($options,'url');
			if(empty($url)){
				return 0;
			}
			if(isset($_COOKIE[$cookie_name])){
				$time = $this->timeBetween(time(),$_COOKIE[$cookie_name]);
				return array($time[0],$url,$time[1],$time[2]);
			}
			return array(0,$url);
		}
		return 0;
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
		$time = op_get_var($op,'time',array());
		$data = array(
			'enabled' => op_get_var($op,'enabled','N'),
			'url' => op_get_var($op,'url'),
			'time' => array(
				'days' => op_get_var($time,'days'),
				'hours' => op_get_var($time,'hours'),
				'minutes' => op_get_var($time,'minutes'),
				'seconds' => op_get_var($time,'seconds'),
			)
		);
		if($return){
			return $data;
		}
		$this->update_option($section_name,$data);
	}
	
	function timeBetween($start_date,$end_date){
		$diff = $end_date-$start_date;
 		$seconds = 0;
 		$hours   = 0;
 		$minutes = 0;
	
		if($diff % 86400 <= 0){
			$days = $diff / 86400;
		}
		if($diff % 86400 > 0){
			$rest = ($diff % 86400);
			$days = ($diff - $rest) / 86400;
     		if($rest % 3600 > 0){
				$rest1 = ($rest % 3600);
				$hours = ($rest - $rest1) / 3600;
        		if($rest1 % 60 > 0){
					$rest2 = ($rest1 % 60);
					$minutes = ($rest1 - $rest2) / 60;
					$seconds = $rest2;
				} else {
					$minutes = $rest1 / 60;
				}
     		} else {
				$hours = $rest / 3600;
			}
		}
		
		$str = array();
		$chks = array('days'=>'dd','hours'=>'hh','minutes'=>'mm','seconds'=>'ss');
		$add = false;
		$formatstr = array();
		foreach($chks as $chk => $format){
			if($add || $$chk > 0){
				array_push($str,($$chk<10?'0':'').$$chk);
				$add = true;
				$formatstr[] = $format;
			}
		}
		$length = count($str);
		$width = (106*$length)+(4*$length-1);
		return array(implode(':',$str),implode(':',$formatstr),$width);
	}
}
?>
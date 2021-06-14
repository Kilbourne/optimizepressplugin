<?php
class OptimizePress_Page_Fb_Share_Settings_Module extends OptimizePress_Modules_Base {
	
	function __construct($config=array()){
		parent::__construct($config);
		if($this->is_enabled('fb_share')){
			add_filter('op_meta_tags',array($this,'meta_tags'));
			add_action('wp_head',array($this,'output_metas'),0);
		}
	}
	
	function meta_tags($metas){
		$options = op_get_var($this->_options,'op_fb_share_',array());
		$chks = array('title'=>'title','description'=>'description','image'=>'image','like_url'=>'url');
		foreach($chks as $name => $prop){
			$val = op_get_var($options,$name);
			if(!empty($val)){
				$metas['og:'.$prop] = $val;
			}
		}
		return $metas;
	}
	
	function output_metas()
	{
		$metas = $this->meta_tags(array());
		if (!empty($metas)) {
			foreach ($metas as $key => $val) {
				echo '<meta property="'.$key.'" content="'.$val.'" />' . "\n";
			}
		}
	}
	
	function save_settings($section_name,$config=array(),$op,$return=false){
		$data = array(
			//'title' => op_get_var($op,'title'),
			//'description' => op_get_var($op, 'description'),
			//'image' => op_get_var($op,'image'),
			'like_url' => op_get_var($op,'like_url'),
		);
		
		if($return){
			return $data;
		}
		$this->update_option($section_name,$data);
	}
}
?>
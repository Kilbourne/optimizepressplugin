<?php
class OptimizePress_Blog_Sharing_Module extends OptimizePress_Modules_Base {
	var $is_active = false;

	function __construct($config=array()){
		parent::__construct($config);
		add_action('wp_footer',array($this,'load_footer_scripts'));
	}

	function display_settings($section_name,$config=array(),$return=false){

	}

	function save_settings($section_name,$config=array(),$op){
		$sharing = array(
			'enabled' => op_get_var($op,'enabled','N'),
		);
		$this->update_option($section_name,$sharing);
	}

	function load_footer_scripts(){
		if($this->get_option('sharing','enabled') == 'Y'){
			/*
			 * https url for script is different from http 
			 */
			if (is_ssl()) {
				echo '<script type="text/javascript">var switchTo5x=true;</script>
					  <script type="text/javascript" src="https://ws.sharethis.com/button/buttons.js">
					  </script><script type="text/javascript">stLight.options({publisher:"f494318c-ebee-4740-a388-1ea04b0fa4e7"});</script>';				
			} else {
				echo '<script type="text/javascript">var switchTo5x=true;</script>
				      <script type="text/javascript" src="http://w.sharethis.com/button/buttons.js"></script>
				      <script type="text/javascript">stLight.options({publisher:"f494318c-ebee-4740-a388-1ea04b0fa4e7"});</script>';
			}
			
		}
	}

	function output($section_name,$config,$op,$return=false){
		$out = '<div class="op-share-code"><span class="st_twitter_hcount" displayText="Tweet"></span><span class="st_plusone_hcount"></span><span class="st_fblike_hcount"></span></div>';
		if($return){
			return $out;
		}
		echo $out;
	}
}
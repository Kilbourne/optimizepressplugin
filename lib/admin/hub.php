<?php
class OptimizePress_Hub {
	
	function __construct(){
		add_action('admin_menu',array($this,'admin_menu'));
	}
	
	function admin_menu(){
		$page = add_menu_page('OptimizePress', 'OptimizePress', 'edit_theme_options', OP_SN, array($this,'hub_page'),'','30.284567');
		add_action('admin_print_styles-'.$page, array($this,'print_scripts'));
	}
	
	function print_scripts(){
		wp_enqueue_style( OP_SN.'-admin-common'); //'-blog-settings');
	}
	
	function hub_page(){
		echo op_tpl('hub/index');
	}
}
new OptimizePress_Hub();
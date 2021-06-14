<?php
class OptimizePress_Page_Launch_Funnel_Module extends OptimizePress_Modules_Base {

	var $add_js = false;

	function __construct($config=array()){
		parent::__construct($config);
		if(defined('OP_LIVEEDITOR')){
			add_action('admin_print_footer_scripts',array($this,'print_scripts'));
		} else {
			add_action(OP_SN.'-print-footer-scripts-admin',array($this,'print_scripts'));
		}
	}

	function print_scripts(){
		echo '<script type="text/javascript" src="'.$this->url.'settings'.OP_SCRIPT_DEBUG.'.js?ver='.OP_VERSION.'"></script>';
		//wp_enqueue_script(OP_SN.'settings', $this->url.'settings.js', array(OP_SN.'-noconflict-js'), OP_VERSION);
	}

	function display_settings($section_name,$config=array(),$return=false){
		global $wpdb;

		$data = array(
			'fieldid' => $this->get_fieldid($section_name),
			'fieldname' => $this->get_fieldname($section_name),
			'section_name' => $section_name,
		);

		$funnel_dropdown = '';
		$current = intval(op_page_option($section_name,'funnel_id'));
		$found = false;
		$funnels = $wpdb->get_results( "SELECT id,title FROM `{$wpdb->prefix}optimizepress_launchfunnels` ORDER BY title ASC");
		$funnel_count = 0;
		if($funnels){
			$funnel_count = count($funnels);
			foreach($funnels as $funnel){
				if($current < 1){
					$current = $funnel->id;
					$found = true;
				} elseif($current == $funnel->id){
					$found = true;
				}
				$funnel_dropdown .= '<option value="'.$funnel->id.'"'.($current==$funnel->id?' selected="selected"':'').'>'.op_attr($funnel->title).'</option>';
			}
		}
		$data['funnel_count'] = $funnel_count;
		$data['funnel_select'] = '<select name="'.$data['fieldname'].'[funnel_id]" id="'.$data['fieldid'].'funnel_id">'.$funnel_dropdown.'</select>';
		$this->add_js = true;
		$out = $this->load_tpl('settings',$data);
		if($return){
			return $out;
		}
		echo $out;
	}

	function save_settings($section_name,$config=array(),$op,$return=false){
		global $wpdb;
		$gateway = op_get_var($op,'gateway_override',array());
		$data = array(
			'enabled' => op_get_var($op,'enabled','N'),
			'funnel_id' => op_get_var($op,'funnel_id'),
			'gateway_override' => array(
				'enabled' => op_get_var($gateway,'enabled','N'),
				'redirect' => op_get_var($gateway,'redirect'),
				'code' => op_get_var($gateway,'code'),
			)
		);

		$entry = $wpdb->get_col( $wpdb->prepare(
			"SELECT page_id FROM `{$wpdb->prefix}optimizepress_launchfunnels_pages` WHERE `page_id` = %s AND `funnel_id` = %s",
			OP_PAGEBUILDER_ID,
			$data['funnel_id']
		));
		if(!$entry){
			$wpdb->query($wpdb->prepare("DELETE FROM `{$wpdb->prefix}optimizepress_launchfunnels_pages` WHERE `page_id` = %s",OP_PAGEBUILDER_ID));
			if($data['enabled'] == 'Y'){
				$insert = array(
					'funnel_id'=>$data['funnel_id'],
					'page_id'=>OP_PAGEBUILDER_ID,
					//'step' => $step,
				);
				$wpdb->insert($wpdb->prefix.'optimizepress_launchfunnels_pages',$insert);
			}
		}
		if($return){
			return $data;
		}
		update_post_meta(OP_PAGEBUILDER_ID, '_'.OP_SN.'_launch_funnel', maybe_serialize($data));
		$this->update_option($section_name,$data);
	}
}
?>
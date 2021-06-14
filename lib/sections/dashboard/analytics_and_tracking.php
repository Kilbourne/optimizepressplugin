<?php
class OptimizePress_Sections_Analytics_and_Tracking {
	function sections(){
		static $sections;
		if(!isset($sections)){
			$sections = array(
				'analytics_and_tracking' => array(
					'title' => __('Analytics & Tracking', 'optimizepress'),
					'action' => array($this,'analytics_and_tracking'), 
					'save_action' => array($this,'save_analytics_and_tracking')
				)
			);
			$sections = apply_filters('op_edit_sections_analytics_and_tracking',$sections);
		}
		return $sections;
	}
	
	/* Analytics and Tracking Section */
	function analytics_and_tracking(){
		echo op_load_section('analytics_and_tracking', array(), 'analytics_and_tracking');
	}
	
	function save_analytics_and_tracking($op){
		if ($analytics_and_tracking = op_get_var($op, 'analytics_and_tracking')){
			op_update_option('analytics_and_tracking', $analytics_and_tracking);
		}
	}
}
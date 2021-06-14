<?php
class OptimizePress_Sections_General {
	
	// Get the list of step 2 sections these can be overridden by the theme using the 'op_edit_sections_general' filter
	function sections(){
		static $sections;
		if(!isset($sections)){
			$sections = array(
				'header_logo_setup' => array(
					'title' => __('Header & Logo Setup', 'optimizepress'),
					'action' => array($this,'header_logo_setup'), 
					'save_action' => array($this,'save_header_logo_setup')
				),
				'favicon_setup' => array(
					'title' => __('Favicon Setup', 'optimizepress'),
					'action' => array($this,'favicon_setup'), 
					'save_action' => array($this,'save_favicon_setup')
				),
				'site_footer' => array(
					'title' => __('Site Footer', 'optimizepress'),
					'action' => array($this,'site_footer'), 
					'save_action' => array($this,'save_site_footer')
				),
				'promotion' => array(
					'title' => __('Promotion Settings', 'optimizepress'),
					'module' => 'promotion',
					'options' => op_theme_config('mod_options','promotion')
				),
				'custom_css' => array(
					'title' => __('Custom CSS (Sitewide)', 'optimizepress'),
					'action' => array($this,'custom_css'), 
					'save_action' => array($this,'save_custom_css')
				),
				'analytics_and_tracking' => array(
					'title' => __('Analytics & Tracking', 'optimizepress'),
					'action' => array($this,'analytics_and_tracking'), 
					'save_action' => array($this,'save_analytics_and_tracking')
				),
				'email_marketing_services' => array(
					'title' => __('Email Marketing Services', 'optimizepress'),
					'action' => array($this,'email_marketing_services'), 
					'save_action' => array($this,'save_email_marketing_services')
				),
				'social_integration' => array(
					'title' => __('Social Integration', 'optimizepress'),
					'action' => array($this,'social_integration'), 
					'save_action' => array($this,'save_social_integration')
				)
			);
			$sections = apply_filters('op_edit_sections_general',$sections);
		}
		return $sections;
	}
	
	/* Header & Logo Setup Section */
	function header_logo_setup(){
		echo op_load_section('header_logo_setup', array(), 'blog/general');
	}
	
	function save_header_logo_setup($op){
		if ($header_logo_setup = op_get_var($op, 'header_logo_setup')){
			op_update_option('header_logo_setup', $header_logo_setup);
		}
	}
	
	/* Favicon Section */
	function favicon_setup(){
		echo op_load_section('favicon_setup', array(), 'blog/general');
	}
	
	function save_favicon_setup($op){
		op_update_option('favicon_setup', op_get_var($op,'favicon_setup'));
	}
	
	/* Site Footer Section */
	function site_footer(){
		echo op_load_section('site_footer', array(), 'blog/general');
	}
	
	function save_site_footer($op){
		if ($site_footer = op_get_var($op, 'site_footer')){
			op_update_option('site_footer', $site_footer);
		}
	}
	
	/* Custom CSS Section */
	function custom_css(){
		echo op_load_section('custom_css', array(), 'blog/general');
	}
	
	function save_custom_css($op){
		if ($custom_css = op_get_var($op, 'custom_css')){
			op_update_option('custom_css', $custom_css);
		}
	}
	
	/* Analytics and Tracking Section */
	function analytics_and_tracking(){
		echo op_load_section('analytics_and_tracking', array(), 'blog/general');
	}
	
	function save_analytics_and_tracking($op){
		if ($analytics_and_tracking = op_get_var($op, 'analytics_and_tracking')){
			op_update_option('analytics_and_tracking', $analytics_and_tracking);
		}
	}
	
	/* Email Marketing Services Section */
	function email_marketing_services(){
		echo op_load_section('email_marketing_services', array(), 'blog/general');
	}
	
	function save_email_marketing_services($op){
		if ($email_marketing_services = op_get_var($op, 'email_marketing_services')){
			op_update_option('email_marketing_services', $email_marketing_services);
		}
	}
	
	/* Social Integration Section */
	function social_integration(){
		echo op_load_section('social_integration', array(), 'blog/general');
	}
	
	function save_social_integration($op){
		if ($social_integration = op_get_var($op, 'social_integration')){
			op_update_option('social_integration', $social_integration);
		}
	}
}
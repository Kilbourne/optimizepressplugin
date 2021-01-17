<?php
class OptimizePress_Page_Feature_Area extends OptimizePress_Page_Feature_Area_Base {
	
	function __construct(){
		parent::__construct();
		$this->settings = op_page_option('feature_area');
		$this->enabled = true;
		$this->get_options();
	}
	
	function get_options(){
		//$content_fields = op_optin_default_fields();
		$vid_opts = array(
			'values' => array(
				'type' => 'video',
				'width' => '540',
				'height' => '350',
			)
		);
		op_mod('signup_form');
		$style = array(
			'title_logo' => array(
				'module' => 'content_fields',
				'mod_options' => array(
					'fields' => array(
						'title' => array(
							'name' => __('Logo', 'optimizepress'),
							'default' => $this->global_imgs.'logo_default.png',
							'element' => 'h1',
							'type' => 'image',
						)
					)
				),
				'template' => array($this,'content_fields'),
			),
			
			'content' => array(
				'module' => 'content_fields',
				'mod_options' => array(
					'fields' => array(
						'title' => array(
							'name' => __('Title', 'optimizepress'),
							'default' => __('Discover How You Can Build Pages Just Like This In Seconds...', 'optimizepress'),
						),
						'content' => array(
							'name' => __('Content', 'optimizepress'),
							'default' => __('Your high impact sub-headline or call to action text would be placed here.  Enter your name and email below for instant access', 'optimizepress'),
							'type' => 'wysiwyg',
							'disable_font' => true
						)
					),
				),
				'before' => '<div>',
				'after' => '</div>',
				'template' => array($this,'content_fields')
			),
			
			'optin' => array(
				'module' => 'signup_form',
				'mod_options' => array(
					'disable' => array('color_scheme'),
					'ignore_fields' => array('title','form_header','footer_note'),
					'content_fields' => op_optin_default_fields(),
					'submit_button_config' => array(
						'defaults' => array(
							'content' => __('Get Started', 'optimizepress')
						)
					)
				),
				'template' => array($this,'optin_box'),
				'before' => '<div>',
				'after' => '</div>'
			),
			
			'footer_note' => array(
				'module' => 'content_fields',
				'mod_options' => array(
					'fields' => array(
						'footer_note' => array(
							'name' => __('Footer Note', 'optimizepress'),
							'default' => __('We value your privacy. Your information will never be shared or sold.', 'optimizepress'),
							'wrap' => '<p class="secure-icon"><img src="'.op_page_img('secure.png',true,'global').'" alt="secure" width="16" height="15"> %s</p>'
						)
					)
				),
				'template' => array($this,'content_fields')
			),
			'template' => array($this,'style_template')
		);
		//1,6,2,7,3,8,4,9,5,10
		$this->options = $style;
	}
	function optin_box($options,$values,$output,$tpl='',$wrap_elems=array()){
		$tpl = '
		{form_open}
			<div>
				{hidden_elems}
				{name_input}
				{email_input}
				{extra_fields}
				{submit_button}
			</div>
		{form_close}';
		return parent::optin_box($options,$values,$output,$tpl);
	}
	
	function style_template($output=array()){
		/*
		 * Theme 4 started having trouble with slashes due to mb_unserialize
		 */
		if (isset($output['content'])) {
			$output['content'] = stripslashes($output['content']);
		}
		//$this->load_style();
		$html = '
		<div class="floating-featured-panel">
			{title_logo}
			<div class="container cf">
				{content}
				{optin}
			</div>
			{footer_note}
		</div>';
		return op_convert_template($html,$output);
	}
	
	function load_feature($enabled = false){
		$output = $this->load_style();
		parent::load_feature(true);
		echo $output;
	}
}
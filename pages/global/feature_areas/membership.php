<?php
class OptimizePress_Page_Feature_Area extends OptimizePress_Page_Feature_Area_Base {
	
	function __construct(){
		$this->settings = op_page_option('feature_area');
		$this->enabled = (op_get_var($this->settings,'enabled') == 'Y');
		$style = op_get_var($this->settings,'type');
		$style = ($style >= 1 && $style <= 11) ? $style : 1;
		$this->style = $style;
		$this->get_options();
		
		add_filter('op_page_feature_area_membership_selection',array($this,'style_selector'),10,2);
		parent::__construct();
	}
	function style_selector($styles,$current){
$styles = array();
		for($i=1;$i<12;$i++){
			$styles[$i] = array(
				'image' => OP_IMG.'previews/feature_areas/marketing/feature_'.$i.'.jpg',
				'width' => 265,
				'height' => 115,
				'input' => '<input type="radio" name="op[feature_area][type]" id="op_layout_feature_area_type_'.$i.'" value="'.$i.'"'.($i==$current? ' checked="checked"':'').' />',
				'li_class' => ($i == $current ? ' img-radio-selected' : ''),
			);
		}
		return $styles;
	}
	
	function get_options(){
		//$content_fields = op_optin_default_fields();
		$fields = array(
			'title' => array(
				'name' => __('Title', 'optimizepress'),
				'help' => __('Enter the title to be displayed at the top of the content area', 'optimizepress'),
				'default' => __('The perfect way to convert your traffic into sales', 'optimizepress'),
			),
			'paragraph' => array(
				'name' => __('Content', 'optimizepress'),
				'help' => __('Enter the sub title/message text above your submit button', 'optimizepress'),
				'type' => 'wysiwyg',
				'default' => __('Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.<br />Epsum factorial non deposit quid pro quo hic escorol. Olypian quarrels et gorilla congolium sic ad nauseum.', 'optimizepress'),
				'disable_font' => true,
			),
			'submit_button' => array(
				'name' => __('Submit Button', 'optimizepress'),
				'help' => __('Enter the text for the button on your feature area', 'optimizepress'),
				'default' => __('Take The Tour...', 'optimizepress'),
				'disable_font' => true,
			),
			'link_url' => array(
				'name' => __('Button Link URL', 'optimizepress'),
				'disable_font' => true,
			),
		);
		$img_fields = array(
			'image' => array(
				'name' => __('Image', 'optimizepress'),
				'help' => __('Enter the URL to the image', 'optimizepress'),
				'default' => /*OP_PAGES_URL.'global/images/marketing-sites/iphone-440.png'*/'',
				'type' => 'image',
				'disable_font' => true,
			)
		);
		$vid_opts = array(
			'values' => array(
				'type' => 'video',
				'width' => '580',
				'height' => '325',
			)
		);
		$styles = array(
			1 => array(	
				'content' => array(
					'module' => 'content_fields',
					'title' => __('Content', 'optimizepress'),
					'mod_options' => array(
						'fields' => $fields
					),
					'template' => array($this,'content_fields'),
					'before' => '<div class="twelve columns">',
					'after' => '</div>',
				),
				'image' => array(
					'module' => 'content_fields',
					'mod_options' => array(
						'fields' => $img_fields
					),
					'template' => array($this,'content_fields'),
					'before' => '<div class="twelve featured-image columns">',
					'after' => '</div>',
				)
			),
			2 => array(
				'content' => array(
					'module' => 'content_fields',
					'mod_options' => array(
						'fields' => $fields
					),
					'before' => '<div class="nine columns">',
					'after' => '</div>',
				),
				'video' => array(
					'module' => 'video',
					'mod_options' => $vid_opts,
					'before' => '<div class="fifteen columns video-panel">',
					'after' => '</div>',
				)
			),
			3 => array(
				'optin' => array(
					'module' => 'signup_form',
					'before' => '<div class="nine columns">',
					'after' => '</div>',
				),
				'image' => array(
					'module' => 'content_fields',
					'mod_options' => array(
						'fields' => $img_fields
					),
					'before' => '<div class="twelve columns featured-image offset-by-two">',
					'after' => '</div>',
				)
			),
			4 => array(
				'optin' => array(
					'module' => 'signup_form',
					'before' => '<div class="nine columns">',
					'after' => '</div>',
				),
				'video' => array(
					'module' => 'video',
					'mod_options' => $vid_opts,
					'before' => '<div class="fifteen columns video-panel">',
					'after' => '</div>',
				)
			),
			5 => array(
				'image' => array(
					'module' => 'content_fields',
					'mod_options' => array(
						'fields' => $img_fields
					),
					'before' => '<div class="twelve featured-image columns">',
					'after' => '</div>',
				),
				'content' => array(
					'module' => 'content_fields',
					'mod_options' => array(
						'fields' => $fields
					),
					'before' => '<div class="twelve columns">',
					'after' => '</div>',
				)
			),
			6 => array(
				'video' => array(
					'module' => 'video',
					'mod_options' => $vid_opts,
					'before' => '<div class="fifteen columns video-panel">',
					'after' => '</div>',
				),
				'content' => array(
					'module' => 'content_fields',
					'mod_options' => array(
						'fields' => $fields
					),
					'before' => '<div class="nine columns">',
					'after' => '</div>',
				)
			),
			7 => array(
				'image' => array(
					'module' => 'content_fields',
					'mod_options' => array(
						'fields' => $img_fields
					),
					'before' => '<div class="twelve columns featured-image">',
					'after' => '</div>',
				),
				'optin' => array(
					'module' => 'signup_form',
					'before' => '<div class="nine columns offset-by-two">',
					'after' => '</div>',
				)
			),
			8 => array(
				'video' => array(
					'module' => 'video',
					'mod_options' => $vid_opts,
					'before' => '<div class="fifteen columns video-panel">',
					'after' => '</div>',
				),
				'optin' => array(
					'module' => 'signup_form',
					'before' => '<div class="nine columns">',
					'after' => '</div>',
				)
			),
			9 => array(
				'content' => array(
					'module' => 'content_fields',
					'mod_options' => array(
						'fields' => array(
							'title' => array(
								'name' => __('Title', 'optimizepress'),
								'help' => __('Enter the title to be displayed at the top of the content area', 'optimizepress'),
								'default' => __('The perfect way to convert your traffic into sales', 'optimizepress'),
							),
							'subtitle' => array(
								'name' => __('Sub Title', 'optimizepress'),
								'help' => __('Enter the sub title to be displayed at the top of the content area', 'optimizepress'),
								'default' => __('The perfect way to convert your traffic into sales', 'optimizepress'),
							),
						)
					),
				),
				'image' => array(
					'module' => 'content_fields',
					'mod_options' => array(
						'fields' => array(
							'image' => array(
								'name' => __('Image', 'optimizepress'),
								'help' => __('Enter the URL to the image', 'optimizepress'),
								'default' => OP_PAGES_URL.'global/images/marketing-sites/screenies.png',
								'type' => 'image',
								'disable_font' => true,
							)
						)
					),
				)
			),
			10 => array(
				'content' => array(
					'module' => 'content_fields',
					'mod_options' => array(
						'fields' => $fields
					),
				),
			),
			11 => array(
				'content_large' => array(
					'module' => 'live_editor',
					'module_type' => 'page',
				)
			)
		);
		//1,6,2,7,3,8,4,9,5,10
		$this->options = isset($styles[$this->style]) ? $styles[$this->style] : array();
		if($this->style != 11){
			$this->options = array_merge(array(
					'liveeditor_above' => array(
						'module' => 'live_editor',
						'module_type' => 'page',
					)
				),$this->options,array(
					'liveeditor_below' => array(
						'module' => 'live_editor',
						'module_type' => 'page',
					)
				)
			);
		}
		foreach($this->options as $name => $options){
			op_mod($options['module'],op_get_var($options,'module_type','blog'));
			if(!isset($options['template'])){
				if($this->options[$name]['module'] == 'content_fields'){
					$this->options[$name]['template'] = array($this,'content_fields');
				} elseif($this->options[$name]['module'] == 'signup_form'){
					$this->options[$name]['template'] = array($this,'optin_box');
					$this->options[$name]['mod_options'] = array(
						'disable' => 'color_scheme',
						'content_fields' => op_optin_default_fields()
					);
					$this->options[$name]['mod_options']['submit_button_config'] = array(
						'defaults' => array(
							'content' => __('Get Started', 'optimizepress')
						)
					);
				} elseif($this->options[$name]['module'] == 'video'){
					$this->options[$name]['template'] = array($this,'video_placeholder');
				}
			}
		}
	}
	
	function load_feature($enabled = false){
		if(!$this->enabled){
			parent::load_feature();
			return '';
		}
		$classes = array(
			1 => 'featured-panel-1 ms-1',
			2 => 'featured-panel-1 ms-6',
			3 => 'featured-panel-2 ms-2',
			4 => 'featured-panel-2 ms-7',
			5 => 'featured-panel-1 ms-3',
			6 => 'featured-panel-1 ms-8',
			7 => 'featured-panel-2 ms-4',
			8 => 'featured-panel-2 ms-9',
			9 => 'featured-panel-2 ms-5',
			10 => 'featured-panel-2 ms-10',
			11 => 'featured-panel-2 ms-10',
		);
		$output = '
		<div class="full-width featured-panel featured-panel-style-2 '.$classes[$this->style].'">
			<div class="row cf"><div class="fixed-width">'.stripslashes($this->load_style()).'
			</div></div>
		</div>';
		parent::load_feature(true);
		echo $output;
	}
}
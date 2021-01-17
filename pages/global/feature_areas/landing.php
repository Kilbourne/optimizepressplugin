<?php
class OptimizePress_Page_Feature_Area extends OptimizePress_Page_Feature_Area_Base {
	
	var $optin_ran = 0;
	
	function __construct(){
		$this->settings = op_page_option('feature_area');
		$this->enabled = true;
		$this->get_options(op_get_var($this->settings,'type','A'));
		parent::__construct();
	}
	
	function get_options($style){
		$vid_opts = array(
			array(
				'values' => array(
					'type' => 'video',
					'width' => '540',
					'height' => '350',
				)
			),
			array(
				'values' => array(
					'type' => 'video',
					'width' => '850',
					'height' => '500',
				)
			)
		);
		$styles = array(
			'A' => array(
				'video' => array(
					'module' => 'video',
					'mod_options' => $vid_opts[0],
					'before' => '<div class="fourteen columns">',
					'after' => '</div>',
				),
				'optin' => array(
					'module' => 'signup_form',
					'before' => '<div class="nine columns offset-by-one">',
					'after' => '</div>',
				)
			),
			'B' => array(
				'title' => array(
					'module' => 'content_fields',
					'mod_options' => array(
						'fields' => array(
							'title' => array(
								'name' => __('Title', 'optimizepress'),
								'default' => __('Sell Your Product or Service Like A Pro With OptimizePress!', 'optimizepress'),
								'element' => 'h1',
								'type' => 'wysiwyg',
							)
						)
					),
					'before' => '<div class="twentyfour columns">',
					'after' => '</div>',
				),
				'video' => array(
					'module' => 'video',
					'mod_options' => $vid_opts[0],
					'before' => '<div class="fourteen columns">',
					'after' => '</div>',
				),
				'optin' => array(
					'module' => 'signup_form',
					'mod_options' => array(
						'ignore_fields' => array('title')
					),
					'before' => '<div class="nine columns offset-by-one">',
					'after' => '</div>',
				)
			),
			'C' => array(
				'video' => array(
					'module' => 'video',
					'mod_options' => $vid_opts[1],
					'before' => '<div class="twentytwo columns offset-by-one">',
					'after' => '</div>',
				),
				'optin' => array(
					'module' => 'signup_form',
					'mod_options' => array(
						'ignore_fields' => array('title','form_header'),
					),
					'before' => '<div class="twentyfour columns">',
					'after' => '</div>'
				)
			),
			'D' => array(
				'video' => array(
					'module' => 'video',
					'mod_options' => $vid_opts[1],
					'before' => '<div class="twentytwo columns offset-by-one">',
					'after' => '</div>'
				),
				'optin' => array(
					'module' => 'signup_form',
					'mod_options' => array(
						'ignore_fields' => array('title','form_header'),
					),
					'before' => '<div class="twentyfour columns">',
					'after' => '</div>'
				)
			),
			'E' => array(
				'video' => array(
					'module' => 'video',
					'mod_options' => $vid_opts[1],
					'before' => '<div class="twentytwo columns offset-by-one">',
					'after' => '</div>'
				),
				'optin' => array(
					'module' => 'signup_form',
					'mod_options' => array(
						'disable_name' => true,
						'ignore_fields' => array('title','form_header','name_default'),
					),
					'before' => '<div class="twenty columns offset-by-two">',
					'after' => '</div>'
				)
			),
			'F' => array(
				'video' => array(
					'module' => 'video',
					'mod_options' => $vid_opts[1],
					'before' => '<div class="twentytwo columns offset-by-one">',
					'after' => '</div>'
				),
				'optin' => array(
					'module' => 'signup_form',
					'mod_options' => array(
						'disable_name' => true,
						'ignore_fields' => array('title','form_header','name_default'),
					),
					'before' => '<div class="twenty columns offset-by-two">',
					'after' => '</div>'
				)
			),
			'G' => array(
				'video' => array(
					'module' => 'video',
					'mod_options' => array(
						'values' => array(
							'type' => 'video',
							'width' => 512,
							'height' => 350,
						)
					),
				),
				'content' => array(
					'module' => 'content_fields',
					'mod_options' => array(
						'fields' => array(
							'quote' => array(
								'name' => __('Quote', 'optimizepress'),
								'default' => __('&quot;The expert industry has been shrouded in myth and mystery for far too long. Now Brendon Burchard, one of our most innovative and powerful leaders, reveals exactly how we—authors, speakers, coaches, consultants, seminar leaders&quot;', 'optimizepress'),
								'disable_font' => true
							),
							'author' => array(
								'name' => __('Quote Author', 'optimizepress'),
								'default' => __('Jack Canfield, New York Times best-selling author of The Success Principles and originator of the Chicken Soup for the Soul&reg; series', 'optimizepress'),
								'disable_font' => true
							)
						)
					),
					'template' => array($this,'blockquote')
				),
				'content2' => array(
					'module' => 'content_fields',
					'mod_options' => array(
						'fields' => array(
							'title' => array(
								'name' => __('Title', 'optimizepress'),
								'default' => __('Sell Anything With OptimizePress', 'optimizepress'),
								'type' => 'wysiwyg'
							),
							'content' => array(
								'name' => __('Content', 'optimizepress'),
								'type' => 'wysiwyg',
								'default' => __('Order on Amazon.com via the button below, thenforward your Amazon receipt to this email: gifts@millionairemessenger.com<br />When you email your receipt to that email, you will also receive these FREE GIFTS:<br />1) 3 in-depth and invaluable training videos on how to make a million dollars as an advice expert, create lucrative how-to websites, and follow a simple 12-step roadmap to succeeding.2) The Guru Guidebook and templates on how to identify your message, select your topic, and create lucrative advice and how-to products.', 'optimizepress'),
							),
							'button_1_url' => array(
								'name' => __('Button 1 URL', 'optimizepress'),
								'default' => '#',
								'disable_font' => true
							),
							'button_1_text' => array(
								'name' => __('Button 1 Text', 'optimizepress'),
								'default' => __('Order On Amazon Now', 'optimizepress'),
								'disable_font' => true
							),
							'button_2_url' => array(
								'name' => __('Button 2 URL', 'optimizepress'),
								'default' => '#',
								'disable_font' => true
							),
							'button_2_text' => array(
								'name' => __('Button 2 Text', 'optimizepress'),
								'default' => __('Order On B&amp;N Now', 'optimizepress'),
								'disable_font' => true
							),
						)
					),
					'before' => '<div class="nine columns offset-by-one">',
					'after' => '</div>',
					'template' => array($this,'content_template_fb')
				)
			),
			'H' => array(
				'content_large' => array(
					'module' => 'live_editor',
					'module_type' => 'page',
				)
			)
		);
		$style = isset($styles[$style]) ? $style : 'A';
		$this->style = $style;
		$this->options = $styles[$style];
		if($style != 'H'){
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
					$mod_options = op_get_var($options,'mod_options',array());
					$mod_options['disable'] = 'color_scheme';
					if(!isset($mod_options['content_fields'])){
						$mod_options['content_fields'] = op_optin_default_fields();
					}
					$mod_options['submit_button_config'] = array(
						'defaults' => array(
							'content' => __('Get Started', 'optimizepress')
						)
					);
					$this->options[$name]['mod_options'] = $mod_options;
				} elseif($this->options[$name]['module'] == 'video'){
					$this->options[$name]['template'] = array($this,'video_placeholder');
				}
			}
		}
		$this->options['template'] = array($this,'style_template');
	}
	
	function load_feature($enabled = false){
		if(!$this->enabled){
			parent::load_feature();
			return '';
		}
		$output = $this->load_style();
		parent::load_feature(true);
		echo $output;
	}
	
	function content_template_fb($fields,$values){
		$fonts = array('title'=>array(),'content'=>array());
		if(isset($values[0])){
			$fonts = $values[1];
			$values = $values[0];
		}
		//op_font_style_str
		$html = '';
		
		op_mod('comments')->need_js = true;
		$button_1 = op_get_var($values,'button_1_text');
		$button_2 = op_get_var($values,'button_2_text');
		
		$title = op_get_var($values,'title');
		$font_str = op_font_style_str(op_get_var($fonts,'title',array()));
		$html .= (empty($title)?'':'<h2'.(!empty($font_str)?' style=\''.$font_str.'\'':'').'>'.nl2br($title).'</h2>
		');
		
		$content = wpautop(op_get_var($values,'content'));
		$font_str = op_font_style_str(op_get_var($fonts,'content',array()));
		$GLOBALS['OP_LIVEEDITOR_FONT_STR'] = array('elements'=>array('p','a'),'style_str'=>$font_str);
		$content = op_process_asset_content($content);
		$html .= $content.(empty($button_1)?'':'
		<a class="button-style-2 button-style-2-orange" href="'.op_get_var($values,'button_1_url').'"><span>'.$button_1.'</span></a>').(empty($button_2)?'':'
		<a class="button-style-2 button-style-2-orange" href="'.op_get_var($values,'button_2_url').'"><span>'.$button_2.'</span></a>');
		return $html;
	}
	
	function blockquote($fields,$values){
		return '<blockquote>'.op_get_var($values,'quote').'
	<cite>'.op_get_var($values,'author').'</cite>
</blockquote>';
	}
	
	function optin_box($options,$values,$output,$tpl='',$wrap_elems=array()){
		$this->optin_ran++;
		switch($this->style){
			case 'B':
				$tpl = '
		<div class="op_signup_form">
			{form_header}
			{form_open}
				<div>
					{hidden_elems}
					{name_input}
					{email_input}
					{extra_fields}
					{submit_button}
				</div>
				{footer_note}
			{form_close}
		</div>';
				break;
			case 'C':
			case 'D':
				$tpl = '
		<div class="op_signup_form cf">
			{form_open}
				<div class="input-area">
					{hidden_elems}
					{name_input}
					{email_input}
					{extra_fields}
					<div class="cf"></div>
					{footer_note}
				</div>
				{submit_button}
			{form_close}
		</div>';
				break;
			case 'E':
			case 'F':
				$tpl = '
		<div class="op_signup_form cf">
			{form_open}
				<div class="cf">
					<div class="input-area">
						{hidden_elems}
						{email_input}
						{extra_fields}
						<div class="cf"></div>
					</div>
					{submit_button}
				</div>
				{footer_note}
			{form_close}
		</div>';
				break;
		}
		return parent::optin_box($options,$values,$output,$tpl);
	}
	
	function style_template($output=array()){
		$styles = array('A'=>1,'B'=>2,'C'=>3,'D'=>4,'E'=>5,'F'=>6,'G'=>7,'H'=>8);
		$html = '
		<div class="full-width featured-panel featured-panel-style-2 featured-panel-'.$styles[$this->style].'">
			<div class="row cf"><div class="fixed-width cf">'.($this->style=='H'?'':'{liveeditor_above}');
		switch($this->style){
			case 'A':
				$html .= '
				{video}
				{optin}';
				break;
			case 'B':
				$html .= '
				{title}
				{video}
				{optin}';
				break;
			case 'C':
				$html .= '
				{video}
			</div>
			<div class="row cf">
				<div class="fixed-width">
					{optin}
				</div>';
				break;
			case 'D':
				$html .= '
				{video}
			</div>
			<div class="row grey-form cf">
				<div class="row cf">
					<div class="fixed-width">
						{optin}
					</div>
				</div>';
				break;
			case 'E':
				$html .= '
				{video}
			</div>
			<div class="row cf">
				<div class="fixed-width">
					{optin}
				</div>';
				break;
			case 'F':
				$html .= '
				{video}
			</div>
			<div class="row grey-form cf">
				<div class="row cf">
					<div class="fixed-width">
						{optin}
					</div>
				</div>';
				break;
			case 'G':
				$html .= '
				<div class="fourteen columns">
					<div class="white-video-panel">
						{video}				
						<div class="video-panel-content">
							<fb:like send="false" width="450" show_faces="true"></fb:like>	
							{content}
						</div>
					</div>
				</div>
				{content2}';
				break;
			case 'H':
				$html .= '{content_large}';
				break;
		}
		$html .= ($this->style=='H'?'':'{liveeditor_below}').'</div>
			</div>
		</div>';
		return op_convert_template($html,$output);
	}
}
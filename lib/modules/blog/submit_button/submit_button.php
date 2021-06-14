<?php
class OptimizePress_Blog_Submit_Button_Module extends OptimizePress_Modules_Base {

	var $add_js = false;

	function __construct($config=array()){
		parent::__construct($config);
		add_action((defined('OP_LIVEEDITOR')?'admin_print_footer_scripts':OP_SN.'-print-footer-scripts-admin'),array($this,'print_scripts'));
	}

	function print_scripts(){
		if($this->add_js){
			echo '<script type="text/javascript" src="'.$this->url.'submit_button'.OP_SCRIPT_DEBUG.'.js?ver='.OP_VERSION.'"></script>';
			//wp_enqueue_script(OP_SN.'submit_button', $this->url.'submit_button.js', array(OP_SN.'-noconflict-js'), OP_VERSION);
		}
	}

	function display_settings($section_name,$config=array(),$return=false){
		$this->add_js = true;
		$data = array(
			'id' => $this->get_fieldid($section_name),
			'fieldname' => $this->get_fieldname($section_name),
			'section_name' => $section_name
		);
		op_tpl_assign($data);
		$out = $this->load_tpl('index');
		if($return){
			return $out;
		}
		echo $out;
	}

	function save_settings($section_name,$config=array(),$op,$return=false){
		if(!$cur = $this->get_option($section_name)){
			$cur = array();
		}
		/*
		 * Apparently this list are allowed params
		 */
		$options = array(
			'location','content','type','image','element_type','element_type','href','new_window','cc','align','text','text_size','text_color','text_font','text_bold','text_underline','text_italic',
			'text_letter_spacing','subtext_panel','subtext','subtext_size','subtext_color','subtext_font','subtext_bold','subtext_underline','subtext_italic','subtext_letter_spacing',
			'text_shadow_panel','text_shadow_vertical','text_shadow_horizontal','text_shadow_color','text_shadow_blur','styling_width','styling_height','styling_border_color',
			'styling_border_size','styling_border_radius','styling_border_opacity','styling_gradient','styling_shine','styling_gradient_start_color','styling_gradient_end_color',
			'drop_shadow_panel','drop_shadow_vertical','drop_shadow_horizontal','drop_shadow_blur','drop_shadow_spread','drop_shadow_color','drop_shadow_opacity',
			'inset_shadow_panel','inset_shadow_vertical','inset_shadow_horizontal','inset_shadow_blur','inset_shadow_spread','inset_shadow_color','inset_shadow_opacity'
		);
		$cur['button'] = array();
		foreach($options as $opt){
			$cur[$opt] = op_get_var($op,$opt);
		}

		$cur['content'] = stripslashes($cur['content']);
		if($return){
			return $cur;
		}
		$this->update_option($section_name,$cur);
	}

	function output($section_name,$config,$button_atts,$return=false) {
		$default = array(
			'type' 							=> 1,
			'image' 						=> '',
			'location' 						=> null,
			'content'						=> '',

			'element_type' 					=> 'a',
			'href' 							=> '',
			'new_window' 					=> '',
			'cc' 							=> '',
			'align' 						=> 'center',

			'text' 							=> '',
			'text_size'						=> 20,
			'text_color'					=> null,
			'text_font'						=> null,
			'text_bold'						=> 'N',
			'text_underline' 				=> 'N',
			'text_italic'					=> 'N',
			'text_letter_spacing'			=> null,

			'subtext_panel' 				=> 'N',
			'subtext'						=> '',
			'subtext_size'					=> 15,
			'subtext_color'					=> null,
			'subtext_font'					=> null,
			'subtext_bold'					=> 'N',
			'subtext_underline' 			=> 'N',
			'subtext_italic'				=> 'N',
			'subtext_letter_spacing'		=> null,

			'text_shadow_panel'				=> 'N',
			'text_shadow_vertical' 			=> 0,
			'text_shadow_horizontal' 		=> 0,
			'text_shadow_color' 			=> null,
			'text_shadow_blur' 				=> 0,

			'styling_width'					=> 63,
			'styling_height'				=> 23,
			'styling_border_color'			=> null,
			'styling_border_size'			=> 0,
			'styling_border_radius'			=> 0,
			'styling_border_opacity'		=> 100,
			'styling_gradient'				=> 'N',
			'styling_shine'					=> 'N',
			'styling_gradient_start_color' 	=> null,
			'styling_gradient_end_color' 	=> null,

			'drop_shadow_panel'				=> 'N',
			'drop_shadow_vertical' 			=> 0,
			'drop_shadow_horizontal' 		=> 0,
			'drop_shadow_blur' 				=> 0,
			'drop_shadow_spread' 			=> 0,
			'drop_shadow_color' 			=> null,
			'drop_shadow_opacity' 			=> 100,

			'inset_shadow_panel'			=> 'N',
			'inset_shadow_vertical' 		=> 0,
			'inset_shadow_horizontal' 		=> 0,
			'inset_shadow_blur' 			=> 0,
			'inset_shadow_spread' 			=> 0,
			'inset_shadow_color' 			=> null,
			'inset_shadow_opacity' 			=> 100
		);

		if (isset($config['defaults'])) {
			$default = wp_parse_args($config['defaults'], $default);
		}

		$button_atts = wp_parse_args($button_atts, $default);
		$type = op_get_var($button_atts, 'type', 0);
		$content = op_get_var($button_atts, 'content');

		switch ($type) {
			case '1':
			case '7':
				$button_atts['text'] = $content;
				$button_atts['element_type'] = 'button';
				$out = call_user_func_array(array('OptimizePress_Default_Assets', 'button_' . $type), array($button_atts, $content));
				break;
			// case '7':
			// 	$out = sprintf('<button type="submit" class="image-button"><img src="%1$s" alt="%2$s" /></button>', op_get_var($button_atts, 'image'), $content);
			// 	break;
			default:
				$out = sprintf(op_get_var($config, 'default_button', '<button type="submit" class="default-button"><span>%1$s</span></button>'), $content);
				break;
		}

		if ($return) {
			return $out;
		}
		echo $out;
	}

	public static function create($type, $attributes)
	{
		switch ($type) {
			case 'text':
			default:
				return sprintf(
					'<label class="form-title">%1$s</label><input type="text" name="%2$s[content]" id="%3$scontent" value="%4$s" />',
					$attributes['label'],
					$attributes['field_name'],
					$attributes['id'],
					$attributes['value']
				);
		}
	}
}
<?php
class OptimizePress_Page_Lightbox_Module extends OptimizePress_Modules_Base {

	function __construct($config=array()){
		parent::__construct($config);
		if($this->is_enabled('lightbox')){
			add_action('wp_enqueue_scripts',array($this,'print_scripts'));
			add_action('op_footer',array($this,'add_lightbox'));
			add_filter(OP_SN.'-script-localize',array($this,'localize_script'));
		}
	}

	function localize_script($data=array()){
		if(!defined('OP_LIVEEDITOR')){
			$options = op_get_var($this->_options,'op_lightbox_',array());
			$data['lightbox_show_on'] = op_get_var($options,'show_on');
		}
		return $data;
	}

	function print_scripts(){
		if(!defined('OP_LIVEEDITOR')){
			wp_enqueue_script(OP_SN.'-module-lightbox', $this->url.'lightbox'.OP_SCRIPT_DEBUG.'.js', array(OP_SCRIPT_BASE), OP_VERSION);
			wp_enqueue_style(OP_SN.'-module-lightbox', $this->url.'lightbox'.OP_SCRIPT_DEBUG.'.css', false, OP_VERSION);
		}
	}

	function add_lightbox(){
		if(!defined('OP_LIVEEDITOR')):
			$options = op_get_var($this->_options,'op_lightbox_',array());
			$type = op_get_var($options,'type');
			$content = '';
			if($type == 'html'){
				$content = op_get_var($options,'html_content',array());
				$content = op_get_var($content,'content');
			} else {
				op_mod('signup_form');
				$mod_opts = array(
					'disable'=>'color_scheme|on_off_switch',
					'content_fields'=>op_optin_default_fields(),
					'submit_button_config' => array(
						'default_button' => '<button class="button-style-2 button-style-2-orange" type="submit"><span>%1$s</span></button>'
					)
				);
				$optin = op_get_var($options,'optin_form');
				$output = op_mod('signup_form')->output(array('lightbox','optin_form'),$mod_opts,$optin,true);
				$tpl = '
{title}
{form_header}
{form_open}
	{hidden_elems}
	{name_input}
	{email_input}
	{extra_fields}
	{submit_button}
	{footer_note}
{form_close}';

				$wrap = array('title'=>'<h1>%s</h1>','form_header'=>'<h2>%s</h2>');
				$content = op_optin_box($mod_opts,$output,$optin,$tpl,$wrap);
			}
		?>
		<div id="epicbox-overlay"></div>
		<div id="epicbox" class="sell-box-1">
			<a href="#" class="close"></a>
			<div class="epicbox-content">
				<div class="epicbox-scroll">
                	<?php echo $content ?>
				</div>
			</div>
		</div>
		<?php
		endif;
	}

	function display_settings($section_name,$config=array(),$return=false){
		$data = array(
			'fieldid' => $this->get_fieldid($section_name),
			'fieldname' => $this->get_fieldname($section_name),
			'section_name' => $section_name,
		);
		$out = $this->load_tpl('settings',$data);
		if($return){
			return $out;
		}
		echo $out;
	}

	function save_settings($section_name,$config=array(),$op,$return=false){
		$settings = array(
			'enabled' => op_get_var($op,'enabled','N'),
			'show_on' => op_get_var($op,'show_on','load'),
			'type' => op_get_var($op,'type','html'),
			'optin_form' => op_mod('signup_form')->save_settings(array($section_name,'optin_form'),array('disable'=>'color_scheme|on_off_switch'),op_get_var($op,'optin_form',array()),true),
			'html_content' => op_mod('content_fields')->save_settings(array($section_name,'html_content'),array('fields'=>array('content'=>array('type'=>'textarea'))),op_get_var($op,'html_content',array()),true)
		);
		op_update_page_option($section_name,$settings);
	}

}
?>
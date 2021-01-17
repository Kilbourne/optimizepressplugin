<?php
class OptimizePress_Page_Feature_Area_Base {

	var $settings = array();
	var $enabled = false;
	var $style = 1;
	var $options = array();
	var $js = array();
	var $global_imgs = '';

	function __construct(){
		$this->global_imgs = op_page_img('',true,'global');
		add_action('op_footer',array($this,'print_js'));
	}

	function generate_dialogs(){
		if(is_admin()){
			$GLOBALS['op_feature_area_dialogs'] = $this->load_dialogs();
		}
	}

	function print_js(){
		if(defined('OP_LIVEEDITOR') && count($this->js) > 0){
			echo '<script type="text/javascript">var OP_Feature_Area = '.json_encode($this->js).';</script>';
		}
	}

	function load_style(){
		//opLog("STYLE2: " .$this->style);
		$html = '';
		$feature_settings = op_get_var($this->settings,'settings',array());
		$font_settings = op_get_var($feature_settings,'font_options',array());
		$settings = $this->options;
		$tpl = isset($settings['template']);
		$output = array();
		foreach($settings as $name => $options){
			if($name != 'template'){
				$fonts = op_get_var($font_settings,$name,array());
				if($tpl){
					$output[$name] = $this->_load_style($name,$options,$feature_settings,$fonts);
				} else {
					$html .= $this->_load_style($name,$options,$feature_settings,$fonts);
				}
			}
		}
		if($tpl){
			return call_user_func_array($settings['template'],array($output,$this->style,$settings,$this->settings));
		}
		return $html;
	}

	function _load_style($name,$options,$feature_settings,$fonts){
		$html = $start = $end = '';
		if(defined('OP_LIVEEDITOR')){
			$start = '<div class="op-feature-area" data-unload="0"><div class="op-feature-settings"><a href="#{link_id}" class="feature-settings">' . __('Settings', 'optimizepress') . '</a></div>';
			$end = '</div>';
		}
		$html .= op_get_var($options,'before').str_replace('{link_id}','feature_area_'.$name,$start);
		$mod_options = op_get_var($options,'mod_options',array());
		$settings = op_get_var($feature_settings,$name,array());
		$module = op_mod($options['module'],op_get_var($options,'module_type','blog'))->output(array('feature_area',$name),$mod_options,$settings,true,true);
		if($options['module'] == 'content_fields' || $options['module'] == 'signup_form'){
			$this->js[$name] = $module;
		} elseif($options['module'] == 'video'){
			$this->js[$name] = op_get_var($module,'options',array());
		} else {
			$this->js[$name] = $settings;
		}
		if($options['module'] == 'content_fields'){
			if(isset($options['template'])){
				$tmp = call_user_func_array($options['template'],array($mod_options,array($module,$fonts)));
			}
		} else {
			if(isset($options['template'])){
				$tmp = call_user_func_array($options['template'],array($mod_options,$module,$settings));
			} else {
				$tmp = $module;
			}
		}
		$html .= $tmp;
		$html .= op_get_var($options,'after_element').$end.op_get_var($options,'after');
		return $html;
	}

	function update_feature(){
		$fonts = array();
		$option = op_post('option');
		$options = $this->options[$option];
		$op = op_post('op','feature_area','settings',$option);
		$mod_options = op_get_var($options,'mod_options',array());
		$module = op_mod($options['module'],op_get_var($options,'module_type','blog'))->save_settings(array('feature_area','settings',$option),$mod_options,$op,true,true);
		$output = '';
		if($options['module'] == 'content_fields'){
			if(isset($options['template'])){
				$output = call_user_func_array($options['template'],array($mod_options,$module));
			}
			$module = $op;
		} else {
			$output = op_mod($options['module'],op_get_var($options,'module_type','blog'))->output(array('feature_area','settings',$option),$mod_options,$module,true);
			if(isset($options['template'])){
				$output = call_user_func_array($options['template'],array($mod_options,$output,$module));
			}
		}
		$output = array(
			'js_options' => $module,
			'output' => $output,
			'option' => $option,
		);
		$output['output'] = '<div class="op-feature-area" data-unload="0">'.(defined('OP_LIVEEDITOR')?str_replace('{link_id}','feature_area_'.$option,'<div class="op-feature-settings"><a href="#{link_id}" class="feature-settings">' . __('Settings', 'optimizepress') . '</a></div>'):'').$output['output'].op_get_var($options,'after_element').'</div>';
		return $output;
	}

	function load_dialogs(){
		$feature_settings = op_get_var($this->settings,'settings',array());
		$settings = $this->options;
		$font_options = op_get_var($feature_settings,'font_options',array());
		$html = '';
		foreach($settings as $name => $options){
			if($name != 'template'){
				if($options['module'] == 'content_fields'){
					$fonts = op_get_var($font_options,$name,array());
					$out = op_mod($options['module'],op_get_var($options,'module_type','blog'))->display_settings(array('feature_area','settings',$name),op_get_var($options,'mod_options',array()),true,true,$fonts);
				} else {
					$out = op_mod($options['module'],op_get_var($options,'module_type','blog'))->display_settings(array('feature_area','settings',$name),op_get_var($options,'mod_options',array()),true);
				}
				$html .= '
			<form action="#" id="feature_area_'.$name.'" class="op-feature-area">
				<div class="op-lightbox-content contains-module-'.$options['module'].'">
					'.$out.'
					<input type="hidden" name="option" value="'.$name.'" />
					<input type="hidden" name="action" value="'.OP_SN.'-live-editor-update-feature" />
					<input type="hidden" name="page_id" value="'.OP_PAGEBUILDER_ID.'" />
					'.wp_nonce_field( 'op_liveeditor_feature_'.$name, 'op_liveeditor_feature_'.$name, false, false ).'
				</div>
				<div class="op-insert-button cf">
					<button type="submit" class="editor-button"><span>'.__('Update Feature', 'optimizepress').'</span></button>
				</div>
			</form>';
			}
		}
		return $html;
	}

	function load_feature($enabled=false){
		$GLOBALS['op_feature_enabled'] = $enabled;
	}

	function save_features(){
		//opLog('POST: ' . print_r($_POST, true));
		//opLog('OPTIONS :' . print_r($this->options, true));
		$font_options = op_page_option('feature_area','settings','font_options');
		if(!is_array($font_options)){
			$font_options = array();
		}
		if($this->enabled && count($this->options) > 0){
			foreach($this->options as $name => $options){
				if($name == 'template'){
					continue;
				}
				$op = op_post('feature_area',$name);
				$mod_options = op_get_var($options,'mod_options',array());
				$module = op_mod($options['module'],op_get_var($options,'module_type','blog'))->save_settings(array('feature_area',$name),$mod_options,$op,true,true);
				if($options['module'] == 'content_fields'){
					if(isset($module[0])){
						$font_options[$name] = $module[1];
						$module = $module[0];
					}
				}
				op_update_page_option('feature_area','settings',$name,$module);
			}
		}
		op_update_page_option('feature_area','settings','font_options',$font_options);
	}


	/* Default Content Templates */


	function content_fields($fields,$values){
		$fonts = array();
		if(isset($values[0])){
			$fonts = $values[1];
			$values = $values[0];
		}
		$html = '';
		$fields = $fields['fields'];
		foreach($fields as $name => $settings){
			$font_str = op_font_style_str(op_get_var($fonts,$name,array()));
			if($font_str != ''){
				$font_str = ' style=\''.$font_str.'\'';
			}
			$value = op_get_var($values,$name);
			$type = op_get_var($settings,'type');
			if($type == 'textarea' || $type == 'wysiwyg'){
				$GLOBALS['OP_LIVEEDITOR_FONT_STR'] = array('elements' => array('p','a'), 'style_str' => $font_str);
				$value = do_shortcode(wpautop($value));
				$value = op_process_asset_content($value);
			} elseif($type == 'image'){
				$value = '<img src="'.$value.'" alt="" />';
			}
			$values[$name] = $value;
			if(empty($value)){
				continue;
			}
			if($name == 'title'){
				$el1 = op_get_var($settings,'element','h2');
				$value = '<'.$el1.$font_str.'>'.$value.'</'.$el1.'>';
			} elseif($name == 'subtitle'){
				$el2 = op_get_var($settings,'element','h3');
				$value = '<'.$el2.$font_str.'>'.$value.'</'.$el2.'>';
			} elseif($name == 'link_url'){
				$value = '';
			} elseif($name == 'submit_button'){
				$value =  '<a class="button-style-2 button-style-2-orange button-style-2-large" href="'.$values['link_url'].'"><span>'.$value.'</span></a>';
			} elseif($name == 'image' && $type != 'image'){
				$value = '<img src="'.$value.'" alt="" />';
			}
			if(isset($settings['wrap'])){
				$html .= sprintf($settings['wrap'],$value);
			} else {
				$html .= $value;
			}
		}
		return $html;
	}

	function optin_box($options,$values,$output,$tpl='',$wrap_elems=array()){
		if(!isset($options['submit_button_config'])){
			$options['submit_button_config'] = array();
		}
		if(!isset($options['submit_button_config']['default_button'])){
			$options['submit_button_config']['default_button'] = '<button class="button-style-2 button-style-2-orange" type="submit"><span>%1$s</span></button>';
		}
		return op_optin_box($options,$values,$output,$tpl,$wrap_elems);
	}

	function video_placeholder($options,$output,$settings=array()){
		if(!is_admin()){
			return $output['output'];
		}
		if(count($settings) == 0){
			$settings = array(
				'width' => $options['values']['width'],
				'height' => $options['values']['height'],
			);
		}
		if(empty($settings['width'])){
			$settings['width'] = $options['values']['width'];
		}
		if(empty($settings['height'])){
			$settings['height'] = $options['values']['height'];
		}
		$output = '<div class="video-plugin" style="width:'.$settings['width'].'px;height:'.$settings['height'].'px"></div>';
		return $output;
	}

	/**
	 * Checks $data['images'] image paths and replaces them with desired path
	 * @author OptimizePress <info@optimizepress.com>
	 * @since 2.1.4
	 * @param  array $data
	 * @param  string $base_path
	 * @return array
	 */
	function fix_image_paths($data, $base_path)
	{
		$search = $replace = array();
		$images = unserialize(base64_decode($data['images']));

		if (count($images) > 0) {

			foreach ($images as $path => $name) {
				$search[] = '{op_filename="'.$path.'"}';
				$replace[] = $base_path . $name;
			}

			$data['layouts'] = base64_encode(serialize($this->replace_op_filename(unserialize(base64_decode($data['layouts'])), $search, $replace)));
		}

		return $data;
	}

	/**
	 * Replaces defined search terms across recursive arrays
	 * @author OptimizePress <info@optimizepress.com>
	 * @since  2.1.4
	 * @param  array $data
	 * @param  array $search
	 * @param  array $replace
	 * @return array
	 */
	function replace_op_filename($data, $search, $replace)
	{
		foreach ($data as $key => $item) {
			if (is_array($item)) {
				$data[$key] = $this->replace_op_filename($item, $search, $replace);
			} elseif (is_string($item) && ! empty($item)) {
				$data[$key] = str_replace($search, $replace, $item);
			}
		}

		return $data;
	}
}
<?php
class OptimizePress_Blog_Feature_Area_Module extends OptimizePress_Modules_Base {

	function display_settings($section_name,$config=array(),$return=false){
		$styles = $this->_get_styles($section_name,$config);
		$content = array();
		foreach($styles as $name => $style){
			$options[$name] = $style['title'];
			$tabs = $tab_content = $modules = array();
			foreach($style['options'] as $option_name => $option){
				$tmp_content = '';
				if(isset($option['action'])){
					$tmp_content = call_user_func_array($option['action'],array($section_name,$config));
				} elseif(isset($option['module'])){
					$tmp_content = op_mod($option['module'])->display_settings(array($section_name,$name,$option_name),op_get_var($option,'mod_options',array()),true);
					$modules[] = $option['module'];
				}
				$tabs[$option_name] = $option['title'];
				$tab_content[$option_name] = $tmp_content;
			}
			$data = array(
				'tabs' => $tabs,
				'tab_content' => $tab_content,
				'module_name' => $modules
			);
			$content[$name] = $this->load_tpl('generic/tabbed_module',$data,false);
		}
		$data = array(
			'section_name' => $section_name,
			'options' => $options,
			'content' => $content
		);
		echo $this->load_tpl('index',$data);
	}

	function save_settings($section_name,$config=array(),$op){
		$styles = $this->_get_styles($section_name,$config);
		$settings = array();
		foreach($styles as $name => $style){
			$cur_op = op_get_var($op,$name,array());
			foreach($style['options'] as $option_name => $option){
				$tmp_content = '';
				if(isset($option['save_action'])){
					$arr[$option_name] = call_user_func_array($option['save_action'],array($section_name,$config));
				} elseif(isset($option['module'])){
					$arr[$option_name] = op_mod($option['module'])->save_settings(array($section_name,$name,$option_name),op_get_var($option,'mod_options',array()),op_get_var($cur_op,$option_name),true);
				}
			}
			$settings[$name] = $arr;
		}
		$settings['type'] = op_get_var($op,'type',key($styles));
		$settings['enabled'] = op_get_enabled($op);
		$this->update_option($section_name,$settings);
	}

	function _get_styles($section_name,$config){
		return apply_filters('op_mod_feature_area_styles',array(),$section_name,$config);
	}


	function output($section_name,$config,$options,$return=false){
		$styles = $this->_get_styles($section_name,$config);
		$type = op_get_var($options,'type');
		$before = op_get_var($config,'before');
		$after = op_get_var($config,'after');

		//If featured area contains load video/audio related JS.
		switch ($options['type']) {
			case 'video_optin':
			case 'video_content':
				op_video_player_script();
				break;
		}

		if(!empty($type) && isset($styles[$type]) && isset($options[$type])){
			$style = $styles[$type];
			if(isset($style['config'])){
				extract($style['config']);
			}
			$options = $options[$type];
			$content_done = $button_done = false;
			$content_options = array();
			array_push($section_name,$type);
			$feature_content = array();
			$used_content = $used_button = '';
			foreach($style['options'] as $option_name => $option){
				$tmp_content = '';
				if(isset($option['display_action'])){
					$tmp_content = call_user_func_array($option['display_action'],array($section_name,$config));
				} elseif(isset($option['module'])){
					$mod_config = op_get_var($option,'mod_options',array());
					$mod_options = op_get_var($options,$option_name,array());
					if(isset($option['use_content']) && isset($style['options'][$option['use_content']])){
						$used_content = $option['use_content'];
						$content_config = op_get_var($style['options'][$option['use_content']],'mod_options',array());
						$content_opts = op_get_var($options,$option['use_content'],array());
						$content_options = op_mod('content_fields')->output(array($section_name,$option['use_content']),$content_config,$content_opts,true);
						$mod_config['content_fields'] = op_get_var($content_config,'fields',array());
						if(isset($mod_config['disable'])){
							$mod_config['disable'] = str_replace('content','',$mod_config['disable']);
						}
						$content_done = true;
						$mod_options['content'] = $content_options;
					}
					if(isset($option['use_button']) && isset($style['options'][$option['use_button']])){
						$used_button = $option['use_button'];
						$button_opts = op_get_var($options,$used_button,array());
						$button_done = true;
						$mod_options['submit_button'] = op_mod('submit_button')->output(array($section_name,$used_button),array(),$button_opts,true);
					}
					if(!($option_name == $used_content && $content_done === true) && !($option_name == $used_button && $button_done === true)){
						$tmp_content = op_mod($option['module'])->output(array($section_name,$option_name),$mod_config,$mod_options,true);
						$content = '';
						if(is_array($tmp_content)){
							if(count($tmp_content) > 0){
								if($option['module'] == 'content_fields'){
									$tmp_content = array('content'=>$tmp_content);
								}
								if(isset($option['template'])){
									if(is_array($option['template'])){
										if(is_object($option['template'][0])){
											if(is_callable($option['template'])){
												$content = call_user_func_array($option['template'],array($tmp_content));
											}
										} else {
											$content = op_tpl($option['template'][0],$tmp_content,$option['template'][1]);
										}
									} else {
										if(is_callable($option['template'])){
											$content = call_user_func_array($option['template'],array($tmp_content));
										} else {
											$content = $this->load_tpl('output/'.$option['template'],$tmp_content);
										}
									}
								} else {
									$content = $this->load_tpl('output/'.$option['module'],$tmp_content);
								}
							}
						} else {
							$content = $tmp_content;
						}
						$feature_content[] = $content;
					}
				}
			}
			$out = $before.implode('',$feature_content).$after;
			if($return){
				return $out;
			}
			echo $out;
		}
	}

}
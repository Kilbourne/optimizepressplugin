<?php
class OptimizePress_Page_Feature_Area extends OptimizePress_Page_Feature_Area_Base {
	
	function __construct(){
		$this->settings = op_page_option('feature_area');
		$this->enabled = (op_get_var($this->settings,'enabled') == 'Y');
		$style = op_get_var($this->settings,'type');
		$style = ($style >= 1 && $style <= 7) ? $style : 1;
		$this->style = $style;
		$this->get_options();
		
		add_filter('op_page_feature_area_launch_selection',array($this,'style_selector'),10,2);
		parent::__construct();
	}
	
	function style_selector($styles,$current){
		$dims = array(
			1 => array(254,94),
			2 => array(254,94),
			3 => array(254,89),
			4 => array(254,92),
			5 => array(254,89),
			6 => array(254,135),
			7 => array(254,135),
		);
		for($i=1;$i<8;$i++){
			$styles[$i] = array(
				'image' => OP_IMG.'previews/feature_areas/launch/launch-funnel-'.$i.'.jpg',
				'width' => $dims[$i][0],
				'height' => $dims[$i][1],
				'input' => '<input type="radio" name="op[feature_area][type]" id="op_layout_feature_area_type_'.$i.'" value="'.$i.'"'.($i==$current? ' checked="checked"':'').' />',
				'li_class' => ($i == $current ? ' img-radio-selected' : ''),
			);
		}
		return $styles;
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
		$styles = array(
			1 => array(
				'video' => array(
					'module' => 'video',
					'mod_options' => $vid_opts,
					'before' => '<div class="fourteen columns">',
					'after' => '</div>',
				),
				'content' => array(
					'module' => 'content_fields',
					'title' => __('Content', 'optimizepress'),
					'mod_options' => array(
						'fields' => array()
					),
					'template' => array($this,'vid_list_1'),
					'before' => '<div class="ten columns">',
					'after' => '</div>',
				),
			),
			2 => array(
				'video' => array(
					'module' => 'video',
					'mod_options' => $vid_opts,
					'before' => '<div class="fourteen columns">',
					'after' => '</div>',
				),
				'content' => array(
					'module' => 'content_fields',
					'mod_options' => array(
						'fields' => array()
					),
					'template' => array($this,'vid_list_2'),
					'before' => '<div class="ten columns">',
					'after' => '</div>',
				),
			),
			3 => array(
				'video' => array(
					'module' => 'video',
					'mod_options' => $vid_opts,
					'before' => '<div class="fourteen columns">',
					'after' => '</div>',
				),
				'content' => array(
					'module' => 'content_fields',
					'mod_options' => array(
						'fields' => array(
							'paragraph' => array(
								'name' => __('Content', 'optimizepress'),
								'help' => __('Enter the content for your feature area', 'optimizepress'),
								'type' => 'wysiwyg',
								'default' => __('Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.', 'optimizepress'),
								'disable_font' => true
							),
						)
					),
					'before' => '<div class="ten columns">',
					'after' => '</div>',
				),
			),
			4 => array(
				'video' => array(
					'module' => 'video',
					'mod_options' => $vid_opts,
					'before' => '<div class="fourteen columns">',
					'after' => '</div>',
				),
				'content' => array(
					'module' => 'content_fields',
					'mod_options' => array(
						'fields' => array()
					),
					'template' => array($this,'vid_list_3'),
					'before' => '<div class="ten columns">',
					'after' => '</div>',
				),
			),
			5 => array(
				'video' => array(
					'module' => 'video',
					'mod_options' => $vid_opts,
					'before' => '<div>',
					'after' => '</div>',
				),
			),
			6 => array(
				'content' => array(
					'module' => 'content_fields',
					'mod_options' => array(
						'fields' => array(
							'subtitle' => array(
								'title' => __('Title', 'optimizepress'),
								'help' => __('Enter the title to be displayed at the top of the content area', 'optimizepress'),
								'default' => __('Launch Videos', 'optimizepress'),
							)
						)
					),
					'before' => '<div class="row cf">
					<div class="twentytwo columns offset-by-one cf">
						<div class="eleven columns alpha">',
					'after' => '
						</div>
						<div class="eleven columns omega">
							<div class="social-buttons">
								<a href="https://twitter.com/share" class="twitter-share-button">Tweet</a>
								<script>!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0];if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src="//platform.twitter.com/widgets.js";fjs.parentNode.insertBefore(js,fjs);}}(document,"script","twitter-wjs");</script>
								<fb:like send="false" width="220" show_faces="false"></fb:like>	
							</div>
						</div>
					</div>
				</div>',
					'template' => array($this,'content_template_fb')
				),
				'video' => array(
					'module' => 'video',
					'mod_options' => array(
						'values' => array(
							'type' => 'video',
							'width' => '860',
							'height' => '470',
						)
					),
					'before' => '
				<div class="row cf">
					<div class="twentytwo offset-by-one columns">',
					'after' => '
					</div>
				</div>',
				),
			),
			7 => array(
				'content_large' => array(
					'module' => 'live_editor',
					'module_type' => 'page',
				)
			)
		);
		//1,6,2,7,3,8,4,9,5,10
		$this->options = isset($styles[$this->style]) ? $styles[$this->style] : array();
		if($this->style != 7){
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
	
	function content_template_fb($fields,$values){
		op_mod('comments')->need_js = true;
		return $this->content_fields($fields,$values);
	}
	
	function vid_list_1(){
		$menu_list = _op_launch_menu_list();
		$str = '
		<h3>'.__('Launch Videos', 'optimizepress').'</h3>
		<ul class="launch-video-list video-list-1">';
		foreach($menu_list as $menu){
			$comments = get_comments_number($menu['page_id']);
			$str .= '<li class="cf'.($menu['selected']?' selected':'').'"><img src="'.$menu['image'].'" /><p>'.($menu['active']?'<a href="'.$menu['link'].'">'.$menu['text'].'</a><br /><a href="'.$menu['link'].'">'.$comments.' '._n('Comment','Comments',$comments).'</a>':$menu['text'].'<br />'.$comments.' '._n('Comment','Comments',$comments)).'</p></li>';
		}
		$str .= '
		</ul>';
		return $str;
	}
	
	function vid_list_2(){
		$menu_list = _op_launch_menu_list();
		$str = '
		<ul class="launch-video-list video-list-2">';
		foreach($menu_list as $menu){
			$comments = get_comments_number($menu['page_id']);
			$str .= '<li class="cf'.($menu['selected']?' selected':'').'"><img src="'.$menu['image'].'" /><p>'.($menu['active']?'<a href="'.$menu['link'].'">'.$menu['text'].'</a><br /><a href="'.$menu['link'].'">'.$comments.' '._n('Comment','Comments',$comments).'</a>':$menu['text'].'<br />'.$comments.' '._n('Comment','Comments',$comments)).'</p></li>';
		}
		$str .= '
		</ul>';
		return $str;
	}
	
	function vid_list_3(){
		$menu_list = _op_launch_menu_list();
		$str = '
		<ul class="video-list video-list-3">';
		foreach($menu_list as $menu){
			$str .= '<li'.($menu['selected']?' class="selected"':'').'>'.($menu['active']?'<a href="'.$menu['link'].'">'.$menu['text'].'</a>':'<span>'.$menu['text'].'</span>').'</li>';
		}
		$str .= '
		</ul>';
		return $str;
	}
	
	function load_feature($enabled = false){
		if(!$this->enabled){
			parent::load_feature();
			return '';
		}
		$classes = array(
			1 => 'featured-panel-1',
			2 => 'featured-panel-2',
			3 => 'featured-panel-3',
			4 => 'featured-panel-4',
			5 => 'featured-panel-5',
			6 => 'featured-panel-6',
			7 => 'featured-panel-7',
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
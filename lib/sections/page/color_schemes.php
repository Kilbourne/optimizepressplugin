<?php
class OptimizePress_Sections_Color_Schemes {

	// Get the list of step 2 sections these can be overridden by the theme using the 'op_edit_sections_brand' filter
	function sections(){
		static $sections;
		if(!isset($sections)){
			$section_names = array(
				//'template' => __('Basic Template Colour Scheme', 'optimizepress'),
				'advanced' => __('Page Colour Settings', 'optimizepress'),
			);
			$sections = array();
			foreach($section_names as $name => $title){
				if(!(op_page_config('disable','color_schemes',$name) === true)){
					$func_name = $name;
					$name = 'color_scheme_'.$name;
					$sections[$name] = array('title' => $title, 'on_off' => false);
					$func = array($this,$func_name);
					if(is_callable($func)){
						$sections[$name]['action'] = $func;
					}
					$func = array($this,'save_'.$func_name);
					if(is_callable($func)){
						$sections[$name]['save_action'] = $func;
					}
				}
			}
			$sections = apply_filters('op_edit_sections_page_color_schemes',$sections);
		}
		return $sections;
	}

	function template(){
		$data = array(
			'previews' => array(),
			'color_scheme_js' => '',
		);
		$schemes = array(
			array('1f282e','182024','34444e','26333a','34444e','182024','1f282e','182024'),
			array('343434','313131','006ea7','005289','006ea7','32638d','343434','313131'),
			array('002f4b','00253a','00466d','003656','004e7b','002439','002f4b','00253a'),
			array('3f3f3f','282828','a82e00','8f2700','c54500','832000','a43300','832100'),
			array('474c45','30352d','487531','4c7b34','6daf4b','335423','474c45','30352d'),
			array('3e3e3e','191919','2e2e2e','191919','282828','121212','3e3e3e','191919'),
			array('454545','3d3d3d','676767','535353','7f7f7f','3b3b3b','454545','3d3d3d'),
			array('1c6460','195855','24817c','20716d','288c87','12413f','1c6460','195855'),
			array('46324f','3f2e48','644871','573e62','664a74','302236','46324f','3f2e48'),
			array('3d4962','333d51','57688a','4a5876','5b6d92','2b3344','3d4962','333d51'),
			array('303948','29313e','3f4b5f','364051','404c61','1e232d','303948','29313e'),
			array('443e36','312e2c','a35800','984a00','cb8b00','914100','443e36','312e2c'),
		);
		$color_schemes = array();
		$count = 1;
		foreach($schemes as $scheme){
			$color_schemes[$count] = array(
				'nav_bar_above' => array(
					'nav_bar_start' => '#'.$scheme[0],
					'nav_bar_end' => '#'.$scheme[1],
				),
				'nav_bar_below' => array(
					'nav_bar_start' => '#'.$scheme[2],
					'nav_bar_end' => '#'.$scheme[3],
				),
				'feature_area' => array(
					'feature_start' => '#'.$scheme[4],
					'feature_end' => '#'.$scheme[5],
				),
				'footer' => array(
					'footer_start' => '#'.$scheme[6],
					'footer_end' => '#'.$scheme[7],
					'text_color' => '#ffffff',
					'link_color' => array(
						'color' => '#ffffff',
					),
					'link_hover_color' => array(
						'color' => '#ffffff',
					)
				),
			);
			$count++;
		}
		$data['color_scheme_js'] = '
<script type="text/javascript">
var OP_Color_Schemes = '.json_encode($color_schemes).'
</script>';
		$current = op_page_option('color_scheme_template');
		for($i=1;$i<13;$i++){
			$li_class = $input_attr = '';
			if($current == $i){
				$li_class = 'img-radio-selected';
				$input_attr = ' checked="checked"';
			}
			$preview = array(
				'image' => OP_IMG.'previews/color_schemes/colourscheme'.($i<10?'0':'').$i.'.jpg',
				'width' => 212,
				'height' => 250,
				'input' => '<input type="radio" name="op[color_scheme_template][template]" id="op_color_scheme_templates_template_'.$i.'" value="'.$i.'"'.$input_attr.' />',
				'li_class' => $li_class
			);
			$data['previews'][] = $preview;
		}
		echo op_load_section('color_schemes/template',$data,'page');
	}

	function save_template($op){
		op_update_page_option('color_scheme_template',op_get_var($op,'template'));
	}

	function _advanced_sections(){
		$type = op_page_option('theme','type');
		$options = array(
			'nav_bar_above' => array(
				'title' => __('Navigation Bar Above Header Colour Options', 'optimizepress'),
				'description' => __('Customize the colour options for your navigation bar above your page header section', 'optimizepress'),
				'elements' => array(
					'nav_bar_start' => array(
						'title' => __('Background (Gradient Start Colour)', 'optimizepress'),
						'description' => __('Choose the start (top) colour for the gradient on your navigation bar. For a solid colour leave the end colour blank', 'optimizepress'),
					),
					'nav_bar_end' => array(
						'title' => __('Background (Gradient End Colour)', 'optimizepress'),
						'description' => __('Choose the end (bottom) colour for the gradient on your navigation bar', 'optimizepress'),
					),
					'nav_bar_hover_start' => array(
						'title' => __('Background Hover (Gradient Start Colour)', 'optimizepress'),
						'description' => __('Choose the hover start (top) colour for the gradient on your main navigation bar. For a solid colour leave the end colour blank', 'optimizepress'),
					),
					'nav_bar_hover_end' => array(
						'title' => __('Background Hover (Gradient End Colour)', 'optimizepress'),
						'description' => __('Choose the hover end (bottom) colour for the gradient on your main navigation bar', 'optimizepress'),
					),
					'nav_bar_bg' => array(
						'title' => __('Dropdown Background', 'optimizepress'),
						'description' => __('Choose the colour foryour dropdown menu.', 'optimizepress'),
					),
					'nav_bar_bg_hover_start' => array(
						'title' => __('Dropdown Background Hover', 'optimizepress'),
						'description' => __('Choose the colour for the background on your dropdown menu.', 'optimizepress'),
					),
					/*'nav_bar_bg_hover_end' => array(
						'title' => __('Header Child Navigation Hover Background Gradient End Colour', 'optimizepress'),
						'description' => __('Choose the background colour for the hover state of child pages in your navigation bar', 'optimizepress'),
					),*/
					'nav_bar_dd_link' => array(
						'title' => __('Dropdown Link Text', 'optimizepress'),
						'description' => __('Choose the colour for the dropdown text links on your navigation bar', 'optimizepress'),
					),
					'nav_bar_dd_hover' => array(
						'title' => __('Dropdown Hover Link Text', 'optimizepress'),
						'description' => __('Choose the hover colour for the dropdown text links on your navigation bar', 'optimizepress'),
					),
					'nav_bar_link' => array(
						'title' => __('Navigation Link Text', 'optimizepress'),
						'description' => __('Choose the colour for the main text links on your navigation bar', 'optimizepress'),
					),
					'nav_bar_hover' => array(
						'title' => __('Navigation Hover Link Text', 'optimizepress'),
						'description' => __('Choose the hover colour for the main text links on your navigation bar', 'optimizepress'),
					)
				)
			),
			'nav_bar_below' => array(
				'title' => __('Navigation Bar Below Header Colour Options', 'optimizepress'),
				'description' => __('Customize the colour options for your navigation bar below your page header section', 'optimizepress'),
				'elements' => array(
					'nav_bar_start' => array(
						'title' => __('Background (Gradient Start Colour)', 'optimizepress'),
						'description' => __('Choose the start (top) colour for the gradient on your navigation bar. For a solid colour leave the end colour blank', 'optimizepress'),
					),
					'nav_bar_end' => array(
						'title' => __('Background (Gradient End Colour)', 'optimizepress'),
						'description' => __('Choose the end (bottom) colour for the gradient on your navigation bar', 'optimizepress'),
					),
					'nav_bar_hover_start' => array(
						'title' => __('Background Hover (Gradient Start Colour)', 'optimizepress'),
						'description' => __('Choose the hover start (top) colour for the gradient on your main navigation bar. For a solid colour leave the end colour blank', 'optimizepress'),
					),
					'nav_bar_hover_end' => array(
						'title' => __('Background Hover (Gradient End Colour)', 'optimizepress'),
						'description' => __('Choose the hover end (bottom) colour for the gradient on your main navigation bar', 'optimizepress'),
					),
					'nav_bar_bg' => array(
						'title' => __('Dropdown Background', 'optimizepress'),
						'description' => __('Choose the colour foryour dropdown menu.', 'optimizepress'),
					),
					'nav_bar_bg_hover_start' => array(
						'title' => __('Dropdown Background Hover', 'optimizepress'),
						'description' => __('Choose the colour for the background on your dropdown menu.', 'optimizepress'),
					),
					/*'nav_bar_bg_hover_end' => array(
						'title' => __('Header Child Navigation Hover Background Gradient End Colour', 'optimizepress'),
						'description' => __('Choose the background colour for the hover state of child pages in your navigation bar', 'optimizepress'),
					),*/
					'nav_bar_dd_link' => array(
						'title' => __('Dropdown Link Text', 'optimizepress'),
						'description' => __('Choose the colour for the dropdown text links on your navigation bar', 'optimizepress'),
					),
					'nav_bar_dd_hover' => array(
						'title' => __('Dropdown Hover Link Text', 'optimizepress'),
						'description' => __('Choose the hover colour for the dropdown text links on your navigation bar', 'optimizepress'),
					),
					'nav_bar_link' => array(
						'title' => __('Navigation Link Text', 'optimizepress'),
						'description' => __('Choose the colour for the main text links on your navigation bar', 'optimizepress'),
					),
					'nav_bar_hover' => array(
						'title' => __('Navigation Hover Link Text', 'optimizepress'),
						'description' => __('Choose the hover colour for the main text links on your navigation bar', 'optimizepress'),
					)
				)
			),
			'nav_bar_alongside' => array(
				'title' => __('Navigation Bar Alongside Logo Colour Options', 'optimizepress'),
				'description' => __('Customize the colour options for your page header section', 'optimizepress'),
				'elements' => array(
					'nav_bar_bg' => array(
						'title' => __('Dropdown Background', 'optimizepress'),
						'description' => __('Choose the  colour for your dropdown menu background.', 'optimizepress'),
					),
					'nav_bar_bg_hover' => array(
						'title' => __('Dropdown Hover Background', 'optimizepress'),
						'description' => __('Choose the background colour for the hover state of child pages in your navigation bar', 'optimizepress'),
					),
					'nav_bar_bg_nav_hover' => array(
						'title' => __('Navigation Hover Background', 'optimizepress'),
						'description' => __('Choose the hover background colour for your main navigation bar (this will be used for the background hover state)', 'optimizepress'),
					),
					'nav_bar_link' => array(
						'title' => __('Navigation Link Text', 'optimizepress'),
						'description' => __('Choose the colour for the main text links on your navigation bar', 'optimizepress'),
					),
					'nav_bar_hover' => array(
						'title' => __('Navigation Hover Link Text', 'optimizepress'),
						'description' => __('Choose the hover colour for the main text links on your navigation bar', 'optimizepress'),
					),
					'nav_bar_dd_link' => array(
						'title' => __('Dropdown Link Text', 'optimizepress'),
						'description' => __('Choose the colour for the dropdown text links on your navigation bar', 'optimizepress'),
					),
					'nav_bar_dd_hover' => array(
						'title' => __('Dropdown Hover Link Text', 'optimizepress'),
						'description' => __('Choose the hover colour for the dropdown text links on your navigation bar', 'optimizepress'),
					)
				)
			),
			'feature_area' => array(
				'title' => __('Feature Area Colour Options', 'optimizepress'),
				'description' => __('Customize the colour options for the feature area on your page', 'optimizepress'),
				'elements' => array(
					'feature_start' => array(
						'title' => __('Feature Area Gradient Start Colour', 'optimizepress'),
						'description' => __('Choose the start (top) colour for the gradient on the feature area of your page', 'optimizepress'),
					),
					'feature_end' => array(
						'title' => __('Feature Area Gradient End Colour', 'optimizepress'),
						'description' => __('Choose the end (bottom) colour for the gradient on the feature area of your page', 'optimizepress'),
					),
					'text_color' => array(
						'title' => __('Feature Area Text Colour', 'optimizepress'),
						'description' => __('Choose the text colour for the feature area content', 'optimizepress'),
					),
					'link_color' => array(
						'title' => __('Feature Area Link Colour', 'optimizepress'),
						'description' => __('Choose the hyperlink colour for the feature area content', 'optimizepress'),
						'text_decoration' => true,
					),
					'link_hover_color' => array(
						'title' => __('Feature Area Link Hover Colour', 'optimizepress'),
						'description' => __('Choose the hyperlink hover colour for the feature area content', 'optimizepress'),
						'text_decoration' => true,
					),
					'bg' => array(
						'title' => __('Feature Area Background Image', 'optimizepress'),
						'description' => __('Choose an image to use as the feature area background', 'optimizepress'),
						'type' => 'image'
					),
					'bg_options' => array(
						'description' => __('Choose how you would like the background image displayed', 'optimizepress'),
						'type' => 'select',
						'values' => array(
						    'center' => __('Center (center your background image in feature area)', 'optimizepress'),
						    'cover' => __('Cover/Stretch (stretch your background image to fit)', 'optimizepress'),
						    'tile_horizontal' => __('Tile Horizontal (tile the background image horizontally)', 'optimizepress'),
						    'tile' => __('Tile (tile the background image horizontally and vertically)', 'optimizepress'),
						)
					)
				),
			)
		);
		if($type != 'launch' && $type != 'landing'){
			$options += array(
				'feature_title' => array(
					'title' => __('Feature Title Colour Options', 'optimizepress'),
					'description' => __('Customize some of the feature title colour options for your page', 'optimizepress'),
					'elements' => array(
						'feature_title_start' => array(
							'title' => __('Feature Title Gradient Start Colour', 'optimizepress'),
							'description' => __('Choose the start (top) colour for the gradient on your feature title', 'optimizepress'),
						),
						'feature_title_end' => array(
							'title' => __('Feature Title Gradient End Colour', 'optimizepress'),
							'description' => __('Choose the end (bottom) colour for the gradient on your feature title', 'optimizepress'),
						),
						'feature_title_text_color' => array(
							'title' => __('Feature Title Text Colour', 'optimizepress'),
							'description' => __('Choose the end (bottom) colour for the gradient on your navigation bar', 'optimizepress'),
						)
					)
				)
			);
		}
		$options += array(
			'footer' => array(
				'title' => __('Footer Colour Options', 'optimizepress'),
				'description' => __('Customize the colour options for the footer area on your page', 'optimizepress'),
				'elements' => array(
					'footer_start' => array(
						'title' => __('Footer Gradient Start Colour', 'optimizepress'),
						'description' => __('Choose the start (top) colour for the gradient of your page footer area', 'optimizepress'),
					),
					'footer_end' => array(
						'title' => __('Footer Gradient End Colour', 'optimizepress'),
						'description' => __('Choose the end (bottom) colour for the gradient of your page footer area', 'optimizepress'),
					),
					'footer_text_color' => array(
						'title' => __('Footer Text Colour', 'optimizepress'),
						'description' => __('Choose the text colour for your page footer area', 'optimizepress')
					),
					'footer_link_color' => array(
						'title' => __('Footer Link Text Colour', 'optimizepress'),
						'description' => __('Choose the hyperlink text colour for your page footer area', 'optimizepress'),
						'text_decoration' => true,
					),
					'footer_link_hover_color' => array(
						'title' => __('Footer Link Hover Text Colour', 'optimizepress'),
						'description' => __('Choose the hyperlink hover text colour for your page footer area', 'optimizepress'),
						'text_decoration' => true,
					)
				),
			),
			'page' => array(
				'title' => __('Overall Page Colour Options', 'optimizepress'),
				'description' => __('Customize some of the overall colour options for your page', 'optimizepress'),
				'elements' => array(
					'repeating_bg' => array(
						'title' => __('Upload a Repeating Background Image', 'optimizepress'),
						'description' => __('This would normally be a gradient. Upload a repeating header background image which will be tiled horizontally on your header. We recommend you use a gradient of your choice which is 1px by 250px', 'optimizepress'),
						'type' => 'image',
					),
					'bg_color' => array(
						'description' => __('or Choose a background colour', 'optimizepress'),
					),
					'link_color' => array(
						'title' => __('Page Hyperlink Colour', 'optimizepress'),
						'description' => __('Select the colour for the main hyperlinks on your page. This will mainly affect hyperlinks in your page content', 'optimizepress'),
						'text_decoration' => true,
					),
					'link_hover_color' => array(
						'title' => __('Page Hyperlink Hover Colour', 'optimizepress'),
						'description' => __('Select the colour for the main hyperlinks on your page. This will mainly affect hyperlinks in your page content', 'optimizepress'),
						'text_decoration' => true,
					)
				),
			),
		);
		$options = apply_filters('op_page_color_options',$options);

		return $options;
	}

	function advanced(){
		echo op_load_section('color_schemes/advanced',array('color_options'=>$this->_advanced_sections()),'page');
	}

	function save_advanced($op){
		$advanced = op_page_option('color_scheme_advanced');
		$advanced = is_array($advanced) ? $advanced : array();

		$typography = op_typography_elements();

		$current_typography = op_page_option('typography');
		if(!is_array($current_typography)){
			$current_typography = op_page_config('default_config','typography');
			if(!is_array($current_typography)){
				$current_typography = array();
			}
		}
		if(!isset($current_typography['color_elements'])){
			$current_typography['color_elements'] = array();
		}

		$elements = array(
			'page' => array(
				'link_color' => 'link_color',
				'link_hover_color' => 'link_hover_color',
			),
			'footer' => array(
				'text_color' => 'footer_text_color',
				'link_color' => 'footer_link_color',
				'link_hover_color' => 'footer_link_hover_color',
			),
			'feature_area' => array(
				'text_color' => 'feature_text_color',
				'link_color' => 'feature_link_color',
				'link_hover_color' => 'feature_link_hover_color'
			)
		);

		$options = $this->_advanced_sections();
		foreach($options as $section => $settings){
			$vals = op_get_var($op,$section,array());
			if(!isset($advanced[$section])){
				$advanced[$section] = array();
			}

			$start_color = '';
			foreach($settings['elements'] as $name => $options){
				$tmp = op_get_var($vals,$name);

				//Check if this is a gradient. If so, and the bottom color is empty, set to first color
				if (strstr($name, '_start')) $start_color = $tmp;
				if (strstr($name, '_end') && empty($tmp)) $tmp = $start_color;

				if(isset($options['text_decoration'])){
					$newtmp = array(
						'color' => op_get_var($tmp,'color'),
						'text_decoration' => op_get_var($tmp,'text_decoration')
					);
				} else {
					$newtmp = $tmp;
				}
				$advanced[$section][$name] = $newtmp;
				if(isset($elements[$section])){
					if(isset($elements[$section][$name])){
						$current_typography['color_elements'][$elements[$section][$name]] = $newtmp;
					}
				}
			}
		}
		op_update_page_option('typography',$current_typography);

		/*$options = array(
			'header' => array('nav_bar_start','nav_bar_end','nav_bar_link'),
			'feature_area' => array('feature_start','feature_end'),
			'footer' => array('footer_start','footer_end'),
			'page' => array('repeating_bg','bg_color','link_color')
		);

		foreach($options as $name => $fields){
			$vals = op_get_var($op,$name,array());
			if(!isset($advanced[$name])){
				$advanced[$name] = array();
			}
			foreach($fields as $f){
				$advanced[$name][$f] = op_get_var($vals,$f);
			}
		}*/


		op_update_page_option('color_scheme_advanced',$advanced);
	}
}
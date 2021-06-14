<?php

class OptimizePress_Page_Options {
	private $_options = array();
	private $_configs = array();
	private $_page_id = null;
	private $_temp_filters = null;
	private $_disabled_filters = null;

	function __construct(){
		if(defined('OP_PAGEBUILDER_ID')){
			$this->_page_id = OP_PAGEBUILDER_ID;
		} elseif(is_admin() && op_get_var($_GET,'page') == OP_SN.'-page-builder' && isset($_GET['page_id'])){
			$this->_page_id = $_GET['page_id'];
		}
	}

	function get($args=array(),$page_id=0){
		if(!$this->_check_args($args,$page_id)){
			return false;
		}
		if(is_array($args[0])){
			$key = array_shift($args[0]);
			if(count($args[0]) == 0){
				array_shift($args);
			}
		} else {
			$key = is_array($args) ? array_shift($args) : $args;
		}
		/*
		 * There was a PHP notice on the line #35 of array to string conversion ($key was an array). It was impossible to me (Luka) to figure out the what
		 * would the correct thing to do is. The issue was with feature_area/optin(2)
		 */
		if (is_array($key)) {
			$key = $key[0];
		}
		$name = '_'.OP_SN.'_'.$key;
		if(!isset($this->_options[$name])){
			if ($page_id == 0) {
				$page_id = $this->_page_id;
			}
			$temp = get_post_meta($page_id, $name, true);
			$this->_options[$name] = mb_unserialize($temp);
		}
		return _op_traverse_array($this->_options[$name],$args);
	}

	function delete($args=array()){
		if(!$this->_check_args($args)){
			return false;
		}
		$name = '_'.OP_SN.'_'.$args[0];
		if(count($args) > 1){
			$key = array_pop($args);
			if($opt = $this->get($args)){
				if(is_array($opt) && isset($opt[$key])){
					unset($opt[$key]);
				}
				array_push($args,$opt);
				$this->update($args);
			}
		} else {
			if(isset($this->_options[$name])){
				unset($this->_options[$name]);
			}
			delete_post_meta($this->_page_id,$name);
		}
	}

	function update($args=array(),$page_id=0){
		if(!$this->_check_args($args,$page_id)){
			return false;
		}

		$name = '_'.OP_SN.'_'.$args[0];
		$val = array_pop($args);
		$cur = $this->get($args,$page_id);
		$update_val = false;
		if(count($args) > 1){
			$option = array_shift($args);
			$options = $this->get(array($option),$page_id);
			$options = $options ? $options : array();
			for($i=0,$al=count($args);$i<$al;$i++){
				$is_array = ($i >= $al-1);
				if(!isset($tmp)){
					$tmp =& $options;
				}
				if(!isset($tmp[$args[$i]])){
					$tmp[$args[$i]] = $is_array ? array() : false;
				}
				$tmp =& $tmp[$args[$i]];
			}
			$tmp = $val;
			$this->_options[$name] = $options;
			$update_val = $options;
		} else {
			$this->_options[$name] = $val;
			$update_val = $val;
		}

		if(isset($update_val)){
			update_post_meta(($page_id > 0 ? $page_id : $this->_page_id),$name,maybe_serialize($update_val));
		}
	}

	function theme_config($args=array()){
		static $page_type;
		if(!isset($page_type)){
			$page_type = $this->get(array('theme','type'));
		}
		if($this->_check_args($args)){
			$found = false;
			$config = array();
			if(is_array($args[0])){
				$key = array_shift($args[0]);
				if(count($args[0]) == 0){
					array_shift($args);
				}
			} else {
				$key = array_shift($args);
			}
			if(!isset($this->_configs[$key])){
				$path = OP_PAGES.$page_type.'/'.$key;
				$theme_url = OP_URL.'pages/'.$page_type.'/'.$key.'/';
				if(file_exists($path.'/config.php')){
					op_textdomain(OP_SN.'_p_'.$key,$path.'/');
					require_once $path.'/config.php';
					$this->_configs[$key] = $config;
					return _op_traverse_array($this->_configs[$key],$args);
				}
			} else {
				return _op_traverse_array($this->_configs[$key],$args);
			}
		}
		return false;
	}

	function _check_args($args=array(),$page_id=0){
		if(is_null($this->_page_id) && $page_id < 1){
			return false;
		}
		if(count($args) == 0){
			return false;
		}
		return true;
	}

	function load_layout($type='body',$array=false,$id='',$class='',$default=array(),$one_col=false){
		global $wpdb;

		// are we trying to get the revision?
		if (isset($_GET['op_revision_id']) && !empty($_GET['op_revision_id']) && is_user_logged_in()) {
			$revisionId = esc_attr($_GET['op_revision_id']);
			$entry = $wpdb->get_var( $wpdb->prepare(
				"SELECT layout FROM `{$wpdb->prefix}optimizepress_post_layouts` WHERE `id` = %d",
				$revisionId
			));
		} else {
			$entry = $wpdb->get_var( $wpdb->prepare(
				"SELECT layout FROM `{$wpdb->prefix}optimizepress_post_layouts` WHERE `post_id` = %d AND `type` = %s AND `status` = 'publish' ORDER BY modified DESC",
				$this->_page_id,
				$type
			));
		}
		$layout = $default;
		if($entry){
			$layout = unserialize(base64_decode($entry));
		}
		if($array){
			return $layout;
		}
		if (('feature_area_liveeditor_above' == $type || 'feature_area_liveeditor_below' == $type) && !is_admin()) {
			$layout = $this->generate_layout($layout, $type, $one_col);
			if (!empty($layout)) {
				return '<div class="row cf"><div class="fixed-width"><div id="'.$id.'" class="'.$class.'"'.(defined('OP_LIVEEDITOR')?' data-layout="'.$type.'" data-one_col="'.($one_col?'Y':'N').'"':'').'>'.$layout.'</div></div></div>';
			}
		} else {
			return '<div id="'.$id.'" class="'.$class.'"'.(defined('OP_LIVEEDITOR')?' data-layout="'.$type.'" data-one_col="'.($one_col?'Y':'N').'"':'').'>'.$this->generate_layout($layout,$type,$one_col).'</div>';
		}
	}

	/**
	 *
	 * Generate inline CSS from array of params for row styling options!
	 * @param object
	 * @return string
	 */
	function generateRowStyle($style)
	{
		// gradient
		if (!isset($style->backgroundImage) || (isset($style->backgroundImage) && null === $style->backgroundImage)) {
			if ((isset($style->backgroundColorStart) && null !== $style->backgroundColorStart) && (isset($style->backgroundColorEnd) && null !== $style->backgroundColorEnd)) {
				$styles['container']['background'][] = $style->backgroundColorStart;
				$styles['container']['background'][] = '-webkit-gradient(linear, left top, left bottom, color-stop(0%, ' . $style->backgroundColorStart . '), color-stop(100%, ' . $style->backgroundColorEnd .'))';
				$styles['container']['background'][] = '-webkit-linear-gradient(top, ' . $style->backgroundColorStart . ' 0%, ' . $style->backgroundColorEnd . ' 100%)';
				$styles['container']['background'][] = '-moz-linear-gradient(top, ' . $style->backgroundColorStart . ' 0%, ' . $style->backgroundColorEnd. ' 100%)';
				$styles['container']['background'][] = '-ms-linear-gradient(top, ' . $style->backgroundColorStart . ' 0%, ' . $style->backgroundColorEnd . ' 100%)';
				$styles['container']['background'][] = '-o-linear-gradient(top, ' . $style->backgroundColorStart . ' 0%, ' . $style->backgroundColorEnd . ' 100%)';
				$styles['container']['background'][] = 'linear-gradient(to bottom, ' . $style->backgroundColorStart . ' 0%, ' . $style->backgroundColorEnd . ' 100%)';
				$styles['container']['filter'] = 'progid:DXImageTransform.Microsoft.gradient(startColorstr=' . $style->backgroundColorStart . ', endColorstr=' . $style->backgroundColorEnd . ', GradientType=0)';
			} else if (isset($style->backgroundColorStart) && null !== $style->backgroundColorStart) {
				$styles['container']['background'][] = $style->backgroundColorStart;
			}
		} else {
			if (isset($style->backgroundPosition)) {
				switch ($style->backgroundPosition) {
					case 'center':
						$styles['container']['background-image'] = $style->backgroundImage;
						$styles['container']['background-repeat'] = 'no-repeat';
						$styles['container']['background-position'] = 'center';
						break;
					case 'cover':
						$styles['container']['background-image'] = $style->backgroundImage;
						$styles['container']['background-repeat'] = 'no-repeat';
						$styles['container']['background-size'] = 'cover';
						break;
					case 'tile_horizontal':
						$styles['container']['background-image'] = $style->backgroundImage;
						$styles['container']['background-repeat'] = 'repeat-x';
						break;
					case 'tile':
						$styles['container']['background-image'] = $style->backgroundImage;
						$styles['container']['background-repeat'] = 'repeat';
						break;
				}
			}
			if (isset($style->backgroundColorStart) && null !== $style->backgroundColorStart) {
				$styles['container']['background-color'] = $style->backgroundColorStart;
			}
		}

		//background parallax
		if (isset($style->backgroundParalax) && null !== $style->backgroundParalax) {
			if ($style->backgroundParalax === true){
				$styles['container']['background-attachment'] = 'fixed';
				$styles['container']['background-position'] = '50% 0';
			} else {
				$styles['container']['background-attachment'] = '';
			}
		}

		// padding top
		if (isset($style->paddingTop) && null !== $style->paddingTop) {
			$styles['container']['padding-top'] = $style->paddingTop . 'px';
		}
		// padding bottom
		if (isset($style->paddingBottom) && null !== $style->paddingBottom) {
			$styles['container']['padding-bottom'] = $style->paddingBottom . 'px';
		}
		// border width
		if (isset($style->borderWidth) && null !== $style->borderWidth) {
			$styles['container']['border-top-width'] = $style->borderWidth . 'px';
			$styles['container']['border-bottom-width'] = $style->borderWidth . 'px';
			$styles['container']['border-style'] = 'solid';
		}
		// border color
		if (isset($style->borderColor) && null !== $style->borderColor) {
			$styles['container']['border-top-color'] = $style->borderColor;
			$styles['container']['border-bottom-color'] = $style->borderColor;
		}

		// border top width
		if (isset($style->borderTopWidth) && null !== $style->borderTopWidth) {
			$styles['container']['border-top-width'] = $style->borderTopWidth . 'px';
			$styles['container']['border-top-style'] = 'solid';
		}

		// border top color
		if (isset($style->borderTopColor) && null !== $style->borderTopColor) {
			$styles['container']['border-top-color'] = $style->borderTopColor;
		}

		// border bottom width
		if (isset($style->borderBottomWidth) && null !== $style->borderBottomWidth) {
			$styles['container']['border-bottom-width'] = $style->borderBottomWidth . 'px';
			$styles['container']['border-bottom-style'] = 'solid';
		}

		// border bottom color
		if (isset($style->borderBottomColor) && null !== $style->borderBottomColor) {
			$styles['container']['border-bottom-color'] = $style->borderBottomColor;
		}

		$style_content = '';
		if (!empty ($styles)) {
			foreach ($styles['container'] as $property => $value) {
				switch ($property) {
					case 'background':
						foreach ($value as $item) {
							$style_content .= $property . ':' . $item . ';';
						}
						break;
					default:
						$style_content .= $property . ':' . $value . ';';
				}
			}
		}

		return $style_content;
	}

	function generateParallaxBackground($style)
	{
		$script = array('selector' => '', 'data-stellar' => '');
		if (isset($style->backgroundParalax) && null !== $style->backgroundParalax && $style->backgroundParalax === true) {
			wp_enqueue_script(OP_SN.'-stellar.js', OP_URL . 'lib/js/jquery/jquery.stellar.min.js', array(OP_SN.'-noconflict-js'), OP_VERSION);
			$script['selector'] = uniqid('bg-parallax-');
			$script['data-stellar'] = 'data-stellar-background-ratio="0.3"';
		}

		return $script;
	}

	function generateRowColorOverlay($style)
	{
		// background color opacity
		if (isset($style->backgroundImageColorOpacity) && null !== $style->backgroundImageColorOpacity) {
			$styles['container']['opacity'] = '0.' . $style->backgroundImageColorOpacity;
		}
		// background image color
		if (isset($style->backgroundImageColor) && null !== $style->backgroundImageColor) {
			$styles['container']['background'] = $style->backgroundImageColor;
		}

		$style_content = '';
		// $style_content = 'position: absolute;width: 100%;height: 100%;top: 0;left: 0;bottom: 0;right: 0;';
		if (!empty ($styles)) {
			foreach ($styles['container'] as $property => $value) {
				$style_content .= $property . ':' . $value . ';';
			}
		}

		if (!empty($style_content)) {
			$style_content = "style='" . $style_content . "' ";
		}

		return $style_content;
	}

	function generateRowChangingColors($options)
	{
		$style = '';
        $markup = '';
        $animationID = 'op_chainge_color_anim_' . op_generate_id();

		if (isset($options->backgroundChangingColorStart) &&
            isset($options->backgroundChangingColorEnd) &&
            isset($options->backgroundChangingColorSpeed)) {

			$style .= 'background-color:' . $options->backgroundChangingColorStart . ';';
            $style .= 'animation: '. $animationID .' '. $options->backgroundChangingColorSpeed .'s infinite alternate;';
            $style .= '-webkit-animation: '. $animationID .' '. $options->backgroundChangingColorSpeed .'s infinite alternate;';

            if (!defined('OP_LIVEEDITOR')) {
                $inner = 'from { background-color: '.$options->backgroundChangingColorStart.'; }
                            to { background-color: '.$options->backgroundChangingColorEnd.'; }';

                $markup = '@keyframes '. $animationID .' { '.$inner.' }';
                $markup .= '@-webkit-keyframes '. $animationID .' ('.$inner.');';
                $markup = '<style>'. $markup .'</style>';
            }
		}

		return (array('style'=>$style,'markup'=>$markup));
	}

	/**
	 * Generate internal CSS for row animate option from Row Option
	 *
	 * @param $style
	 * @return array|void
	 */
	function generateRowAnimation($style)
	{
		if(defined('OP_LIVEEDITOR')) {
			return;
		}
		$element = array('element_class' => '', 'script' => '');
		if(isset($style->extras) && null !== $style->extras) {
			if($style->extras->animationDelay != '') {

				if ($style->extras->animationEffect == '') {
					$style->extras->animationEffect = 'fadeIn';
				}

				wp_enqueue_style('animate.css', OP_URL . 'lib/css/components/animate.min.css', array(), OP_VERSION);
				wp_enqueue_script(OP_SN . 'jquery-waypoints', OP_URL . 'lib/js/jquery/jquery.waypoints.min.js', array(OP_SN.'-noconflict-js'), OP_VERSION);

				$selector = uniqid('anim-row-');
				$element['element_class'] = 'to-be-animated-row ' . $selector;

				$delay = ($style->extras->animationDelay !== '') ? $style->extras->animationDelay : '0';
				$animationEffect = ($style->extras->animationEffect !== '') ? $style->extras->animationEffect : 'fadeIn';

				$temp = explode("_", $style->elementId);
				$script = '<script id="row-animation-' . $temp[3] . '">
                    ;(function ($) {
                        $(window).load(function() {
                            var element = $("#le_body_row_' . $temp[3] . '");

                            setTimeout(function(){
                                $(".' . $selector . '").removeClass("to-be-animated-row").addClass(" animated ' . $animationEffect . '");
                                var scripts = $(".' . $selector . '").nextAll().find($(\'script[id^="scroll-fix-row-"]\'));
                                if (scripts.length > 0){
                                    $.each(scripts, function( index, value ) {
                                        var rowNumber = value.getAttribute("id").split("-")[3]
                                        OptimizePress["row_" + rowNumber + "_fixPosition"] += $(".' . $selector . '").outerHeight();
                                    });
                                }
                                if($(\'.row\').is(\'[class*="bg-parallax"]\')){
                                    $.stellar("refresh");
                                }
                            },' . $delay * 1000 . ');
                        });
                    }(opjq));
                </script>';
				$element['script'] = $script;
			}
		}

		return $element;
	}

	/**
	 * Generate javascript code for fixing row when scroll to it depending on chosen value from select box.
	 * @param $data
	 * @return array|void
	 */
	function generateScrollFixedRow($data){
		if(defined('OP_LIVEEDITOR')) {
			return;
		}

		$script = array('selector' => '', 'javascript' => '');

		//Disable fixed row for mobile checkbox
		$disableForMobile = "false";
		if (isset($data->rowScrollFixedMobile) && null !== $data->rowScrollFixedMobile && $data->rowScrollFixedMobile === true) {
			$disableForMobile = "true";
		}

		if(isset($data->rowScrollFixedPosition) && null !== $data->rowScrollFixedPosition && $data->rowScrollFixedPosition !== '' && $data->rowScrollFixedPosition !== 'none') {
			$script['selector'] = uniqid('scroll-fix-row-');
			$temp = explode("_", $data->elementId);
			switch ($data->rowScrollFixedPosition){
				case 'top':
					$script['javascript'] = '<script id="scroll-fix-row-'.$temp[3].'">
                        ;(function ($) {
                        	var disableForMobile = '.$disableForMobile.';

                            $(window).on("load", function() {
                             	if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) && disableForMobile == true) {
                             		return;
                             	}

                                OptimizePress.row_' . $temp[3] . '_fixPosition = $(".'. $script['selector'] . '").offset().top;
                                var topPosition = 0;

                                if($("body").hasClass("admin-bar") && $(window).width() > 600){
                                    topPosition = 32;
                                }

                                $(window).on("scroll", function () {
                                    var fixedRowHeight = $(".'. $script["selector"] .'").outerHeight();
                                    var currentScroll = $(window).scrollTop();

                                    if (currentScroll >= OptimizePress.row_' . $temp[3] . '_fixPosition) {
                                        $("#le_body_row_' . (((int) $temp[3]) + 1) . '").css({"margin-top": fixedRowHeight});
                                        $(".'. $script['selector'] . '").css({
                                            position: "fixed",
                                            top: topPosition,
                                            left: 0,
                                            right: 0,
                                            zIndex: "100"
                                        });
                                    } else {
                                        $("#le_body_row_' . (((int) $temp[3]) + 1) . '").css({"margin-top": "0"});
                                        $(".'. $script['selector'] . '").css({
                                                position: "relative",
                                                top: "0",
                                                zIndex: ""
                                        });
                                    }
                                });

                                $(window).on("resize", function(){
                                    if($(window).width() < 600){
                                        topPosition = 0;
                                    } else {
                                        if($("body").hasClass("admin-bar")){
                                            topPosition = 32;
                                        } else {
                                            topPosition = 0;
                                        }
                                    }
                                    OptimizePress.row_' . $temp[3] . '_fixPosition = $(".'. $script['selector'] . '").offset().top;
                                });
                            });
                        }(opjq));
                                </script>';
					break;
				case 'bottom':
					$script['javascript'] = '<script id="scroll-fix-row-'.$temp[3].'">
                        ;(function ($) {
                            $(window).on("load", function() {
                            	var disableForMobile = '.$disableForMobile.';
                            	if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) && disableForMobile == true) {
                             		return;
                             	}
                                OptimizePress.row_' . $temp[3] . '_fixPosition = $(".'. $script['selector'] . '").offset().top + $(".'. $script['selector'] . '").outerHeight();
                                var fixedRowHeight = $(".'. $script["selector"] .'").outerHeight(),
									viewportHeight = $(window).height();

								if (viewportHeight > OptimizePress.row_' . $temp[3] . '_fixPosition) {
									return;
								}

                                $(window).on("scroll", function () {
                                    var currentScroll = $(window).scrollTop() + $(window).height();

                                    if (currentScroll >= OptimizePress.row_' . $temp[3] . '_fixPosition) {
                                        $(".'. $script['selector'] . '").css({
                                            position: "fixed",
                                            bottom: 0,
                                            width: "100%",
                                            zIndex: "100",
                                            marginBottom: "0"
                                        });
                                        if (document.documentElement.clientHeight + $(document).scrollTop() >= document.body.offsetHeight ){
                                            $(".'. $script['selector'] . '").css({
                                                bottom: -fixedRowHeight,
                                            });
                                        }
                                    } else {
                                        $(".'. $script['selector'] . '").css({
                                                position: "static",
                                                width: "100%"
                                        });
                                    }
                                });

                                $(window).on("resize", function(){
                                    OptimizePress.row_' . $temp[3] . '_fixPosition = $(".'. $script['selector'] . '").offset().top;
                                });
                            });
                        }(opjq));
                    </script>';
					break;
				default:
					break;
			}
		}

		return $script;
	}

	function generate_layout($layout,$type,$one_col=false)
	{
		if (is_404()) {
			wp_redirect(home_url().'/prtctd');exit;
		}
		$this->remove_disabled_filters();
		// initializing variables to deal with Undefined variable notices
		$popup_data_fade = $popup_button_class = '';

		// initializing some variables
		$after_element = '';
		$subcol_start = '';
		$subcol_end = '';

		$row_start = $row_end = $element_start = $element_end = $col_start = $col_end = '';
		$measures = array(
			'split-half' => 0.5,
			'split-one-third' => 0.33,
			'split-two-thirds' => 0.66,
			'split-one-fourth' => 0.25,
			'split-three-fourths' => 0.75
		);
		if(defined('OP_LIVEEDITOR')){
			if($one_col && count($layout) == 0){
				$layout = array(
					array(
						'row_class' => 'row one-col cf ui-sortable',
						'columns' => array(
							array(
								'col_class' => 'one column cols',
								'elements' => array()
							)
						),
						'children' => array(
							array(
								'col_class' => 'one column cols',
								'elements' => array()
							)
						),
					)
				);
			}
			$row_start = (
			$one_col ? '' : '<div class="op-row-links">
                        <div class="op-row-links-content">
                            <a title="' . __('Copy Row', 'optimizepress') . '" href="#copy-row" class="copy-row"></a>
                            <a title="' . __('Edit Row Options', 'optimizepress') . '" href="#options" class="edit-row" id="row_options"></a>
                            <a title="' . __('Clone Row', 'optimizepress') . '" href="#clone-row" class="clone-row"></a>
                            <a href="#add-new-row" class="add-new-row"><span>' . __('Add New Row', 'optimizepress') . '</span></a>
                            <a title="' . __('Move Row', 'optimizepress') . '" href="#move" class="move-row"></a>
                            <a title="' . __('Paste Row', 'optimizepress') . '" href="#paste-row" class="paste-row"></a>
                            <a title="' . __('Delete Row', 'optimizepress') . '" href="#delete-row" class="delete-row"></a>
                        </div>
                    </div>');
			$row_end = '';
			$col_start = $subcol_start = '';//<div class="op-col-links"><a class="move-col" href="#move"><img alt="'.__('Move', 'optimizepress').'" src="'.OP_IMG.'move-icon.png" /></a></div>';
			$col_end = '<div class="element-container sort-disabled"></div>
                <div class="add-element-container">
                    <a href="#add_element" class="add-new-element">
                        <span>' . __('Add Element', 'optimizepress') . '</span>
                    </a>
                </div>';
			$element_start = '<div class="op-element-links">' .
			                 '<a class="element-settings" href="#settings">' . __('Edit Element', 'optimizepress') . '</a>' .
			                 '<a class="element-clone" href="#clone-element">' . esc_attr__('Clone Element', 'optimizepress') . '</a>' .
			                 '<a class="element-advanced" href="#op-le-advanced">' . __('Advanced Element Options', 'optimizepress') . '</a>' .
			                 '<a class="element-move" href="#move">' . __('Move', 'optimizepress') . '</a>' .
			                 '<a class="element-delete" href="#delete">' . __('Remove Element', 'optimizepress') . '</a>' .
			                 '</div>
                <div class="op-hidden op-waiting">
                    <img class="op-bsw-waiting op-show-waiting" alt="" src="images/wpspin_light.gif" />
                </div>';
			$element_end = '<div class="op-hidden"><textarea class="op-le-shortcode" name="shortcode[]">{element_str}</textarea></div>';
			$after_element = '<div class="element-container sort-disabled"></div>
                <div class="add-element-container">
                    <a href="#add_element" class="add-new-element">
                        <span>' . __('Add Element', 'optimizepress') . '</span>
                    </a>
                </div>';
		}
		$html = '';
		$pref = 'le_'.$type.'_row_';
		$rcounter = 1;
		$le = defined('OP_LIVEEDITOR');
		$clear = '';
		//check for default wordpress password protection
		global $post;
		if (!$le && isset($post->ID) && post_password_required($post->ID)) {
			$html .= '<div class="row one-column cf ui-sortable"><div class="fixed-width">';
			$html .= get_the_password_form();
		} else {
			foreach($layout as $row){
				// generating new styles from row_data_styles!!!
				$colorOverlay = '';
				$sectionSeparatorStyle = '';
				$colorChangingRows['markup'] = '';
				if (!empty($row['row_data_style'])) {
					$rowStyle = base64_decode($row['row_data_style']);
					$rowStyle = json_decode($rowStyle);
					$colorChangingRows = $this->generateRowChangingColors($rowStyle);
					$row_style = "style='" . $this->generateRowStyle($rowStyle) . $colorChangingRows['style'] . "' ";
					$colorOverlayStyle = $this->generateRowColorOverlay($rowStyle);
					if ($colorOverlayStyle !== '') {
						$colorOverlay = '<div '.$colorOverlayStyle.' class="op-row-image-color-overlay"></div>';
					}
					$rowAnimate = $this->generateRowAnimation($rowStyle);
					$parallax = $this->generateParallaxBackground($rowStyle);
					$scrollFixedRow = $this->generateScrollFixedRow($rowStyle);
					if(property_exists($rowStyle, "sectionSeparatorStyle")){
						$sectionSeparatorStyle = $rowStyle->sectionSeparatorStyle;
					}
				} else {
					$row_style = '';
					$rowStyle = '';
					$rowAnimate = array('script' => '', 'element_class' => '');
					$parallax = array('selector' => '', 'javascript' => '', 'data-stellar' => '');
					$scrollFixedRow = array('selector' => '', 'javascript' => '');
				}

				if (!isset($row['row_data_style'])) {
					$row['row_data_style'] = '';
				}

				if (isset($rowStyle->codeBefore) and !empty($rowStyle->codeBefore)) {
					if ($le) {
						$html .= '<op-row-before class="op-row-code-before">'.htmlentities($rowStyle->codeBefore).'</op-row-before>';
					} else {
						$html .= $rowStyle->codeBefore;
						// $html .= do_shortcode($rowStyle->codeBefore);
					}
				}

				$html .= $sectionSeparatorStyle . '<div ' . $row_style . ' class="' . $row['row_class'] . ' ' . $rowAnimate['element_class'] . ' ' . $parallax['selector'] . ' ' . $scrollFixedRow['selector'] . '" id="' . $pref . $rcounter . '"' . $parallax['data-stellar'] . ' data-style="' . $row['row_data_style'] . '">';
				$html .= $colorChangingRows['markup'];
				$html .= $rowAnimate['script'];
				$html .= $scrollFixedRow['javascript'];
				$html .= apply_filters('op_inside_row', $rowStyle);
				$html .= ''. $colorOverlay . '<div class="fixed-width">' . $row_start;

				$ccounter = 1;
				foreach($row['children'] as $col) {
					//do we split or not
					switch ($col['col_class']) {
						case 'one-half column cols':
						case 'two-thirds column cols':
						case 'two-fourths column cols':
						case 'three-fourths column cols':
						case 'three-fifths column cols':
						case 'four-fifths column cols':
							$td = substr($col['col_class'], 0, -12);
							$splitColumns = '<a href="#' . $td . '" class="split-column"></a>';
							break;
						default:
							$splitColumns = '';
							break;
					}
					if (is_admin()) {
						$col_end = '<div class="element-container sort-disabled"></div>
                            <div class="add-element-container">' .
						           $splitColumns .
						           '<a href="#add_element" class="add-new-element"><span>' . __('Add Element', 'optimizepress') . '</span></a>
                            </div>';
					}
					$html .= '<div class="' . $col['col_class'] . '" id="' . $pref . $rcounter . '_col_' . $ccounter . '">' . $col_start;

					if (!empty($col['children']) and count($col['children'])) {
						$ecounter = 1;
						$elNumber = 1;
						$subcolNumber = 100;
						$subcolumn = false;
						$nrChildren = count($col['children']);
						$previous = '';
						$subcounter = 0;
						$fullWidth = 0;
						foreach($col['children'] as $child) {
							$flag = false;
							if ($child['type'] != $previous && $previous != '') {
								$flag = true;
							}
							if ($ecounter == $nrChildren && $subcolumn === true && $child['type'] != 'element') {
								$clear .= '<div class="clearcol"></div>';
								$subcolumn = false;
							} else {
								$clear = '';
							}
							switch ($child['type']) {
								case 'element':
									if ($subcolumn === true) {
										$html .= '<div class="clearcol"></div>';
										$subcolumn = false;
										$flag = false;
									}
									$GLOBALS['OP_LIVEEDITOR_DEPTH'] = 0;
									$GLOBALS['OP_PARSED_SHORTCODE'] = '';
									$GLOBALS['OP_LIVEEDITOR_FONT_STR'] = array();
									$GLOBALS['OP_LIVEEDITOR_DISABLE_NEW'] = false;
									$sc = op_fix_embed_url_shortcodes(stripslashes($child['object']));

									// removing new line before shortcode entered in content
									// commented out if() was for testing - custom html element is not behaving properly with this on
									// if (strpos($sc, '[custom_html') === false) {
									$sc = str_replace(array("\n[", "\r[", "\r\n[", "\n\r["), array("[", "[", "[", "["), $sc);
									// }

									$child = apply_filters('op_element_advanced_options', $child);

									// getting and processing before and after elements
									$elemBefore = '';
									$elemAfter = '';
									if (empty($child['element_class'])) {
										$elClass = 'element-container cf';
									} else {
										$elClass = $child['element_class'];
									}
									if (!empty($child['element_data_style'])) {
										$elementStyle = base64_decode($child['element_data_style']);
										$elementStyle = json_decode($elementStyle);
										if (!empty($elementStyle->codeBefore)) {
											$elemBefore = $elementStyle->codeBefore;
										}
										if (!empty($elementStyle->codeAfter)) {
											$elemAfter = $elementStyle->codeAfter;
										}
										if (!empty($elementStyle->fadeIn)) {
											$data_fade = ' data-fade="' . $elementStyle->fadeIn . '" style="display:none;" ';
										} else {
											$data_fade = ' ';
										}
										$elementDataStyle = $child['element_data_style'];
									} else {
										$elemBefore = ' ';
										$elemAfter = ' ';
										$data_fade = ' ';
										$elementDataStyle = '';
									}

									if (strpos($sc, '[op_popup ') !== false) {
										$op_popup_present = true;
									} else {
										$op_popup_present = false;
									}

									// $html .= '<div class="'.$elClass.'"'.$data_fade.'data-style="'.$elementDataStyle.'" id="'.$pref.$rcounter.'_col_'.$ccounter.'_el_'.$elNumber.'">'.$element_start;
									$new_element_start = $element_start;
									if(preg_match('/'.op_shortcode_regex('op_liveeditor_elements').'/s',$sc,$matches) || $op_popup_present){

										/* Make sure $matches[0] is set to avoid PHP notices */
										if (!isset($matches[0])) {
											$matches[0] = null;
										}

										$GLOBALS['OP_LIVEEDITOR_DISABLE_NEW'] = true;
										$sc = str_replace($matches[0],'#OP_CHILD_ELEMENTS#', $sc);
										$GLOBALS['OP_LIVEEDITOR_DEPTH'] = 1;

										$child_data = op_page_parse_child_elements($matches[0]);
										$matches[0] = $child_data['liveeditorElements'];
										$processed = op_process_content_filter($sc, true);
										$child_html = op_page_parse_child_row($matches[0]);

										if ($op_popup_present) {

											$new_popup_elements = '';
											$new_popup_elements_sc = '';

											preg_match_all('/\[op_popup_content_element[ d|\]].*?\[\/op_popup_content_element\]/is', $sc, $popup_elements);

											foreach ($popup_elements[0] as $popup_element) {
												$new_popup_elements_sc .= $popup_element;
												preg_match('/data-style="(.*?)"/is', $popup_element, $popup_element_data_style);
												$popup_data_style = op_page_parse_advanced_element_options($popup_element_data_style[1]);

												$popup_element = preg_replace('/\[op_popup_content_element(.*?"?)\]/is', '[op_liveeditor_element$1]', $popup_element);
												$popup_element = str_replace('[/op_popup_content_element]', '[/op_liveeditor_element]', $popup_element);
												$popup_element = op_process_content_filter($popup_element, true);

												$new_popup_elements .= '<div class="element-container op-popup-element-container ' . $popup_data_style['advancedClass'] . $popup_data_style['hideClasses'] . '"' . $popup_data_style['dataFade'] . ' data-popup-child="true">' . $popup_data_style['elemBefore'] . $popup_element . $popup_data_style['elemAfter'] . '</div>';
											}

											//$new_popup_elements = '[op_liveeditor_elements]' . $new_popup_elements . '[/op_liveeditor_elements]';

											$new_popup_elements = '<div class="op-popup-content">' . $new_popup_elements . '</div>';
											$new_popup_elements .= op_process_content_filter('[op_liveeditor_elements][/op_liveeditor_elements]', true);
											$new_popup_elements = str_replace('$', '\$', $new_popup_elements);
											$processed = preg_replace('/\[op_popup_content[ d|\]].*?\[\/op_popup_content\]/is', $new_popup_elements, $sc);

											// Parse op_popup_button
											// preg_match_all('/\[op_popup_button\].*?\[\/op_popup_button\]/is', $sc, $new_popup_button);
											preg_match_all('/\[op_popup_button\].*?\[\/op_popup_button\]/is', str_replace('$', '\$', $sc), $new_popup_button);
											$new_popup_button = $new_popup_button[0][0];
											$new_popup_button = str_replace('[op_popup_button]', '', $new_popup_button);
											$new_popup_button = str_replace('[/op_popup_button]', '', $new_popup_button);
											$new_popup_button = op_process_content_filter($new_popup_button, true);
											$new_popup_button = '<div class="op-popup-button ' . $popup_button_class . '">' . $new_popup_button . '</div>';

											$processed = op_process_content_filter($processed, true);
											$new_popup_button = str_replace('$', '\$', $new_popup_button);
											$processed = preg_replace('/\[op_popup_button\].*?\[\/op_popup_button\]/is', $new_popup_button, $processed);

											// $processed = str_replace('[op_popup_button]', '<div class="op-popup-button ' . $popup_button_class . '">', $processed);
											// $processed = str_replace('[/op_popup_button]', '</div>', $processed);

											// when textarea is added into custom html element insisde overlay optimizer, it breaks the op-hidden textarea
											// this below fixes it (blame Zvonko for any problems)
											// if (false !== strpos($new_popup_elements_sc, 'textarea')) {
											//     $new_popup_elements_sc = htmlentities($new_popup_elements_sc, ENT_QUOTES);
											// }
											$processed .= $le ? '<div class="op-hidden"><textarea class="op-le-child-shortcode" name="shortcode[]">' . op_attr(shortcode_unautop('[op_popup_elements]' . $new_popup_elements_sc . '[/op_popup_elements]')) . '</textarea></div>' : '';

										}

										if (!$op_popup_present) {

											/**
											 * At the end of child elements "add element" button must
											 * be inserted, which is done by parsing [op_liveeditor_elements] shortcode
											 */
											$child_html .= op_process_content_filter('[op_liveeditor_elements][/op_liveeditor_elements]', true);

											$child_html = op_process_asset_content($child_html).($le?'<div class="op-hidden"><textarea class="op-le-child-shortcode" name="shortcode[]">'.op_attr(shortcode_unautop($matches[0])).'</textarea></div>':'');

											/*
											 * $ needs to be escaped
											 */
											$child_html = str_replace('$', '\$', $child_html);
											$processed = preg_replace(array('{<p[^>]*>\s*#OP_CHILD_ELEMENTS#\s*<\/p>}i','{#OP_CHILD_ELEMENTS#}i'),$child_html,$processed);

										}

										if (defined('OP_LIVEEDITOR')) {
											$new_element_start = substr($element_start, 0, 30) . '<a class="element-parent-settings" href="#parent-settings">' . __('Edit Parent Element', 'optimizepress') . '</a>' . substr($element_start, 30);
										}
									} else {
										$processed = op_process_content_filter($sc, true);
									}

									if (strpos($sc, '[op_popup ') !== false && defined('OP_LIVEEDITOR')) {
										$new_element_start = substr($element_start, 0, 30) . '<a class="element-parent-settings" href="#parent-settings">' . __('Edit Parent Element', 'optimizepress') . '</a>' . substr($element_start, 30);
									}

									$html .= '<div class="'.$elClass.'"'.$data_fade.'data-style="'.$elementDataStyle.'" id="'.$pref.$rcounter.'_col_'.$ccounter.'_el_'.$elNumber.'">'.$new_element_start;
									//$html .= $elemBefore .'<div class="element">' . $processed . '</div>' . $elemAfter;

									if (!is_admin()) {
										$content =  do_shortcode($elemBefore . '###OP_ELEM_PROCESSED###' . $elemAfter);
										$content = str_replace('###OP_ELEM_PROCESSED###', $processed, $content);
									} else {
										$content = $elemBefore . $processed . $elemAfter;
									}

									// if (!is_admin() && !$op_popup_present) {
									// $content = do_shortcode($content);
									// }

									$elementNumberClass = (strrpos($content, 'page-listing three-col') !== false) ? ' element-three-col':'';
									$elementNumberClass .= (strrpos($content, 'page-listing four-col') !== false) ? ' element-four-col':'';
									$html .= '<div class="element' . $elementNumberClass .'">' .$content. '</div>';
									if(isset($GLOBALS['OP_PARSED_SHORTCODE']) && !empty($GLOBALS['OP_PARSED_SHORTCODE'])){
										$sc = $GLOBALS['OP_PARSED_SHORTCODE'];
									}
									$html .= str_replace('{element_str}',op_attr($sc),$element_end).'</div>';
									if ($flag && $ecounter < $nrChildren) {
										$html .= $after_element;
									}
									$elNumber++;
									$previous = 'element';
									break;
								case 'subcolumn':
									if ($previous == '') {
										$html .= $after_element;
									}
									if ($flag == true) {
										$html .= $after_element;
									}
									$temp = explode(' ', $child['subcol_class']);
									if (!$flag && ($fullWidth == 1 || $fullWidth == 0.99)) {
										$html .= '<div class="clearcol"></div>' . $after_element;
										$fullWidth = 0;
									}
									$subcolumn = true;
									$html .= '<div class="'.$child['subcol_class'].'" id="'.$pref.$rcounter.'_col_'.$subcolNumber.'">'.$subcol_start;
									if (!empty($child['children']) and count($child['children']) > 0) {
										//elements
										$elNumber = 1;
										foreach ($child['children'] as $kid) {
											$GLOBALS['OP_LIVEEDITOR_DEPTH'] = 0;
											$GLOBALS['OP_PARSED_SHORTCODE'] = '';
											$GLOBALS['OP_LIVEEDITOR_FONT_STR'] = array();
											$GLOBALS['OP_LIVEEDITOR_DISABLE_NEW'] = false;
											$sc = op_fix_embed_url_shortcodes(stripslashes($kid['object']));
											// removing new line before shortcode entered in content
											$sc = str_replace(array("\n[", "\r[", "\r\n[", "\n\r["), array("[", "[", "[", "["), $sc);

											$kid = apply_filters('op_element_advanced_options', $kid);
											// getting and processing before and after elements
											$elemBefore = '';
											$elemAfter = '';
											if (empty($kid['element_class'])) {
												$elClass = 'element-container cf';
											} else {
												$elClass = $kid['element_class'];
											}

											$kidElementDataStyle = $kid['element_data_style'];
											$elementDataStyle = op_page_parse_advanced_element_options($kid['element_data_style']);

											if (strpos($sc, '[op_popup ') !== false) {
												$op_popup_present = true;
											} else {
												$op_popup_present = false;
											}

											// $html .= '<div class="'.$elClass.'"'.$data_fade.'data-style="'.$elementDataStyle.'" id="'.$pref.$rcounter.'_col_'.$subcolNumber.'_el_'.$elNumber.'">'.$element_start;
											$new_element_start = $element_start;

											if(preg_match('/'.op_shortcode_regex('op_liveeditor_elements').'/s',$sc,$matches) || $op_popup_present){

												$GLOBALS['OP_LIVEEDITOR_DISABLE_NEW'] = true;
												$sc = str_replace($matches[0],'#OP_CHILD_ELEMENTS#',$sc);
												$GLOBALS['OP_LIVEEDITOR_DEPTH'] = 1;

												$child_data = op_page_parse_child_elements($matches[0]);
												$matches[0] = $child_data['liveeditorElements'];
												$processed = op_process_content_filter($sc, true);
												$child_html = op_page_parse_child_row($matches[0]);

												if ($op_popup_present) {

													$new_popup_elements = '';
													$new_popup_elements_sc = '';

													preg_match_all('/\[op_popup_content_element[ d|\]].*?\[\/op_popup_content_element\]/is', $sc, $popup_elements);

													foreach ($popup_elements[0] as $popup_element) {
														$new_popup_elements_sc .= $popup_element;
														// $popup_element = str_replace('[op_popup_content_element]', '[op_liveeditor_element]', $popup_element);
														preg_match('/data-style="(.*?)"/is', $popup_element, $popup_element_data_style);
														$popup_data_style = op_page_parse_advanced_element_options($popup_element_data_style[1]);

														$popup_element = preg_replace('/\[op_popup_content_element(.*?"?)\]/is', '[op_liveeditor_element$1]', $popup_element);
														$popup_element = str_replace('[/op_popup_content_element]', '[/op_liveeditor_element]', $popup_element);
														$popup_element = op_process_content_filter($popup_element, true);

														// $new_popup_elements .= $popup_element;
														$new_popup_elements .= '<div class="element-container op-popup-element-container ' . $popup_data_style['advancedClass'] . $popup_data_style['hideClasses'] . '"' . $popup_data_style['dataFade'] . ' data-popup-child="true">' . $popup_data_style['elemBefore'] . $popup_element . $popup_data_style['elemAfter'] . '</div>';
													}

													$new_popup_elements = str_replace('$', '\$', $new_popup_elements);

													$new_popup_elements = '<div class="op-popup-content">' . $new_popup_elements . '</div>';
													$new_popup_elements .= op_process_content_filter('[op_liveeditor_elements][/op_liveeditor_elements]', true);
													$processed = preg_replace('/\[op_popup_content[ d|\]].*?\[\/op_popup_content\]/is', $new_popup_elements, $sc);

													// Parse op_popup_button
													preg_match_all('/\[op_popup_button\].*?\[\/op_popup_button\]/is', str_replace('$', '\$', $sc), $new_popup_button);
													$new_popup_button = $new_popup_button[0][0];
													$new_popup_button = str_replace('[op_popup_button]', '', $new_popup_button);
													$new_popup_button = str_replace('[/op_popup_button]', '', $new_popup_button);
													$new_popup_button = op_process_content_filter($new_popup_button, true);
													$new_popup_button = '<div class="op-popup-button ' . $popup_button_class . '">' . $new_popup_button . '</div>';

													$processed = op_process_content_filter($processed, true);
													$new_popup_button = str_replace('$', '\$', $new_popup_button);
													$processed = preg_replace('/\[op_popup_button\].*?\[\/op_popup_button\]/is', $new_popup_button, $processed);

													// $processed = str_replace('[op_popup_button]', '<div class="op-popup-button ' . $popup_button_class . '">', $processed);
													// $processed = str_replace('[/op_popup_button]', '</div>', $processed);

													$processed .= $le ? '<div class="op-hidden"><textarea class="op-le-child-shortcode" name="shortcode[]">' . op_attr(shortcode_unautop('[op_popup_elements]' . $new_popup_elements_sc . '[/op_popup_elements]')) . '</textarea></div>' : '';

												}

												if (!$op_popup_present) {

													/**
													 * At the end of child elements "add element" button must
													 * be inserted, which is done by parsing [op_liveeditor_elements] shortcode
													 */
													$child_html .= op_process_content_filter('[op_liveeditor_elements][/op_liveeditor_elements]', true);

													$child_html = op_process_asset_content($child_html).($le?'<div class="op-hidden"><textarea class="op-le-child-shortcode" name="shortcode[]">'.op_attr(shortcode_unautop($matches[0])).'</textarea></div>':'');

													/*
													 * $ needs to be escaped
													 */
													$child_html = str_replace('$', '\$', $child_html);
													$processed = preg_replace(array('{<p[^>]*>\s*#OP_CHILD_ELEMENTS#\s*<\/p>}i','{#OP_CHILD_ELEMENTS#}i'),$child_html,$processed);

												}

												if (defined('OP_LIVEEDITOR')) {
													$new_element_start = substr($element_start, 0, 30) . '<a class="element-parent-settings" href="#parent-settings">' . __('Edit Parent Element', 'optimizepress') . '</a>' . substr($element_start, 30);
												}


											} else {
												// $processed = apply_filters('the_content',$sc);
												$processed = op_process_content_filter($sc, true);
											}

											if (strpos($sc, '[op_popup ') !== false && defined('OP_LIVEEDITOR')) {
												$new_element_start = substr($element_start, 0, 30) . '<a class="element-parent-settings" href="#parent-settings">' . __('Edit Parent Element', 'optimizepress') . '</a>' . substr($element_start, 30);
											}


											$html .= '<div class="' . $elClass . $elementDataStyle['hideClasses'] . '"' . $elementDataStyle['dataFade'] . 'data-style="' . $kidElementDataStyle . '" id="' . $pref . $rcounter . '_col_' . $subcolNumber . '_el_' . $elNumber . '">' . $new_element_start;

											if (!is_admin()) {
												$content = do_shortcode($elementDataStyle['elemBefore'] . '###OP_ELEM_PROCESSED###' . $elementDataStyle['elemAfter']);
												$content = str_replace('###OP_ELEM_PROCESSED###', $processed, $content);
											} else {
												$content = $elementDataStyle['elemBefore'] . $processed . $elementDataStyle['elemAfter'];
											}

											// if (!is_admin()) {
											//     $content = do_shortcode($content);
											// }

											$html .= '<div class="element">' .$content . '</div>';
											if(isset($GLOBALS['OP_PARSED_SHORTCODE']) && !empty($GLOBALS['OP_PARSED_SHORTCODE'])){
												$sc = $GLOBALS['OP_PARSED_SHORTCODE'];
											}
											$html .= str_replace('{element_str}',op_attr($sc),$element_end).'</div>';
											$previous = 'element';
											$elNumber++;
										}
										$html .= $after_element;
										$subcolNumber++;
									} else {
										$html .= $after_element;
									}
									$html .= $subcol_end.'</div>';
									$next = next($child['children']);
									$html .= $clear;
									$previous = 'subcolumn';
									$subcounter++;
									$fullWidth += $measures[$temp[0]];
									break;
							}
							$ecounter++;
						}
					}

					$ccounter++;
					$html .= $col_end . '</div>';
				}
				$html .= $row_end . '</div></div>';

				if (isset($rowStyle->codeAfter) and !empty($rowStyle->codeAfter)) {
					if ($le) {
						$html .= '<op-row-after class="op-row-code-after">'.htmlentities($rowStyle->codeAfter).'</op-row-after>';
					} else {
						$html .= $rowStyle->codeAfter;
						// $html .= do_shortcode($rowStyle->codeAfter);
					}
				}
				$rcounter++;
			} // end row foreach
		} // end else

		$this->revert_disabled_filters();

		// return normal content in LE, but parse shortcodes on frontend to deal with code before and after rows!
		if ($le) {
			return $html;
		} else {
			return do_shortcode($html);
		}

	}

	function remove_disabled_filters()
	{
		global $wp_filter, $wp_version;

		if (null === $this->_temp_filters) {

			// WP 4.7 introduces WP_Hook class which handles hooks on low level a bit differently
			if (class_exists('WP_Hook')) {
				$temp_filters = new WP_Hook;
			} else {
				$temp_filters = array();
			}

			$disabled_filters = $this->get_disabled_filters();

			if (!empty($disabled_filters)) {

				// WP 4.7 introduces WP_Hook class which handles hooks on low level a bit differently
				if (class_exists('WP_Hook')) {
					$the_content_filters = $wp_filter['the_content']->callbacks;
				} else {
					$the_content_filters = $wp_filter['the_content'];
				}

				foreach ($the_content_filters as $priority => $filters) {
					foreach ($filters as $id => $filter) {
						if (is_string($filter['function'])) {
							$name = $filter['function'];
						} else if (is_array($filter['function'])) {
							$name = $filter['function'][1];
						} else {
							continue;
						}

						if ( ! in_array($name, $disabled_filters)) {
							// WP 4.7 introduces WP_Hook class which handles hooks on low level a bit differently
							if (version_compare($wp_version, '4.6.100', '<')) {
								$temp_filters[$priority][$id] = $filter;
							} else {
								$temp_filters->callbacks[$priority][$id] = $filter;
							}
						}
					}
				}

				$this->_temp_filters = $temp_filters;
			} else {
				$this->_temp_filters = $wp_filter['the_content'];
			}

			$temp                       = $wp_filter['the_content'];
			$wp_filter['the_content']   = $this->_temp_filters;
			$this->_temp_filters        = $temp;
		}
	}

	function get_disabled_filters()
	{
		if (null === $this->_disabled_filters) {
			$filters = op_default_option('advanced_filter');

			$disabled = array();
			if (!empty($filters)) {
				foreach ($filters as $key => $filter) {
					if ($filter === '1') {
						$disabled[] = $key;
					}
				}
			}

			$this->_disabled_filters = $disabled;
		}

		return $this->_disabled_filters;
	}

	function revert_disabled_filters()
	{
		global $wp_filter;

		if (null !== $this->_temp_filters) {
			$temp                       = $wp_filter['the_content'];
			$wp_filter['the_content']   = $this->_temp_filters;
			$this->_temp_filters        = $temp;
		}
	}

	function update_layout($layout,$type='body'){
		global $wpdb;

		$table = $wpdb->prefix.'optimizepress_post_layouts';

		$entry = $wpdb->get_row(
			$wpdb->prepare(
				"SELECT * FROM `{$table}` WHERE `post_id` = %d AND `type` = %s AND `status` = 'publish' ORDER BY modified DESC",
				$this->_page_id,
				$type
			)
		);

		// storing the unserialized layout
		$cleanLayout = $layout;
		$layout = base64_encode(serialize($layout));
		if (null == $entry) {
			$wpdb->insert($table,array('post_id' => $this->_page_id, 'type' => $type, 'layout' => $layout, 'modified'  => date('Y-m-d H:i:s')));
			// saving layout to post_content
			$this->saveLayoutToPostContent($this->_page_id, $cleanLayout);
		} else {
			// actually saving only if changes are present
			if ($layout !== $entry->layout) {
				// adding a revision by copying last published entry
				$wpdb->update($table, array('status' => 'revision'), array('id' => $entry->id));
				// creating new published version
				$wpdb->insert($table, array(
					'post_id'   => $entry->post_id,
					'type'      => $type,
					'layout'    => $layout,
					'status'    => 'publish',
					'modified'  => date('Y-m-d H:i:s')
				));
				// saving layout to post_content
				$this->saveLayoutToPostContent($this->_page_id, $cleanLayout);
				// delete obsolete revisions
				$revisions = $wpdb->get_results($wpdb->prepare(
					"SELECT id FROM `{$table}` WHERE `post_id` = %d AND `type` = %s AND status = 'revision' ORDER BY modified",
					$this->_page_id,
					$type
				));

				// delete only if number of revisions is higher than configuration number
				if ($deleteNr = count($revisions) - OP_REVISION_NUMBER > 0) {

					$i = 0;
					foreach ($revisions as $revision) {
						if ($i == $deleteNr) break;
						$wpdb->delete($table, array('id' => $revision->id));
						$i++;
					}
				}
			}
		}
	}

	/**
	 * Saving OP layout to post_content so it can be searched.
	 *
	 * @param $pageId
	 * @param $content
	 */
	function saveLayoutToPostContent($pageId, $content)
	{
		$newPost = array(
			'ID' => $pageId,
			'post_content' => '<!-- OP_SEARCH_GENERATED -->' . op_page_generate_layout($content)
		);

		wp_update_post($newPost);
	}

	function clearSettings()
	{
		global $wpdb;

		$tableName = $wpdb->prefix . 'postmeta';
		$sql = "DELETE FROM $tableName WHERE post_id = ".$this->_page_id." AND meta_key LIKE '_optimizepress_%' AND meta_key != '_optimizepress_pagebuilder'";

		$wpdb->query($sql);
	}

	/**
	 * Removes layouts for current page that aren't updated or created in this cycle
	 * @param  array $types
	 * @return void
	 */
	function clean_layouts($types)
	{
		global $wpdb;

		$tableName = $wpdb->prefix . 'optimizepress_post_layouts';

		/*
		 * If there are types that was created/updated in this cycle we won't delete them
		 */
		if (count($types) > 0) {
			$preparedQuery = sprintf(
				"DELETE FROM %s WHERE type NOT IN ('%s') AND post_id = %d",
				$tableName,
				implode("','", $types),
				$this->_page_id
			);
		} else {
			$preparedQuery = $wpdb->prepare(
				"DELETE FROM $tableName WHERE post_id = %d",
				$this->_page_id
			);
		}
		$wpdb->query($preparedQuery);
	}

	/**
	 * Parses shortcode with child elements and adds advanced options to it
	 *
	 * @param  [string] $liveeditor_elements_sc [liveeditor elements shortcode]
	 * @return array [array] child advanced options
	 */
	function parse_child_elements($liveeditor_elements_sc)
	{
		$childRows = '[op_liveeditor_elements] ';
		preg_match_all('/\[op_liveeditor_element[ d|\]].*?\[\/op_liveeditor_element\]/is', $liveeditor_elements_sc, $children);

		/* Make sure $parsedDataStyle children are defined, to avoid PHP notices */
		$parsedDataStyle = array();
		if (empty($children[0])) {
			$parsedDataStyle = array();
			$parsedDataStyle['elemBefore'] = null;
			$parsedDataStyle['elemAfter'] = null;
			$parsedDataStyle['dataFade'] = null;
			$parsedDataStyle['advancedClass'] = null;
		}
		foreach($children[0] as $child) {
			preg_match('/data-style="(.*?)"{1}/i', $child, $childDataStyle);
			$parsedDataStyle = op_page_parse_advanced_element_options(@$childDataStyle[1]);
			$child = $parsedDataStyle['elemBefore'] . $child . $parsedDataStyle['elemAfter'];
			$childRows .= '<div class="row element-container cf ' . $parsedDataStyle['advancedClass'] . $parsedDataStyle['hideClasses'] . '"' . $parsedDataStyle['dataFade'] . '>' . $child . '</div>';
		}
		$childRows .= '[/op_liveeditor_elements]';

		return array(
			'liveeditorElements' => $childRows,
			'childElemBefore' => $parsedDataStyle['elemBefore'],
			'childElemAfter' => $parsedDataStyle['elemAfter'],
			'childDataFade' => $parsedDataStyle['dataFade'],
			'childAdvancedClass' => $parsedDataStyle['advancedClass']
		);

	}

	/**
	 * Parses encoded element data-style and returns an array with data values
	 * @param  [string] $data_style [data-style base64 encoded string]
	 * @return [array] element attribute values
	 */
	function parse_advanced_element_options($data_style){

		$data_style = base64_decode($data_style);
		$data_style = json_decode($data_style);

		if (!empty($data_style->codeBefore)) {
			$elemBefore = $data_style->codeBefore;
		} else {
			$elemBefore = '';
		}

		if (!empty($data_style->codeAfter)) {
			$elemAfter = $data_style->codeAfter;
		} else {
			$elemAfter = '';
		}

		if (!empty($data_style->fadeIn)) {
			$dataFade = ' data-fade="' . $data_style->fadeIn . '"';

			// We don't want to actually fade the element with delay in liveeditor, only on frontend
			$dataFade .= defined('OP_LIVEEDITOR') ? '' : ' style="display:none;" ';
		} else {
			$dataFade = ' ';
		}

		if (!empty($data_style->advancedClass)) {
			$advancedClass = $data_style->advancedClass;
		} else {
			$advancedClass = '';
		}

		$hideClasses = '';
		if (isset($data_style->hideMobile) && !empty($data_style->hideMobile))  {
			$hideClasses .= ' hide-mobile';
		}
		if (isset($data_style->hideTablet) && !empty($data_style->hideTablet))  {
			$hideClasses .= ' hide-tablet';
		}

		return array(
			'elemBefore' => $elemBefore,
			'elemAfter' => $elemAfter,
			'dataFade' => $dataFade,
			'advancedClass' => $advancedClass,
			'hideClasses' => $hideClasses,
		);
	}

	/**
	 * Parses the child row and returns the html
	 * @param $liveeditor_elements_shortcode
	 * @return string elements html
	 * @internal param string $matches - op_liveeditor_elements shortcode
	 */
	function parse_child_row($liveeditor_elements_shortcode){

		$child_html = '';
		$child_element_nr = 0;

		preg_match_all('/(<div class="row.*>)(.*)\[\/op_liveeditor_element\]/isU', $liveeditor_elements_shortcode, $child_rows_result);
		foreach($child_rows_result[2] as $result_row) {

			// Clean up the current $result_row, because a before element can be present alognside the [op_liveeditor_element]
			preg_match_all('/\[op_liveeditor_element.+$/is', $result_row, $result_row);
			$result_row = $result_row[0][0];

			// Get the elemen data style and parse it (it's later used in html output)
			preg_match_all('/data-style="(.*?)"/is', $result_row, $currentElDataStyle);
			$currentElDataStyle = op_page_parse_advanced_element_options(@$currentElDataStyle[1][0]);

			// Regex extracts only opening op_liveeditor_element shortcode tag, so we need to ad a closing one
			$result_row = $result_row . '[/op_liveeditor_element]';

			$child_html .= $child_rows_result[1][$child_element_nr] . $currentElDataStyle['elemBefore'] .  op_process_content_filter($result_row) . $currentElDataStyle['elemAfter'] . '</div>';

			$child_element_nr += 1;

		}

		return $child_html;

	}

}


function _op_page_func(){
	static $op_ops;
	if(!isset($op_ops)){
		$op_ops = new OptimizePress_Page_Options;
	}
	$args = func_get_args();
	$func = array_shift($args);
	return call_user_func_array(array($op_ops,$func),$args);
}
function op_page_generate_layout($layout=array(),$type='body'){
	return _op_page_func('generate_layout',$layout,$type);
}
function op_page_layout($type='body',$array=false,$id='',$class='',$default=array(),$one_col=false){
	return _op_page_func('load_layout',$type,$array,$id,$class,$default,$one_col);
}
function op_page_update_layout($layout,$type='body'){
	return _op_page_func('update_layout',$layout,$type);
}

function op_page_parse_child_elements($shortcode){
	return _op_page_func('parse_child_elements',$shortcode);
}
function op_page_parse_advanced_element_options($data_style){
	return _op_page_func('parse_advanced_element_options',$data_style);
}
function op_page_parse_child_row($matches){
	return _op_page_func('parse_child_row',$matches);
}
/**
 * Remove layouts that are not used
 * @param  array $types
 * @return void
 */
function op_page_clean_layouts($types)
{
	return _op_page_func('clean_layouts', $types);
}

function op_page_clear_settings()
{
	return _op_page_func('clearSettings');
}
function op_page_option(){
	$args = func_get_args();
	return _op_page_func('get',$args);
}
function op_update_page_option(){
	$args = func_get_args();
	return _op_page_func('update',$args);
}
function op_load_page_config(){
	$args = func_get_args();
	return _op_page_func('theme_config',$args);
}
function op_page_config(){
	static $tpl_dir;
	if(!isset($tpl_dir)){
		$tpl_dir = op_page_option('theme','dir');
	}
	$args = func_get_args();
	array_unshift($args,$tpl_dir);
	return _op_page_func('theme_config',$args);
}

function op_default_page_option(){
	static $tpl_dir;
	if(!isset($tpl_dir)){
		$tpl_dir = op_page_option('theme','dir');
	}
	$args = func_get_args();
	if(($option = _op_page_func('get',$args)) === false){
		array_unshift($args,$tpl_dir,'default_config');
		$option = _op_page_func('theme_config',$args);
	}
	return $option === false ? '' : $option;
}
function op_page_attr(){
	$args = func_get_args();
	return op_attr(call_user_func_array('op_default_page_option',$args));
}
function op_page_attr_e(){
	$args = func_get_args();
	echo op_attr(call_user_func_array('op_default_page_option',$args));
}
function op_delete_page_option(){
	$args = func_get_args();
	return _op_page_func('delete',$args);
}
function op_update_page_id_option($page_id,$args){
	if(!is_array($args)){
		$args = array($args);
	}
	return _op_page_func('update',$args,$page_id);
}
function op_page_id_option($page_id,$args){
	if(!is_array($args)){
		$args = array($args);
	}
	return _op_page_func('get',$args,$page_id);
}
function op_page_set_saved_settings($result,$keep_options=array()){
	$get_layout = true;
	$merge_scripts = false;
	$layout_settings = unserialize(base64_decode($result->settings));
	foreach($keep_options as $keep){
		if($keep == 'content'){
			$get_layout = false;
		} elseif($keep == 'scripts'){
			$merge_scripts = true;
		} elseif($keep == 'color_scheme'){
			if(isset($layout_settings['color_scheme_advanced'])){
				unset($layout_settings['color_scheme_advanced']);
			}
			if(isset($layout_settings['color_scheme_template'])){
				unset($layout_settings['color_scheme_template']);
			}
		} elseif(isset($layout_settings[$keep])){
			unset($layout_settings[$keep]);
		}
	}
	foreach($layout_settings as $option => $settings){
		if(!empty($settings)){
			$settings = unserialize(base64_decode($settings));
			$current = op_page_option($option);
			if($option == 'scripts'){
				if($merge_scripts === true){
					$new_scripts = array();
					$script_opts = array('header','footer','css');
					foreach($script_opts as $opt){
						$cur = op_get_var($current,$opt,array());
						$new = op_get_var($settings,$opt,array());
						foreach($new as $n){
							$cur[] = $n;
						}
						$new_scripts[$opt] = $cur;
					}
					$current = $new_scripts;
				} else {
					$current = $settings;
				}
			} else {
				if(is_array($current) && is_array($settings)){
					$current = array_merge($current,$settings);
				} else {
					$current = $settings;
				}
			}
			op_update_page_option($option,$current);
		}
	}
	if($get_layout === true){
		$layouts = unserialize(base64_decode($result->layouts));
		if (is_array($layouts)) {
			foreach($layouts as $type => $layout){
				op_page_update_layout($layout,$type);
			}
		}
	}
}

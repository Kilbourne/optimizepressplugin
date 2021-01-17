<?php
class OptimizePress_Install {
	//Init notification flags
	var $error = false;
	var $notification = false;

	function __construct(){
		//Add the admin menu
		add_action('admin_menu',array($this,'admin_menu'));
	}

	function admin_menu(){
		//Create the primary OptimizePress admin menu
		$page = add_menu_page('OptimizePress', 'OptimizePress', 'edit_theme_options', OP_SN, array($this,'install_screen'),OP_LIB_URL.'images/op_menu_image16x16.png','30.284567');

		//When loaded we will run the install function
		add_action('load-'.$page, array($this,'run_install'));

		//And load the styles
		add_action('admin_print_styles-'.$page, array($this,'print_styles'));
	}

	function print_styles(){
		//Load the common stylesheet
		wp_enqueue_style(OP_SN.'-admin-common',  OP_CSS.'common'.OP_SCRIPT_DEBUG.'.css', false, OP_VERSION);
	}

	function install_screen(){
		//If we can't get the API key we must inform the user
		if (false === op_sl_get_key()) $this->error = __('API key missing or invalid', 'optimizepress');

		//Set the data array for the template
		$data = array(
			'error' => $this->error,
			'notification' => $this->notification,
		);

		//Load the template
		echo op_tpl('install/index',$data);
	}

	function run_install(){
		//Get the global wordpress database object
		global $wpdb;

		//Make sure we are supposed to be running this function
		if(isset($_POST[OP_SN.'_install'])){
			//Perform security verification
			if(isset($_POST['_wpnonce']) && wp_verify_nonce($_POST['_wpnonce'],'op_install')){
				//Get the OP order number
				$key = trim(op_post('op', 'install', 'order_number'));

				//Register the key and return key status
				$status = op_sl_register($key);

				//If the key is invalid, notify user, otherwise continue
				if (is_wp_error($status)) {
					$this->error = __('API key is invalid. Please re-check it.', 'optimizepress');
				} else {
					//Save the API key
					op_sl_save_key($key);

					//Continue if the product is not already installed
					if (op_get_option('installed') != 'Y') {
						//CReate the Assets table
						$wpdb->query(
							"CREATE TABLE IF NOT EXISTS `{$wpdb->prefix}optimizepress_assets` (
							  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
							  `name` varchar(64) NOT NULL DEFAULT '0',
							  `title` varchar(150) NOT NULL DEFAULT '',
							  `settings` varchar(1) NOT NULL DEFAULT 'N',
							  PRIMARY KEY (`id`)
							);"
						);

						//Create the launch funnel table
						$wpdb->query(
							"CREATE TABLE IF NOT EXISTS `{$wpdb->prefix}optimizepress_launchfunnels` (
								`id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
								`title` varchar(254) NOT NULL DEFAULT '',
								PRIMARY KEY (`id`)
							);"
						);

						//Create the launch funnel pages table
						$wpdb->query(
							"CREATE TABLE IF NOT EXISTS `{$wpdb->prefix}optimizepress_launchfunnels_pages` (
								`funnel_id` bigint(20) unsigned NOT NULL,
								`page_id` bigint(20) unsigned NOT NULL,
								`step` int(10) unsigned NOT NULL
							);"
						);

						//Create the layout categories table
						$wpdb->query(
							"CREATE TABLE IF NOT EXISTS `{$wpdb->prefix}optimizepress_layout_categories` (
								`id` int(10) unsigned NOT NULL AUTO_INCREMENT,
								`name` varchar(255) NOT NULL,
								PRIMARY KEY (`id`)
							);"
						);

						//Create the products table
						$wpdb->query(
							"CREATE TABLE IF NOT EXISTS `{$wpdb->prefix}optimizepress_pb_products` (
							  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
							  `post_id` bigint(20) unsigned NOT NULL,
							  `parent_id` bigint(20) unsigned NOT NULL,
							  `type` varchar(50) NOT NULL DEFAULT '',
							  PRIMARY KEY (`id`)
							);"
						);

						//Create the post layouts table
						$wpdb->query(
							"CREATE TABLE IF NOT EXISTS `{$wpdb->prefix}optimizepress_post_layouts` (
							  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
							  `post_id` bigint(20) unsigned NOT NULL,
							  `type` varchar(255) NOT NULL,
							  `layout` longtext NOT NULL,
							  `status` varchar(20) DEFAULT 'publish' NOT NULL,
							  `modified` datetime DEFAULT NULL,
							  PRIMARY KEY (`id`)
							);"
						);

						//Create the predefined layouts table
						$wpdb->query(
							"CREATE TABLE IF NOT EXISTS `{$wpdb->prefix}optimizepress_predefined_layouts` (
							  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
							  `name` varchar(100) NOT NULL DEFAULT '',
							  `category` int(10) unsigned NOT NULL,
							  `description` text NOT NULL,
							  `preview_ext` varchar(4) NOT NULL DEFAULT '',
							  `layouts` longtext NOT NULL,
							  `settings` longtext NOT NULL,
							  PRIMARY KEY (`id`)
							);"
						);

						//Create the presets table
						$wpdb->query(
							"CREATE TABLE IF NOT EXISTS `{$wpdb->prefix}optimizepress_presets` (
							  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
							  `name` varchar(255) NOT NULL,
							  `layouts` longtext NOT NULL,
							  `settings` longtext NOT NULL,
							  PRIMARY KEY (`id`)
							);"
						);

						//Save the assets
						_op_assets('save_assets');

						//Set the installed flag to Y so the installer doesn't run again
						op_update_option('installed','Y');

                        //Set the blog setup as finished and set template 1 as default
                        op_update_option('theme','dir',1);

						//Ping pong
						if (!wp_next_scheduled('ping_pong')) wp_schedule_event(time(), 'daily', 'ping_pong');

						//Set defaults
						$this->set_defaults();

						// install content templates
						$this->install_content_templates();

						//Redirect to the OptimizePress dashboard
                        wp_redirect(menu_page_url(OP_SN,false));
					} else {
						//Reload
						wp_redirect(menu_page_url(OP_SN,false));
					}
				}

			} else {
				//If the security verification failed, notify the user
				$this->error = __('Verification failed, please refresh the page and try again.', 'optimizepress');
			}
		}
	}

	/**
	 * Install content templates from admin/inc/install_templates folder on first install!
	 * @return void
	 */
	function install_content_templates()
	{
		$version = get_option('optimizepress_content_templates_version');
		if (false === $version) { // first install
			$dirString = OP_ADMIN . '/inc/install_templates';
			$templates_dir = @dir($dirString);
			if($templates_dir){
				while(($file = $templates_dir->read()) !== false){
					if($file != '.' && $file != '..' && $file != 'index.php' && strpos($file, '.') !== 0){
						$dir = $dirString . '/' . $file;
						$this->add_content_templates($dir, $dir, $dir, false, $file);
					}
				}
			}
		}

	}

    function keyExists($array, $keySearch)
    {
        // check if it's even an array
        if (!is_array($array)) return false;

        // key exists
        if (array_key_exists($keySearch, $array)) return true;

        // key isn't in this array, go deeper
        foreach($array as $key => $val)
        {
            // return true if it's found
            if ($this->keyExists($val, $keySearch)) return true;
        }

        return false;
    }

	function add_content_templates($local_destination,$remote_destination,$remote_source,$clear_working, $install=false){
		global $wpdb;

		if(file_exists($local_destination.'/config.php')){
            if (!is_dir(OP_LIB.'content_layouts/working')) mkdir(OP_LIB.'content_layouts/working');
			$config = array();
			include $local_destination.'/config.php';
			$image_file = op_get_var($config,'image');
			$image_url = str_replace(OP_DIR, OP_URL, $local_destination . DIRECTORY_SEPARATOR . $image_file);
			$tmp_image = download_url($image_url);
			$ext = preg_match('/\.([^.]+)$/', $image_file, $matches) ? strtolower($matches[1]) : false;
			if($ext){
				$asset_dest = OP_ASSETS;
				$img_dest = OP_LIB.'images/content_layouts/';
				$images = array();
				$layouts = op_get_var($config,'layouts',array());
				$replace = array();
				$settings = array();
				$downloaded_images = array();
				$new_images = array();
				$replace = array();
				// uploading image as attachment
				if (is_wp_error($tmp_image)) {
					@copy($local_destination . DIRECTORY_SEPARATOR . $image_file, OP_LIB . 'content_layouts/working/' . $image_file);
					$tmp_image = OP_LIB . 'content_layouts/working/' . $image_file;
				}
				$file_array = array(
						'name' => $image_file,
						'tmp_name' => $tmp_image
				);
				$imgId = media_handle_sideload($file_array,0);
				if (!is_wp_error($imgId)) {
					$imageUrl = wp_get_attachment_url($imgId);
				}
				if(isset($config['images'])){
					$images = unserialize(base64_decode($config['images']));
					//error_log(print_r($images, true));
					foreach($images as $path => $file){
						$image_tmp_url = str_replace(OP_DIR, OP_URL, $local_destination . DIRECTORY_SEPARATOR . 'images' . DIRECTORY_SEPARATOR . $file);
						//copy($local_destination . '/images/' . $file, OP_LIB . 'content_layouts/working/' . $file);
						$tmp_file = download_url($image_tmp_url);
						if (!is_wp_error($tmp_file)) {
							$file_array = array(
									'name' => $file,
									'tmp_name' => $tmp_file
							);
							$id = media_handle_sideload($file_array, 0);
							if(!is_wp_error($id)){
								$new_images[$path] = wp_get_attachment_url($id);
								$replace['{op_filename="'.$path.'"}'] = $new_images[$path];
							}
						} else {
                            // if the above broke, let's take another course of action
                            @copy($local_destination . '/images/' . $file, OP_LIB . 'content_layouts/working/' . $file);
                            $tmp_image2 = OP_LIB . 'content_layouts/working/' . $file;
                            $file_array = array(
                                'name' => $file,
                                'tmp_name' => $tmp_image2
                            );
                            $imgId2 = media_handle_sideload($file_array,0);
                            if (!is_wp_error($imgId2)) {
                                $new_images[$path] = wp_get_attachment_url($imgId2);
                                $replace['{op_filename="'.$path.'"}'] = $new_images[$path];
                            }
                        }
					}
				}
				if(isset($config['settings_images'])) {
					$settings_images = unserialize(base64_decode($config['settings_images']));
                    $urls = array();
                    foreach ($settings_images as $path => $conf) {
                        $urls[] = '{op_filename="'.$path.'"}';
                    }
					foreach($settings_images as $path => $conf) {
						foreach($conf as $keys){
							$url_string = '{op_filename="'.$path.'"}';
							$found = false;
							if(isset($new_images[$path])){
								$url = $new_images[$path];
								if(!isset($settings[$keys[0]])){
									$settings[$keys[0]] = unserialize(base64_decode($config['settings'][$keys[0]]));
                                    if ($this->keyExists($settings[$keys[0]], 'script')) {
                                        foreach ($settings[$keys[0]] as $key => $child) {
                                            if (isset($child['script'])) {
                                                $settings[$keys[0]][$key]['script'] = base64_decode($child['script']);
                                                $settings[$keys[0]][$key]['script'] = str_replace($urls, array_values($new_images), $settings[$keys[0]][$key]['script']);
                                                $settings[$keys[0]][$key]['script'] = base64_encode($settings[$keys[0]][$key]['script']);
                                            }
                                        }
                                    }
								}
								$settings = $this->update_array($settings, $keys, $url_string, $url);
							}
						}
					}
				}
				// remove the header link on template install
				if (isset($settings['header_layout']['header_link'])) {
					$settings['header_layout']['header_link'] = '';
				}
				
				foreach($settings as $name => $conf) {
					$settings[$name] = base64_encode(serialize($conf));
				}
				foreach($config['settings'] as $name => $conf){
					if(!isset($settings[$name])){
						$settings[$name] = $conf;
					}
				}
				try {
					$layouts = unserialize(base64_decode($layouts));
				} catch(Exception $e){
					$layouts = array();
				}
				if(count($replace) > 0){
					$find = array_keys($replace);
					$new_layouts = array();
					foreach($layouts as $layout_name => $layout){
						$new_layouts[$layout_name] = array();
						/**/
						foreach($layout as $row){
							$new_row = array(
									'row_class' => $row['row_class'],
									'row_style' => str_replace($find, $replace, $row['row_style']),
									'children' => array(),
							);
							if (!empty($row['row_data_style'])) {
								$temp = base64_decode($row['row_data_style']);
								$temp = str_replace(array_map('addslashes', $find), $replace, $temp);
								$new_row['row_data_style'] = base64_encode($temp);
							} else {
								$new_row['row_data_style'] = '';
							}
							if(isset($row['children']) && count($row['children']) > 0){
								foreach($row['children'] as $col){
									$new_col = array(
											'col_class' => $col['col_class'],
											'children' => array()
									);
									if (!empty($col['children']) && count($col['children']) > 0) {
										foreach ($col['children'] as $child) {
											switch ($child['type']) {
												case 'subcolumn':
													$subcol['type'] = 'subcolumn';
													$subcol['subcol_class'] = $child['subcol_class'];
													$subcol['children'] = array();
													if (!empty($child['children']) && count($child['children']) > 0) {
														$nr = 0;
														foreach ($child['children'] as $kid) {
															$subcol['children'][$nr]['type'] = 'element';
															$subcol['children'][$nr]['object'] = str_replace($find, $replace, $kid['object']);
															$subcol['children'][$nr]['element_class'] = $kid['element_class'];
															$subcol['children'][$nr]['element_data_style'] = $kid['element_data_style'];
															$nr++;
														}
													}
													$new_col['children'][] = $subcol;
													break;
												case 'element':
													$element['type'] = 'element';
													$element['object'] = str_replace($find, $replace, $child['object']);
													$element['element_class'] = $child['element_class'];
													$element['element_data_style'] = $child['element_data_style'];
													$new_col['children'][] =  $element;
													break;
											}
										}
									}
									$new_row['children'][] = $new_col;
								}
							}
							//die(print_r($new_row));
							$new_layouts[$layout_name][] = $new_row;
						}
					}
					$layouts = $new_layouts;
				}
				$category_name = op_get_var($config,'category','General');
				$category = $wpdb->get_var( $wpdb->prepare(
						"SELECT id FROM `{$wpdb->prefix}optimizepress_layout_categories` WHERE `name` = %s",
						$category_name
				));
				if(!$category){
					$wpdb->insert($wpdb->prefix.'optimizepress_layout_categories',array('name'=>$category_name));
					$category = $wpdb->insert_id;
				}
				$insert = array(
						'name' => op_get_var($config,'name'),
						'category' => $category,
						'description' => op_get_var($config,'description') . '|' . $imageUrl,
						'preview_ext' => $ext,
						'layouts' => base64_encode(serialize($layouts)),
						'settings' => base64_encode(serialize($settings)),
				);
				$wpdb->insert($wpdb->prefix.'optimizepress_predefined_layouts',$insert);
				//@copy($local_destination.'/'.$image_file,$img_dest.'/'.$wpdb->insert_id.'.'.$ext);
				update_option('optimizepress_content_templates_version', OP_VERSION);
			} else {
				return new WP_Error('missing_config', $this->strings['missing_config']);
			}
		} else {
			return new WP_Error('missing_config', $this->strings['missing_config']);
		}
	}

	function update_array($options,$args,$replace,$with){
		if(count($args) == 0){
			return false;
		}
		$update_val = false;
		if(count($args) > 1){
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
			$tmp = str_replace($replace,$with,$tmp);
			$update_val = $options;
		}
		if($update_val !== false){
			return $update_val;
		} else {
			return $cur;
		}
	}

	/*
	* Function: set_defaults
	* Description: Sets the site defaults
	* Parameters:
	* 	(None)
	*/
	function set_defaults(){
		//Set the dashboard defaults
		$this->set_dashboard_defaults();

		//Set the typography defaults
		$this->set_typography_defaults();

		// Set the compatibility defaults
		$this->set_compat_defaults();
	}

	/**
	 * Disabling theme JS & CSS files on installation due to large number of compatibility issues reported
	 */
	function set_compat_defaults()
	{
		// We need to disable only for plugin installation
		if (OP_TYPE === 'plugin') {
			op_update_option('op_external_theme_css', 1);
			op_update_option('op_le_external_theme_css', 1);
			op_update_option('op_external_theme_js', 1);
			op_update_option('op_le_external_theme_js', 1);
		}
	}

	/*
	* Function: set_dashboard_defaults
	* Description: Sets the defaults for the Dashboard section, which
	* 	       are the global defaults for the entire site
	* Parameters:
	* 	(None)
	*/
	function set_dashboard_defaults(){
		//First, set the Site Footer defaults by getting the title of the site
		$title = get_bloginfo('name');

		//If thats empty then just use the hostname
		$title = (!empty($title) ? $title : str_replace('/', '', $_SERVER['HTTP_HOST']));

		//Generate the copyright notice
		$site_footer['copyright'] = 'Copyright '.date('Y').' - '.$title.' - All Rights Reserved';

		//Update the site footer settings
		op_update_option('site_footer', $site_footer);
	}

	/*
	* Function: set_typography_defaults
	* Description: Sets the global typography defaults
	* Parameters:
	* 	(None)
	*/
	function set_typography_defaults(){
		//Get the header preferences
		$default_typography = op_default_option('default_typography');
		if (!empty($default_typography)) {
			//Loop through each of them and set the defaults if not set
			foreach($default_typography['font_elements'] as $key=>$cat){
				foreach($cat as $key2=>$pref){
					//Check to see if this value is empty so we can set the default, if needed
					if (empty($pref)){
						//Explode the key so we can see which setting this is for
						$key2_array = explode('_', $key2);

						//Get the setting by seeing what is the last index of the array
						$setting = end($key2_array);

						//Check the last index in the array to see which setting this is for
						switch($setting){
							case 'font':
								$default_typography['font_elements'][$key][$key2] = 'Source Sans Pro, sans-serif';
								break;
							case 'size':
								if ($key=='default') $default_typography['font_elements'][$key][$key2] = 15;
								break;
							/*case 'style':
								$default_typography['font_elements'][$key][$key2] = OP_FONT_STYLE;
								break;
							case 'spacing':
								$default_typography['font_elements'][$key][$key2] = OP_FONT_SPACING;
								break;
							case 'shadow':
								$default_typography['font_elements'][$key][$key2] = OP_FONT_SHADOW;
								break;*/
							case 'color':
								if ($key=='default') $default_typography['font_elements'][$key][$key2] = '###4';
								break;
						}
					}
				}
			}

			//Update the default typography settings
			op_update_option('default_typography', $default_typography);
		}

		//Also check the footer defaults
		$site_footer = op_default_option('site_footer');

		//Set the default font family but only if it is not currently set
		$site_footer['font_family'] = (!empty($site_footer['font_family']) ? 'Source Sans Pro, sans-serif' : '');

		//Update the default footer font settings
		op_update_option('site_footer', $site_footer);
	}
}
new OptimizePress_Install();
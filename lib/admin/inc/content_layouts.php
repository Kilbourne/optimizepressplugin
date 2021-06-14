<?php
$GLOBALS['op_layout_uploaded'] = false;
class OP_Content_Layout_Upgrader extends WP_Upgrader {

	var $result;
	var $bulk = false;
	var $show_before = '';

	function upgrade_strings() {
		$this->strings['downloading_package'] = __('Downloading update from <span class="code">%s</span>&#8230;', 'optimizepress');
		$this->strings['unpack_package'] = __('Unpacking the update&#8230;', 'optimizepress');
		$this->strings['remove_old_failed'] = __('Could not remove the old plugin.', 'optimizepress');
		$this->strings['remove_old'] = __('Removing old content template files.', 'optimizepress');
		$this->strings['process_failed'] = __('Content template update failed.', 'optimizepress');
		$this->strings['process_success'] = __('Content template updated successfully.', 'optimizepress');
	}

	function install_strings() {
		$this->strings['no_package'] = __('Install content template not available.', 'optimizepress');
		$this->strings['downloading_package'] = __('Downloading install package from <span class="code">%s</span>&#8230;', 'optimizepress');
		$this->strings['unpack_package'] = __('Unpacking the package&#8230;', 'optimizepress');
		$this->strings['installing_package'] = __('Installing the content template&#8230;', 'optimizepress');
		$this->strings['process_failed'] = __('Content template install failed.', 'optimizepress');
		$this->strings['process_success'] = __('Content template installed successfully.', 'optimizepress');
		$this->strings['missing_config'] = __('Content template config file is missing.', 'optimizepress');
		$this->strings['missing_image'] = __('Content template thumbnail image is missing.', 'optimizepress');
		$this->strings['remove_old'] = __('Removing old template layout files.', 'optimizepress');
	}

	function install($package) {
		$this->init();
		$this->install_strings();
		global $wp_filesystem;

		//add_filter('upgrader_source_selection', array($this, 'check_package') );
		// $package is the path to zip file, so unzip it
		$destination = OP_LIB.'content_layouts/working';
        if (!is_dir($destination)) mkdir($destination);
		// clear destination
		foreach(new RecursiveIteratorIterator(new RecursiveDirectoryIterator($destination, FilesystemIterator::SKIP_DOTS), RecursiveIteratorIterator::CHILD_FIRST) as $path) {
			$path->isFile() ? unlink($path->getPathname()) : rmdir($path->getPathname());
		}
		if (class_exists('ZipArchive')) {
			$zip = new ZipArchive;
			if ($zip->open($package) === true) {
				$zip->extractTo($destination);
				$zip->close();
				echo $this->strings['process_success'];
				// install the template
				require_once (OP_LIB . 'admin/install.php');
				$ins = new OptimizePress_Install();
				$this->result = $ins->add_content_templates($destination, '', '', true, false);
				// refresh everything
				$GLOBALS['op_layout_uploaded'] = true;
				echo '<script type="text/javascript">var win = window.dialogArguments || opener || parent || top; win.op_refresh_content_layouts();</script>';
			} else {
				echo $this->strings['process_failed'];
			}
		} else {
			require_once(ABSPATH . 'wp-admin/includes/class-pclzip.php');

			$zip = new PclZip($package);
			$zip->extract(PCLZIP_OPT_PATH, $destination);
			echo $this->strings['process_success'];
			// install the template
			require_once (OP_LIB . 'admin/install.php');
			$ins = new OptimizePress_Install();
			$this->result = $ins->add_content_templates($destination, '', '', true, false);
			// refresh everything
			$GLOBALS['op_layout_uploaded'] = true;
			echo '<script type="text/javascript">var win = window.dialogArguments || opener || parent || top; win.op_refresh_content_layouts();</script>';
		}

		/*$this->run(array(
					'package' => $package,
					'destination' => OP_LIB.'content_layouts/working',//rtrim(OP_ASSETS,'/'),
					'clear_destination' => true, //Do not overwrite files.
					'clear_working' => true,
					//'hook_extra' => array($this,'install_content_layout')
					));

		remove_filter('upgrader_source_selection', array($this, 'check_package') );

		if ( ! $this->result || is_wp_error($this->result) )
			return $this->result;
		*/

		// Force refresh of plugin update information
		//delete_site_transient('update_plugins');
		//remove_filter('upgrader_source_selection', array($this, 'check_package') );
		return true;
	}

	function install_package($args = array()) {
		global $wp_filesystem;
		$defaults = array( 'source' => '', 'destination' => '', //Please always pass these
						'clear_destination' => true, 'clear_working' => true,
						'hook_extra' => array());
		$args = wp_parse_args($args, $defaults);
		extract($args);

		@set_time_limit( 300 );

		if ( empty($source) || empty($destination) )
			return new WP_Error('bad_request', $this->strings['bad_request']);

		$this->skin->feedback('installing_package');

		$res = apply_filters('upgrader_pre_install', true, $hook_extra);
		if ( is_wp_error($res) )
			return $res;

		//Retain the Original source and destinations
		$remote_source = $source;
		$local_destination = $destination;


		$source_files = array_keys( $wp_filesystem->dirlist($remote_source) );
		$remote_destination = $wp_filesystem->find_folder($local_destination);

		//Locate which directory to copy to the new folder, This is based on the actual folder holding the files.
		if ( 1 == count($source_files) && $wp_filesystem->is_dir( trailingslashit($source) . $source_files[0] . '/') ) //Only one folder? Then we want its contents.
			$source = trailingslashit($source) . trailingslashit($source_files[0]);
		elseif ( count($source_files) == 0 )
			return new WP_Error('bad_package', $this->strings['bad_package']); //There are no files?
		//else //Its only a single file, The upgrader will use the foldername of this file as the destination folder. foldername is based on zip filename.

		//Hook ability to change the source file location..
		$source = apply_filters('upgrader_source_selection', $source, $remote_source, $this);
		if ( is_wp_error($source) )
			return $source;

		//Has the source location changed? If so, we need a new source_files list.
		if ( $source !== $remote_source )
			$source_files = array_keys( $wp_filesystem->dirlist($source) );

		//Protection against deleting files in any important base directories.
		if ( in_array( $destination, array(ABSPATH, WP_CONTENT_DIR, WP_PLUGIN_DIR, WP_CONTENT_DIR . '/themes') ) ) {
			$remote_destination = trailingslashit($remote_destination) . trailingslashit(basename($source));
			$destination = trailingslashit($destination) . trailingslashit(basename($source));
		}

		if ( $clear_destination ) {
			//We're going to clear the destination if theres something there
			$this->skin->feedback('remove_old');
			$removed = true;
			if ( $wp_filesystem->exists($remote_destination) )
				$removed = $wp_filesystem->delete($remote_destination, true);
			$removed = apply_filters('upgrader_clear_destination', $removed, $local_destination, $remote_destination, $hook_extra);

			if ( is_wp_error($removed) )
				return $removed;
			else if ( ! $removed )
				return new WP_Error('remove_old_failed', $this->strings['remove_old_failed']);
		} elseif ( $wp_filesystem->exists($remote_destination) ) {
			//If we're not clearing the destination folder and something exists there allready, Bail.
			//But first check to see if there are actually any files in the folder.
			$_files = $wp_filesystem->dirlist($remote_destination);
			if ( ! empty($_files) ) {
				$wp_filesystem->delete($remote_source, true); //Clear out the source files.
				return new WP_Error('folder_exists', $this->strings['folder_exists'], $remote_destination );
			}
		}

		//Create destination if needed
		if ( !$wp_filesystem->exists($remote_destination) )
			if ( !$wp_filesystem->mkdir($remote_destination, FS_CHMOD_DIR) )
				return new WP_Error('mkdir_failed', $this->strings['mkdir_failed'], $remote_destination);

		// Copy new version of item into place.
		$result = copy_dir($source, $remote_destination);
		if ( is_wp_error($result) ) {
			if ( $clear_working )
				$wp_filesystem->delete($remote_source, true);
			return $result;
		}
		$result = $this->install_content_layout($local_destination,$remote_destination,$remote_source,$clear_working);
		if(is_wp_error($result)){
			if($clear_working)
				$wp_filesystem->delete($remote_source, true);
			return $result;
		}

		//Clear the Working folder?
		if ( $clear_working )
			$wp_filesystem->delete($remote_source, true);

		$destination_name = basename( str_replace($local_destination, '', $destination) );
		if ( '.' == $destination_name )
			$destination_name = '';

		$this->result = compact('local_source', 'source', 'source_name', 'source_files', 'destination', 'destination_name', 'local_destination', 'remote_destination', 'clear_destination', 'delete_source_dir');

		$res = apply_filters('upgrader_post_install', true, $hook_extra, $this->result);
		if ( is_wp_error($res) ) {
			$this->result = $res;
			return $res;
		}

		//Bombard the calling function will all the info which we've just used.
		return $this->result;
	}

	function install_content_layout($local_destination,$remote_destination,$remote_source,$clear_working, $install=false){
		global $wp_filesystem, $wpdb;

		if(file_exists($local_destination.'/config.php')){
			$config = array();
			include $local_destination.'/config.php';
			$image_file = op_get_var($config,'image');
			$ext = preg_match('/\.([^.]+)$/', $image_file, $matches) ? strtolower($matches[1]) : false;
			if($ext){
				$asset_dest = $wp_filesystem->find_folder(OP_ASSETS);
				$img_dest = $wp_filesystem->find_folder(OP_LIB.'images/content_layouts/');
				$images = array();
				$layouts = op_get_var($config,'layouts',array());
				$replace = array();
				$settings = array();
				$downloaded_images = array();
				$new_images = array();
				$replace = array();
				// uploading image as attachment
				@copy($local_destination . $image_file, OP_LIB . 'content_layouts/working/' . $image_file);
				$file_array = array(
						'name' => $image_file,
						'tmp_name' => OP_LIB . 'content_layouts/working/' . $image_file
				);
				$imgId = media_handle_sideload($file_array,0);
				if (!is_wp_error($imgId)) {
					$imageUrl = wp_get_attachment_url($imgId);
				}
				if(isset($config['images'])){
					$images = unserialize(base64_decode($config['images']));
					foreach($images as $path => $file){
						$file_array = array(
							'name' => $file,
							'tmp_name' => $local_destination.'/images/'.$file
						);
						$id = media_handle_sideload($file_array,0);
						if(!is_wp_error($id)){
							$new_images[$path] = wp_get_attachment_url($id);
							$replace['{op_filename="'.$path.'"}'] = $new_images[$path];
						}
					}
					if (!install) {
						$wp_filesystem->delete($remote_destination.'images/',true);
					}
				}
				if(isset($config['settings_images'])){
					$settings_images = unserialize(base64_decode($config['settings_images']));
					foreach($settings_images as $path => $conf){
						foreach($conf as $keys){
							$url_string = '{op_filename="'.$path.'"}';
							$found = false;
							if(isset($new_images[$path])){
								$url = $new_images[$path];
								if(!isset($settings[$keys[0]])){
									$settings[$keys[0]] = unserialize(base64_decode($config['settings'][$keys[0]]));
								}
								$settings = $this->_update_array($settings,$keys,$url_string,$url);
							}
						}
					}
				}
                
                // remove the header link on template install
                if (isset($settings['header_layout']['header_link'])) {
                    $settings['header_layout']['header_link'] = '';
                }

				foreach($settings as $name => $conf){
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
							$temp = base64_decode($row['row_data_style']);
							$temp = str_replace(array_map('addslashes', $find), $replace, $temp);
							$new_row['row_data_style'] = base64_encode($temp);
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
				//$wp_filesystem->copy($remote_destination.$image_file,$img_dest.$wpdb->insert_id.'.'.$ext);
				if (!$install) {
					$wp_filesystem->delete($remote_destination.$image_file);
					$wp_filesystem->delete($remote_destination.'config.php');
				}
				if(file_exists($local_destination.'/assets') && is_dir($local_destination.'/assets')){
					$dirlist = $wp_filesystem->dirlist($remote_destination.'assets');
					if(count($dirlist) > 0){
						foreach($dirlist as $dir){
							if($dir['type'] == 'd'){
								if(file_exists(OP_ASSETS.'addon/'.$dir['name'])){
									$wp_filesystem->rmdir($asset_dest.'addon/'.$dir['name'],true);
								}
							}
						}
					}
					$wp_filesystem->chmod($asset_dest.'addon/',FS_CHMOD_DIR);
					$result = copy_dir($remote_destination.'assets/', $asset_dest.'addon/');
					$wp_filesystem->delete($remote_destination.'assets/',true);
					if ( is_wp_error($result) ) {
						if ( $clear_working )
							$wp_filesystem->delete($remote_source, true);
						return $result;
					} else {
						_op_assets('save_assets');
					}
				}
				$GLOBALS['op_layout_uploaded'] = true;
			} else {
				return new WP_Error('missing_config', $this->strings['missing_config']);
			}
		} else {
			return new WP_Error('missing_config', $this->strings['missing_config']);
		}
	}

	function _update_array($options,$args,$replace,$with){
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

	function check_package($source) {
		global $wp_filesystem;

		if ( is_wp_error($source) )
			return $source;
		$working_directory = str_replace( $wp_filesystem->wp_content_dir(), trailingslashit(WP_CONTENT_DIR), $source);
		if ( ! is_dir($working_directory) ) // Sanity check, if the above fails, lets not prevent installation.
			return $source;
		/*
		if ( ! file_exists($working_directory.'config.php') )
			return new WP_Error( 'incompatible_archive', $this->strings['incompatible_archive'], __('No valid plugins were found.') );*/

		return $source;
	}

	//return plugin info.
	function plugin_info() {
		if ( ! is_array($this->result) )
			return false;
		if ( empty($this->result['destination_name']) )
			return false;

		$plugin = get_plugins('/' . $this->result['destination_name']); //Ensure to pass with leading slash
		if ( empty($plugin) )
			return false;

		$pluginfiles = array_keys($plugin); //Assume the requested plugin is the first in the list

		return $this->result['destination_name'] . '/' . $pluginfiles[0];
	}
}

class OP_Content_Layout_Skin extends Plugin_Installer_Skin {

	function header() {
		if ( $this->done_header )
			return;
		$this->done_header = true;
		echo '<div class="wrap">';
		echo '<h2>' . $this->options['title'] . '</h2>';
	}

	function after() {
		$this->plugin = $this->upgrader->plugin_info();

		$update_actions =  array(
			'plugins_page' => '<a href="' . menu_page_url(OP_SN.'-page-builder',false) .'&amp;section=content_upload" title="' . esc_attr__('Upload another layout') . '" target="_self">' . __('Upload another layout') . '</a>'
		);

		$update_actions = apply_filters('update_plugin_complete_actions', $update_actions, $this->plugin);
		if ( ! empty($update_actions) )
			$this->feedback(implode(' | ', (array)$update_actions).(isset($GLOBALS['op_layout_uploaded']) && $GLOBALS['op_layout_uploaded'] === true?'<script type="text/javascript">var win = window.dialogArguments || opener || parent || top; win.op_refresh_content_layouts();</script>':''));
	}
}

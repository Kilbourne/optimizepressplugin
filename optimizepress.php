<?php
/*
Plugin Name: OptimizePress
Plugin URI: http://www.optimizepress.com/
Description: OptimizePress is the essential plugin for marketers. Create squeeze pages, sales letters and much more with ease.
Version: 2.5.24
Author: OptimizePress
Author URI: http://www.optimizepress.com/
*/

define('OP_PLUGIN_DIR', plugin_dir_path(__FILE__));
define('OP_PLUGIN_URL', plugin_dir_url(__FILE__));

// used in update script
define('OP_PLUGIN_SLUG', plugin_basename(__FILE__));

require_once OP_PLUGIN_DIR . 'lib/framework.php';
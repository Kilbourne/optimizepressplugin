<?php

if(!function_exists('op_define_vars')){
    function op_define_vars(){
        //Init constants
        define('OP_VERSION', '2.5.25');

        define('OP_TYPE','plugin');
        define('OP_SN','optimizepress'); //Short/safe name
        define('OP_DIR',OP_PLUGIN_DIR);
        define('OP_URL',OP_PLUGIN_URL);

        //Lib directory constants
        define('OP_LIB',OP_DIR.'lib/');
        define('OP_LIB_URL',OP_URL.'lib/');
        define('OP_ADMIN',OP_LIB.'admin/');
        define('OP_MOD',OP_LIB.'modules/');
        define('OP_MOD_URL',OP_URL.'lib/modules/');
        define('OP_ASSETS',OP_DIR.'lib/assets/');
        define('OP_ASSETS_URL',OP_URL.'lib/assets/');
        define('OP_DEFAULTS',OP_LIB.'defaults/');
        define('OP_FUNC',OP_LIB.'functions/');
        define('OP_TPL',OP_LIB.'tpl/');
        define('OP_THEMES',OP_DIR.'themes/');

        //Pages directory constants
        define('OP_PAGES',OP_DIR.'pages/');
        define('OP_PAGES_URL',OP_URL.'pages/');

        //Script constants
        define('OP_JS',OP_URL.'lib/js/');
        define('OP_JS_PATH',OP_LIB.'js/');
        define('OP_CSS',OP_LIB_URL.'css/');

        //Image constants
        define('OP_IMG',OP_LIB_URL.'images/');
        define('OP_IMG_DIR',OP_LIB.'images/');
        define('OP_THUMB',OP_IMG_DIR.'thumbs/');
        define('OP_THUMB_URL',OP_IMG.'thumbs/');

        //Notification constants
        define('OP_NOTIFY_SUCCESS', 0);
        define('OP_NOTIFY_WARNING', 1);
        define('OP_NOTIFY_ERROR', 2);


        //Date constants
        define('OP_DATE_MYSQL', 'Y-m-d');
        define('OP_DATE_POSTS', 'F j, Y');
        define('OP_DATE_TIME_PICKER_GMT', 'Y/m/d G:i:s O');

        //Font constants
        define('OP_FONT_FAMILY', 'Source Sans Pro, sans-serif');
        define('OP_FONT_SIZE', 15);
        define('OP_FONT_STYLE', 'normal');
        define('OP_FONT_SPACING', '');
        define('OP_FONT_SHADOW', 'none');
        define('OP_FONT_COLOR', '#444');

        //Font strings
        define('OP_STRING_FONT_FAMILY', 'Font');
        define('OP_STRING_FONT_SIZE', 'Size');
        define('OP_STRING_FONT_STYLE', 'Style');
        define('OP_STRING_FONT_SPACING', 'Spacing');
        define('OP_STRING_FONT_SHADOW', 'Shadow');
        define('OP_STRING_FONT_COLOR', 'Color');
        define('OP_STRING_FONT_DECORATION', 'Decoration');
        define('OP_STRING_FONT_THEME_DEFAULT', 'Theme Default');

        //Logo and Image Constants
        define('OP_HEADER_LOGO_WIDTH', 250);
        define('OP_HEADER_LOGO_HEIGHT', 50);

        //AWeber Oauth authorizing URL
        define('OP_AWEBER_AUTH_URL', 'op-aweber-authorize');

        //iContact App ID
        define('OP_ICONTACT_APP_ID', 'bxqNtsRX17VsWHc437VGAjmwS9keS2er');

        //1ShoppingCart
        define('OP_ONESHOPPINGCART_CONNECT_URL', 'op-1-shopping-cart-connect');

        //GoToWebinar
        define('OP_GOTOWEBINAR_AUTH_URL', 'op-gotowebinar-authorize');
        define('OP_GOTOWEBINAR_EXPIRE_NOTICE', 1209600);

        //OP Social Networking Account Names
        define('OP_SOCIAL_ACCT_TWITTER', 'optimizepress');
        define('OP_SOCIAL_ACCT_FACEBOOK', 'optimizepress');
        define('OP_SOCIAL_ACCT_GOOGLEPLUS', '111273444733787349971');

        //SL cache lifetime (in seconds)
        define('OP_SL_ELEMENT_CACHE_LIFETIME', 172800);

        //CSS Classes
        define('OP_CSS_CLASS_CLOSE_MODAL', 'close-optin-modal');

        //OptimizeLeads;
        if (! defined('OP_LEADS_URL')) {
            define('OP_LEADS_URL', 'https://my.optimizeleads.com/');
            define('OP_LEADS_THEMES_URL', 'https://my.optimizeleads.com/build/themes/');
    }

    define('OP_LEADS_BOXES_CACHE_EXPIRATION_SEC', 300);
    define('OP_LEADS_BOX_CACHE_EXPIRATION_SEC', 300);

        //Globals
        $GLOBALS['OP_LIVEEDITOR_FONT_STR'] = array();
        $GLOBALS['OP_LIVEEDITOR_DEPTH'] = 0;
        $GLOBALS['OP_PARSED_SHORTCODE'] = '';
        $GLOBALS['OP_LIVEEDITOR_DISABLE_NEW'] = true;

        // link to our support page
        define('OP_SUPPORT_LINK', 'http://help.optimizepress.com');

        // SEO ENABLED
        $seo_enabled = unserialize(get_option(OP_SN . '_seo'));
        if (!empty($seo_enabled) && isset($seo_enabled['enabled'])) {
            define('OP_SEO_ENABLED', $seo_enabled['enabled']);
        } else {
            define('OP_SEO_ENABLED', 'Y');
        }

        // AUTOSAVE ENABLED IN LIVE EDITOR
        $autosave_enabled = unserialize(get_option(OP_SN . '_autosave'));
        if (!empty($autosave_enabled) && isset($autosave_enabled['enabled'])) {
            define('OP_AUTOSAVE_ENABLED', $autosave_enabled['enabled']);
        } else {
            define('OP_AUTOSAVE_ENABLED', 'Y');
        }

        // Minified resources (script and style)
        // OP_SCRIPT_BASE is a basic OP script dependency.
        // op-noconflict for development and op-jquery-base-all for production.
        if (!defined('OP_SCRIPT_DEBUG')) {
            define('OP_SCRIPT_DEBUG', '.min');
            define('OP_SCRIPT_BASE', OP_SN.'-op-jquery-base-all');
        } else {
            define('OP_SCRIPT_BASE', OP_SN.'-noconflict-js');
        }

        // how many revisions to keep, can be overriden in wp-config by defining this constant
        if (!defined('OP_REVISION_NUMBER')) {
            define('OP_REVISION_NUMBER', 10);
        }

        // autosave interval in seconds, can be overriden in wp-config by defining this constant
        if (!defined('OP_AUTOSAVE_INTERVAL')) {
            define('OP_AUTOSAVE_INTERVAL', 300); // 5 minutes
        }

        // add image attributes to all images?
        if (!defined('OP_ADD_IMAGE_ATTRIBUTES')) {
            define('OP_ADD_IMAGE_ATTRIBUTES', true);
        }

        // add gmaps api key only if plus pack is active
        if (defined('OPPP_VERSION')) {
            $gmaps_api_key = get_option(OP_SN . '_gmaps_api_key');
            if (!defined('GMAPS_API_KEY')) {
                define('GMAPS_API_KEY', $gmaps_api_key);
            }
        }

    }
    add_action('init','op_define_vars');

    /**
     * Enqueues jquery and based on OP_SCRIPT_DEBUG either jquery-noconflict and loadscript OR op-jquery-base-all.
     */
    function op_enqueue_base_scripts()
    {
        // If jQuery version is higher than 1.9 we require jQuery migrate plugin (which is by default registered in WP versions that come with jQuery 1.9 or higher)
        if (wp_script_is('jquery-migrate', 'registered')) {
            $jquery_dependency = array('jquery', 'jquery-migrate');
        } else {
            $jquery_dependency = array('jquery');
        }

        if (OP_SCRIPT_DEBUG === '') {
            wp_enqueue_script(OP_SN.'-noconflict-js', OP_JS.'jquery/jquery.noconflict'.OP_SCRIPT_DEBUG.'.js', $jquery_dependency, OP_VERSION);
            // wp_enqueue_script(OP_SN.'-loadScript', OP_JS.'jquery/jquery.loadScript'.OP_SCRIPT_DEBUG.'.js', array(OP_SN.'-noconflict-js'), OP_VERSION);
            wp_enqueue_script(OP_SN.'-fancybox', OP_JS.'fancybox/jquery.fancybox'.OP_SCRIPT_DEBUG.'.js', array(OP_SN.'-noconflict-js'), OP_VERSION);
            wp_enqueue_script(OP_SN.'-loading-indicator', OP_JS.'op-loading.js', array(OP_SN.'-noconflict-js'), OP_VERSION);
            wp_enqueue_script(OP_SN.'-stellar.js', OP_URL . 'lib/js/jquery/jquery.stellar.min.js', array(OP_SN.'-noconflict-js'), OP_VERSION);
        } else {
            wp_enqueue_script(OP_SN.'-op-jquery-base-all', OP_JS.'op-jquery-base-all.min.js', $jquery_dependency, OP_VERSION);
        }
    }

    /**
     * Enqueues backend scripts
     */
    function op_enqueue_backend_scripts()
    {
        // echo 'op_enqueue_backend_scripts();';
        op_register_backend_scripts();


        // TinyMCE
        wp_enqueue_style(OP_SN.'-tiny-mce-css', includes_url() . 'css/editor.min.css');
        wp_enqueue_style(OP_SN.'-dashicons', includes_url() . 'css/dashicons.min.css');
        wp_enqueue_media();

        if (OP_SCRIPT_DEBUG === '') {

            wp_enqueue_script(OP_SN.'-base64', OP_JS.'jquery/jquery.basesixtyfour.min.js', array(OP_SN.'-noconflict-js'), OP_VERSION);
            wp_enqueue_script(OP_SN.'-asset-browser', OP_JS.'assets/dialog'.OP_SCRIPT_DEBUG.'.js', array(OP_SN.'-noconflict-js', OP_SN.'-admin-common', 'jquery-ui-position', OP_SN.'-base64', OP_SN.'-fancybox'), OP_VERSION, 1 );
            wp_enqueue_script(OP_SN.'-admin', OP_JS.'admin'.OP_SCRIPT_DEBUG.'.js', array(OP_SN.'-noconflict-js', OP_SN.'-fancybox'), OP_VERSION);
            wp_enqueue_script(OP_SN.'-admin-live-editor', OP_JS.'live_editor'.OP_SCRIPT_DEBUG.'.js', array(OP_SN.'-noconflict-js', OP_SN.'-admin-common','jquery-ui-sortable'), OP_VERSION);
            // wp_enqueue_script(OP_SN.'-loadScript', OP_JS.'jquery/jquery.loadScript'.OP_SCRIPT_DEBUG.'.js', array(OP_SN.'-noconflict-js'), OP_VERSION);
            wp_enqueue_script(OP_SN.'-html-parser', OP_JS.'html_parser'.OP_SCRIPT_DEBUG.'.js', array(OP_SN.'-noconflict-js', OP_SN.'-admin-common', OP_SN.'-base64', OP_SN.'-fancybox'), OP_VERSION, 1 );
            wp_enqueue_script('jquery-ui-slider', false, array(OP_SN . '-noconflict-js'), OP_VERSION);
            wp_enqueue_script('jquery-ui-progressbar', false, array(OP_SN . '-noconflict-js'), OP_VERSION);

            wp_enqueue_script(OP_SN.'-jquery-input-file-prettify', OP_JS . 'jquery-input-file-prettify/jquery-input-file-prettify' . OP_SCRIPT_DEBUG . '.js', array(OP_SN.'-noconflict-js'), OP_VERSION);
            wp_enqueue_script(OP_SN.'-op-form', OP_JS . 'op-form' . OP_SCRIPT_DEBUG . '.js', array(OP_SN.'-jquery-input-file-prettify'), OP_VERSION);
            wp_enqueue_script(OP_SN.'-admin-create-new-page-scripts', OP_JS.'create_new_page'.OP_SCRIPT_DEBUG.'.js', array(OP_SN.'-noconflict-js', OP_SN.'-admin-common', OP_SN.'-fancybox'), OP_VERSION);

        } else {

            wp_enqueue_script(OP_SN.'-op-back-all', OP_JS.'op-back-all.min.js', array(OP_SN.'-op-jquery-base-all', 'jquery-ui-slider', 'farbtastic', 'jquery-ui-position', 'media-upload', 'thickbox', 'jquery-ui-sortable', 'jquery-ui-progressbar'), OP_VERSION);

        }

        // Fix for WooCommerce, because the old flot version (0.8.1)
        // currently used in WooCommerce is causing script errors.
        if (class_exists('WooCommerce')) {
            wp_enqueue_script('flot', OP_JS . 'flot/jquery.flot.min.js', array(OP_SCRIPT_BASE), OP_VERSION, false);
            wp_enqueue_script('flot-resize', OP_JS . 'flot/jquery.flot.resize.min.js', array(OP_SCRIPT_BASE, 'flot'), OP_VERSION, false);
        }

        /**
         * MediaElement included with WP crashes the LiveEditor
         * in some cases when OP Plugin is used, so we're
         * removing wp version and forcing our version
         * of mediaelement and wp-mediaelement
         */
        if (defined('OP_LIVEEDITOR')) {
            wp_deregister_script('mediaelement');
            wp_enqueue_script('mediaelement', OP_MOD_URL . 'blog/video/mediaelement/mediaelement-and-player' . OP_SCRIPT_DEBUG . '.js', array(OP_SCRIPT_BASE), OP_VERSION, true);
        }
        wp_deregister_script('wp-mediaelement');
        wp_enqueue_script('wp-mediaelement', OP_MOD_URL . 'blog/video/mediaelement/wp-mediaelement' . OP_SCRIPT_DEBUG . '.js', array('mediaelement'), OP_VERSION, true);

    }

    /**
     * Registers scripts for backend
     * (currently only for debug version, when OP_SCRIPT_DEBUG is '')
     */
    function op_register_backend_scripts()
    {
        // There's nothing to register for production here
        if (OP_SCRIPT_DEBUG === '') {
            wp_register_script(OP_SN.'-fancybox', OP_JS.'fancybox/jquery.fancybox'.OP_SCRIPT_DEBUG.'.js', array(OP_SN.'-noconflict-js'), OP_VERSION);

            wp_register_script(OP_SN.'-ajax-upload', OP_JS.'fileuploader'.OP_SCRIPT_DEBUG.'.js', array(OP_SN.'-noconflict-js'), OP_VERSION);
            wp_register_script(OP_SN.'-checkbox-js', OP_JS.'jquery/jquery.ibutton.min.js', array(OP_SN.'-noconflict-js'), OP_VERSION);
            wp_register_script(OP_SN.'-placeholder', OP_JS.'jquery/jquery.placeholder.min.js', array(OP_SN.'-noconflict-js', OP_SN.'-noconflict-js'), OP_VERSION);
            wp_register_script(OP_SN.'-admin-common', OP_JS.'common'.OP_SCRIPT_DEBUG.'.js', array(OP_SN.'-noconflict-js', 'farbtastic', OP_SN.'-checkbox-js', 'jquery-ui-position', 'media-upload', 'thickbox'), OP_VERSION);
            wp_register_script(OP_SN.'-blog-settings', OP_JS.'blog_settings'.OP_SCRIPT_DEBUG.'.js', array(OP_SN.'-noconflict-js', OP_SN.'-admin-common'), OP_VERSION);
        }
    }

    /**
     * Enqueues scripts for frontend
     */
    function op_enqueue_frontend_scripts()
    {
        if (OP_SCRIPT_DEBUG === '') {
            wp_enqueue_script(OP_SN.'-tooltipster', OP_JS.'tooltipster.min.js', array(OP_SN.'-noconflict-js'), OP_VERSION);
            wp_enqueue_script(OP_SN.'-selectnav', OP_JS.'selectnav'.OP_SCRIPT_DEBUG.'.js', array(OP_SN.'-noconflict-js'), OP_VERSION);
            wp_enqueue_script(OP_SN.'-dropkick', OP_JS.'dropkick'.OP_SCRIPT_DEBUG.'.js', array(OP_SN.'-noconflict-js'), OP_VERSION);
            wp_enqueue_script(OP_SN.'-sharrre', OP_JS.'jquery/jquery.sharrre-1.3.5'.OP_SCRIPT_DEBUG.'.js', array(OP_SN.'-noconflict-js'), OP_VERSION);
            wp_enqueue_script(OP_SN.'-reveal', OP_JS.'jquery/jquery.reveal.min.js', array(OP_SN.'-noconflict-js'), OP_VERSION);
            wp_enqueue_script(OP_SN.'-countdown', OP_JS.'jquery/countdown'.OP_SCRIPT_DEBUG.'.js', array(OP_SN.'-noconflict-js'), OP_VERSION);
            wp_enqueue_script(OP_SN.'-global', OP_JS.'global'.OP_SCRIPT_DEBUG.'.js', array(OP_SN.'-noconflict-js'), OP_VERSION);
            if (is_admin_bar_showing()) {
                wp_enqueue_script(OP_SN.'-admin', OP_JS.'admin'.OP_SCRIPT_DEBUG.'.js', array(OP_SN.'-noconflict-js', OP_SN.'-fancybox'), OP_VERSION);
            }
            wp_enqueue_script(OP_SN.'-multiselect.js', OP_JS.'jquery/jquery.multiselect'.OP_SCRIPT_DEBUG.'.js', array(OP_SN.'-noconflict-js'), OP_VERSION);
            wp_enqueue_script(OP_SN.'-quicksearch.js', OP_JS.'jquery/jquery.quicksearch'.OP_SCRIPT_DEBUG.'.js', array(OP_SN.'-noconflict-js'), OP_VERSION);
        } else {
            if (is_admin_bar_showing() && !wp_script_is(OP_SN.'-op-back-all', 'enqueued')) {
                wp_enqueue_script(OP_SN.'-admin', OP_JS.'admin'.OP_SCRIPT_DEBUG.'.js', array(OP_SN.'-op-jquery-base-all'), OP_VERSION, true);
            }
            wp_enqueue_script(OP_SN.'-op-front-all', OP_JS.'op-front-all.min.js', array(OP_SN.'-op-jquery-base-all'), OP_VERSION);
        }
    }

    // Fancybox for images
    // TODO: Should this be localized? Is there a need for a separate js file for this amount of code?
    function op_enqueue_fancybox_images()
    {
        $fancybox_images = op_default_option('fancybox_images');
        if (is_array($fancybox_images) && $fancybox_images['enabled'] === 'Y') {
            if (OP_SCRIPT_DEBUG === '') {
                wp_enqueue_script(OP_SN.'-fancybox-images', OP_JS.'fancybox_images'.OP_SCRIPT_DEBUG.'.js', array(OP_SN.'-noconflict-js', OP_SN.'-fancybox'), OP_VERSION, true);
            } else {
                wp_enqueue_script(OP_SN.'-fancybox-images', OP_JS.'fancybox_images'.OP_SCRIPT_DEBUG.'.js', array(OP_SN.'-op-jquery-base-all'), OP_VERSION, true);
            }
        }
    }

    function admin_bar_links() {
        if (!is_admin() && current_user_can('administrator')) {
            global $wp_admin_bar;
            global $post;

            if (is_object($post) && $post->post_type == 'page') {
                $wp_admin_bar->add_menu( array(
                    'parent' => false, // use 'false' for a root menu, or pass the ID of the parent menu
                    'id' => 'optimizepress', // link ID, defaults to a sanitized title value
                    'title' => __('OptimizePress', OP_SN), // link title
                    'href' => '', // name of file
                    'meta' => false // array of any of the following options: array( 'html' => '', 'class' => '', 'onclick' => '', target => '', title => '' );
                ));
                if (get_post_meta($post->ID,'_'.OP_SN.'_pagebuilder',true) == 'Y') {
                    $wp_admin_bar->add_menu( array(
                        'parent' => 'optimizepress',
                        'id' => 'op_live_editor',
                        'title' => __('Live Editor', OP_SN),
                        'href' => admin_url("admin.php?page=optimizepress-page-builder&page_id=".$post->ID."&step=5"),
                        'meta' => array('class' => 'op-pagebuilder')
                    ));
                }
                /*$wp_admin_bar->add_menu( array(
                        'parent' => 'optimizepress',
                        'id' => 'op_pagebuilder',
                        'title' => __('Page Builder', OP_SN),
                        'href' => admin_url("admin.php?page=optimizepress-page-builder&page_id=".$post->ID),
                        'meta' => array('class' => 'op-pagebuilder')
                    ));*/
            }
        }

    }
    add_action('wp_before_admin_bar_render', 'admin_bar_links');

    function op_include_files(){
        require_once OP_FUNC.'widgets.php';
        require_once OP_FUNC.'options.php';
        require_once OP_FUNC.'page_options.php';
        require_once OP_FUNC.'general.php';
        require_once OP_FUNC.'shortcodes.php';
        require_once OP_FUNC.'scripts.php';
        require_once OP_FUNC.'assets.php';
        require_once OP_FUNC.'fonts.php';
        require_once OP_FUNC.'sl_api.php';
        require_once OP_FUNC.'optin_stats.php';
        require_once OP_FUNC.'social-count.php';
        require_once OP_FUNC.'gdpr.php';
        require_once OP_FUNC.'google-recaptcha.php';

        // Loading DB upgrader
        require_once OP_ADMIN . 'upgrade.php';

        op_textdomain();
        require_once OP_FUNC.'templates.php';

        _op_assets();
        add_theme_support( 'automatic-feed-links' );
        add_theme_support( 'post-thumbnails' );

        if (is_admin()) {
            require_once OP_FUNC . 'admin.php';
            require_once OP_ADMIN . 'init.php';
            require_once OP_ADMIN . 'editor_shortcodes.php';
        } else {
            op_register_scripts();
            do_action('op_pre_template_include');

            require_once ABSPATH . 'wp-admin/includes/plugin.php';

            /*
             * DAP
             */
            if (is_plugin_active('DAP-WP-LiveLinks/DAP-WP-LiveLinks.php')) {
                add_filter('op_check_page_availability', 'dap_allowed_page');
            }

            /*
             * Fast Member
             */
            if (is_plugin_active('fastmember/fastmember.php')) {
                add_filter('op_check_page_availability', 'fast_member_allowed_page');
            }

            /*
             * iMember
             */
            if (class_exists('infusionWP')) {
                add_filter('op_check_page_availability', 'imember_allowed_page');
            }

            add_filter('template_include', 'op_template_include');
            do_action('op_setup');
        }
    }

    add_action('init','op_include_files');

    // One hook is loading on frontend and other in admin
    add_action('wp_head','op_localize_script', 5);
    add_action('admin_print_styles', 'op_localize_script', 5);

    function op_template_include($template,$use_template=true){
        if($use_template){
            if($id = get_queried_object_id()){
                $status = get_post_status($id);

                if ( $status == 'publish' || (current_user_can('edit_posts') || current_user_can('edit_pages')) ){
                    if(get_post_meta($id,'_'.OP_SN.'_pagebuilder',true) == 'Y'){
                        op_init_page($id);
                        if(op_page_option('launch_funnel','enabled') == 'Y' && $launch_info = op_page_option('launch_suite_info')){
                            require_once OP_FUNC.'launch.php';
                        }
                        $theme = op_page_option('theme');
                        $file = OP_PAGES.$theme['type'].'/'.$theme['dir'].'/template.php';
                        if(file_exists($file)){
                            return apply_filters('op_check_page_availability', $file);
                        }
                    }
                }
            }
        }

        return $template;
    }

    /**
     * Multi-byte Unserialize
     *
     * UTF-8 will screw up a serialized string
     *
     * @access private
     * @param string
     * @return string
     */
    if (! function_exists('mb_unserialize')) {
        function mb_unserialize_callback($match)
        {
            return 's:' . strlen($match[2]) . ':"' . $match[2] . '";';
        }
        function mb_unserialize($string)
        {
            if (is_array($string)) {
                return $string;
            }

            //$string = preg_replace('!s:(\d+):"(.*?)";!se', "'s:'.strlen('$2').':\"$2\";'", $string);
            // as /e flag was deprecated, this is a new version of the function:
            $string = preg_replace_callback(
                '!s:(\d+):"(.*?)";!s',
                'mb_unserialize_callback',
                $string
            );

            return unserialize($string);
        }
    }
    /*
     * Attaching on template redirect action for processing of optin form
     */
    add_action('template_redirect', 'processOptinForm', 20);

    /**
     * Processing optin form, subscribing users
     * @author OptimizePress <info@optimizepress.com>
     * @return void
     */
    function processOptinForm()
    {
        global $wp;
        /*
         * We are checking for our processing URL slug
         */
        if ($wp->request === 'process-optin-form') {

            $type = op_post('provider');

            /**
             * op_process_optin_before
             *
             * @hooked addUserToOpm - 10
             */
            do_action('op_process_optin_before', $type);


            /*
             * Infusionsoft needs to be redirected with 307 to keep all of its required POST vars
             */
            if ($type === 'infusionsoft') {

                $list = op_post('list');
                $email = op_post('inf_field_Email');

                $webinar = op_post('gotowebinar');
                /*
                 * Triggering GoToWebinar
                 */
                if (false !== $webinar) {
                    do_action('gotowebinar', $webinar, $email);
                }

                /**
                 * op_process_optin_after
                 *
                 * @hooked OptimizePress_Optin_Stats::recordOptin - 10
                 */
                do_action('op_process_optin_after', $type, true);

                /*
                 * Redirecting user with all its POST data (needed for GoToWebinar interception)
                 */
                wp_redirect(op_post('redirect_url'), 307);
            } else if (false !== $type) {

                require_once(OP_MOD . 'email/ProviderFactory.php');

                $list = op_post('list');
                $email = op_post('email');

                $webinar = op_post('gotowebinar');

                /*
                 * Triggering GoToWebinar
                 */
                if (false !== $webinar) {
                    do_action('gotowebinar', $webinar, $email);
                }

                $provider = OptimizePress_Modules_Email_ProviderFactory::getFactory($type, true);
                if (isset($provider)) {
                    $status = $provider->subscribe(array('list' => $list, 'email' => $email));
                }

                /**
                 * op_process_optin_after
                 *
                 * @hooked OptimizePress_Optin_Stats::recordOptin - 10
                 */
                do_action('op_process_optin_after', $type, $status);


                header("HTTP/1.1 200 OK");
                header("Location: " . op_post('redirect_url'));
            } else {
                $email = op_post(op_post('email_field'));
                $webinar = op_post('gotowebinar');

                /*
                 * Triggering GoToWebinar
                 */
                if (false !== $webinar) {
                    do_action('gotowebinar', $webinar, $email);
                }

                /**
                 * op_process_optin_after
                 *
                 * @hooked OptimizePress_Optin_Stats::recordOptin - 10
                 */
                do_action('op_process_optin_after', $type, true);

                /*
                 * Redirecting user with all its POST data (needed for GoToWebinar interception)
                 */
                wp_redirect(op_post('redirect_url'), 307);
            }
            exit();
        }
    }

    /**
     * Checks GET vars for 'op_' prefixed parameters to fill the value or call 'op_optin_field_value' filter
     * @author OptimizePress <info@optimizepress.com>
     * @param  string $name
     * @return string
     */
    function getOptinUrlValue($name)
    {
        $value = op_get('op_' . strtolower($name));
        if (false !== $value) {
            $value = op_attr($value);
        } else if ('FNAME' == $name) {
            $value = getOptinUrlValue('name');
        } else {
            $value = apply_filters('op_optin_field_value', $value, $name);
        }
        return $value;
    }

    /*
     * Admin action for Aweber authorization
     */
    add_action('admin_action_op-aweber-authorize', 'aweberAuthorize');

    /**
     * Authorize Aweber using OAuth
     * @author  Luka Peharda <luka.peharda@gmail.com>
     * @return [type] [description]
     */
    function aweberAuthorize()
    {
        require_once(OP_MOD . 'email/ProviderFactory.php');

        $provider = OptimizePress_Modules_Email_ProviderFactory::getFactory('aweber', true);
        $provider->authorize();
    }

    /*
     * Admin action for GoToWebinar authorization
     */
    add_action('admin_action_op-gotowebinar-authorize', 'goToWebinarAuthorize');

    /**
     * Authorize gotowebinar using OAuth
     * @author  Luka Peharda <luka.peharda@gmail.com>
     * @return [type] [description]
     */
    function goToWebinarAuthorize()
    {
        // Delete disabled notification transient
        delete_transient(OP_SN . '_gtw_notification_disabled');

        require_once(OP_MOD . 'email/ProviderFactory.php');

        $provider = OptimizePress_Modules_Email_ProviderFactory::getFactory('gotowebinar', true);
        $provider->authorize();
    }

    /*
     * Admin action for enabling 1 Shopping Cart
     */
    add_action('admin_action_op-1-shopping-cart-connect', 'oneshoppingcartAuthorize');

    /**
     * Enable 1 Shopping cart
     * @author  Luka Peharda <luka.peharda@gmail.com>
     * @return [type] [description]
     */
    function oneshoppingcartAuthorize()
    {
        require_once(OP_MOD . 'email/ProviderFactory.php');

        $provider = OptimizePress_Modules_Email_ProviderFactory::getFactory('oneshoppingcart', true);
        $provider->authorize();
    }

    /*
     * Attaching to scheduled delete to clean up expired DB transients
     */
    add_action('wp_scheduled_delete', 'deleteExpiredDbTransients');

    /**
     * Deletes expired DB transients as WP currently doesn't do garbage cleaning
     * @author OptimizePress <info@optimizepress.com>
     * @return void
     */
    function deleteExpiredDbTransients()
    {
        global $wpdb, $_wp_using_ext_object_cache;

        if ($_wp_using_ext_object_cache) {
            return;
        }

        $time = isset ($_SERVER['REQUEST_TIME']) ? (int)$_SERVER['REQUEST_TIME'] : time();
        $expired = $wpdb->get_col("SELECT option_name FROM {$wpdb->options} WHERE option_name LIKE '_transient_timeout%' AND option_value < $time;");

        foreach ($expired as $transient) {
            delete_transient(str_replace('_transient_timeout_', '', $transient));
        }
    }

    /**
     * Adding custom post status that's not visible in admin, used for content template previews in Create New Page.
     */
    function op_preview_custom_post_status()
    {
        $args = array(
            'label'                     => _x( 'op_preview', 'OptimizePress Preview Status', OP_SN ),
            'label_count'               => _n_noop( 'op_preview (%s)',  'op_preview (%s)', OP_SN ),
            'public'                    => !is_admin(),
            'show_in_admin_all_list'    => false,
            'show_in_admin_status_list' => false,
            'exclude_from_search'       => true,
        );
        register_post_status('op_preview', $args);
    }

    add_action('init', 'op_preview_custom_post_status', 11);

    /**
     * Check if op-no-admin-bar is present in the URL and hides the admin bar if it is
     * used for revisions preview
     */
    function hide_admin_bar()
    {
        if (!empty($_GET['op-no-admin-bar'])) {
            add_filter('show_admin_bar', '__return_false');
        }
    }
    // adding action for hiding admin bar
    add_action('init', 'hide_admin_bar');


    /*
     * Adding ping-pong action
     */
    add_action('ping_pong', 'op_sl_ping');

    /*
     * Action to process GTW
     */
    add_action('gotowebinar', 'processGoToWebinar', 10, 2);

    /*
     * GoToWebinar token is active only for a year. We are showing user notice when the token is about to expire
     */
    //add_action('admin_notices', 'goToWebinarTokenExpiry');

    /**
     * Checks that 'optimizepress_gotowebinar_access_token' is defined and if 'optimizepress_gotowebinar_expires_in' is larger smaller than two weeks
     * @author OptimizePress <info@optimizepress.com>
     * @return void
     */
    function goToWebinarTokenExpiry()
    {
        $accessToken = op_get_option('gotowebinar_access_token');
        $expiresIn = op_get_option('gotowebinar_expires_in');
        $expiryTime = (int) $expiresIn - time();

        if (false !== $accessToken && false !== $expiresIn && $expiryTime < OP_GOTOWEBINAR_EXPIRE_NOTICE) {
            if ($expiryTime > 0) {
                echo '<div class="update-nag">' . sprintf(__('GoToWebinar access token is going to expire in %1$d day(s). Please <a href="%2$s">re-authorize</a>.', OP_SN), intval($expiryTime / 86400), admin_url('admin.php?action=op-gotowebinar-authorize&authorize=1')) . '</div>';
            } else if (false === get_transient(OP_SN . '_gtw_notification_disabled')) {
                echo '<div class="update-nag">' . sprintf(__('GoToWebinar access token is expired. Please <a href="%1$s">re-authorize</a> or <a href="%2$s">disable this notification</a>.', OP_SN), admin_url('admin.php?action=' . OP_GOTOWEBINAR_AUTH_URL) . '&authorize=1', admin_url('admin.php?action=optimizepress-disable-gtw-notification')) . '</div>';
            }
        }
    }

    /*
     * GoToWebinar deprecated old API,
     * we are checking if user is suing it
     */
    add_action('admin_notices', 'goToWebinarNewAPI');

    /**
     * Checks that 'optimizepress_gotowebinar_access_token'
     * is defined and if 'optimizepress_gotowebinar_api_secret'
     * is not empty (API v2)
     * @author OptimizePress <info@optimizepress.com>
     * @return void
     */
    function goToWebinarNewAPI()
    {
        $accessToken = op_get_option('gotowebinar_access_token');
        $apiSecret = op_get_option('gotowebinar_api_secret');

        if (false !== $accessToken && false === $apiSecret) {
            echo '<div class="update-nag">' . __('You are using a deprecated GoTowebinar API connection. Please <a href="'.admin_url() . 'admin.php?page=optimizepress-dashboard#email_marketing_services--gotowebinar'.'">re-connect</a>.', 'optimizepress') . '</div>';
        }
    }

    /*
     * Checking if API key is valid and displaying admin notice if not
     */
    add_action('admin_notices', 'checkApiKeyValidity');

    /**
     * Checks API key and URL combo validity
     *
     * Saves intermediate results to transient to avoid constant pinging of OP SL
     * @return void
     */
    function checkApiKeyValidity()
    {
        /*
         * Transient is not found
         */
        if (false === $validity = get_transient(OptimizePress_Sl_Api::OPTION_API_KEY_STATUS)) {
            $validity = array(
                'api_key'           => op_sl_get_key(),
                'installation_url'  => op_sl_get_url(),
                'status'            => op_sl_ping() === true ? 1 : 0,
            );
        }

        /*
         * If API key and URL combo is valid we are done
         */
        if ((int)$validity['status'] === 1
        && $validity['api_key'] === op_sl_get_key()
        && $validity['installation_url'] === op_sl_get_url()) {

            set_transient(OptimizePress_Sl_Api::OPTION_API_KEY_STATUS, $validity, (HOUR_IN_SECONDS * 6));
            return;
        }

        /*
         * We are nagging the user with our message
         */
        echo '<div class="update-nag">' . sprintf(__('There seems to be a problem with your OptimizePress API Key.  Please recheck it is entered correctly and if you still have problems <a href="%s" target="_blank">contact support</a>.', OP_SN), OP_SUPPORT_LINK) . '</div>';
    }

    /**
     * Checks if user is eligible for updates and show him nag message
     * @since  2.2.2
     * @return void
     */
    function checkEligibility()
    {
        /*
         * We'll only check eligiblity if API key is valid
         */
        if (false === ($validity = get_transient(OptimizePress_Sl_Api::OPTION_API_KEY_STATUS))
        || $validity['status'] !== 0) {
            return;
        }

        /*
         * User can disable eligibility notice, in that case nag won't be shown
         */
        if ('disabled' === get_transient(OptimizePress_Sl_Api::OPTION_ELIGIBILITY_STATUS . '_disabled')) {
            return;
        }

        /*
         * We need to skip if user hasn't added API key yet
         */
        $apiKey = op_sl_get_key();
        if (empty($apiKey)) {
            return;
        }

        /*
         * Lets check transients
         */
        if (false === $eligibility = get_transient(OptimizePress_Sl_Api::OPTION_ELIGIBILITY_STATUS)) {
            $eligibility = array(
                'installation_url'  => op_sl_get_url(),
                'status'            => op_sl_eligible() === true ? 1 : 0,
            );
        }

        /*
         * If API key and URL combo is valid we are done, and we'll save transient (to avoid false positive transient)
         */
        if ((int)$eligibility['status'] === 1
        && $eligibility['installation_url'] === op_sl_get_url()) {
            set_transient(OptimizePress_Sl_Api::OPTION_ELIGIBILITY_STATUS, $eligibility, (MINUTE_IN_SECONDS * 15));
            return;
        }

        /*
         * We are nagging the user with our message
         */
        echo '<div class="update-nag">' . sprintf(__('You are not eligible for new updates. You can <a href="%s" target="_blank">prolong your subscription</a> or <a href="%s">disable this notification</a>.', OP_SN), 'http://www.optimizepress.com/updates-renewal/', admin_url('admin.php?action=optimizepress-disable-eligibility')) . '</div>';
    }

    /*
     * Checks if user is eligible for updates and show him nag message
     */
    add_action('admin_notices', 'checkEligibility');

    /**
     * Disables eligibility check (sets WP option to 'disabled')
     * @since  2.2.2
     * @return void
     */
    function disableEligibilityCheck()
    {
        set_transient(OptimizePress_Sl_Api::OPTION_ELIGIBILITY_STATUS . '_disabled', 'disabled', 4 * WEEK_IN_SECONDS);
        wp_redirect(admin_url('index.php'));
    }

    /*
     * Hooking on admin action (for the purpose of disabling eligibility check as well as nagging user with notice)
     */
    add_action('admin_action_optimizepress-disable-eligibility', 'disableEligibilityCheck');

    /**
     * Disables GoToWebinar auth check
     * @return void
     */
    function disableGtwCheck()
    {
        set_transient(OP_SN . '_gtw_notification_disabled', 'disabled', YEAR_IN_SECONDS);
        wp_redirect(admin_url('index.php'));
    }

    /*
     * Disabling GTW notification
     */
    add_action('admin_action_optimizepress-disable-gtw-notification', 'disableGtwCheck');

    /**
     * Displays admin notice that both theme and plugin are activated
     * @author OptimizePress <info@optimizepress.com>
     * @return void
     */
    function pluginAndThemeAreRunning()
    {
        $currentTheme = wp_get_theme();
        /*
         * We are both checking the name and the version of the current theme to make sure that we don't display the notice when OP1 theme is used with OP2 plugin
         */
        if ('OptimizePress' === $currentTheme->Name && version_compare($currentTheme->Version, 2) > -1) {
            echo '<div class="update-nag">' . __('Both OptimizePress plugin and theme are running. You should deactivate one of them.', OP_SN) . '</div>';
        }
    }

    /*
     * called on admin_init
    */
    function load_plugin_screen() {
        if (isUserAnAdmin()) {
            add_thickbox();
            add_action( 'admin_notices', 'update_nag_screen' );
        }
    }

    /**
     * Checks if the user is an administrator
     * @return bool
     */
    function isUserAnAdmin(){
        return in_array('administrator',  wp_get_current_user()->roles);
    }

    /*
     * checking and adding admin notices for plugin update
    * @return void
    */
    function update_nag_screen() {
        //PLUGIN
        $response = get_transient('op_plugin_update');

        $plugin_version = OP_VERSION;
        $plugin_slug = OP_PLUGIN_SLUG;
        list ($t1, $t2) = explode('/', $plugin_slug);
        $pluginName = str_replace('.php', '', $t2);

        if (false === $response)
            return;

        $update_url = wp_nonce_url( 'update.php?action=upgrade-plugin&amp;plugin=' . urlencode($plugin_slug), 'upgrade-plugin_' . $plugin_slug);
        $update_onclick = '';

        if (isset($response->new_version) &&  version_compare( $plugin_version, $response->new_version, '<' ) ) {
            echo '<div id="update-nag">';
            printf(__('<strong>%1$s %2$s</strong> is available. <a href="%3$s" class="thickbox" title="%4s">Check out what\'s new</a> or <a href="%5$s"%6$s>update now</a>.', OP_SN),
            'OptimizePress Plugin',
            $response->new_version,
            admin_url('plugin-install.php?tab=plugin-information&plugin=' . OP_PLUGIN_SLUG  .'&section=changelog&TB_iframe=true&width=640'),
            'OptimizePress Plugin',
            $update_url,
            $update_onclick
            );
            echo '</div>';
            echo '<div id="' . $pluginName . '_' . 'changelog" style="display:none;">';
            echo wpautop($response->sections['changelog']);
            echo '</div>';
        }
    }

    /**
     * Take over plugin description screen.
     *
     * @param  false|object|array $def
     * @param  string $action
     * @param  object $args
     * @return false|object|array
     */
    function plugin_screen($def, $action, $args)
    {
        if (!isset($args->slug) || $args->slug !== OP_PLUGIN_SLUG) {
            return $def;
        }

        $obj = get_transient('op_plugin_update');

        if (false === $obj) {
            return $def;
        }

        return $obj;
    }
    add_filter('plugins_api', 'plugin_screen', 10, 3);

    /**
     * Check SL service for new version
     * @param array existing WordPress transient array
     * @return bool|WP_Error
     */
    function checkUpdate($transient)
    {
        if (!defined('OP_FUNC')) {
            return $transient;
        }
        $plugin_version = OP_VERSION;
        $plugin_slug = OP_PLUGIN_SLUG;
        list ($t1, $t2) = explode('/', $plugin_slug);
        $pluginName = str_replace('.php', '', $t2);

        if (!function_exists('op_sl_update')) {
            require_once OP_FUNC.'options.php';
            require_once OP_FUNC.'sl_api.php';
        }
        $apiResponse = op_sl_update('plugin');

        if (is_wp_error($apiResponse)) {
            return $transient;
        }

        if (version_compare($plugin_version, $apiResponse->new_version, '<')) {
            //prepare object for WordPress
            $obj                    = new stdClass();
            $obj->name              = __('OptimizePress Plugin', OP_SN);
            $obj->slug              = $t1;
            $obj->version           = $apiResponse->new_version;
            $obj->new_version       = $apiResponse->new_version;
            $obj->homepage          = $apiResponse->url;
            $obj->url               = $apiResponse->url;
            $obj->download_url      = isset($apiResponse->s3_package) ? $apiResponse->s3_package : $apiResponse->package;
            $obj->package           = isset($apiResponse->s3_package) ? $apiResponse->s3_package : $apiResponse->package;
            $obj->requires          = '3.5';
            $obj->tested            = '5.2.1';
            $obj->sections          = array(
                                        'description' => $apiResponse->section->description,
                                        'changelog' => $apiResponse->section->changelog,
                                    );

            $transient->response[$plugin_slug] = $obj;

            // set transient for 12 hours
            set_transient('op_plugin_update', $obj, (HOUR_IN_SECONDS * 12));
        }

        return $transient;
    }

    //this is for debug only, DON'T USE IN PRODUCTION
    //set_site_transient('update_plugins', null); //check version in every request, but also check op_theme_update transient. If is set, nothing will happen

    add_filter('pre_set_site_transient_update_plugins', 'checkUpdate');
    add_action('admin_init', 'load_plugin_screen');

    /**
     * Fetches new presigned S3 link just before download will occur
     * @param  array $transient
     * @return array
     */
    function checkS3Update($transient)
    {
        if (!defined('OP_FUNC')) {
            return $transient;
        }

        $plugin_version = OP_VERSION;
        $plugin_slug = OP_PLUGIN_SLUG;
        list($t1, $t2) = explode('/', $plugin_slug);

        /*
         * We are only going on SL to get freshly presigned S3 link if the preconditions are OK
         */
        $do = false;
        if (isset($_SERVER['SCRIPT_NAME']) && strpos($_SERVER['SCRIPT_NAME'], 'update.php')
        && isset($_GET['action']) && $_GET['action'] === 'upgrade-plugin'
        && isset($_GET['plugin']) && $_GET['plugin'] === OP_PLUGIN_SLUG) {
            // single plugin upgrade
            $do = true;
        } elseif (isset($_SERVER['SCRIPT_NAME']) && strpos($_SERVER['SCRIPT_NAME'], 'update.php')
        && isset($_GET['action']) && $_GET['action'] === 'update-selected'
        && isset($_GET['plugins']) && in_array(OP_PLUGIN_SLUG, explode(',', $_GET['plugins']))) {
            // multi plugin upgrade
            $do = true;
        } elseif (isset($_SERVER['SCRIPT_NAME']) && strpos($_SERVER['SCRIPT_NAME'], 'plugins.php')
        && ((isset($_POST['action']) && $_POST['action'] === 'update-selected') || (isset($_POST['action2']) && $_POST['action2'] === 'update-selected'))
        && isset($_POST['checked']) && in_array(OP_PLUGIN_SLUG, $_POST['checked'])) {
            // multi plugin upgrade
            $do = true;
        } elseif (isset($_SERVER['SCRIPT_NAME']) && strpos($_SERVER['SCRIPT_NAME'], 'update-core.php')
        && isset($_GET['action']) && $_GET['action'] === 'do-plugin-upgrade'
        && isset($_POST['checked']) && in_array(OP_PLUGIN_SLUG, $_POST['checked'])) {
            // update from dashboard
            $do = true;
        } elseif (defined('DOING_AJAX') && DOING_AJAX
        && isset($_POST['action']) && $_POST['action'] === 'update-plugin'
        && isset($_POST['slug']) && $_POST['slug'] === $t1) {
            // AJAX update
            $do = true;
        }
        if (false === $do) {
            return $transient;
        }

        if (!function_exists('op_sl_update')) {
            require_once OP_FUNC.'options.php';
            require_once OP_FUNC.'sl_api.php';
        }
        $apiResponse = op_sl_update('plugin');

        if (is_wp_error($apiResponse)) {
            return $response;
        }

        $obj                    = new stdClass();
        $obj->name              = __('OptimizePress Plugin', OP_SN);
        $obj->slug              = $t1;
        $obj->version           = $apiResponse->new_version;
        $obj->new_version       = $apiResponse->new_version;
        $obj->homepage          = $apiResponse->url;
        $obj->url               = $apiResponse->url;
        $obj->download_url      = $apiResponse->s3_package;
        $obj->package           = $apiResponse->s3_package;
        $obj->requires          = '3.5';
        $obj->tested            = '5.2.1';
        $obj->sections          = array(
            'description' => $apiResponse->section->description,
            'changelog' => $apiResponse->section->changelog,
        );

        $transient->response[$plugin_slug] = $obj;

        return $transient;
    }
    /*
     * Hooking on get_site_transient
     */
    add_filter('site_transient_update_plugins', 'checkS3Update');

    /*
     * Hooking on admin action (for the purpose of page cloning)
     */
    add_action('admin_action_optimizepress-page-cloning', 'clonePage');

    /**
     * Clones the page
     * @return void
     */
    function clonePage()
    {
        $id = (int) filter_input(INPUT_GET, 'page_id', FILTER_SANITIZE_NUMBER_INT);
        if (empty($id)) {
            wp_die(__('No page ID to duplicate has been provided!', OP_SN));
        }

        require_once OP_ADMIN . 'clone_page.php';

        $newId = OptimizePress_Admin_ClonePage::getInstance()->clonePage($id);

        wp_redirect(admin_url('post.php?action=edit&post=' . $newId));
    }

    /*
     * Registering directory filter
     */
    add_filter('op_dir_filter', 'filterDirectory', 10, 2);

    /**
     * Adding hidden folder/directory on a list based on a parent directory
     *
     * @author OptimizePress <info@optimizepress.com>
     * @since 2.1.4
     * @param  array $hiddenDirs
     * @param  string $dir
     * @return array
     */
    function filterDirectory($hiddenDirs, $dir)
    {
        /*
         * This is beeing used for filtering out pages/landing/4 for example, we created new theme which is created with normal
         * elements but needs to keep this one (4) for legacy purposes
         */
        if (strpos($dir, 'pages/landing')) {
            $hiddenDirs[] = '4';
        }

        return $hiddenDirs;
    }

    /*
     * Triggering deleting of custom post meta on post delete action
     */
    add_action('delete_post', 'deletePostMetaInOpTables');

    /**
     * Deletes post meta in OptimizePress custom DB tables (optimizepress_post_layouts)
     * @author OptimizePress <info@optimizepress.com>
     * @since 2.1.4
     * @param int $postId
     * @return bool
     */
    function deletePostMetaInOpTables($postId)
    {
        global $wpdb;

        /*
         * optimizepress_post_layouts
         */
        if ($wpdb->get_var( $wpdb->prepare('SELECT post_id FROM ' . $wpdb->prefix . 'optimizepress_post_layouts WHERE post_id = %d', $postId))) {
            return $wpdb->query($wpdb->prepare('DELETE FROM ' . $wpdb->prefix . 'optimizepress_post_layouts WHERE post_id = %d', $postId));
        }

        /*
         * optimizepress_launchfunnels_pages
         */
        if ($wpdb->get_var( $wpdb->prepare('SELECT page_id FROM ' . $wpdb->prefix . 'optimizepress_launchfunnels_pages WHERE page_id = %d', $postId))) {
            return $wpdb->query($wpdb->prepare('DELETE FROM ' . $wpdb->prefix . 'optimizepress_launchfunnels_pages WHERE page_id = %d', $postId));
        }

        return true;
    }

    /**
     * Adding 'op-live-editor-page' class to <body /> on pages created with LE
     * @author OptimizePress <info@optimizepress.com>
     * @param  array $classes
     * @return array
     */
    function leBodyClass($classes)
    {
        if (true === is_le_page() && !in_array('op-live-editor-page', $classes)) {
            $classes[] = 'op-live-editor-page';
        }

        $classes[] = 'op-' . OP_TYPE;

        return $classes;
    }

    /*
     * Attaching on body class filter to add custom class for LE created pages
     */
    add_filter('body_class', 'leBodyClass', 10);

    /**
     * Checking if PHP version is greater or equall than recommended version (5.3)
     *
     * Additional checks can be implemented later on
     * @author OptimizePress <info@optimizepress.com>
     * @since 2.1.6
     * @return void
     */
    function compatibilityCheck()
    {
        if (version_compare(PHP_VERSION, '5.3', '<')) {
            echo '<div class="update-nag">' . sprintf(__('Your PHP version (%s) is lower than recommended (%s) by OptimizePress and therefore some features might not work. <a href="%s">Check compatibility</a>.', 'optimizepress'), PHP_VERSION, '5.3', admin_url('admin.php?page=optimizepress-dashboard#global_settings--compatibility_check')) . '</div>';
        }
    }

    /*
     * Attaching on admin_notices to check if PHP version is greater or equall than recommended (5.3)
     */
    add_action('admin_notices', 'compatibilityCheck');

    /*
     * Default filter value for addon row options
     */
    add_filter('op_inside_row', '__return_empty_string', 111);

    /**
     * Remove registered JS scripts
     * @since 2.3.0
     * @return void
     */
    function opRemoveScripts()
    {
        /*
         * Not a LE page and not a LE backend, let's leave this joint
         */
        if (false === is_le_page() && false === defined('OP_LIVEEDITOR')) {
            return;
        }

        $prefix = 'op_';

        /*
         * If LE backend then modify prefix
         */
        if (defined('OP_LIVEEDITOR')) {
            $prefix = 'op_le_';
        }

        $js         = op_get_option($prefix . 'external_plugins_js');
        $themeJs    = (int) op_get_option($prefix . 'external_theme_js');
        if (is_array($js) || $themeJs) {
            global $wp_scripts;
            /*
             * Traversing through collection of all registered scripts
             */
            foreach ($wp_scripts->registered as $key => $dependency) {
                if (is_array($js)) {
                    /*
                     * Traversing through collection of "unwanted" plugins
                     */
                    if (count($js) > 0) {
                        foreach ($js as $script) {
                            if (strpos($dependency->src, 'plugins/' . $script . '/')) {
                                wp_deregister_script($key);
                            }
                        }
                    }
                }
                /*
                 * Deregistering theme JS files if we are using plugin and if necessary checkbox is checked
                 */
                if (OP_TYPE === 'plugin' && $themeJs === 1 && strpos($dependency->src, 'themes')) {
                    wp_deregister_script($key);
                }
            }
        }
    }
    add_action('wp_print_scripts', 'opRemoveScripts', 10);

    /**
     * Remove registered CSS styles
     * @since 2.3.0
     * @return void
     */
    function opRemoveStyles()
    {
        /*
         * Not a LE page and not a LE backend, let's leave this joint
         */
        if (false === is_le_page() && false === defined('OP_LIVEEDITOR')) {
            return;
        }

        $prefix = 'op_';

        /*
         * If LE backend then modify prefix
         */
        if (defined('OP_LIVEEDITOR')) {
            $prefix = 'op_le_';
        }

        $css        = op_get_option($prefix . 'external_plugins_css');
        $themeCss   = (int) op_get_option($prefix . 'external_theme_css');
        if (is_array($css) || $themeCss) {
            global $wp_styles;
            /*
             * Traversing through collection of all registered styles
             */
            foreach ($wp_styles->registered as $key => $dependency) {
                if (is_array($css)) {
                    /*
                     * Traversing through collection of "unwanted" plugins
                     */
                    if (count($css) > 0) {
                        foreach ($css as $style) {
                            if (strpos($dependency->src, 'plugins/' . $style . '/')) {
                                wp_deregister_style($key);
                            }
                        }
                    }
                }
                /*
                 * Deregistering theme CSS files if we are using plugin and if necessary checkbox is checked
                 */
                if (OP_TYPE === 'plugin' && $themeCss === 1 && strpos($dependency->src, '/themes/')) {
                    wp_deregister_style($key);
                }
            }
        }
    }
    add_action('wp_print_styles', 'opRemoveStyles', 10);

    /**
     * Register OptimizePress translation textdomain
     * @since 2.3.5
     * @return void
     */
    function loadOptimizePressTextDomain() {
        load_plugin_textdomain( 'OptimizePress', false, dirname( plugin_basename( __FILE__ ) ) . '/languages' );
    }
    add_action( 'plugins_loaded', 'loadOptimizePressTextDomain' );

    /**
     * Check if WPML plugin is installed on website
     * @since 2.5.1.2
     */
    if ( defined('ICL_SITEPRESS_VERSION') ) {
        /**
         * Adds button to translation sidebar for coping OptimizePress content
         * @since 2.5.1.2
         * @return void
         */
        function wpmlCopyContentFromOriginalLanguage(){
            if (isset($_GET['lang'])){
                $iclQuestionIcon = ICL_PLUGIN_URL . '/res/img/question1.png';
                $iclCloseIcon = ICL_PLUGIN_URL . '/res/img/ico-close.png';

                echo '<label><input name="icl_copyOPTranslation" type="checkbox">' . __('Copy OptimizePress content', 'optimizepress') . '</label>';
                echo "
                <div class='icl_pop_info_wrap'>
                    <img class='icl_pop_info_but ' src='$iclQuestionIcon' width='16' height='16' alt='info'>

                    <div class='icl_cyan_box icl_pop_info'>
                        <img class='icl_pop_info_but_close' align='right' src='$iclCloseIcon' width='12' height='12' alt='x'>";
                _e('After you publish the page, content from original LiveEditor page will be copied to your translation page.', 'optimizepress');
                echo "
                    </div>
                </div>
                ";
            }
        }
        add_action('icl_post_languages_options_after','wpmlCopyContentFromOriginalLanguage');

        /**
         * Copies LiveEditor page from original page to translation page - post_layouts table and all postmeta information
         * @since 2.5.1.2
         * @return void
         */
        function setElementLanguageOriginal($translation_id, $el_id, $language_code, $trid){
            if (isset($_POST['icl_copyOPTranslation']) && isset($_POST['icl_translation_of'])){
                $postTranslation_id = intval($_POST['icl_translation_of']);
                $checkIfLEPage = get_post_meta( $postTranslation_id, '_optimizepress_pagebuilder', true );
                if ($checkIfLEPage == 'Y'){
                    require_once OP_ADMIN . 'clone_page.php';
                    OptimizePress_Admin_ClonePage::getInstance()->cloneOpData($postTranslation_id,$el_id);

                    $post_meta_keys = get_post_custom_keys($postTranslation_id);
                    if (empty($post_meta_keys)){
                        return;
                    }

                    foreach ($post_meta_keys as $meta_key) {
                        $meta_values = get_post_custom_values($meta_key, $postTranslation_id);
                        foreach ($meta_values as $meta_value) {
                            $meta_value = maybe_unserialize($meta_value);
                            update_post_meta($el_id, $meta_key, $meta_value);
                        }
                    }
                }
            }
        }
        add_action( 'icl_set_element_language', 'setElementLanguageOriginal', 10, 4);
    }

    /**
     * Disabling Gutenberg editor for Live Editor pages
     *
     * @return bool
     */
    function op2_disable_gutenberg()
    {
        global $post;
        if (isset($post->ID) && is_le_page($post->ID))
            return false;

        return true;
    }

    // core Gutenberg version filter
    add_filter('use_block_editor_for_post_type', 'op2_disable_gutenberg', 100);
    // Gutenberg plugin version filter
    add_filter('gutenberg_can_edit_post', 'op2_disable_gutenberg');
}

if (!class_exists('Op_Arrow_Walker_Nav_Menu')) {
    class Op_Arrow_Walker_Nav_Menu extends Walker_Nav_Menu
    {
        public function display_element($el, &$children, $max_depth, $depth = 0, $args, &$output)
        {
            $id = $this->db_fields['id'];

            if(isset($children[$el->$id])) {
                $el->classes[] = 'has_children';
            }

            parent::display_element($el, $children, $max_depth, $depth, $args, $output);
        }
    }
}

add_action('admin_notices', 'pluginAndThemeAreRunning');

/**
 * Akismet 3.0 - 3.1.7, we are deregistering their comment_form script and returning it in /lib/functions/scripts.php
 * in op_register_scripts method
 */
if (defined('AKISMET__PLUGIN_URL')) {
    if (!function_exists('akismet_fix')) {
        add_action('wp_print_scripts', 'akismet_fix');
        function akismet_fix()
        {
            if (defined('AKISMET_VERSION') && version_compare(AKISMET_VERSION, '3.0.0') >= 0) {
                wp_deregister_script('akismet-form');
            }
        }
    }
}

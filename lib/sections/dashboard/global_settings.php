<?php
class OptimizePress_Sections_Global_Settings {
    function sections(){
        static $sections;
        if(!isset($sections)){
            $sections = array(
                'api_key' => array(
                    'title' => __('API Key', 'optimizepress'),
                    'action' => array($this,'api_key'),
                    'save_action' => array($this,'save_api_key')
                ),
                'google_recaptcha' => array(
                    'title' => __('Google ReCaptcha v3', 'optimizepress'),
                    'action' => array($this,'google_recaptcha'),
                    'save_action' => array($this,'save_google_recaptcha')
                ),
                'header_logo_setup' => array(
                    'title' => __('Header & Logo Setup', 'optimizepress'),
                    'action' => array($this,'header_logo_setup'),
                    'save_action' => array($this,'save_header_logo_setup')
                ),
                'favicon_setup' => array(
                    'title' => __('Favicon Setup', 'optimizepress'),
                    'action' => array($this,'favicon_setup'),
                    'save_action' => array($this,'save_favicon_setup')
                ),
                'site_footer' => array(
                    'title' => __('Site Footer', 'optimizepress'),
                    'action' => array($this,'site_footer'),
                    'save_action' => array($this,'save_site_footer')
                ),
                'seo' => array(
                    'title' => __('SEO Options', 'optimizepress'),
                    'module' => 'seo',
                    //'options' => op_theme_config('mod_options','seo'),
                    'on_off' => true,
                ),
                'autosave' => array(
                    'title' => __('LiveEditor Autosave', 'optimizepress'),
                    'module' => 'autosave',
                    'options' => op_theme_config('mod_options','autosave')
                ),
                'promotion' => array(
                    'title' => __('Promotion Settings', 'optimizepress'),
                    'module' => 'promotion',
                    'options' => op_theme_config('mod_options','promotion')
                ),
                'custom_css' => array(
                    'title' => __('Custom CSS (Sitewide)', 'optimizepress'),
                    'action' => array($this,'custom_css'),
                    'save_action' => array($this,'save_custom_css')
                ),
                'typography' => array(
                    'title' => __('Typography', 'optimizepress'),
                    'action' => array($this,'typography'),
                    'save_action' => array($this,'save_typography')
                ),
                'templates_reset' => array(
                    'title' => __('Content Templates', 'optimizepress'),
                    'action' => array($this,'templates_reset'),
                    'save_action' => array($this,'content_templates_reset')
                ),
                'flowplayer_license' => array(
                    'title' => __('Flowplayer License', 'optimizepress'),
                    'action' => array($this, 'flowplayer_license'),
                    'save_action' => array($this, 'save_flowplayer_license'),
                ),
                'fancybox_images' => array(
                    'title' => __('Fancybox for Images', 'optimizepress'),
                    'module' => 'fancybox_images',
                    'options' => op_theme_config('mod_options','fancybox_images')
                ),
            );

            //only when PlusPack is active show this section
            if (defined('OPPP_VERSION')) {
                $sections['gmaps_api'] = array(
                    'title' => __('Google Maps Api Key', 'optimizepress'),
                    'action' => array($this, 'gmaps_api_key'),
                    'save_action' => array($this, 'save_gmaps_api_key'),
                );
            }

            $sections = apply_filters('op_edit_sections_global_settings',$sections);
        }
        return $sections;
    }

    /* Content templates reset section*/
    function templates_reset()
    {
        echo op_load_section('templates_reset');
    }

    function content_templates_reset($op)
    {
        $reset = op_get_var($op, 'content_templates_reset');
        if (!empty($reset)) {
            global $wpdb;

            // removing old templates from db
            $sql = "delete from " . $wpdb->prefix . "optimizepress_predefined_layouts";
            $wpdb->query($sql);
            // removing option
            delete_option(OP_SN . '_content_templates_version');
            require_once (OP_ADMIN . 'install.php');
            $install = new OptimizePress_Install();
            $install->install_content_templates();
        }
    }

    /* API key Section */
    function api_key(){
        echo op_load_section('api_key');
    }

    function save_api_key($op){
        $key = trim(op_get_var($op, OptimizePress_Sl_Api::OPTION_API_KEY_PARAM));
        $status = op_sl_register($key);
        if (is_wp_error($status)) {
            op_group_error('global_settings');
            op_section_error('global_settings_api_key');
            op_tpl_error('op_sections_' . OptimizePress_Sl_Api::OPTION_API_KEY_PARAM, __('API key is invalid. Please re-check it.', 'optimizepress'));
        } else {
            op_sl_save_key($key);
        }
    }

    /* Google ReCaptcha Section */
    function google_recaptcha(){
        echo op_load_section('google_recaptcha');
    }

    function save_google_recaptcha($op) {
        $section = op_get_var($op, 'google_recaptcha');
        op_update_option('google_recaptcha_site_key', op_get_var($section,'google_recaptcha_site_key'));
        op_update_option('google_recaptcha_secret_key', op_get_var($section,'google_recaptcha_secret_key'));
    }

    /* Header & Logo Setup Section */
    function header_logo_setup(){
        echo op_load_section('header_logo_setup', array(), 'global_settings');
    }

    function save_header_logo_setup($op){
        if ($header_logo_setup = op_get_var($op, 'header_logo_setup')){
            op_update_option('header_logo_setup', $header_logo_setup);
        }
    }

    /* Favicon Section */
    function favicon_setup(){
        echo op_load_section('favicon_setup', array(), 'global_settings');
    }

    function save_favicon_setup($op){
        op_update_option('favicon_setup', op_get_var($op,'favicon_setup'));
    }

    /* Site Footer Section */
    function site_footer(){
        echo op_load_section('site_footer', array(), 'global_settings');
    }

    function save_site_footer($op){
        if ($site_footer = op_get_var($op, 'site_footer')){
            op_update_option('site_footer', $site_footer);
        }
    }

    /* Custom CSS Section */
    function custom_css(){
        echo op_load_section('custom_css', array(), 'global_settings');
    }

    function save_custom_css($op){
        //if ($custom_css = op_get_var($op, 'custom_css')){
        op_update_option('custom_css', op_get_var($op, 'custom_css'));
        //}
    }

    /* Typography */
    function typography(){
        echo op_load_section('typography', array(), 'global_settings');
    }

    function save_typography($op){
        if(isset($op['default_typography'])){
            $op = $op['default_typography'];
            $typography = op_get_option('default_typography');
            $typography = is_array($typography) ? $typography : array();
            $typography_elements = op_typography_elements();
            $typography_elements['color_elements'] = array(
                'link_color' => '',
                'link_hover_color' => '',
                'footer_text_color' => '',
                'footer_link_color' => '',
                'footer_link_hover_color' => '',
                'feature_text_color' => '',
                'feature_link_color' => '',
                'feature_link_hover_color' => ''
            );
            $typography['font_elements'] = op_get_var($typography,'font_elements',array());
            $typography['color_elements'] = op_get_var($typography,'color_elements',array());
            if(isset($typography_elements['font_elements'])){
                foreach($typography_elements['font_elements'] as $name => $options){
                    $tmp = op_get_var($op,$name,op_get_var($typography['font_elements'],$name,array()));
                    $typography['font_elements'][$name] = array(
                        'size' => op_get_var($tmp,'size'),
                        'font' => op_get_var($tmp,'font'),
                        'style' => op_get_var($tmp,'style'),
                        'color' => op_get_var($tmp,'color'),
                    );
                }
            }
            if(isset($typography_elements['color_elements'])){
                foreach($typography_elements['color_elements'] as $name => $options){
                    $typography['color_elements'][$name] = $op[$name];
                }
            }
            op_update_option('default_typography',$typography);

            //Check for blanks so we can set the defaults.
            //Otherwise a refresh would be necessary to see the defaults.
            // op_set_font_defaults();
        }
    }

    function flowplayer_license()
    {
        echo op_load_section('flowplayer_license', array(), 'global_settings');
    }

    function save_flowplayer_license($op)
    {
        if (empty($op['flowplayer_license']['custom_logo']) && empty($op['flowplayer_license']['license_key'])
        && empty($op['flowplayer_license']['js_file']) && empty($op['flowplayer_license']['swf_file'])) {
            /*
             * If every param is empty, we aren't trying to license flowplayer
             */
            op_delete_option('flowplayer_license');
            return;
        } else if (empty($op['flowplayer_license']['license_key']) || empty($op['flowplayer_license']['js_file']) || empty($op['flowplayer_license']['swf_file'])) {
            op_group_error('global_settings');
            op_section_error('global_settings_flowplayer_license');
            op_tpl_error('op_sections_flowplayer_license', __('To remove Flowplayer watermark and/or to use custom logo, license key, HTML5 and Flash commercial version files needs to be present.', 'optimizepress'));
        }

        op_update_option('flowplayer_license', $op['flowplayer_license']);
    }

    /**
     * Display /tpl/sections/global_settings/gmaps_api_key.php in OptimizePress Dashboard
     */
    function gmaps_api_key() {
        echo op_load_section('gmaps_api_key', array(), 'global_settings');
    }

    /**
     * Validate and save Google maps api
     */
    function save_gmaps_api_key($op) {
        if (false === $this->checkIfApiKeyIsValid($op['gmaps_api_key'])) {
            op_group_error('global_settings');
            op_section_error('global_settings_gmaps_api');
            op_tpl_error('op_sections_gmaps_api_key', __('It seems that your API key is not valid. Please, check your API key in your Google API Console and provide a valid one.', 'optimizepress'));

            return;
        }

        //$dataToBePassed = array('gmaps_api_key' => __( $op['gmaps_api_key'] ));
        //wp_localize_script( 'op_gmaps_api_key', 'OptimizePressGmapsApiKey', $dataToBePassed );

        op_update_option('gmaps_api_key', $op['gmaps_api_key']);
    }

    /**
     * Validate the API key for google maps by trying to access google geocode api
     * This approach is used because there is no backend straight foward way to test if api key is valid for Google Maps Javascrip API
     *
     * @param  string  $api_key
     * @return boolean
     */
    function checkIfApiKeyIsValid($api_key) {
        if ($api_key === '') {
            return;
        }

        $response = json_decode(wp_remote_retrieve_body(wp_remote_get('https://maps.googleapis.com/maps/api/geocode/json?key='. $api_key .'&address=Infinite%20Loop%201,%20Cupertino')));

        if (isset($response->error_message)) {
            if (strpos($response->error_message, 'invalid') !== false) {
                return false;
            }
        } 

        return true;
    }

}
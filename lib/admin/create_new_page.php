<?php

class OptimizePress_CreateNewPage
{

    var $cur_step;
    var $sections;
    var $error = false;
    var $notification = false;
    var $post;

    function __construct()
    {
        // Init the function to add the menu in
        add_action('admin_menu', array($this, 'admin_menu'), 20);

        // ajaxian
        add_action('wp_ajax_'.OP_SN.'-preview-content-layout', array($this, 'content_layout_preview'));
        add_action('wp_ajax_'.OP_SN.'-create-new-page-content-layouts', array($this, 'create_new_page_ajax'));

   }

    /**
     * Create the menus
     */
    function admin_menu()
    {
        // Add the submenu
        $page = add_submenu_page(OP_SN, __('Create New Page', 'optimizepress'), __('Create New Page', 'optimizepress'), 'edit_theme_options', OP_SN, array($this,'create_new_page'));
        add_action('load-'.$page, array($this,'load_create_new_page'));

        /**
         * If first subpage isn't the same as parent page, original submenu is displayed.
         * We don't want this, so we remove it.
         */
        // remove_submenu_page(OP_SN, OP_SN);

        // Load page functions, styles and scripts
        add_action('admin_print_styles-'.$page, array($this,'print_scripts'));

    }

    function print_scripts()
    {
        wp_enqueue_style(OP_SN.'-admin-create-new-page-styles', OP_CSS.'create_new_page'.OP_SCRIPT_DEBUG.'.css', array(OP_SN.'-admin-common'), OP_VERSION);
        // wp_enqueue_script(OP_SN.'-admin-create-new-page-scripts', OP_JS.'create_new_page'.OP_SCRIPT_DEBUG.'.js', array(OP_SN.'-noconflict-js', OP_SN.'-admin-common', OP_SN.'-fancybox'), OP_VERSION);
    }

    /*
    function dequeue_print_scripts() {
        wp_dequeue_style(OP_SN.'-admin-live-editor');
        wp_dequeue_style(OP_SN.'-live_editor');
        wp_dequeue_script(OP_SN.'-admin-live-editor');
    }
    */

    /**
     * We create a dummy (draft) page that is populated for content preview.
     */
    function content_layout_preview()
    {

        global $user_ID;
        global $wpdb;

        $page = get_page_by_path('op_content_layout_preview_page');

        // Page already exists
        if (is_object($page)) {

            $page_id = $page->ID;

        } else {

            $page['post_type'] = 'page';
            $page['post_content'] = '';
            $page['post_parent'] = 0;
            $page['post_author'] = $user_ID;
            $page['post_status'] = 'op_preview';
            $page['post_title'] = 'OptimizePress Content Preview Page';
            $page['post_name'] = 'op_content_layout_preview_page';

            $page_id = wp_insert_post($page);

            /* Add Page Failed */
            if ($page_id == 0) {
                die('Error creating new page.');
            }

        }

        echo get_permalink($page_id) . '?op-no-admin-bar=true';
        define('OP_PAGEBUILDER_ID', $page_id);

        $template = $_POST['template'];
        /*$result = $wpdb->get_row($wpdb->prepare(
            "SELECT `layouts`,`settings`,`guid` FROM `{$wpdb->prefix}optimizepress_predefined_layouts` WHERE `id`=%d ORDER BY name ASC",
            $template
        ));*/
        $result = $wpdb->get_row($wpdb->prepare(
            "SELECT `layouts`,`settings` FROM `{$wpdb->prefix}optimizepress_predefined_layouts` WHERE `id`=%d ORDER BY name ASC",
            $template
        ));

        $keep = op_post('keep_options');
        if (!is_array($keep)) {
            $keep = array();
        }

        // Set page template ID if it exists - this will be used for stats and analytics
        /*if (isset($result->guid) && !empty($result->guid)) {
            op_update_page_option('template_id', $result->guid);
        }*/

        op_update_page_option('pagebuilder', 'Y');
        op_page_set_saved_settings($result, $keep);

        die();

    }

    /**
     * Get the data that is needed for content templates
     */
    function get_content_templates_data()
    {
        return array(
            'module_name' => 'create_new_page',
            'error' => $this->error,
            'notification' => $this->notification,
            'content_layouts' => $this->get_content_layouts(),
            'blank_templates' => $this->get_marketing_templates(),
            'op_template_sections' => array(
                'blank' => 'op-blank-template',
                'membership' => 'op-membership-template',

                // landing is opt-in
                'landing' => 'op-landing-template',
                'opt-in' => 'op-landing-template',

                'webinar' => 'op-webinar-template',
                'sales' => 'op-sales-template',
                'launch' => 'op-funnel-template',
                'other' => 'op-other-template'
            )
        );
    }

    /**
     * This function is called when the Create New Page is displayed
     */
    function create_new_page()
    {

        // Create the data array for use in template
        $data = $this->get_content_templates_data();

        // Echo out the template
        echo op_tpl('create_new_page/index', $data);
    }

    /**
     * I don't know why this works, but it works.
     * I need it because I want to know in scripts.php if current page is CREATE NEW PAGE, and that seems to be a good way fo find out.
     * It works the same in page_builder.php
     */
    function load_create_new_page()
    {
        define('OP_CREATE_NEW_PAGE',true);
    }

    function create_new_page_ajax()
    {
        $data = $this->get_content_templates_data();

        // Echo out the template
        echo op_tpl('create_new_page/content_templates', $data);
        die();
    }

    /**
     * Returns the list of all available content layouts
     * @return array
     */
    function get_content_layouts()
    {

        global $wpdb;

        $content_layouts = array();
        $results = $wpdb->get_results("SELECT * FROM `{$wpdb->prefix}optimizepress_layout_categories` ORDER BY name ASC");

        if ($results) {

            $selected = false;
            $nr = 0;

            foreach($results as $result) {

                $content_layouts[$nr]['name'] = $result->name;

                $results2 = $wpdb->get_results($wpdb->prepare(
                    "SELECT * FROM `{$wpdb->prefix}optimizepress_predefined_layouts` WHERE category=%d ORDER BY name ASC",
                    $result->id
                ));

                if ($results2) {
                    $tmp = array(
                        'name' => $result->name,
                        'item_html' => ''
                    );

                    $previews = array();

                    foreach($results2 as $result2){
                        $input_attr = $li_class = '';
                        if ($selected === false) {
                            $input_attr = ' checked="checked"';
                            $li_class = 'img-radio-selected';
                            $selected = true;
                        }
                        list($t1, $t2) = explode('|', $result2->description);

                        $content_layouts[$nr]['templates'][] = array(
                            'image' => $t2,
                            'width' => 212,
                            'height' => 156,
                            'tooltip_title' => $result2->name,
                            'tooltip_description' => wpautop($t1),
                            'preview_content' => $result2->name,
                            'input' => '<input type="radio" id="op_content_layout_'.$result2->id.'" name="op[page][content_layout]" value="'.$result2->id.'"'.$input_attr.' />',
                            'content_layout_id' => $result2->id,
                            'li_class' => $li_class,
                            'settings' => unserialize(base64_decode($result2->settings))
                        );
                    }

                }

                $nr += 1;

            }

            return $content_layouts;

        }

    }

    /**
     * Returns the list of blank marketing templates
     * @return array
     */
    function get_marketing_templates()
    {

        $dirs = op_dir_list(OP_PAGES . 'marketing');
        // we are sorting them
        sort($dirs);

        foreach($dirs as $key){

            $path = OP_PAGES . 'marketing/' . $key;
            $theme_url = OP_URL . 'pages/marketing/' . $key . '/';

            if (file_exists($path . '/config.php')) {

                op_textdomain(OP_SN.'_p_' . $key, $path . '/');
                require_once $path.'/config.php';

                $blank_themes[] = array('name' => $config['name'],
                              'screenshot' => $theme_url . $config['screenshot'],
                              'screenshot_thumbnail' => $theme_url . $config['screenshot_thumbnail'],
                              'description' => $config['description'],
                              'dir' => $key);
            }

        }

        return $blank_themes;

    }

}
new OptimizePress_CreateNewPage();
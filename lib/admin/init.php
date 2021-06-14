<?php
class OptimizePress_Admin_Init
{
    var $installed = false;
    var $print_scripts_initialized = false;

    function __construct()
    {
        if(current_user_can('edit_theme_options')){
            add_action('admin_enqueue_scripts',array($this,'print_scripts'));
            if(op_get_option('installed') != 'Y' || false === op_sl_get_key()) {
                require_once OP_ADMIN.'install.php';
            } else {
                $this->installed = true;
                add_action('edit_form_after_title', array($this, 'remove_content_editor'));
                add_filter('page_row_actions', array($this, 'addOpLinks'), 10, 2);
                $this->initalize_theme();
                $this->include_admin_files();
                if(isset($_REQUEST['op_uploader']) && $_REQUEST['op_uploader'] == 'true'){
                    add_filter(OP_SN.'-script-localize',array($this,'op_localize'));
                    add_action('admin_print_scripts-media-upload-popup', array($this, 'media_js'));
                }
            }
            add_action('admin_init',array($this,'init_admin'));
        }

        add_action('admin_menu',array($this,'admin_menu'), 7);
    }

    function remove_content_editor()
    {
        global $post;
        $pb = (get_post_meta($post->ID,'_'.OP_SN.'_pagebuilder',true) == 'Y');
        if ($pb) {
            remove_post_type_support( 'page', 'editor' );
        }
    }

    function addOpLinks($actions, $page_object)
    {
        global $post;

        if (get_post_meta($page_object->ID,'_'.OP_SN.'_pagebuilder',true) == 'Y') {
            $actions['op_live_editor'] = "<a class='op-pagebuilder' href='" . admin_url("admin.php?page=optimizepress-page-builder&page_id=".$page_object->ID."&step=5") . "'>" . __('Live Editor', 'optimizepress') . "</a>";
        }
        
        $op3 = function_exists('is_op3_page') && is_op3_page($post->ID);

        if (! $op3) {
            $actions['op_page_clone'] = "<a class='op-clone' href='" . admin_url("admin.php?action=optimizepress-page-cloning&page_id=" . $page_object->ID . "") . "'>" . __('Clone Page', 'optimizepress') . "</a>";
        }

        return $actions;
    }

    function init_admin()
    {
        global $pagenow;
        if ('themes.php' == $pagenow && isset($_GET['activated'])){
            //op_post_types();
            //flush_rewrite_rules();
            wp_redirect(menu_page_url(OP_SN.($this->installed?(op_get_option('blog_enabled')=='Y'?'':'-setup-wizard'):''),false));
        }
    }

    function media_js()
    {
        wp_enqueue_script(OP_SN.'-admin-media-upload', OP_JS.'media_upload.js', array(OP_SCRIPT_BASE), OP_VERSION);
    }

    function op_localize($array)
    {
        $array['media_insert'] = __('Insert into Post', 'optimizepress');
        $disable = 'N';
        if(isset($_REQUEST['op_uploader_url_disable'])){
            $disable = 'Y';
        }
        $array['media_disable_url'] = $disable;
        return $array;
    }

    function initalize_theme()
    {
        $pages = array(OP_SN,OP_SN.'-setup-wizard');
        $reinit_theme = $reinit_page_theme = false;
        $disable_theme = false;
        if(isset($_GET['page'])){
            if($_GET['page'] == OP_SN || $_GET['page'] == OP_SN.'-setup-wizard'){
                $cur = op_get_option('theme','dir');
                if(isset($_GET['theme_switch']) && $_GET['theme_switch'] != $cur &&
                    (($conf = op_load_theme_config($_GET['theme_switch'])) !== false)){
                    $theme = array('name' => $conf['name'],
                                   'screenshot' => $conf['screenshot'],
                                   'screenshot_thumbnail' => $conf['screenshot_thumbnail'],
                                   'description' => $conf['description'],
                                   'dir' => $_GET['theme_switch']);
                    op_update_option('theme',$theme);
                    $reinit_theme = true;
                }
            } elseif($_GET['page'] == OP_SN.'-page-builder'){
                $disable_theme = true;
            }
        } elseif(defined('DOING_AJAX')){
            $action = '';
            if(!$action = op_get('action')){
                $action = op_post('action');
            }
            $chk = OP_SN.'-live-editor';
            if(is_string($action) && substr($action,0,strlen($chk)) == $chk){
                $disable_theme = true;
            }
        }
        if($disable_theme === false){
            op_init_theme();
            define('OP_REINIT_THEME',$reinit_theme);
            if($reinit_theme){
                define('OP_SHOW_THEME_MSG',($cur!==false));
                do_action(OP_SN.'-reinit_theme');
            }
        }
    }

    function admin_menu()
    {
        if (get_option('optimizepress_installed') == 'Y'){
            add_menu_page('OptimizePress', 'OptimizePress', 'edit_theme_options', OP_SN, array(),OP_LIB_URL.'images/op_menu_image16x16.png','30.284567');
        }
    }

    function include_admin_files()
    {
        global $pagenow;
        require_once OP_ADMIN.'create_new_page.php';
        require_once OP_ADMIN.'dashboard.php';
        //require_once OP_ADMIN.'theme_settings.php';
        //require_once OP_ADMIN.'wizard.php';
        require_once OP_ADMIN.'page_builder.php';
        require_once OP_ADMIN.'launch_suite.php';
        require_once OP_ADMIN.'support.php';
        require_once OP_ADMIN.'stats.php';
        if ( in_array( $pagenow, array( 'post.php', 'post-new.php', 'page-new.php', 'page.php' ) ) ) {
            if ( ! current_user_can('edit_posts') && ! current_user_can('edit_pages') )
                return;
            if (get_user_option('rich_editing') != 'true')
                return;
            define('OP_POST_PAGE',true);
            require_once OP_ADMIN.'post_page.php';
            require_once OP_ADMIN.'assets.php';
        }
        if(defined('DOING_AJAX')){
            require_once OP_ADMIN.'assets.php';
        }
    }

    function print_scripts()
    {

        if ($this->print_scripts_initialized == true)  {
            return false;
        }
        $this->print_scripts_initialized = true;

        // Register & enqueue scripts
        op_enqueue_base_scripts();
        op_enqueue_backend_scripts();
        op_enqueue_fancybox_images();

        // Styles
        wp_enqueue_style(OP_SN.'-admin-assets', OP_CSS.'assets'.OP_SCRIPT_DEBUG.'.css', array(OP_SN.'-admin-common'), OP_VERSION);
        wp_register_style(OP_SN.'-admin-common', OP_CSS.'common'.OP_SCRIPT_DEBUG.'.css', array('farbtastic','thickbox'), OP_VERSION);
    }
}
new OptimizePress_Admin_Init();

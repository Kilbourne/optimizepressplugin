<?php
class OptimizePress_ThemeSettings
{
    var $cur_step;
    var $sections;
    var $error = false;
    var $notification = false;

    function __construct()
    {
        add_action('admin_menu',array($this,'admin_menu'), 40);
        add_action('wp_ajax_'.OP_SN.'-enable-blog', array($this, 'enable_blog'));
    }

    function enable_blog()
    {
        if(isset($_POST['_wpnonce']) && wp_verify_nonce($_POST['_wpnonce'],'op_theme_settings')){
            $enabled = op_get_var($_POST,'enabled','N');
            $enabled = ($enabled == 'Y' || $enabled == 'N' ? $enabled : 'N');
            op_update_option('blog_enabled',$enabled);
            $arr = array('done'=>true);
        } else {
            $arr = array('error' => __('Verification failed, please refresh the page and try again.', 'optimizepress'));
        }
        echo json_encode($arr);
        exit;
    }

    function get_sections()
    {
        if(!isset($this->sections)){
            if(!op_get_option('theme','dir')){
                wp_redirect(menu_page_url(OP_SN.'-setup-wizard',false));
            }
            $this->sections = array();
            $sections = array(
                'brand' => __('Brand', 'optimizepress'),
                'layout' => __('Layout Structure', 'optimizepress'),
                'modules' => __('Modules', 'optimizepress'),
            );
            foreach($sections as $section => $title){
                require_once OP_LIB.'sections/blog/'.$section.'.php';
                $class = 'OptimizePress_Sections_'.ucfirst($section);
                $this->sections[$section] = array(
                    'title' => $title,
                    'object' => new $class(),
                    'image' => $section.'-icon.png'
                );
            }
        }
    }

    function admin_menu()
    {
        $page = add_submenu_page(OP_SN, __('Blog Settings', 'optimizepress'), __('Blog Settings', 'optimizepress'), 'edit_theme_options', OP_SN.'-theme-settings', array($this,'theme_settings'));
        add_action('load-'.$page, array($this,'save_theme_settings'));
        add_action('admin_print_styles-'.$page, array($this,'print_scripts'));
        add_action('admin_footer-'.$page, array($this,'print_footer_scripts'));
    }

    function print_scripts()
    {
        op_print_scripts('theme-settings');
        wp_enqueue_style(OP_SN.'-admin-common', false, false, OP_VERSION);
        op_enqueue_backend_scripts();
    }

    function print_footer_scripts()
    {
        op_print_footer_scripts('theme-settings');
    }

    function theme_settings()
    {
        $img = op_img('',true);
        $tabs = array(
            'theme' => array(
                'title' => __('Theme', 'optimizepress'),
                'prefix' => '<span><img src="'.$img.'theme-icon.png" alt="" width="16" height="53" /></span>'
            )
        );
        $tab_content = array(
            'theme' => $this->theme_tab(),
        );
        foreach($this->sections as $name => $section){
            $tabs[$name] = array(
                'title' => $section['title'],
                'prefix' => '<span><img src="'.$img.$section['image'].'" alt="" width="16" height="53" /></span> '
            );
            $tab_content[$name] = op_tpl('theme_settings/step',array('section_type'=>$name,'sections'=>$section['object']->sections()));
            if(op_has_section_error($name)){
                $tabs[$name]['li_class'] = 'has-error';
            }
        }
        $data = array(
            'tabs' => $tabs,
            'tab_content' => $tab_content,
            'module_name' => 'theme_settings',
            'error' => $this->error,
            'notification' => $this->notification,
        );
        echo op_tpl('theme_settings/index',array('content' => op_tpl('generic/tabbed_module',$data)));
    }

    function save_theme_settings()
    {
        $this->get_sections();
        if(isset($_POST[OP_SN.'_theme_settings'])){
            if(isset($_POST['_wpnonce']) && wp_verify_nonce($_POST['_wpnonce'],'op_theme_settings')){
                $this->save_step();
            } else {
                $this->error = __('Verification failed, please refresh the page and try again.', 'optimizepress');
            }
        } elseif(OP_REINIT_THEME && OP_SHOW_THEME_MSG){
            $this->notification = __('Your theme has been changed. Please review ALL settings', 'optimizepress');
        }
    }

    function save_step()
    {
        $op = $_POST['op'];
        $sections_op = op_get_var($op,'sections',array());
        foreach($this->sections as $name => $section){
            $sections = $section['object']->sections();
            foreach($sections as $section_name => $section_section){
                if(is_array($section_section)){
                    if(isset($section_section['save_action'])){
                        call_user_func_array($section_section['save_action'],array($sections_op));
                    }
                    if(isset($section_section['module'])){
                        $mod_ops = op_get_var($op,$section_name,array());
                        $opts = op_get_var($section_section,'options',array());
                        op_mod($section_section['module'])->save_settings($section_name,$opts,$mod_ops);
                    }
                }
            }
        }
        $this->save_theme();
        if(op_has_error()){
            $this->error = __('There was a problem processing the form, please review the errors below', 'optimizepress');
        } else {
            $this->notification = __('Your blog settings have been updated.', 'optimizepress');
        }
    }

    function theme_tab()
    {
        if(($dirs = op_dir_list(OP_THEMES)) === false){
            return op_show_error(__('No themes were found. Please check the themes directory is present and contains themes.', 'optimizepress'));
        }
        $themes = array();
        foreach($dirs as $d){
            if(($conf = op_load_theme_config($d)) !== false){
                $themes[] = array('name' => $conf['name'],
                                  'screenshot' => $conf['screenshot'],
                                  'screenshot_thumbnail' => $conf['screenshot_thumbnail'],
                                  'description' => $conf['description'],
                                  'dir' => $d);
            }
        }
        usort($themes,'op_sort_theme_array');
        return op_tpl('theme_settings/themes',array('themes'=>$themes));
    }

    function save_theme()
    {
        if(isset($_POST['theme_id'])){
            if(op_get_option('theme','dir') != $_POST['theme_id'] && (($conf = op_load_theme_config($_POST['theme_id'])) !== false)){
                op_update_option('theme', 'dir', $_POST['theme_id']);
                wp_redirect(menu_page_url(OP_SN.'-theme-settings',false).'&theme_switch='.$_POST['theme_id']);
            }
        }
    }
}
new OptimizePress_ThemeSettings();
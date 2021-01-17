<?php
class OptimizePress_PageBuilder {

    var $cur_step;
    var $sections;
    var $error = false;
    var $notification = false;
    var $js = array('post_id'=>0);
    var $post;
    var $live_editor;

    function __construct(){
        add_action('admin_menu',array($this,'admin_menu'), 9999999);
        add_action('wp_ajax_'.OP_SN.'-page-builder-slug', array($this, 'check_slug'));
        require_once OP_ADMIN.'live_editor.php';
        $this->live_editor = new OptimizePress_LiveEditor();
    }

    function get_step(){
        if(!isset($this->cur_step)){
            $step = intval(isset($_GET['step'])?$_GET['step']:1);
            $this->cur_step = $step > 0 ? $step : 1;
            op_tpl_assign('cur_step',$this->cur_step);
            if($this->cur_step > 0){
                if(isset($_GET['page_id']) && ($this->post = get_post($_GET['page_id']))){
                    define('OP_PAGEBUILDER_ID',$_GET['page_id']);
                    $GLOBALS['post_id'] = $_GET['page_id'];
                    op_tpl_assign('pagebuilder_postid',$_GET['page_id']);
                    $this->js['post_id'] = $_GET['page_id'];
                }
                if($this->cur_step > 1 && !defined('OP_PAGEBUILDER_ID')){
                    wp_redirect(menu_page_url(OP_SN.'-page-builder',false));
                }
                if($this->cur_step == 4){
                    $this->_sections();
                }
                $sections = array(
                    1 => __('Proceed to Step 2', 'optimizepress'),
                    2 => __('Proceed to Step 3', 'optimizepress'),
                    3 => __('Proceed to Step 4', 'optimizepress'),
                    4 => __('Save Settings &amp; Launch LiveEditor', 'optimizepress'),
                );
                if(isset($sections[$this->cur_step])){
                    op_tpl_assign('setup_wizard_submit_text',$sections[$this->cur_step]);
                }
            }
        }
        return $this->cur_step;
    }

    function admin_menu(){
        $page = add_submenu_page(OP_SN, __('Page Builder', 'optimizepress'), __('Page Builder', 'optimizepress'), 'edit_pages', OP_SN.'-page-builder', array($this,'page_builder'));
        add_action('load-'.$page,array($this,'load_page_builder'));
        add_action('admin_print_styles-'.$page, array($this,'print_scripts'));
        add_action('admin_footer-'.$page, array($this,'print_footer_scripts'));
    }

    function page_builder(){

    }

    function load_page_builder(){
        define('OP_PAGEBUILDER',true);
        if(isset($_GET['section']) && $_GET['section'] == 'content_upload'){
            define('OP_CONTENT_UPLOAD',true);
            define('IFRAME_REQUEST',true);
            $this->live_editor->load_content_upload();
        } else {
            define('OP_CONTENT_UPLOAD',false);
            $this->theme_change();
            $this->save_setup_wizard();
            $this->setup_wizard();
        }
    }

    function print_scripts(){
        if(OP_CONTENT_UPLOAD){
            wp_dequeue_script(OP_SN.'-fancybox');
            wp_dequeue_style(OP_SN.'-fancybox');
            wp_enqueue_style(OP_SN.'-admin-content-layout',  OP_CSS.'content_layout'.OP_SCRIPT_DEBUG.'.css', false, OP_VERSION);
        } else {
            op_print_scripts(array('page-wizard',$this->cur_step));
            wp_enqueue_style( OP_SN.'-admin-page-wizard',  OP_CSS.'page_builder'.OP_SCRIPT_DEBUG.'.css', array(OP_SN.'-admin-common'), OP_VERSION);

            op_enqueue_backend_scripts();
            if (OP_SCRIPT_DEBUG === '') {
                $page_builder_dependency = array(OP_SN.'-noconflict-js', OP_SN.'-admin-common');
            } else {
                $page_builder_dependency = array(OP_SN.'-op-back-all');
            }
            wp_enqueue_script(OP_SN.'-admin-page-wizard',  OP_JS.'page_builder'.OP_SCRIPT_DEBUG.'.js', $page_builder_dependency, OP_VERSION);
        }
    }

    function print_footer_scripts(){
        if(!OP_CONTENT_UPLOAD){
            op_print_footer_scripts(array('page-wizard',$this->cur_step));
            echo '<script type="text/javascript">var OP_PageBuilder = '.json_encode($this->js).';</script>';
        }
    }

    function theme_change(){
        $this->get_step();
        $reinit_page_theme = false;
        if(isset($_GET['page_id'])){
            $cur_page = op_page_option('theme','dir');
            if(isset($_GET['page_id']) && isset($_GET['theme_switch']) && $_GET['theme_switch'] != $cur_page &&
                (($conf = op_load_page_config($_GET['theme_switch'])) !== false)){
                $theme = array('name' => $conf['name'],
                               'screenshot' => $conf['screenshot'],
                               'screenshot_thumbnail' => $conf['screenshot_thumbnail'],
                               'description' => $conf['description'],
                               'dir' => $_GET['theme_switch']);
                op_update_page_option('theme',$theme);
                $reinit_page_theme = true;
            }
        }
        define('OP_REINIT_PAGE_THEME',$reinit_page_theme);
        if($reinit_page_theme){
            define('OP_SHOW_THEME_MSG',($cur_page !== false));
        }
        if(defined('OP_PAGEBUILDER_ID')){
            op_init_page_theme();
            if(OP_REINIT_PAGE_THEME){
                do_action(OP_SN.'-reinit_page_theme');
            }
        }
    }

    function save_setup_wizard(){
        if(isset($_POST[OP_SN.'_page_builder']) && $this->cur_step < 5){
            if(isset($_POST['_wpnonce']) && wp_verify_nonce($_POST['_wpnonce'],'op_page_builder')){
                $func = array($this,'save_step_'.$this->cur_step);
                if(!is_callable($func)){
                    $func[1] = 'save_step';
                }
                call_user_func($func);
            } else {
                $this->error = __('Verification failed, please refresh the page and try again.', 'optimizepress');
            }
        }
        if(OP_REINIT_PAGE_THEME && OP_SHOW_THEME_MSG){
            $this->notification = __('Your theme has been changed. Please review ALL settings', 'optimizepress');
        }
    }

    function setup_wizard(){
        if($this->error){
            op_tpl_assign('error',$this->error);
        }
        if($this->notification){
            op_tpl_assign('notification',$this->notification);
        }
        if($this->cur_step > 5){
            return op_show_error(__('You have completed the wizard.', 'optimizepress'));
        }
        $func = array($this,'step_'.$this->cur_step);
        if(!is_callable($func)){
            $func[1] = 'step';
        }
        echo call_user_func($func);
        exit;
    }




    // Step 1 - Theme Selection
    function step_1(){
        global $wpdb;
        $this->js['slug_message'] = __('Please provide a valid URL slug which is not in use.', 'optimizepress');
        $this->js['name_message'] = __('Please provide a name for your page.', 'optimizepress');
        $permalinks = true;
        if(get_option('permalink_structure') != ''){
            $permalinks = false;
        }
        op_tpl_assign('permalinks_disabled',$permalinks);
        $page_title = $page_name = $page_thumbnail = '';
        $blankimg = 'pb_page_blank.png';
        $presets = array(
            'blank' => __('Blank Page', 'optimizepress'),
            'content_layout' => __('Use a Content Template', 'optimizepress'),
            'preset' => __('Use a Saved Preset', 'optimizepress'),
        );
        if(defined('OP_PAGEBUILDER_ID')){
            $blankimg = 'pb_page_blank.png';
            $presets['blank'] = __('Use Current Settings', 'optimizepress');
            $post_id = OP_PAGEBUILDER_ID;
            $page_title = $this->post->post_title;
            $page_name = $this->post->post_name;
            $results = $wpdb->get_results("SELECT meta_value as page_thumbnail FROM `{$wpdb->prefix}postmeta` WHERE post_id = ".$post_id." AND meta_key = '_optimizepress_page_thumbnail'");
            if (!empty($results)) {
                $page_thumbnail = $results[0]->page_thumbnail;
            }
        }
        $data = array('page_name'=>$page_name,'page_title'=>$page_title,'page_thumbnail'=>$page_thumbnail);

        $content_layouts = $this->live_editor->load_content_layouts(true);
        if(!empty($content_layouts)){
            $data['content_layouts'] = $content_layouts;
        } else {
            $data['content_layouts'] = '';
        }

        $preset_html = '';
        $results = $wpdb->get_results("SELECT * FROM `{$wpdb->prefix}optimizepress_presets` ORDER BY name ASC");
        if($results){
            $drop_html = '';
            foreach($results as $result){
                $drop_html .= '<option value="'.$result->id.'">'.$result->name.'</option>';
            }
            $preset_html = '<select name="op[page][preset]">'.$drop_html.'</select>';
        }

        if($preset_html != ''){
            $data['presets'] = $preset_html;
        } else {
            unset($presets['preset']);
        }

        $selected = 'blank';
        $preset_options = array();
        $default = array(
            'width' => 206,
            'height' => 147,
        );
        foreach($presets as $name => $title){
            $li_class = $input_attr = '';
            if($selected == $name){
                $input_attr = ' checked="checked"';
                $li_class = 'img-radio-selected';
            }
            $preset_options[] = array_merge($default,array(
                'input' => '<input type="radio" name="op[page][preset_option]" value="'.$name.'"'.$input_attr.' />',
                'image' => OP_IMG.'page_types/'.($name=='blank'?$blankimg:'pb_page_'.$name.'.png'),
                'preview_content' => $title,
                'li_class' => $li_class,
            ));
        }
        $data['preset_options'] = $preset_options;

        return op_tpl('page_builder/step1',$data);
    }

    function save_step_1(){
        global $wpdb;
        $op = op_post('op','page');
        if(count($op) > 0 && isset($op['name'])){
            $post_arr = array(
                'post_title'=>op_get_var($op,'name'),
                'post_name'=>op_get_var($op,'slug'),
                'post_type'=>'page'
            );
            if(!defined('OP_PAGEBUILDER_ID')){
                $post_id = wp_insert_post($post_arr);
                define('OP_PAGEBUILDER_ID',$post_id);
            } else {
                $post_arr['ID'] = $post_id = OP_PAGEBUILDER_ID;
                wp_update_post($post_arr);
            }
            op_update_page_option('pagebuilder','Y');
            $thumbnail = op_get_var($op,'thumbnail');
            $thumbnail_preset = op_get_var($op, 'thumbnail_preset');
            if (empty($thumbnail_preset)) op_update_page_option('page_thumbnail', $thumbnail); else op_update_page_option('page_thumbnail', $thumbnail_preset);
            op_update_page_option('page_thumbnail_preset', $thumbnail_preset);
            $preset_option = op_get_var($op,'preset_option','blank');
            switch($preset_option){
                case 'content_layout':
                    if(isset($op['content_layout']) && $op['content_layout'] > 0){
                        $this->cur_step = 4;
                        /*$result = $wpdb->get_row($wpdb->prepare(
                            "SELECT `layouts`,`settings`,`guid` FROM `{$wpdb->prefix}optimizepress_predefined_layouts` WHERE `id`=%d ORDER BY name ASC",
                            $op['content_layout']
                        ));*/
                        $result = $wpdb->get_row($wpdb->prepare(
                            "SELECT `layouts`,`settings` FROM `{$wpdb->prefix}optimizepress_predefined_layouts` WHERE `id`=%d ORDER BY name ASC",
                            $op['content_layout']
                        ));
                        $keep = op_post('keep_options');
                        if(!is_array($keep)){
                            $keep = array();
                        }

                        // Set page template ID if it exists - this will be used for stats and analytics
                        /*if (isset($result->guid) && !empty($result->guid)) {
                            op_update_page_option('template_id', $result->guid);
                        }*/

                        op_page_set_saved_settings($result,$keep);
                    }
                    if (isset($op['content_layout']) && $op['content_layout'] == 0) {
                        $this->cur_step = 4;
                        $keep = array();
                        require_once(OP_LIB . 'content_layouts/blank_page.php');
                        op_page_set_saved_settings($result,$keep);
                    }
                    break;
                case 'preset':
                    $this->cur_step = 4;
                    $result = $wpdb->get_row($wpdb->prepare(
                        "SELECT `layouts`,`settings` FROM `{$wpdb->prefix}optimizepress_presets` WHERE `id`=%d ORDER BY name ASC",
                        $op['preset']
                    ));
                    op_page_set_saved_settings($result);
                    do_action('op_preset_import_launch_suite');
                    break;
            }

            if (op_get_var($op, 'return_page_id') == 'true') {

                if (!empty($_POST['theme_type'])) {
                    op_update_page_option('theme','type',$_POST['theme_type']);
                }

                if (!empty($_POST['theme_id'])) {
                    op_update_page_option('theme','dir',$_POST['theme_id']);
                }

                // Set this page's typography settings to be that of the defaults
                // but only if we're not using a predefined template
                if ($preset_option === 'content_layout' && $op['content_layout'] === 0) {
                    $default_typography = op_default_option('default_typography');
                    if (!empty($default_typography) && isset($default_typography['font_elements'])) {
                        $op_fonts = new OptimizePress_Fonts;
                        foreach($default_typography['font_elements'] as $typography){
                            $op_fonts->add_font($typography['font']);
                        }
                        op_update_page_option('typography', $default_typography);
                    }
                }

                echo OP_PAGEBUILDER_ID;
                exit;

            } else {
                $this->_redirect();
            }
        }
    }

    function step_2(){
        $default = array(
            'image' => OP_IMG.'page_types/pb_page_blank.png',
            'width' => 212,
            'height' => 156,
        );
        $types = array(
            'landing' => __('Landing Page', 'optimizepress'),
            'marketing' => __('Marketing Site Page', 'optimizepress'),
            //'launch' => __('Launch Funnel Page', 'optimizepress'),
            'membership' => __('Membership Page', 'optimizepress'),
        );
        $types = apply_filters('op_pagebuilder_types',$types);
        $type = 'landing';
        if($tmp_type = op_page_option('theme','type')){
            $type = $tmp_type;
        }
        $theme_types = array();
        foreach($types as $name => $title){
            $li_class = $input_attr = '';
            if($type == $name){
                $input_attr = ' checked="checked"';
                $li_class = 'img-radio-selected';
            }
            $theme_types[] = array_merge($default,array(
                'input' => '<input type="radio" name="theme_type" value="'.$name.'"'.$input_attr.' />',
                'image' => OP_IMG.'page_types/'.($name=='blank'?$blankimg:'pb_page_'.$name.'.png'),
                'preview_content' => $title,
                'li_class' => $li_class,
            ));
        }
        return op_tpl('page_builder/step2',array('theme_types'=>$theme_types));
    }

    function save_step_2(){
        $op = op_post('op','page');
        $cur = op_page_option('theme','type');
        if ($_POST['theme_type'] != $cur && $_POST['theme_type'] != 'membership') {
            op_page_clear_settings();
            op_page_clean_layouts(array());

        }
        if(isset($_POST['theme_type'])){
            op_update_page_option('theme','type',$_POST['theme_type']);
            $this->_redirect();
        }
    }

    function step_3(){
        $presets = $preset_options = array();
        $this->js['product_message'] = __('Please provide a name for your product', 'optimizepress');
        $type = op_page_option('theme','type');
        $membership = ($type == 'membership');
        op_tpl_assign('page_type',$type);
        if(($dirs = op_dir_list(OP_PAGES.$type)) === false){
            return op_show_error(__('No themes were found. Please check the themes directory is present and contains themes.', 'optimizepress'));
        }
        $themes = $js_options = $landing_themes = array();
        foreach($dirs as $d){
            if(($conf = op_load_page_config($d)) !== false){
                $themes[] = array('name' => $conf['name'],
                                  'screenshot' => $conf['screenshot'],
                                  'screenshot_thumbnail' => $conf['screenshot_thumbnail'],
                                  'description' => $conf['description'],
                                  'dir' => $d);
                if($membership){
                    $js_options[$d] = isset($conf['membership_type']) ? $conf['membership_type'] : 'content';
                } elseif($type == 'landing'){
                    if(isset($conf['feature_areas'])){
                        $landing_themes[$d] = $conf['feature_areas'];
                    }
                }
            }
        }
        usort($themes,'op_sort_theme_array');
        if($membership){
            $presets = array(
                'blank' => __('Blank Page', 'optimizepress'),
                'sidebar' => __('Page with sidebar', 'optimizepress'),
                'module_listing' => __('Module listings', 'optimizepress'),
            );
            $product_id = $category_id = $subcategory_id = 0;
            if($product = op_page_option('membership')){
                $product_id = op_get_var($product,'product_id',0);
                $category_id = op_get_var($product,'category_id',0);
                $subcategory_id = op_get_var($product,'subcategory_id',0);
            }
            op_tpl_assign(array(
                'product_select' => $this->_select_html('product', $product_id),
                'category_select' => $this->_select_html('category', 0, $product_id),
                'subcategory_select' => $this->_select_html('subcategory', 0, $category_id)
            ));

            $this->js['membership_types'] = $js_options;
            $blankimg = 'pb_page_blank.png';
            $selected = 'blank';
            $preset_options = array();
            $default = array(
                'width' => 206,
                'height' => 147,
            );
            foreach($presets as $name => $title){
                $li_class = $input_attr = '';
                if($selected == $name){
                    $input_attr = ' checked="checked"';
                    $li_class = 'img-radio-selected';
                }
                $preset_options[] = array_merge($default,array(
                    'input' => '<input type="radio" name="op[page][preset_option]" value="'.$name.'"'.$input_attr.' />',
                    'image' => OP_IMG.'page_types/'.$blankimg,//($name=='blank'?$blankimg:'pb_page_'.$name.'.png'),
                    'preview_content' => $title,
                    'li_class' => $li_class,
                ));
            }
        }
        return op_tpl('page_builder/step3',array('themes'=>$themes,'landing_themes'=>$landing_themes, 'presets'=>$presets, 'preset_options'=>$preset_options));
    }

    function save_step_3(){
        if(isset($_POST['theme_id']) && ($conf = op_load_page_config($_POST['theme_id']))){
            $cur = op_page_option('theme','dir');
            if($cur === false || $cur != $_POST['theme_id']){
                // removed clearing settings on theme/type change
                //op_page_clear_settings();
                //op_page_clean_layouts(array());
                op_update_page_option('theme','dir',$_POST['theme_id']);
            }
            $type = op_page_option('theme','type');
            if($type == 'membership'){
                $this->save_membership_settings($conf);
            } elseif($type == 'landing'){
                if($feature = op_post('op','feature_area',$_POST['theme_id'])){
                    op_update_page_option('feature_area','type',$feature);
                    op_update_page_option('feature_area','enabled','Y');
                    /*
                    $feature_area = op_page_option('feature_area');
                    if(!$feature_area){
                        $feature_area = array();
                    }
                    $feature_area['type'] = $feature;
                    $feature_area['enabled'] = 'Y';
                    op_update_page_option('feature_area',$feature_area);*/
                }
            }
        }
        $this->_redirect();
    }

    /**
     *
     * Saving of membership pages
     * @param array $conf
     * @return void
     */
    function save_membership_settings($conf)
    {
        global $wpdb;
        $op = op_post('op');
        if (empty($op['pageType']['type'])) { // saving product!
            update_post_meta(OP_PAGEBUILDER_ID, 'type', 'product');
            op_update_page_option('membership', 'layout', $op['page']['preset_option']);
            // change title and slug
            $post = array(
                'ID' => OP_PAGEBUILDER_ID,
                'post_title' => $op['product']['name'],
                'post_name' => sanitize_title($op['product']['name'])
            );
            wp_update_post($post);
        } else {
            if ($op['pageType']['type'] == 'category') {
                //$page_id = $this->_add_page($op['category']['name'], OP_PAGEBUILDER_ID, 'category');
                $page_id = OP_PAGEBUILDER_ID;
                wp_update_post(array(
                    'ID' => $page_id,
                    'post_parent' => $op['pageType']['product'],
                    'post_title' => $op['category']['name'],
                    'post_name' => sanitize_title($op['category']['name'])
                ));
                update_post_meta($page_id, 'type', 'category');
                update_post_meta($page_id, '_'.OP_SN.'_pagebuilder', 'Y');
                $value = array(
                    'layout' => $op['page']['preset_option'],
                    'description' => base64_encode($op['category']['description'])
                );
                update_post_meta($page_id, '_'.OP_SN.'_membership', maybe_serialize($value));
                $value = array(
                    'type' => 'membership',
                    'dir' => $op['theme']
                );
                update_post_meta($page_id, '_'.OP_SN.'_theme', maybe_serialize($value));
            } else if ($op['pageType']['type'] == 'subcategory') {
                //$page_id = $this->_add_page($op['subcategory']['name'], $op['subcategory']['category'], 'subcategory');
                $page_id = OP_PAGEBUILDER_ID;
                wp_update_post(array(
                    'ID' => $page_id,
                    'post_parent' => $op['subcategory']['category'],
                    'post_title' => $op['subcategory']['name'],
                    'post_name' => sanitize_title($op['subcategory']['name'])
                ));
                update_post_meta($page_id, 'type', 'subcategory');
                update_post_meta($page_id, '_'.OP_SN.'_pagebuilder', 'Y');
                $value = array(
                    'layout' => $op['page']['preset_option'],
                    'description' => base64_encode($op['subcategory']['description'])
                );
                update_post_meta($page_id, '_'.OP_SN.'_membership', maybe_serialize($value));
                $value = array(
                    'type' => 'membership',
                    'dir' => $op['theme']
                );
                update_post_meta($page_id, '_'.OP_SN.'_theme', maybe_serialize($value));
            } else if ($op['pageType']['type'] == 'content') {
                if (!empty($op['content']['subcategory'])) {
                    $parentId = $op['content']['subcategory'];
                } else if (!empty($op['content']['category'])) {
                    $parentId = $op['content']['category'];
                } else if (!empty($op['pageType']['product'])) {
                    $parentId = $op['pageType']['product'];
                }
                //$page_id = $this->_add_page($op['content']['name'], $parentId, 'content');
                $page_id = OP_PAGEBUILDER_ID;
                wp_update_post(array(
                    'ID' => $page_id,
                    'post_parent' => $parentId,
                    'post_title' => $op['content']['name'],
                    'post_name' => sanitize_title($op['content']['name'])
                ));
                update_post_meta($page_id, 'type', 'content');
                update_post_meta($page_id, '_'.OP_SN.'_pagebuilder', 'Y');
                $value = array(
                    'layout' => $op['page']['preset_option'],
                    'description' => base64_encode($op['content']['description'])
                );
                update_post_meta($page_id, '_'.OP_SN.'_membership', maybe_serialize($value));
                $value = array(
                    'type' => 'membership',
                    'dir' => $op['theme']
                );
                update_post_meta($page_id, '_'.OP_SN.'_theme', maybe_serialize($value));
            }
        }
    }

    function _sections(){
        $sections = array(
            'layout' => array(
                'title' => __('Layout', 'optimizepress'),
                'description' => __('Customize the layout of your template. Setup your headers, navigation bars, feature areas and footers.', 'optimizepress'),
            ),
            'color_schemes' => array(
                'title' => __('Colour Scheme', 'optimizepress'),
                'description' => __('Customize the colour scheme for your page. You can use the advanced section to customize individual element colours', 'optimizepress'),
            ),
            'functionality' => array(
                'title' => __('On-Page Functionality', 'optimizepress'),
                'description' => __('Control the additional functionality and options for your page below. You can also use the options below to add any custom script code to your page', 'optimizepress'),
            ),
        );
        $i = 1;
        foreach($sections as $name => $section){
            if(!(op_page_config('disable',$name) === true)){
                $class = str_replace('_',' ',$name);
                $class = 'OptimizePress_Sections_'.str_replace(' ','_',ucwords($class));
                require_once OP_LIB.'sections/page/'.$name.'.php';
                $this->sections[$name] = array(
                    'object' => new $class(),
                    'title' => ''.__($section['title'], 'optimizepress'),
                    'description' => __($section['description'], 'optimizepress')
                );
                $i++;
            }
        }
    }

    function step_4(){
        op_tpl_assign('nav_menus',wp_get_nav_menus());

        $img = op_img('',true);
        $tabs = array();
        $tab_content = array();
        if (is_array($this->sections) || is_object($this->sections)){
            foreach($this->sections as $name => $section){
                $tabs[$name] = array(
                    'title' => $section['title']
                );
                $tab_content[$name] = op_tpl('page_builder/step',array(
                    'section_type'=>$name,
                    'sections'=>($name=='functionality' ? $GLOBALS['functionality_sections'] : $section['object']->sections()),
                    'title' => $section['title'],
                    'description' => $section['description'],
                ));
                if(op_has_section_error($name)){
                    $tabs[$name]['li_class'] = 'has-error';
                }
            }
        }
        $data = array(
            'tabs' => $tabs,
            'tab_content' => $tab_content,
            'module_name' => 'page_builder',
            'error' => $this->error,
            'notification' => $this->notification,
        );
        return op_tpl('page_builder/step4',array('content' => op_tpl('generic/tabbed_module',$data)));
    }

    function save_step_4(){
        $op_fonts = new OptimizePress_Fonts;
        $op = $_POST['op'];
        foreach($this->sections as $name => $section){
            $sections = $section['object']->sections();
            foreach($sections as $section_name => $section_section){
                if(is_array($section_section)){
                    if(isset($section_section['save_action'])){
                        call_user_func_array($section_section['save_action'],array(op_get_var($op,$section_name,array())));
                    }
                    if(isset($section_section['module'])){
                        $mod_ops = op_get_var($op,$section_name,array());
                        $opts = op_get_var($section_section,'options',array());
                        op_mod($section_section['module'],op_get_var($section_section,'module_type','blog'))->save_settings($section_name,$opts,$mod_ops);
                    }
                }
            }
        }

        //Set this page's typography settings to be that of the defaults
        $default_typography = op_default_option('default_typography');
        if (!empty($default_typography) && isset($default_typography['font_elements'])) {
            foreach($default_typography['font_elements'] as $typography){
                $op_fonts->add_font($typography['font']);
            }
            op_update_page_option('typography', $default_typography);
        }


        if(op_has_error()){
            $this->error = __('There was a problem processing the form, please review the errors below', 'optimizepress');
        }/* else {
            $this->notification = __('Your page settings have been updated.', 'optimizepress');
        }*/
        $this->_redirect();
    }

    function step_5(){
        return $this->live_editor->load_editor($this->post);
    }

    function _redirect($ext=''){
        if(!op_has_error()){
            $step = ++$this->cur_step;
            wp_redirect(menu_page_url(OP_SN.'-page-builder',false).(defined('OP_PAGEBUILDER_ID')?'&page_id='.OP_PAGEBUILDER_ID:'').'&step='.$step.$ext);
        }
    }

    /**
     * Check if membership product page exists
     * @return boolean
     */
    static function productExist()
    {
        global $wpdb;
        $query = "SELECT o.id FROM {$wpdb->posts} o
            INNER JOIN {$wpdb->postmeta} p
            ON o.id = p.post_id
            WHERE p.meta_key = 'type' AND p.meta_value='product'";
        if($rows = $wpdb->get_results($query)){
            return true;
        }
        return false;
    }

    function _select_html($type, $selected_id=0, $parent_id=0) {
        global $wpdb;
        $select_html = '<option value="" class="default-val"></option>';
        $query = "SELECT o.id, o.post_parent, o.post_title FROM {$wpdb->prefix}posts o INNER JOIN {$wpdb->postmeta} p ON o.id = p.post_id WHERE p.meta_key = 'type' AND p.meta_value = '{$type}' ORDER BY o.post_title ASC";
        if($rows = $wpdb->get_results($query)){
            foreach($rows as $row){
                $select_html .= '<option value="'.$row->id.'"'.($selected_id == $row->id?' selected="selected"':'').' class="parent-'.$row->post_parent.($row->post_parent != $parent_id?'':'').'">'.$row->post_title.'</option>';
            }
        }
        return $select_html;
    }

    function _add_page($name,$parent_id=0,$type='product'){
        global $wpdb;
        $page_id = false;
        if($name != ''){
            $page_id = wp_insert_post(array('post_title'=>$name,'post_name' => sanitize_title($name), 'post_type'=>'page','post_parent'=>$parent_id));
            update_post_meta($page_id, 'type', $type);
            update_post_meta($page_id, '_'.OP_SN.'_pagebuilder', 'Y');
            //update_post_meta($page_id, '_'.OP_SN.'_theme', maybe_serialize(array('type' => 'membership')));
        }
        return $page_id;
    }

    function _check_is($type,$parent){
        global $wpdb;
        if($row = $wpdb->get_row($wpdb->prepare( "SELECT id FROM {$wpdb->prefix}optimizepress_pb_products WHERE post_id=%d",OP_PAGEBUILDER_ID))){
            $wpdb->update($wpdb->prefix.'optimizepress_pb_products',array('type'=>$type,'parent_id'=>$parent),array('id'=>$row->id));
        } else {
            $wpdb->insert($wpdb->prefix.'optimizepress_pb_products',array('post_id'=>OP_PAGEBUILDER_ID,'parent_id'=>$parent,'type'=>$type));
        }
    }

    function check_slug(){
        global $wpdb;
        $valid = true;
        if($row = $wpdb->get_row($wpdb->prepare("SELECT id FROM {$wpdb->posts} WHERE post_name=%s AND post_type='page' AND ID!=%d",$_POST['slug'],$_POST['post_id']))){
            $valid = false;
        }
        echo json_encode(array('valid'=>$valid));
        exit;
    }
}
new OptimizePress_PageBuilder();

<?php

class OptimizePress_LaunchSuite
{
    var $error = false;
    var $notification = false;
    var $data = array();
    var $funnel_dropdown = '';
    var $funnel_count = 0;
    var $pages = array();
    var $is_key_on = false;

    function __construct()
    {
        add_action('admin_menu',array($this,'admin_menu'), 70);
        add_action('wp_ajax_'.OP_SN.'-launch-suite-create', array($this, 'create_funnel'));
        add_action('wp_ajax_'.OP_SN.'-launch-suite-refresh_dropdown', array($this, 'refresh_dropdown'));
        add_action('op_preset_import_launch_suite', array($this, 'preset_import'));
        add_action('wp_ajax_' . OP_SN . '-launch-suite-delete', array($this, 'delete_funnel'));
    }

    /**
     * Delete launch funnel
     *
     * Removes launch funnel based in ID received from POST. This method is called through AJAX, so it outputs JSON encoded string.
     *
     * @author OptimizePress <info@optimizepress.com>
     * @since  2.2.4
     * @return void
     */
    function delete_funnel()
    {
        $nonce      = op_post('_wpnonce');
        $nonceChk   = 'op_launch_suite';

        if (wp_verify_nonce($nonce, $nonceChk)) {
            $funnelId = op_post('funnel_id');

            global $wpdb;
            $wpdb->delete($wpdb->prefix . 'optimizepress_launchfunnels', array('id' => $funnelId), array('%d'));
            $wpdb->delete($wpdb->prefix . 'optimizepress_launchfunnels_pages', array('funnel_id' => $funnelId), array('%d'));

            wp_send_json_success(array('message' => __('Funnel deleted successfully.', 'optimizepress')));
        } else {
            wp_send_json_error(array('error' => __('Verification failed, please refresh the page and try again.', 'optimizepress')));
        }

        exit();
    }

    function create_funnel(){
        global $wpdb;
        $nonce = op_post('_wpnonce');
        $arr = array(
            'error' => __('Verification failed, please refresh the page and try again.', 'optimizepress')
        );
        $nonce_chk = 'op_launch_suite';
        if(op_post('pagebuilder') === 'Y'){
            $nonce_chk = 'op_page_builder';
        } elseif(op_post('live_editor') == 'Y'){
            $nonce_chk = 'op_liveeditor';
        }
        if(wp_verify_nonce($nonce,$nonce_chk)){
            $name = op_post('funnel_name');
            $arr['error'] = __('Please provide a name for your funnel', 'optimizepress');
            if(!empty($name)){
                $funnel_dropdown = '';
                $wpdb->insert($wpdb->prefix.'optimizepress_launchfunnels',array('title'=>$name));
                $current = $wpdb->insert_id;

                $funnels = $wpdb->get_results( "SELECT id,title FROM `{$wpdb->prefix}optimizepress_launchfunnels` ORDER BY title ASC");
                $funnel_count = 0;
                if($funnels){
                    $funnel_count = count($funnels);
                    foreach($funnels as $funnel){
                        if($current < 1){
                            $current = $funnel->id;
                            $found = true;
                        } elseif($current == $funnel->id){
                            $found = true;
                        }
                        $funnel_dropdown .= '<option value="'.$funnel->id.'"'.($current==$funnel->id?' selected="selected"':'').'>'.op_attr($funnel->title).'</option>';
                    }
                }

                $arr = array(
                    'html' => $funnel_dropdown,
                );
            }
        }
        echo json_encode($arr);
        exit;
    }

    function refresh_dropdown(){
        global $wpdb;
        $nonce = op_post('_wpnonce');
        $arr = array(
            'error' => __('Verification failed, please refresh the page and try again.', 'optimizepress')
        );
        if(wp_verify_nonce($nonce,'op_launch_suite')){
            $id = op_post('funnel_id');
            $arr['error'] = __('No funnel ID was provided', 'optimizepress');
            if(!empty($id)){
                define('OP_LAUNCH_FUNNEL',$id);
                $funnel_dropdown = '';
                $arr = array(
                    'html' => $this->_page_select()
                );
            }
        }
        echo json_encode($arr);
        exit;
    }

    function admin_menu(){
        $page = add_submenu_page(OP_SN, __('Launch Suite', 'optimizepress'), __('Launch Suite', 'optimizepress'), 'edit_theme_options', OP_SN.'-launch-suite', array($this,'launch_suite'));
        add_action('load-'.$page,array($this,'save_launch_suite'));
        add_action('admin_print_styles-'.$page, array($this,'print_scripts'));
        add_action('admin_footer-'.$page, array($this,'print_footer_scripts'));
    }

    function print_scripts(){
        op_print_scripts('launch-suite');
        // There was 1 line of css in this file. Literally and seriously only 1 line; this one: .op-hidden { display: none; }.
        // wp_enqueue_style(OP_SN.'-admin-launch-suite',  OP_CSS.'launch_suite'.OP_SCRIPT_DEBUG.'.css', array(OP_SN.'-admin-common'), OP_VERSION);

        if (OP_SCRIPT_DEBUG === '') {
            $launch_suite_dependency = array(OP_SN.'-noconflict-js', OP_SN.'-admin-common','jquery-ui-sortable');
        } else {
            $launch_suite_dependency = array(OP_SN.'-op-back-all');
        }
        wp_enqueue_script(OP_SN.'-admin-launch-suite',  OP_JS.'launch_suite'.OP_SCRIPT_DEBUG.'.js', $launch_suite_dependency, OP_VERSION);
    }

    function print_footer_scripts(){
        op_print_footer_scripts('launch-suite');
    }

    function launch_suite(){
        $this->data['add_page_link'] = '<a href="'.menu_page_url(OP_SN.'-page-builder',false).'" class="add-new-page"><img src="'.OP_IMG.'blue-add.png" alt="'.__('Add A New Page').'" border="0" /></a>';
        $data = array_merge($this->data,array(
            'content' => '',
            'error' => $this->error,
            'notification' => $this->notification,
            'funnel_found' => false,
            'funnel_count' => $this->funnel_count,
        ));
        $data['funnel_select'] = $this->funnel_count > 0 ? '<select name="funnel_select" id="funnel_select">'.$this->funnel_dropdown.'</select>' : '<select name="funnel_select" id="funnel_select"></select>';
        if(defined('OP_LAUNCH_FUNNEL')){
            $data['funnel_id'] = OP_LAUNCH_FUNNEL;
            $data['funnel_found'] = true;
            $img = op_img('',true);
            $tabs = array(
                'funnel_pages' => array(
                    'title' => __('Funnel Pages', 'optimizepress'),
                    'prefix' => '<span><img src="'.$img.'theme-icon.png" alt="" width="16" height="53" /></span>'
                ),
                'launch_settings' => array(
                    'title' => __('Launch Settings', 'optimizepress'),
                    'prefix' => '<span><img src="'.$img.'brand-icon.png" alt="" width="16" height="53" /></span>'
                )
            );
            $data = array_merge($data,$this->_generate_funnel_pages());
            $tab_content = array(
                'funnel_pages' => op_tpl('launch_suite/pages',$data),
                'launch_settings' => op_tpl('launch_suite/settings',$data),
            );
            $tabbed_data = array(
                'tabs' => $tabs,
                'tab_content' => $tab_content,
                'module_name' => 'launch_suite'
            );
            $data['content'] = op_tpl('generic/tabbed_module',$tabbed_data);
        }
        echo op_tpl('launch_suite/index',$data);
    }

    function save_launch_suite(){
        global $wpdb;
        add_filter(OP_SN.'-script-localize', array($this,'localize'));
        $funnel_dropdown = '';
        $current = intval(op_get('funnel_id'));
        $found = false;
        $funnels = $wpdb->get_results( "SELECT id,title FROM `{$wpdb->prefix}optimizepress_launchfunnels` ORDER BY title ASC");
        $funnel_count = 0;
        if($funnels){
            $funnel_count = count($funnels);
            foreach($funnels as $funnel){
                if($current < 1){
                    $current = $funnel->id;
                    $found = true;
                } elseif($current == $funnel->id){
                    $found = true;
                }
                $funnel_dropdown .= '<option value="'.$funnel->id.'"'.($current==$funnel->id?' selected="selected"':'').'>'.op_attr($funnel->title).'</option>';
            }
        }
        $this->funnel_count = $funnel_count;
        $this->funnel_dropdown = $funnel_dropdown;
        if($found){
            define('OP_LAUNCH_FUNNEL',$current);
        }
        $this->data['settings_sections'] = array(
            'gateway_key' => __('Funnel Gateway Key', 'optimizepress'),
            'perpetual_launch' => __('Perpetual/Evergreen Launch Mode', 'optimizepress'),
            'redirect_all' => __('Redirect All Launch Pages', 'optimizepress'),
            'hide_coming_soon' => __('Hide Coming Soon Placeholders', 'optimizepress'),
        );
        $this->data['settings_sections'] = apply_filters('op_launch_suite_settings_sections',$this->data['settings_sections']);

        if($found && isset($_POST[OP_SN.'_launch_suite'])){
            if(isset($_POST['_wpnonce']) && wp_verify_nonce($_POST['_wpnonce'],'op_launch_suite')){
                $op = op_post('op');
                foreach($this->data['settings_sections'] as $name => $section){
                    if(is_array($section)){
                        if(isset($section['save_action'])){
                            call_user_func($section['save_action'],op_get_var($op,$name));
                        }
                    } else {
                        call_user_func(array($this,'_save_'.$name),op_get_var($op,$name));
                    }
                }
                $funnel_pages = array('sales'=>array(),'stages'=>array());
                $used_ids = array();
                $page_ids = array('sales'=>0,'stages'=>array());
                if(isset($op['funnel_pages'])){
                    if(isset($op['funnel_pages']['sales'])){
                        $options = array('page_setup' => array('open_sales_cart','sales_page', 'hide_cart'),
                                         'page_thumbnails' => array('active_thumbnail','inactive_thumbnail'),
                                         'navigation' => array('active_link_text','inactive_link_text'));
                        if(isset($op['funnel_pages']['sales']['page_setup']) && ($page_id = op_get_var($op['funnel_pages']['sales']['page_setup'],'sales_page',0)) > 0){
                            foreach($options as $section => $fields){
                                $conf = op_get_var($op['funnel_pages']['sales'],$section);
                                if($section == 'page_setup'){
                                    $page_ids['sales'] = op_get_var($conf,'sales_page',0);
                                    if($page_ids['sales'] > 0){
                                        $used_ids[$page_ids['sales']] = true;
                                        $funnel_pages['sales']['sales_page'] = $page_ids['sales'];
                                        op_update_page_id_option($page_ids['sales'],array('launch_suite_info',array('funnel_id'=>OP_LAUNCH_FUNNEL,'funnel_page'=>'sales')));
                                    }
                                }
                                $tmp = array();
                                foreach($fields as $field){
                                    $tmp[$field] = op_get_var($conf,$field);
                                }
                                $funnel_pages['sales'][$section] = $tmp;
                            }
                        }
                    }

                    if (empty($funnel_pages['sales'])) $funnel_pages['sales'] = $op['funnel_pages']['sales'];

                    if(isset($op['funnel_pages']['stage'])){
                        $options = array('page_setup' => array('value_page'),
                                         'page_thumbnails' => array('active_thumbnail','inactive_thumbnail'),
                                         'navigation' => array('active_link_text','inactive_link_text'),
                                         'publish_stage' => array('publish'));
                        if($this->is_key_on){
                            array_unshift($options['page_setup'],'landing_page');
                        }
                        if(isset($op['funnel_pages']['stage']) && is_array($op['funnel_pages']['stage'])){
                            $count = count(op_get_var($op['funnel_pages']['stage']['page_setup'],'landing_page',array()));
                            $configs = array(
                                'page_setup' => op_get_var($op['funnel_pages']['stage'],'page_setup',array()),
                                'page_thumbnails' => op_get_var($op['funnel_pages']['stage'],'page_thumbnails',array()),
                                'navigation' => op_get_var($op['funnel_pages']['stage'],'navigation',array()),
                                'publish_stage' => op_get_var($op['funnel_pages']['stage'],'publish_stage',array())
                            );
                            for($i=0;$i<$count;$i++){
                                $stage = array();
                                $pg_ids = array();
                                foreach($options as $section => $fields){
                                    $stage[$section] = array();
                                    foreach($fields as $field){
                                        $stage[$section][$field] = op_get_var(op_get_var($configs[$section],$field,array()),$i);
                                        if ($field=='active_link_text' && empty($stage[$section]['active_link_text'])){
                                            $stage[$section]['active_link_text'] = get_the_title(op_get_var($stage,'value_page'));
                                        } elseif ($field=='inactive_link_text' && empty($stage[$section]['inactive_link_text'])){
                                            $stage[$section]['inactive_link_text'] = 'Coming Soon';
                                        }
                                        if($field == 'landing_page' || $field == 'value_page'){
                                            $pg_ids[$field] = $stage[$section][$field];
                                            $stage[$field] = $pg_ids[$field];
                                            if($pg_ids[$field] > 0){
                                                $used_ids[$pg_ids[$field]] = true;
                                                op_update_page_id_option($pg_ids[$field],array('launch_suite_info',array('funnel_id'=>OP_LAUNCH_FUNNEL,'funnel_page'=>'stage','stage_idx'=>$i,'type'=>$field)));
                                            }
                                        }
                                    }
                                }
                                $funnel_pages['stages'][] = $stage;
                                $page_ids['stages'][] = $pg_ids;
                            }
                        }
                    }
                }

                op_launch_update_option('funnel_pages',$funnel_pages);
                op_launch_update_option('page_ids',$page_ids);

                $funnel_pages = $wpdb->get_results( $wpdb->prepare(
                    "SELECT page_id FROM `{$wpdb->prefix}optimizepress_launchfunnels_pages` WHERE funnel_id=%s",
                    OP_LAUNCH_FUNNEL
                ));
                if($funnel_pages){
                    $pages = array();
                    foreach($funnel_pages as $page){
                        if(!isset($used_ids[$page->page_id])){
                            op_update_page_id_option($page->page_id,array('launch_suite_info',array('funnel_id'=>OP_LAUNCH_FUNNEL,'funnel_page'=>'stage','stage_idx'=>-1,'type'=>'')));
                        }
                    }
                }

                if(op_has_error()){
                    $this->error = __('There was a problem processing the form, please review the errors below', 'optimizepress');
                } else {
                    $this->notification = __('Your launch suite settings have been updated.', 'optimizepress');
                }
            } else {
                $this->error = __('Verification failed, please refresh the page and try again.', 'optimizepress');
            }
        }
    }

    function _generate_funnel_pages(){
        $funnel_pages = op_launch_option('funnel_pages');
        $funnel_pages = is_array($funnel_pages) ? $funnel_pages : array('sales'=>array(),'stages'=>array());
        $sales_page = $stages = '';

        $tabs = array(
            'page_setup_sales' => __('Page Setup', 'optimizepress'),
            'page_thumbnails' => __('Page Thumbnails', 'optimizepress'),
            'navigation_text' => __('Navigation Text', 'optimizepress'),
        );
        $tab_content = $this->_generate_tabs($funnel_pages['sales'],$tabs,'[sales]','',op_get_var($funnel_pages['sales'],'sales_page'));
        $sales_page = $this->_page_section('sales',__('Sales / Cart Page', 'optimizepress'),array('tabs'=>$tabs,'tab_content'=>$tab_content,'module_name'=>'launch_suite_sales_page'));

        $tabs = array(
            'page_setup' => __('Setup', 'optimizepress'),
            'page_thumbnails' => __('Thumbnails', 'optimizepress'),
            'navigation_text' => __('Nav Text', 'optimizepress'),
            'publish_stage' => __('Publish', 'optimizepress'),
            'delete_stage' => __('Delete', 'optimizepress'),
        );
        $counter = 1;
        foreach($funnel_pages['stages'] as $stage){
            $tab_content = $this->_generate_tabs($stage,$tabs,'[stage]','[]',op_get_var($stage,'landing_page'),op_get_var($stage,'value_page'),$counter);
            $stages .= $this->_page_section('stage',sprintf(__('Funnel Stage %1$s', 'optimizepress'),$counter),array('tabs'=>$tabs,'tab_content'=>$tab_content,'module_name'=>'launch_suite_page_'.$counter));
            $counter++;
        }

        $tab_content = $this->_generate_tabs(array(),$tabs,'[stage]','[]',0,0,9999);
        $hidden = $this->_page_section('stage','# TITLE #',array('tabs'=>$tabs,'tab_content'=>$tab_content,'module_name'=>'launch_suite_page_9999'));
        return array('sales_page'=>$sales_page,'stages'=>$stages,'hidden'=>$hidden);
    }

    function _generate_tabs($conf=array(),$tabs,$field_name,$field_ext='',$page_id=0,$page_id2=0,$idx=0){
        _op_tpl('clear');
        op_tpl_assign(array(
            'config' => $conf,
            'page_id' => $page_id,
            'page_id2' => $page_id2,
            'field_name' => $field_name,
            'field_ext' => $field_ext,
            'index' => $idx,
            'add_page_link' => $this->data['add_page_link']
        ));
        $tab_content = array();
        $counter = 0;
        foreach($tabs as $name => $title){
            $tab_data = array();
            if($name == 'page_setup'){
                $tab_data['landing_select'] = $this->_page_select($page_id);
                $tab_data['value_select'] = $this->_page_select($page_id2);
            } elseif($name == 'page_setup_sales'){
                $tab_data['sales_select'] = $this->_page_select($page_id);
            }
            $tab_content[$name] = op_tpl('launch_suite/pages/'.$name,$tab_data);

            //Check if this is the first tab content (if it is, this contains the markup we need to filter)
            if ($counter==1){
                //Create the regex for finding the ID
                $pattern = '/<div id=\".*\" class=\"sneezing-panda op-content-slider\"\>/';
                //Init the counter for the number of replacement we are on
                $replacement_counter = 0;

                //Search through the content with regex, using callback so we can increment the replacement counter
                $tab_content[$name] = preg_replace_callback($pattern,
                    create_function('$matches', '
                        global $replacement_counter;
                        $replacement_counter++;

                        //Return the same string found only this time, increment the id by one
                        return str_replace("\" class=\"sneezing-panda op-content-slider\">", "_".$replacement_counter."\" class=\"sneezing-panda op-content-slider\">", $matches[0]);
                    '),
                $tab_content[$name]);
            }
            $counter++;
        }
        return $tab_content;
    }

    function _page_section($type,$title,$data){
        $content = op_tpl('generic/tabbed_module',$data);
        $data = array(
            'content' => $content,
            'title' => $title,
            'page_type' => $type
        );
        return op_tpl('launch_suite/pages/section',$data);
    }

    function _page_select($selected=0){
        global $wpdb;
        static $pages;
        if(!isset($pages)){
            $funnel_pages = $wpdb->get_results( $wpdb->prepare(
                "SELECT l.page_id,p.post_title FROM `{$wpdb->prefix}optimizepress_launchfunnels_pages` l INNER JOIN `{$wpdb->prefix}posts` p ON l.page_id=p.ID WHERE l.funnel_id=%s ORDER BY p.post_title ASC",
                OP_LAUNCH_FUNNEL
            ));
            $pages = array(
                '' => __('(Select Page...)', 'optimizepress')
            );
            if($funnel_pages){
                foreach($funnel_pages as $page){
                    $this->pages[$page->page_id] = get_permalink($page->page_id);
                    $pages[$page->page_id] = $page->post_title;
                }
            }
        }
        $select = '';
        foreach($pages as $id => $title){
            $select .= '<option value="'.$id.'"'.($id==$selected?' selected="selected"':'').'>'.$title.'</option>';
        }
        $select .= '<input type="hidden" id="op_funnel_pages_stage_page_setup_value_page_title" value="" />';
        return $select;
    }

    function localize($array){
        $array['launch_suite_url'] = menu_page_url(OP_SN.'-launch-suite',false).'&funnel_id=';
        $array['launch_section_title'] = __('Funnel Stage %1$s', 'optimizepress');
        $this->_page_select();
        $array['launch_page_urls'] = $this->pages;
        if(defined('OP_LAUNCH_FUNNEL')){
            $array['launch_funnel_key'] = 'lf_'.OP_LAUNCH_FUNNEL;
        }
        return $array;
    }



    function _save_gateway_key($op){
        $arr = array(
            'enabled' => op_get_var($op,'enabled','N'),
            'key' => op_get_var($op,'key')
        );
        op_launch_update_option('gateway_key',$arr);
        $this->is_key_on = ($arr['enabled']=='Y');
    }

    function _save_perpetual_launch($op){
        $arr = array(
            'enabled' => op_get_var($op,'enabled','N')
        );
        op_launch_update_option('perpetual_launch',$arr);
    }

    function _save_hide_coming_soon($op){
        $arr = array(
            'enabled' => op_get_var($op,'enabled','N')
        );
        op_launch_update_option('hide_coming_soon',$arr);
    }

    function _save_redirect_all($op){
        $arr = array(
            'enabled' => op_get_var($op,'enabled','N'),
            'url' => op_get_var($op,'url')
        );
        op_launch_update_option('redirect_all',$arr);
    }

    function preset_import(){
        global $wpdb;
        if(op_page_option('launch_funnel','enabled')){
            $entry = $wpdb->get_col( $wpdb->prepare(
                "SELECT page_id FROM `{$wpdb->prefix}optimizepress_launchfunnels_pages` WHERE `page_id` = %s AND `funnel_id` = %s",
                OP_PAGEBUILDER_ID,
                $data['funnel_id']
            ));
            if(!$entry){
                $wpdb->query($wpdb->prepare("DELETE FROM `{$wpdb->prefix}optimizepress_launchfunnels_pages` WHERE `page_id` = %s",OP_PAGEBUILDER_ID));
                $insert = array(
                    'funnel_id'=>op_page_option('launch_funnel','funnel_id'),
                    'page_id'=>OP_PAGEBUILDER_ID,
                );
                $wpdb->insert($wpdb->prefix.'optimizepress_launchfunnels_pages',$insert);
            }
        }
    }
}
new OptimizePress_LaunchSuite();
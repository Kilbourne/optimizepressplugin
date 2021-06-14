<?php
class OptimizePress_Dashboard {

    var $cur_step;
    var $sections;
    var $error = false;
    var $notification = false;

    function __construct(){
        //Init the function to add the menu in
        add_action('admin_menu',array($this,'admin_menu'), 30);
    }

    /*
     *
     * This function simply creates the module sections if they don't exist
     *
     */
    function get_sections(){
        //If we do not have sections in this module...
        if(!isset($this->sections)){
            //Init the sections array
            $this->sections = array();

            //Add sections to the array
            $sections = array(
                'global_settings' => __('Global Settings', 'optimizepress'),
                'analytics_and_tracking' => __('Analytics and Tracking', 'optimizepress'),
                'email_marketing_services' => __('Email Marketing Services', 'optimizepress'),
                'social_integration' => __('Social Integration', 'optimizepress'),
                'optimizeleads' => __('OptimizeLeads', 'optimizepress'),
                'compatibility' => __('Compatibility', 'optimizepress'),
            );

            //Loop through each section
            foreach($sections as $section => $title){
                //Include the section into this file
                require_once OP_LIB.'sections/dashboard/'.$section.'.php';

                //Create the class name we are using based on the section
                $class = 'OptimizePress_Sections_'.ucfirst($section);

                //Create the contents of the section
                $this->sections[$section] = array(
                    'title' => $title,
                    'object' => new $class(),
                    'image' => $section.'-icon.png'
                );
            }
        }
    }

    /*
     *
     * Create the menus
     *
     */
    function admin_menu(){
        //Add the submenu
        $page = add_submenu_page(OP_SN, __('Dashboard', 'optimizepress'), __('Dashboard', 'optimizepress'), 'edit_theme_options', OP_SN.'-dashboard', array($this,'dashboard'));

        //Load page functions, styles and scripts
        add_action('load-'.$page, array($this,'save_dashboard'));
        add_action('admin_print_styles-'.$page, array($this,'print_scripts'));
        add_action('admin_footer-'.$page, array($this,'print_footer_scripts'));
    }

    function print_scripts(){
        op_print_scripts('dashboard');
        wp_enqueue_style(OP_SN.'-admin-common', false, false, OP_VERSION);

        op_enqueue_backend_scripts();
    }

    function print_footer_scripts(){
        op_print_footer_scripts('dashboard');
    }

    /*
     *
     * This function is called when the dashboard pages are displayed
     *
     */
    function dashboard(){
        //Create an image
        $img = op_img('',true);

        //Init the tabs and content arrays
        $tabs = array();
        $tab_content = array();

        //Loop through each section
        foreach($this->sections as $name => $section){
            //Init tab info such as title of the tab
            $tabs[$name] = array(
                'title' => $section['title'],
                'prefix' => ''/*'<span><img src="'.$img.$section['image'].'" alt="" width="16" height="53" /></span> '*/
            );

            //Get tab content
            $tab_content[$name] = op_tpl('dashboard/step',array('section_type'=>$name,'sections'=>$section['object']->sections()));

            //Set the li class if the section has an error
            $tabs[$name]['li_class'] = (op_has_section_error($name) ? 'has-error' : '');
        }

        //Create the data array for use in template
        $data = array(
            'tabs' => $tabs,
            'tab_content' => $tab_content,
            'module_name' => 'dashboard',
            'error' => $this->error,
            'notification' => $this->notification,
        );

        //Echo out the template
        echo op_tpl('dashboard/index',array('content' => op_tpl('generic/tabbed_module',$data)));
    }

    function save_dashboard(){
        //Get the sections for this module
        $this->get_sections();

        //Finally we save the dashboard
        if(isset($_POST[OP_SN.'_dashboard'])) $this->save_step();
    }

    function save_step(){
        //Get the primary OP object
        $op = $_POST['op'];

        //Get sections
        $sections_op = op_get_var($op,'sections',array());

        //Loop through sections
        foreach($this->sections as $name => $section){
            //Get current sections
            $sections = $section['object']->sections();

            //Loop through sub sections
            foreach($sections as $section_name => $section_section){
                if(is_array($section_section)){
                    if(isset($section_section['save_action'])) call_user_func_array($section_section['save_action'],array($sections_op));

                    if(isset($section_section['module'])){
                        $mod_ops = op_get_var($op,$section_name,array());
                        $opts = op_get_var($section_section,'options',array());
                        op_mod($section_section['module'])->save_settings($section_name,$opts,$mod_ops);
                    }
                }
            }
        }
        if(op_has_error())
            $this->error = __('There was a problem processing the form, please review the errors below', 'optimizepress');
        else
            $this->notification = __('Your settings have been updated.', 'optimizepress');
    }
}
new OptimizePress_Dashboard();
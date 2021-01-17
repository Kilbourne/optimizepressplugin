<?php
class OptimizePress_Sections_Functionality {

    // Get the list of step 4 sections these can be overridden by the theme using the 'op_edit_sections_modules' filter
    static function sections(){
        //Init the static sections variable
        static $sections;

        //Init the default sections
        $defaults = array(
            'seo' => array(
                'title' => __('SEO Options', 'optimizepress'),
                'module' => 'seo',
                'options' => op_page_config('mod_options','seo'),
                'on_off' => false,
            ),
            /*'fb_share' => array(
                'title' => __('Facebook Share Settings', 'optimizepress'),
                'module' => 'fb_share_settings',
                'options' => op_page_config('mod_options','fb_share_settings'),
                'module_type' => 'page',
                'on_off' => false,
            ),*/
            'scripts' => array(
                'title' => __('Other Scripts', 'optimizepress'),
                'module' => 'scripts',
                'options' => op_page_config('mod_options','scripts'),
                'on_off' => false,
            ),
            'launch_funnel' => array(
                'title' => __('Launch Funnel', 'optimizepress'),
                'module' => 'launch_funnel',
                'options' => op_page_config('mod_options','launch_funnel'),
                'module_type' => 'page'
            ),
            'exit_redirect' => array(
                'title' => __('Exit Redirect', 'optimizepress'),
                'module' => 'exit_redirect',
                'options' => op_page_config('mod_options','exit_redirect'),
                'module_type' => 'page',
            ),
            // 'one_time_offer' => array(
            //  'title' => __('One Time Offer', 'optimizepress'),
            //  'module' => 'one_time_offer',
            //  'options' => op_page_config('mod_options','one_time_offer'),
            //  'module_type' => 'page',
            // ),
            'mobile_redirect' => array(
                'title' => __('Mobile Redirection', 'optimizepress'),
                'module' => 'mobile_redirect',
                'options' => op_page_config('mod_options','mobile_redirection'),
                'module_type' => 'page',
            ),
            'launch_gateway' => array(
                    'title' => __('Launch Gateway', 'optimizepress'),
                    'module' => 'launch_gateway',
                    'options' => op_page_config('mod_options','launch_gateway'),
                    'module_type' => 'page',
            ),
            'lightbox' => array(
                'title' => __('Lightbox Pop', 'optimizepress'),
                'module' => 'lightbox',
                'options' => op_page_config('mod_options','lightbox'),
                'module_type' => 'page',
            ),
            'comments' => array(
                'title' => __('Comments System', 'optimizepress'),
                'module' => 'comments',
                'options' => op_page_config('mod_options','comments'),
                'on_off' => false
            )
        );

        //If there are no sections set, then we must set them
        if(!isset($sections)){
            //Add the default sections to the array
            $sections = array(
                'seo'               => $defaults['seo'],
                //'fb_share'            => $defaults['fb_share'],
                'scripts'           => $defaults['scripts'],
                'launch_funnel'     => $defaults['launch_funnel'],
                'exit_redirect'     => $defaults['exit_redirect'],
                // 'one_time_offer'     => $defaults['one_time_offer'],
                'mobile_redirect'   => $defaults['mobile_redirect']
            );

            //If the SEO options is set to no, then we remove SEO as an option
            if (OP_SEO_ENABLED != 'Y') {
                unset($sections['seo']);
            }

            //Get the keys from the array
            $keys = array_keys($sections);

            //Loop through each section key
            foreach($keys as $name){
                //Check if this section is disabled and remove from array if so
                if(op_page_config('disable','functionality',$name) === true) {
                    unset($sections[$name]);
                }
            }

            //Apply filters to the sections
            $sections = apply_filters('op_edit_sections_page_functionality',$sections);
            $sections = apply_filters('op_edit_sections_page_functionality_'.op_page_option('theme','type'),$sections);
        }

        //Return the sections
        return $sections;
    }

}
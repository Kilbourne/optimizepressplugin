<?php
class OptimizePress_Sections_Optimizeleads {
    function sections(){
        static $sections;
        if(!isset($sections)){
            $sections = array(
                'optimizeleads_api_key' => array(
                     'title' => __('OptimizeLeads API Key', 'optimizepress'),
                     'action' => array($this, 'optimizeleads_api_key'),
                     'save_action' => array($this, 'save_optimizeleads')
                ),
                'optimizeleads_sitewide' => array(
                     'title' => __('Site-Wide Configuration', 'optimizepress'),
                     'action' => array($this, 'optimizeleads_sitewide'),
                     'save_action' => array($this, 'save_optimizeleads')
                ),
            );
            $sections = apply_filters('op_edit_sections_optimizeleads', $sections);
        }
        return $sections;
    }


    function optimizeleads_api_key(){
        echo op_load_section('optimizeleads_api_key', array(), 'optimizeleads');
    }

    function optimizeleads_sitewide(){
        // if ($errorClass === '') {
            echo op_load_section('optimizeleads_sitewide', array(), 'optimizeleads');
        // }
    }

    function save_optimizeleads($op){
        global $wp_version;
        $api_key = op_get_var($op, 'optimizeleads_api_key');
        $args = array(
            'timeout'     => 5,
            'redirection' => 5,
            'httpversion' => '1.0',
            'user-agent'  => 'WordPress/' . $wp_version . '; ' . get_bloginfo( 'url' ),
            'blocking'    => true,
            'headers'     => array('X-API-Token' => $api_key),
            'cookies'     => array(),
            'body'        => null,
            'compress'    => false,
            'decompress'  => true,
            'sslverify'   => true,
            'stream'      => false,
            'filename'    => null
        );

        // Update the OptimizeLeads API key.
        // We want to update it in either case, even if user removes it
        op_update_option('optimizeleads_api_key', $api_key);

        // No need to go further if there's no API key
        if (empty($api_key)) {
            op_update_option('optimizeleads_api_key_error', false);
            return;
        }

        // Get the OPLeads boxes
        $response = wp_remote_get( OP_LEADS_URL . 'api/boxes', $args );
        $response = json_decode($response['body']);

        if (isset($response->error)) {
            $message = __('There was an error with your OptimizeLeads API key. Please re-check it and try again.', 'optimizepress');
            if ($response->code == 401) {
                $message = __('Your OptimizeLeads API key is invalid. Please re-check it.', 'optimizepress');
            }

            op_tpl_error('op_sections_optimizeleads', $message);
            op_update_option('optimizeleads_api_key_error', $message);
            op_group_error('optimizeleads');
            op_section_error('optimizeleads_optimizeleads_api_key');

        } else {
            op_update_option('optimizeleads_api_key_error', false);
        }

        // Sitewide related options
        $optimizeLeadsSitewideUid = op_get_var($op, 'optimizeleads_sitewide_uid');

        if (!empty($optimizeLeadsSitewideUid)) {

            op_update_option('optimizeleads_sitewide_uid', $optimizeLeadsSitewideUid);

            // Save the basic filter options
            $filters = op_get_var($op, 'optimizeleads_sitewide_filter');
            op_update_option('optimizeleads_sitewide_filter', $filters);

            if (isset($_POST['opl_post_id']))
                update_option('opl_post_id',
                    $_POST['opl_post_id']);
            else
                delete_option('opl_post_id');

            // Save the category options
            $category_filters = op_get_var($op, 'optimizeleads_sitewide_filter_category');
            op_update_option('optimizeleads_sitewide_filter_category', $category_filters);

            // We retrieve the embed code only if necessary
            if (!empty($api_key) && !empty($optimizeLeadsSitewideUid)) {
                $response = wp_remote_get( OP_LEADS_URL . 'api/boxes/' . $optimizeLeadsSitewideUid, $args );
                $response = json_decode($response['body']);

                if (!empty($response)
                    && isset($response->box)
                    && isset($response->box->embed_code)
                    && $optimizeLeadsSitewideUid !== 'none'
                ) {
                    op_update_option('optimizeleads_sitewide_embed', $response->box->embed_code);
                } else {
                    op_update_option('optimizeleads_sitewide_embed', '');
                }
            }
        }
    }
}

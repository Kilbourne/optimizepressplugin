<?php
class OptimizePress_Sections_Compatibility {
    function sections(){
        static $sections;
        if(!isset($sections)){
            $sections = array(
                'advanced_filter' => array(
                    'title' => __('Advanced WP Filter Settings', 'optimizepress'),
                    'action' => array($this,'advanced_filter'),
                    'save_action' => array($this,'save_advanced_filter')
                ),
                'external_plugin_compatibility' => array(
                    'title' => __('External Plugin Compatibility', 'optimizepress'),
                    'action' => array($this,'external_plugin_compatibility'),
                    'save_action' => array($this,'save_external_plugin_compatibility')
                ),
                'compatibility_check' => array(
                    'title' => __('Compatibility Check', 'optimizepress'),
                    'action' => array($this, 'compatibility_check'),
                ),
            );
            $sections = apply_filters('op_edit_sections_compatibility', $sections);
        }
        return $sections;
    }


    /**
     * Advanced filter settings
     */
    function advanced_filter()
    {
        echo op_load_section('advanced_filter', array(), 'compatibility');
    }

    function save_advanced_filter($op)
    {
        if ($advancedFilter = op_get_var($op, 'advanced_filter')) {
            op_update_option('advanced_filter', $advancedFilter);
        }
    }

    /**
     * External plugin compatibility
     */
    function external_plugin_compatibility()
    {
        echo op_load_section('external_plugin_compatibility', array(), 'compatibility');
    }

    function save_external_plugin_compatibility($op)
    {
        op_update_option('dap_redirect_url', op_get_var($op, 'dap_redirect_url'));
        op_update_option('fast_member_redirect_url', op_get_var($op, 'fast_member_redirect_url'));
        op_update_option('imember_redirect_url', op_get_var($op, 'imember_redirect_url'));
        if ('theme' === OP_TYPE) {
            op_update_option('op_other_plugins', op_get_var($op, 'op_other_plugins'));
        }
    }


    function compatibility_check()
    {
        global $wpdb;
        global $wp_version;

        $data = array();

        // PHP
        if (version_compare(PHP_VERSION, '5.3', '<')) {
            $data['php'] = array(
                'status' => 'warning',
                'message' => sprintf(__('Your PHP version (%s) is lower than recommended (%s).', 'optimizepress'), PHP_VERSION, '5.3'),
            );
        } else {
            $data['php'] = array(
                'status' => 'ok',
                'message' => sprintf(__('Your PHP version (%s) meets requirements (%s).', 'optimizepress'), PHP_VERSION, '5.3'),
            );
        }

        // MySQL
        if (version_compare($wpdb->db_version(), '5.0', '<')) {
            $data['mysql'] = array(
                'status' => 'error',
                'message' => sprintf(__('Your MySQL version (%s) is lower than required (%s).', 'optimizepress'), $wpdb->db_version(), '5.0'),
            );
        } else {
            $data['mysql'] = array(
                'status' => 'ok',
                'message' => sprintf(__('Your MySQL version (%s) meets requirements (%s).', 'optimizepress'), $wpdb->db_version(), '5.0'),
            );
        }

        // WP
        if (version_compare($wp_version, '3.5', '<')) {
            $data['wordpress'] = array(
                'status' => 'warning',
                'message' => sprintf(__('Your WordPress version (%s) is lower than recommended (%s).', 'optimizepress'), $wp_version, '3.5'),
            );
        } else {
            $data['wordpress'] = array(
                'status' => 'ok',
                'message' => sprintf(__('Your WordPress version (%s) meets requirements (%s).', 'optimizepress'), $wp_version, '3.5'),
            );
        }

        // Transfer protocols (curl, streams)
        $http = new Wp_Http();
        if (false === $http->_get_first_available_transport(array())) {
            $data['transfer'] = array(
                'status' => 'error',
                'message' => __('There are no transport protocols (curl, streams) that are capable of handling the requests.', 'optimizepress'),
            );
        } else {
            $data['transfer'] = array(
                'status' => 'ok',
                'message' => __('Transfer protocols (curl, streams) are in order.', 'optimizepress'),
            );
        }

        // OP SL
        if (true !== op_sl_ping()) {
            $data['op_sl'] = array(
                'status' => 'error',
                'message' => __('Unable to connect to OptimizePress Security & Licensing service.', 'optimizepress'),
            );
        } else {
            $data['op_sl'] = array(
                'status' => 'ok',
                'message' => __('Connection with OptimizePress Security & Licensing service is in order.', 'optimizepress'),
            );
        }

        // OP Eligibility
        if (true !== op_sl_eligible()) {
            $data['eligiblity'] = array(
                'status' => 'warning',
                'message' => sprintf(__('You are not eligible for new updates. You can prolong your subscription <a href="%s" target="_blank">here</a>.', 'optimizepress'), 'http://optimizepress.com/updates-renewal/'),
            );
        } else {
            $data['eligiblity'] = array(
                'status' => 'ok',
                'message' => sprintf(__('You are eligible for new updates. You can prolong your subscription <a href="%s" target="_blank">here</a>.', 'optimizepress'), 'http://optimizepress.com/updates-renewal/'),
            );
        }

        // Permalink structure
        if ('' === $permalink_structure = get_option('permalink_structure', '')) {
            $data['permalink'] = array(
                'status' => 'error',
                'message' => sprintf(__('Permalink structure must not be set to "default" for OptimizePress to work correctly. Please change the <a href="%s">setting</a>.', 'optimizepress'), admin_url('options-permalink.php')),
            );
        } else {
            $data['permalink'] = array(
                'status' => 'ok',
                'message' => sprintf(__('Permalink structure is in order (%s).', 'optimizepress'), trim($permalink_structure, '/')),
            );
        }

        // Memory limit
        $memory_limit = wp_convert_hr_to_bytes(ini_get('memory_limit')) / 1024 / 1024;
        if ($memory_limit < 64) {
            $data['memory'] = array(
                'status' => 'warning',
                'message' => sprintf(__('Your memory limit (%sMB) is lower than recommended (%sMB)', 'optimizepress'), $memory_limit, 64),
            );
        } else {
            $data['memory'] = array(
                'status' => 'ok',
                'message' => sprintf(__('Your memory limit (%sMB) meets recommendation (%sMB)', 'optimizepress'), $memory_limit, 64),
            );
        }

        // Upload limit
        $upload_limit = wp_max_upload_size() / 1024 / 1024;
        if ($upload_limit < 32) {
            $data['upload'] = array(
                'status' => 'warning',
                'message' => sprintf(__('Your upload limit (%sMB) is lower than recommended (%sMB).', 'optimizepress'), $upload_limit, 32),
            );
        } else {
            $data['upload'] = array(
                'status' => 'ok',
                'message' => sprintf(__('Your upload limit (%sMB) meets recommendation (%sMB).', 'optimizepress'), $upload_limit, 32),
            );
        }

        // Max input vars
        $input_vars_limit = ini_get('max_input_vars');
        if ($input_vars_limit < 3000) {
            $data['input_vars'] = array(
                'status' => 'info',
                'message' => sprintf(__('Your "max_input_vars" setting is set to %s. If you plan to have pages with a large number of elements on it, you should raise this setting to at least %s.', 'optimizepress'), $input_vars_limit ? $input_vars_limit : 1000, 3000),
            );
        } else {
            $data['input_vars'] = array(
                'status' => 'ok',
                'message' => sprintf(__('Your "max_input_vars" (%s) meets recommendation (%s).', 'optimizepress'), $input_vars_limit, 3000),
            );
        }

        // Max execution time
        $execution_time = ini_get('max_execution_time');
        if ($execution_time < 60) {
            $data['execution_time'] = array(
                'status' => 'info',
                'message' => sprintf(__('Your "max_execution_time" setting (%s) is lower than recommended (%s).', 'optimizepress'), $execution_time ? $execution_time : 30, 60),
            );
        } else {
            $data['execution_time'] = array(
                'status' => 'ok',
                'message' => sprintf(__('Your "max_execution_time" (%s) meets recommendation (%s).', 'optimizepress'), $execution_time, 60),
            );
        }

        echo op_load_section('compatibility_check', array('compat' => $data), 'compatibility');
    }
}
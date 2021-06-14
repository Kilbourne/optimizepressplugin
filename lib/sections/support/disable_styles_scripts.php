<?php

/**
 * Disable Styles and Scripts sections for OptimizePress Support page
 */
class OptimizePress_Sections_Disable_Styles_Scripts
{
    /**
     * Return available sections
     * @return array
     */
    public function sections()
    {
        $sections = array(
            'plugins'           => array(
                'title'         => __('Plugin Styles and Scripts', 'optimizepress'),
                'action'        => array($this, 'loadPlugins'),
                'save_action'   => array($this, 'savePlugins'),
            ),
        );

        if (OP_TYPE === 'plugin') {
            $sections['theme'] = array(
                'title'         => __('Theme Styles and Scripts', 'optimizepress'),
                'action'        => array($this, 'loadTheme'),
                'save_action'   => array($this, 'saveTheme'),
            );
        }

        return apply_filters('op_edit_sections_disable_styles_scripts', $sections);
    }

    /**
     * Load plugin section template
     * @return void
     */
    public function loadPlugins()
    {
        echo op_load_section('plugins', array('plugins' => get_plugins()), 'disable_styles_scripts');
    }

    /**
     * Save form data
     * @param  array $data
     * @return void
     */
    public function savePlugins($data)
    {
        // Frontend
        $externalPlugins = op_get_var($data, 'external_plugins');
        if (isset($externalPlugins['css'])) {
            op_update_option('op_external_plugins_css', $externalPlugins['css']);
        } else {
            op_delete_option('op_external_plugins_css');
        }
        if (isset($externalPlugins['js'])) {
            op_update_option('op_external_plugins_js', $externalPlugins['js']);
        } else {
            op_delete_option('op_external_plugins_js');
        }

        // Backend
        $externalPlugins = op_get_var($data, 'le_external_plugins');
        if (isset($externalPlugins['css'])) {
            op_update_option('op_le_external_plugins_css', $externalPlugins['css']);
        } else {
            op_delete_option('op_le_external_plugins_css');
        }
        if (isset($externalPlugins['js'])) {
            op_update_option('op_le_external_plugins_js', $externalPlugins['js']);
        } else {
            op_delete_option('op_le_external_plugins_js');
        }
    }

    /**
     * Load theme section template
     * @return void
     */
    public function loadTheme()
    {
        echo op_load_section('theme', array('theme' => wp_get_theme()), 'disable_styles_scripts');
    }

    /**
     * Save form data
     * @param  array $data
     * @return void
     */
    public function saveTheme($data)
    {
        // Frontend
        op_update_option('op_external_theme_css', op_get_var($data, 'external_theme_css'));
        op_update_option('op_external_theme_js', op_get_var($data, 'external_theme_js'));

        // Backend
        op_update_option('op_le_external_theme_css', op_get_var($data, 'le_external_theme_css'));
        op_update_option('op_le_external_theme_js', op_get_var($data, 'le_external_theme_js'));
    }
}
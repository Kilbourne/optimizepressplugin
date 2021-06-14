<?php

/**
 * Render and edit LE elements shortcodes in page/post editor
 */
class OptimizePress_Admin_EditorShortcodes
{
    /**
     * Init hooks and filters.
     */
    public function __construct()
    {
        add_action('wp_enqueue_editor', array($this, 'enqueueEditorScripts'));
        add_action('wp_ajax_do_shortcode', array($this, 'doShortcode'));
        add_action('admin_print_scripts-post-new.php', array($this, 'enqueueAdminStyles'));
        add_action('admin_print_scripts-post.php', array($this, 'enqueueAdminStyles'));

        add_filter('mce_css', array($this, 'addTinyMceEditorStyles'));
        add_filter(OP_SN . '-script-localize', array($this, 'localizeEditorScripts'));
    }

    /**
     * Enqueue editor scripts.
     * @param  string $page
     * @return void
     */
    public function enqueueEditorScripts()
    {
        if ($this->isViableToUse()) {

            // We need base and frontend scripts
            // to be able to generate element
            // previews in WYSIWYG
            op_enqueue_base_scripts();
            wp_enqueue_script(OP_SN . '-editor-shortcodes', OP_JS . 'editor_shortcodes' . OP_SCRIPT_DEBUG . '.js', false, OP_VERSION, true);
            op_enqueue_frontend_scripts();

        }
    }

    /**
     * Add JS params needed by editor scripts.
     * @param  array $data
     * @return array
     */
    public function localizeEditorScripts($data)
    {
        if ($this->isViableToUse()) {
            $data['leNonce']    = wp_create_nonce('op_liveeditor');
            $data['shortcodes'] = array_keys(op_assets_parse_list());
        }

        return $data;
    }

    /**
     * Render LE shortcode.
     * @return void
     */
    public function doShortcode()
    {
        check_ajax_referer('op_liveeditor', 'nonce');
        wp_send_json_success(do_shortcode(stripslashes($_POST['shortcode'])));
    }

    /**
     * Add styles to TinyMce editor.
     * @param array $stylesheets
     * @return array
     */
    function addTinyMceEditorStyles($stylesheets)
    {
        if ($this->isViableToUse()) {
            $stylesheets .= ',' . OP_PAGES_URL .'global/css/layout' . OP_SCRIPT_DEBUG . '.css';
            $stylesheets .= ',' . OP_ASSETS_URL .'default' . OP_SCRIPT_DEBUG . '.css';
            if (OP_TYPE === 'theme') {
                $stylesheets .= ',' . OP_THEME_URL . 'style' . OP_SCRIPT_DEBUG . '.css';
            }
            $stylesheets .= ',' . OP_CSS . 'live_editor' . OP_SCRIPT_DEBUG . '.css';
            $stylesheets .= ',' . OP_CSS . 'editor_shortcodes_mce' . OP_SCRIPT_DEBUG . '.css';
        }

        return $stylesheets;
    }

    /**
     * Enqueue admin styles.
     * @return void
     */
    public function enqueueAdminStyles()
    {
        if ($this->isViableToUse()) {
            wp_enqueue_style(OP_SN . '-editor-shortcodes-overlay', OP_CSS . 'editor_shortcodes_overlay' . OP_SCRIPT_DEBUG . '.css');
        }
    }

    /**
     * Check if we are on the screen that should utilize editor shortcodes. This way we won't have any issues with LE TinyMce instances.
     * @return boolean
     */
    protected function isViableToUse()
    {
	    // in some cases we received get_current_screen is not defined
	    if (!function_exists('get_current_screen')) {
		    require_once(ABSPATH . 'wp-admin/includes/screen.php');
	    }

	    $screen = get_current_screen();

        // Utilize only on page edit screen
        if ($screen instanceof WP_Screen && $screen->base === 'post' && ($screen->post_type === 'page' || $screen->post_type === 'post')) {
            return true;
        }

        return false;
    }
}

new OptimizePress_Admin_EditorShortcodes;
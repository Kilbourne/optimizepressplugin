<?php

/**
 * OptimizePress Admin Stats Page
 *
 * @author OptimizePress <info@optimizepress.com>
 */
class OptimizePress_Screen_Stats
{
    protected $sections;
    protected $error;
    protected $notification;

    /**
     * Add menu page action.
     */
    public function __construct()
    {
        add_action('admin_menu', array($this, 'addMenuPage'), 90);
    }

    /**
     * Register menu page.
     *
     * @return void
     */
    public function addMenuPage()
    {
        $page = add_submenu_page(OP_SN, __('Experiments', 'optimizepress'), __('Experiments', 'optimizepress'), 'edit_theme_options', OP_SN . '-stats', array($this, 'displayPage'));

        add_action('load-' . $page, array($this, 'initSections'));
        // add_action('load-' . $page, array($this, 'saveSections'));
        add_action('admin_print_styles-' . $page, array($this,'printScripts'));
        add_action('admin_footer-' . $page, array($this,'printFooterScripts'));
        add_action('admin_enqueue_scripts', array($this, 'enqueueScripts'));
    }

    /**
     * Enqueue scripts for stats page only (Flot charting library).
     *
     * @param  string $hook
     * @return void
     */
    public function enqueueScripts($hook)
    {
        if ($hook !== 'optimizepress_page_optimizepress-stats') {
            return;
        }

        wp_enqueue_script('excanvas', OP_JS . 'excanvas.min.js', false, OP_VERSION, true);
        wp_script_add_data('excanvas', 'conditional', 'lte IE 8');

        wp_enqueue_script('flot', OP_JS . 'flot/jquery.flot.min.js', array(OP_SCRIPT_BASE), OP_VERSION, false);
        wp_enqueue_script('flot-resize', OP_JS . 'flot/jquery.flot.resize.min.js', array(OP_SCRIPT_BASE, 'flot'), OP_VERSION, false);

        wp_enqueue_script('op-flot-init', OP_JS . 'flot/op-flot-init' . OP_SCRIPT_DEBUG . '.js', array('jquery', 'flot'), OP_VERSION, true);
        wp_localize_script('op-flot-init', 'OpStats', array('data' => op_optin_stats_get_chart_formated_data()));
    }

    /**
     * Print head scripts.
     *
     * @return void
     */
    public function printScripts()
    {
        op_print_scripts('stats');
        wp_enqueue_style(OP_SN . '-admin-common', false, false, OP_VERSION);

        op_enqueue_backend_scripts();
    }

    /**
     * Print footer scripts.
     *
     * @return void
     */
    public function printFooterScripts()
    {
        op_print_footer_scripts('stats');
    }

    /**
     * Show Stats page with its sections. Load "stats/index" template.
     *
     * @return void
     */
    public function displayPage()
    {
        $tabs = $tabContent = array();

        foreach ($this->sections as $key => $section) {
            $tabs[$key] = array(
                'title'     => $section['title'],
                'prefix'    => '',
                'li_class'  => op_has_section_error($key) ? 'has-error' : '',
            );

            $tabContent[$key] = op_tpl('support/step', array('section_type' => $key, 'sections' => $section['object']->sections()));
        }

        $data = array(
            'tabs'          => $tabs,
            'tab_content'   => $tabContent,
            'module_name'   => 'stats',
            'error'         => $this->error,
            'notification'  => $this->notification,
        );

        echo op_tpl('stats/index', array('content' => op_tpl('generic/tabbed_module', $data)));
    }

    /**
     * Initialize sections.
     *
     * @return void
     */
    public function initSections()
    {
        $sections = apply_filters('op_screen_stats_sections', array(
            'stats' => __('Experiments', 'optimizepress'),
        ));

        foreach ($sections as $key => $title) {
            if ( ! class_exists('OptimizePress_Sections_' . ucfirst($key))) {
                require_once OP_LIB . 'sections/stats/' . $key . '.php';
            }

            $class = 'OptimizePress_Sections_' . ucfirst($key);

            $this->sections[$key] = array(
                'title'     => $title,
                'object'    => new $class(),
                'image'     => $key . '-icon.png'
            );
        }
    }

    /**
     * Save page sections. Run each section "save_action" callback which deals with saving of data.
     *
     * @return void
     */
    public function saveSections()
    {
        return;
    }
}

new OptimizePress_Screen_Stats();

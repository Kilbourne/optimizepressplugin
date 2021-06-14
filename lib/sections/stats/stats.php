<?php

/**
 * Show system stats section.
 */
class OptimizePress_Sections_Stats
{
    protected $sections;

    /**
     * Init hooks.
     */
    public function __construct()
    {
        add_action('admin_enqueue_scripts', array($this, 'enqueueScripts'));
    }

    /**
     * Enqueue styles and scripts.
     * @param  string $hook
     * @return void
     */
    public function enqueueScripts($hook)
    {
        if ('optimizepress_page_optimizepress-stats' !== $hook) {
            return;
        }

        wp_enqueue_style('optimizepress-stats-clubhouse-ui', OP_CSS . 'clubhouse-ui' . OP_SCRIPT_DEBUG . '.css', array(), OP_VERSION);
    }

    /**
     * Initialize sections.
     *
     * @return array
     */
    public function sections()
    {
        if (!isset($this->sections)) {
            $sections = array(
                'clubhouse' => array(
                    'title'     => __('Clubhouse', 'optimizepress'),
                    'action'    => array($this, 'showClubhouseInfo'),
                ),
                'optin' => array(
                    'title'     => __('Optin Stats', 'optimizepress'),
                    'action'    => array($this, 'showOptinStats'),
                ),
            );

            $this->sections = apply_filters('op_edit_sections_stats', $sections);
        }

        return $this->sections;
    }

    /**
     * Load and show optin stats.
     *
     * @return void
     */
    public function showOptinStats()
    {
    ?>
        <div class="op-bsw-grey-panel-content op-bsw-grey-panel-no-sidebar cf" style="display: block;">
            <label><?php _e('Total Optins from OptimizePress', 'optimizepress'); ?></label>
            <h2 style="color: #004a80; text-align: center;"><?php printf('%s', number_format_i18n(op_optin_stats_get_local_total_count())); ?></h2>
            <p class="op-micro-copy"><?php printf(__('<small>(since %s)</small>', 'optimizepress'), date_i18n(get_option('date_format'), strtotime(OptimizePress_Optin_Stats::SINCE_DATE))); ?></p>

        <?php if (op_optin_stats_get_local_data()) : ?>
            <hr />

            <label><?php _e('Optins per month', 'optimizepress'); ?></label>
            <div id="optin_stats_chart" style="height: 300px; width: 437px;"></div>
            <div class="clear"></div>
        <?php endif; ?>
        </div>
    <?php
    }

    public function showClubhouseInfo()
    {
        ?>
            <div class="op-clubhouse-box cf">
                <h5 class="op-clubhouse-lead"><?php _e('OptimizePress Experiments', 'optimizepress-stats'); ?></h6>
                <h3 class="op-clubhouse-headline"><?php _e('Why should you be A/B testing?', 'optimizepress-stats'); ?></h3>
                <ul class="op-clubhouse-reasons cf">
                    <li class="op-float-left op-clubhouse-icon op-icon-list">
                        <h6><?php _e('Grow Your List', 'optimizepress-stats'); ?></h6>
                        <p><?php _e('Test elements of your landing pages to improve opt-in rates & list growth.', 'optimizepress-stats'); ?></p>
                    </li>
                    <li class="op-float-right op-clubhouse-icon op-icon-sales">
                        <h6><?php _e('Boost Sales', 'optimizepress-stats'); ?></h6>
                        <p><?php _e('Increase engagement on your sales and funnel pages to boost profits.', 'optimizepress-stats'); ?></p>
                    </li>
                    <li class="op-float-left op-clubhouse-icon op-icon-conversions">
                        <h6><?php _e('Increase Conversions', 'optimizepress-stats'); ?></h6>
                        <p><?php _e('Test your copy, images, page layouts & colours to increase conversions.', 'optimizepress-stats'); ?></p>
                    </li>
                    <li class="op-float-right op-clubhouse-icon op-icon-optimize">
                        <h6><?php _e('Optimize Your Site', 'optimizepress-stats'); ?></h6>
                        <p><?php _e('Let the data do the work, optimize your pages towards your goal.', 'optimizepress-stats'); ?></p>
                    </li>
                </ul>
                <a class="op-clubhouse-btn-primary" href="http://www.optimizepress.com/plus-pack/" target="_blank"><?php _e('Find out more', 'optimizepress-stats'); ?></a>
            </div>
        <?php
    }
}

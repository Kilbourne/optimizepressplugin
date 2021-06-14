<?php

/**
 * Class for simple optin stats
 * @author OptimizePress <info@optimizepress.com>
 * @since 2.5.4
 */
class OptimizePress_Optin_Stats
{
    const OPTION_LOCAL_KEY = 'optin_stats_local';
    const OPTION_GLOBAL_KEY = 'optin_stats_global';
    const SINCE_DATE = '2016-03-30';

    /**
     * @var array
     */
    protected $globalData;

    /**
     * @var array
     */
    protected $localData;

    /**
     * @var OptimizePress_Optin_Stats
     */
    protected static $instance;

    /**
     * Singleton pattern instance getter.
     *
     * @return OptimizePress_Optin_Stats
     */
    public static function getInstance()
    {
        if (null === self::$instance) {
            self::$instance = new self;
        }

        return self::$instance;
    }

    /**
     * Hook into WP actions and filters.
     */
    private function __construct()
    {
        add_action('op_process_optin_after', array($this, 'recordOptin'), 10, 2);
        add_action('wp_dashboard_setup', array($this, 'registerDashboardWidget'), 10);
    }

    /**
     * Record optin for current Y-m key.
     *
     * @param string $type
     * @param boolean $status
     * @return boolean
     */
    public function recordOptin($type = null, $status = true)
    {
        /*
         * If user isn't subscribed (either some error occured or he is already on the list) we won't record his optin.
         * We won't record GoToWebinar as well as it would duplicate results.
         */
        if (false === $status || 'gotowebinar' === $type) {
            return false;
        }

        $key = date('Y-m');

        $data = $this->getLocalData();

        if (isset($data[$key]) && !empty($data[$key])) {
            $data[$key] = $data[$key] + 1;
        } else {
            $data[$key] = 1;
        }

        $this->saveLocalData($data);

        return true;
    }

    /**
     * Return local month optin stats count.
     *
     * @param  string $key
     * @return integer
     */
    public function getLocalMonthCount($key)
    {
        $data = $this->getLocalData();

        if (is_array($data) && isset($data[$key]) && !empty($data[$key])) {
            return (int) $data[$key];
        }

        return 0;
    }

    /**
     * Return local month optin stats count for current month.
     *
     * @return integer
     */
    public function getLocalCurrentMonthCount()
    {
        return $this->getLocalMonthCount(date('Y-m'));
    }

    /**
     * Return local month optin stats count for last month.
     *
     * @return integer
     */
    public function getLocalLastMonthCount()
    {
        return $this->getLocalMonthCount(date('Y-m', strtotime("first day of last month")));
    }

    /**
     * Return total optin stats count. Filterable with $year.
     *
     * @param  mixed $year
     * @return integer
     */
    public function getLocalTotalCount($year = null)
    {
        $data = $this->getLocalData();

        // If there is no date we leave early
        if (!is_array($data)) {
            return 0;
        }

        // Total count
        if (null === $year) {
            return array_sum($data);
        }

        // Count for given year
        $count = 0;
        foreach ($data as $key => $value) {
            if (0 === strpos($key, $year)) {
                $count += $value;
            }
        }

        return (int) $count;
    }

    /**
     * Return total global optin stats.
     *
     * @return integer
     */
    public function getGlobalTotalCount()
    {
        $data = $this->getGlobalData();

        if (isset($data['total']) && !empty($data['total'])) {
            return (int) $data['total'];
        }

        return 0;
    }

    /**
     * Return global optin stats for current month.
     *
     * @return integer
     */
    public function getGlobalCurrentMonthCount()
    {
        $data = $this->getGlobalData();

        if (isset($data['current']) && !empty($data['current'])) {
            return (int) $data['current'];
        }

        return 0;
    }

    /**
     * Lazy load global stats from WP options table.
     *
     * @return array
     */
    protected function getGlobalData()
    {
        if (null === $this->globalData) {
            $data = op_get_option(self::OPTION_GLOBAL_KEY);

            if (!is_array($data)) {
                $data = array();
            }

            $this->globalData = $data;
        }

        return $this->globalData;
    }

    /**
     * Lazy load global stats from WP options table.
     *
     * @return array
     */
    public function getLocalData()
    {
        if (null === $this->localData) {
            $data = op_get_option(self::OPTION_LOCAL_KEY);

            if (!is_array($data)) {
                $data = array();
            }

            $this->localData = $data;
        }

        return $this->localData;
    }

    /**
     * Save local optin stats.
     *
     * @param  array $data
     * @return boolean
     */
    public function saveLocalData($data)
    {
        op_update_option(self::OPTION_LOCAL_KEY, $data);
        $this->localData = $data;

        return true;
    }

    /**
     * Save global optin stats.
     *
     * @param mixed $data
     * @return boolean
     */
    public function saveGlobalData($data)
    {
        op_update_option(self::OPTION_GLOBAL_KEY, (array) $data);
        $this->globalData = (array) $data;

        return true;
    }

    /**
     * Register dashboard widget for showing OP stats.
     *
     * @return void
     */
    public function registerDashboardWidget()
    {
        wp_add_dashboard_widget(
            'op_optin_stats_widget',
            __('Optin Stats', 'optimizepress'),
            array($this, 'displayDashboardWidget')
        );

        wp_enqueue_script('excanvas', OP_JS . 'excanvas.min.js', false, OP_VERSION, true);
        if (function_exists('wp_script_add_data')) {
            wp_script_add_data('excanvas', 'conditional', 'lte IE 8');
        }

        wp_enqueue_script('flot', OP_JS . 'flot/jquery.flot.min.js', array(OP_SCRIPT_BASE), OP_VERSION, false);
        wp_enqueue_script('flot-resize', OP_JS . 'flot/jquery.flot.resize.min.js', array(OP_SCRIPT_BASE, 'flot'), OP_VERSION, false);

        wp_enqueue_script('op-flot-init', OP_JS . 'flot/op-flot-init' . OP_SCRIPT_DEBUG . '.js', array(OP_SCRIPT_BASE, 'flot'), OP_VERSION, false);
        wp_localize_script('op-flot-init', 'OpStats', array('data' => $this->getChartFormatedData()));
    }

    /**
     * Output dashboard widget.
     *
     * @return void
     */
    public function displayDashboardWidget()
    {
    ?>
        <h3><?php printf(__('Total Optins from OptimizePress <small>(since %s)</small>', 'optimizepress'), date_i18n(get_option('date_format'), strtotime(self::SINCE_DATE))); ?></h3>
        <h2 style="color: #004a80; text-align: center;"><?php printf('%s', number_format_i18n($this->getLocalTotalCount())); ?></h2>

    <?php if ($this->getLocalData()) : ?>
        <hr />

        <h3><?php _e('Optins per month', 'optimizepress'); ?></h3>
        <div id="optin_stats_chart" style="height: 300px; width: 100%;"></div>
    <?php endif;
    }

    /**
     * Return formated for Flot charting and sorted local data.
     *
     * @param integer $limit
     * @return array
     */
    public function getChartFormatedData($limit = 10)
    {
        $data = array();

        $localData = $this->getLocalData();

        ksort($localData, SORT_STRING);

        foreach ($localData as $period => $number) {
            $data[] = array(date('M', strtotime($period)), (int) $number);
        }

        return array_slice($data, ($limit * -1));
    }
}

// Class needs to be instantiated to hook all actions and hooks
OptimizePress_Optin_Stats::getInstance();

/**
 * Record optin for current Y-m key.
 * @param string $type
 * @return boolean
 */
function op_optin_stats_record($type = null)
{
    return OptimizePress_Optin_Stats::getInstance()->recordOptin($type);
}

/**
 * Return local month optin stats for given month (date("Y-m")|"current"|"last").
 *
 * @param  string $key
 * @return integer
 */
function op_optin_stats_get_local_month_count($key)
{
    if ($key === 'current') {
        return OptimizePress_Optin_Stats::getInstance()->getLocalCurrentMonthCount();
    } else if ($key === 'last') {
        return OptimizePress_Optin_Stats::getInstance()->getLocalLastMonthCount();
    } else {
        return OptimizePress_Optin_Stats::getInstance()->getLocalMonthCount($key);
    }
}

/**
 * Save global optin stats values.
 *
 * @param  mixed $data
 * @return boolean
 */
function op_optin_stats_save_global_data($data)
{
    return OptimizePress_Optin_Stats::getInstance()->saveGlobalData($data);
}

/**
 * Return total global optin stats.
 *
 * @return integer
 */
function op_optin_stats_get_global_total_count()
{
    return OptimizePress_Optin_Stats::getInstance()->getGlobalTotalCount();
}

/**
 * Return total local optin stats.
 *
 * @return integer
 */
function op_optin_stats_get_local_total_count()
{
    return OptimizePress_Optin_Stats::getInstance()->getLocalTotalCount();
}

/**
 * Return local optin stats data.
 *
 * @return array
 */
function op_optin_stats_get_local_data()
{
    return OptimizePress_Optin_Stats::getInstance()->getLocalData();
}

/**
 * Return global optin stats for current month.
 *
 * @return integer
 */
function op_option_stats_get_global_current_month_count()
{
    return OptimizePress_Optin_Stats::getInstance()->getGlobalCurrentMonthCount();
}

/**
 * Return data formated for Flot charting library.
 *
 * @param  integer $limit
 * @return array
 */
function op_optin_stats_get_chart_formated_data($limit = 10)
{
    return OptimizePress_Optin_Stats::getInstance()->getChartFormatedData($limit);
}

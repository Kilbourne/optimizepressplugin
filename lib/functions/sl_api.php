<?php

/**
 * Class for handling API actions as well as security and licensing
 * @author OptimizePress <info@optimizepress.com>
 */
class OptimizePress_Sl_Api
{
	//const OP_SL_BASE_URL                = 'aHR0cDovL29wdGltaXplaHViLmNvbS9zbC9wdWJsaWMvYXBpLw==';
    const OP_SL_BASE_URL = 'aHR0cDovLzIzLjIzLjEwMi4xNjYvc2wvcHVibGljL2FwaS8=';
    const HEADER_INSTALLATION_URL_PARAM = 'Op-Installation-Url';
    const HEADER_API_KEY_PARAM          = 'Op-Api-Key';
    const OPTION_API_KEY_PARAM          = 'sl_api_key';
    const OPTION_API_KEY_STATUS         = 'sl_api_key_status';
    const OPTION_ELIGIBILITY_STATUS     = 'sl_eligibility_status';

    /**
     * @var OptimizePress_Sl_Api
     */
    protected static $instance;

    /**
     * @var array
     */
    protected $customer = array();

    /**
     * Singleton pattern hidden constructor, initializes object
     */
    private function __construct()
    {
        $this->customer = op_get_option('sl_customer');
    }

    /**
     * Singleton pattern instance getter
     * @return OptimizePress_Sl_Api
     */
    public static function getInstance()
    {
        if (null === self::$instance) {
            self::$instance = new self;
        }

        return self::$instance;
    }

    /**
     * Returns bloginfo('url')
     *
     * WPML uses 'home_url' filter and appends language code to the base home URL which invalidates installation URL param.
     * For example http://fathermeditations.com becomes http://fathermeditations.com/nl (SL throws 401 url_mismatch error).
     *
     * @return string
     */
    public function getInstallationUrl()
    {
        global $wpml_url_filters;

        if (isset($wpml_url_filters)) {
            remove_filter('home_url', array($wpml_url_filters, 'home_url_filter'), - 10, 4);
        }

        $url = get_bloginfo('url');

        if (isset($wpml_url_filters)) {
            add_filter('home_url', array($wpml_url_filters, 'home_url_filter'), - 10, 4);
        }

        return $url;
    }

    /**
     * Fetching API key from options table
     * @return [type] [description]
     */
    public function getApiKey()
    {
        return op_get_option(self::OPTION_API_KEY_PARAM);
    }

    /**
     * Saving API key to WP options table
     * @param string $key
     * @return void
     */
    public function setApiKey($key)
    {
        op_update_option(self::OPTION_API_KEY_PARAM, $key);
    }

    /**
     * Registers API key on OP SL
     * @param  string $key
     * @return bool|WP_Error      true on success, WP_Error on failure
     */
    public function register($key)
    {
        $args = array(
            'headers' => array(
                self::HEADER_INSTALLATION_URL_PARAM => $this->getInstallationUrl()
            )
        );
        $response = wp_remote_get(base64_decode(self::OP_SL_BASE_URL) . 'register/' . $key, $args);

        if (is_wp_error($response)) {
            /*
             * Request faild
             */
            $this->log('OP SL error: ' . $response->get_error_message());
            return new WP_Error($response->get_error_code(), $response->get_error_message());
        } else if ((int)$response['response']['code'] !== 200) {
            /*
             * API key issues
             */
            $data = json_decode($response['body']);
            $this->log('OP SL error: ' . $data->error);
            return new WP_Error('failed', $data->error);
        } else {
            /*
             * Success
             */
            $this->setApiKey($key);
            return true;
        }
    }

    /**
     * Sends data to SL for parsing
     * @param  string $type
     * @param  array $data
     * @return string
     */
    public function parse($type, $data)
    {
        $args = array(
            'headers' => array(
                self::HEADER_INSTALLATION_URL_PARAM => $this->getInstallationUrl(),
                self::HEADER_API_KEY_PARAM => $this->getApiKey()
            ),
            'body' => array(
                'data' => $data
            )
        );

        $response = wp_remote_post(base64_decode(self::OP_SL_BASE_URL) . 'parse/' . $type, $args);

        if (is_wp_error($response)) {
            /*
             * Request failed
             */
            $data = '';
        } else if ((int)$response['response']['code'] != 200) {
            /*
             * API key issues
             */
            if (is_admin()) {
                $data = '##' . sprintf(__('There seems to be a problem with your OptimizePress API Key.<br />Please recheck it is entered correctly and if you still have problems <a href="https://optimizepress.zendesk.com/hc/en-us/articles/201687173" target="_blank">see this guide for help</a> or  <a href="%s" target="_blank">contact support</a>.', 'optimizepress'), OP_SUPPORT_LINK);
            } else {
                $data = '';
            }
        } else {
            /*
             * Success
             */
            $json = json_decode($response['body'], true);
            $data = $json['data'];
        }

        return $data;
    }

    /**
     * Ping SL service with API key
     * @param string $type
     * @param string $version
     * @return bool|WP_Error
     */
    public function ping($type = null, $version = null)
    {
        $args = array(
            'headers' => array(
                self::HEADER_INSTALLATION_URL_PARAM => $this->getInstallationUrl(),
                self::HEADER_API_KEY_PARAM => $this->getApiKey()
            ),
            'body' => array(
                'type'      => $type !== null ? $type : OP_TYPE,
                'version'   => $version !== null ? $version : OP_VERSION,
                'php'       => phpversion(),
                'locale'    => get_locale(),
            )
        );

        if ($type === null && OP_TYPE === 'plugin') {
            $theme                  = wp_get_theme();
            $args['body']['theme']  = $theme->get('Name');
        } else if ($type === null && OP_TYPE === 'theme') {
            $themeNum = op_get_option('theme','dir');

            // There is no theme selected cause the blog setup wasn't finished
            if (empty($themeNum)) {
                $themeNum = '0 (not selected)';
            }

            $args['body']['theme']  = 'OptimizePress #' . $themeNum;
        }

        $args['body']['optin_stats_current']    = op_optin_stats_get_local_month_count('current');
        $args['body']['optin_stats_last']       = op_optin_stats_get_local_month_count('last');

        $response = wp_remote_post(base64_decode(self::OP_SL_BASE_URL) . 'ping', $args);

        if (is_wp_error($response)) {
            /*
             * Request failed
             */
            $this->log('OP SL error: ' . $response->get_error_message());
            return new WP_Error($response->get_error_code(), $response->get_error_message());
        } else if ((int)$response['response']['code'] !== 200) {
            /*
             * API key issues
             */
            $data = json_decode($response['body']);
            $this->log('OP SL error: ' . $data->error);
            return new WP_Error('invalid', $data->error);
        } else {
            /*
             * Success
             */
            $data = json_decode($response['body']);

            // If SL customer data exists we'll save it
            if (isset($data->data->customer)) {
                op_update_option('sl_customer', (array) $data->data->customer);
            }

            // If global optin stats exists we'll save it
            if (isset($data->data->optin_stats)) {
                op_optin_stats_save_global_data($data->data->optin_stats);
            }

            return true;
        }
    }

    /**
     * Checks if customer is eligible for updates
     * @since  2.2.2
     * @return bool|WP_Error
     */
    public function eligible()
    {
        $args = array(
            'headers' => array(
                self::HEADER_INSTALLATION_URL_PARAM => $this->getInstallationUrl(),
                self::HEADER_API_KEY_PARAM => $this->getApiKey()
            ),
        );

        $response = wp_remote_post(base64_decode(self::OP_SL_BASE_URL) . 'eligible', $args);

        if (is_wp_error($response)) {
            /*
             * Request failed
             */
            $this->log('OP SL error: ' . $response->get_error_message());
            return new WP_Error($response->get_error_code(), $response->get_error_message());
        } else if ((int)$response['response']['code'] !== 200) {
            /*
             * API key issues
             */
            $data = json_decode($response['body']);
            $this->log('OP SL error: ' . $data->error);
            return new WP_Error('invalid', $data->error);
        } else {
            /*
             * Success
             */
            return true;
        }
    }

    /**
     * Check for latest theme/plugin/opm version
     * @param  string $type
     * @return mixed
     */
    public function update($type = 'theme')
    {
        $args = array(
            'headers' => array(
                self::HEADER_INSTALLATION_URL_PARAM => $this->getInstallationUrl(),
                self::HEADER_API_KEY_PARAM => $this->getApiKey()
            ),
        );

        $response = wp_remote_get(base64_decode(self::OP_SL_BASE_URL) . 'update/' . $type, $args);

        if (is_wp_error($response)) {
            /*
             * Request failed
             */
            $this->log('OP SL error: ' . $response->get_error_message());
            return new WP_Error($response->get_error_code(), $response->get_error_message());
        } else if ((int)$response['response']['code'] !== 200) {
            /*
             * API key issues
             */
            $data = json_decode($response['body']);
            $this->log('OP SL error: ' . $data->error);
            return new WP_Error('invalid', $data->error);
        } else {
            /*
             * Success
             */
            $data = json_decode($response['body']);
            return $data;
        }
    }

    /**
     * If WP_DEBUG_LOG is defined and set to true it will log errors in log file
     * @param  mixed $debug
     * @return void
     */
    protected function log($debug)
    {
        if (defined('WP_DEBUG_LOG') && WP_DEBUG_LOG) {
            if (is_scalar($debug)) {
                error_log($debug);
            } else {
                error_log(print_r($debug, true));
            }
        }
    }

    /**
     * Get SL customer data (currently only package type and pack information)
     * @param  string $key
     * @return mixed It will return array|null if no $key provided, string if $key is set and null otherwise
     */
    public function customer($key = null)
    {
        if (null === $key) {
            return $this->customer;
        }

        if (is_array($this->customer) && isset($this->customer[$key])) {
            return $this->customer[$key];
        }

        return null;
    }
}

/**
 * Wrapper for saving API key to DB
 * @param  string $key
 * @return void
 */
function op_sl_save_key($key)
{
    OptimizePress_Sl_Api::getInstance()->setApiKey($key);

    /*
     * We are also clearing API key status transient
     */
    delete_transient(OptimizePress_Sl_Api::OPTION_API_KEY_STATUS);
}

/**
 * Wrapper for fetching API key
 * @return string
 */
function op_sl_get_key()
{
    return OptimizePress_Sl_Api::getInstance()->getApiKey();
}

/**
 * Wrapper for ping method
 * @param string $type
 * @param string $version
 * @return bool|WP_Error
 */
function op_sl_ping($type = null, $version = null)
{
    $status = OptimizePress_Sl_Api::getInstance()->ping($type, $version);

    if (is_wp_error($status) && $status->get_error_code() === 'invalid') {

    }

    return $status;
}

/**
 * Wrapper for eligible method
 * @param string $type
 * @param string $version
 * @return bool|WP_Error
 */
function op_sl_eligible()
{
    $status = OptimizePress_Sl_Api::getInstance()->eligible();

    return $status;
}

/**
 * Wrapper for fetching installation URL
 * @return string
 */
function op_sl_get_url()
{
    return OptimizePress_Sl_Api::getInstance()->getInstallationUrl();
}

/**
 * Wrapper for registration method
 * @param  string $key
 * @return bool|WP_Error
 */
function op_sl_register($key)
{
    return OptimizePress_Sl_Api::getInstance()->register($key);
}

/**
 * Wrapper for parsing method
 * @param  string $type
 * @param  array $data
 * @return string
 */
function op_sl_parse($type, $data)
{
    return OptimizePress_Sl_Api::getInstance()->parse($type, $data);
}

/**
 * Wrapper for update method
 * @param  string $type
 * @return string
 */
function op_sl_update($type)
{
    return OptimizePress_Sl_Api::getInstance()->update($type);
}

/**
 * Wrapper for fetching customer package type
 * @return string|null
 */
function op_sl_package_type()
{
    return OptimizePress_Sl_Api::getInstance()->customer('package');
}

/**
 * Wrapper for fetching customer pack information
 * @return string|null
 */
function op_sl_pack()
{
    return OptimizePress_Sl_Api::getInstance()->customer('pack');
}

/**
 * Wrapper for fetching customer data.
 * @param  string $key
 * @return mixed      if $key is provided then the string will be returned (or null) and if $key isn't provided whole customer data will be returned as arary
 */
function op_sl_customer($key = null)
{
    return OptimizePress_Sl_Api::getInstance()->customer($key);
}
<?php

require_once(OP_MOD . 'email/ProviderInterface.php');

/**
 * WordPress Transient cache decorator for email services provider
 * @author OptimizePress <info@optimizepress.com>
 */
class OptimizePress_Modules_Email_Provider_TransientCache implements OptimizePress_Modules_Email_ProviderInterface
{
    const CACHE_EXPIRY_TIME = 900;

    /**
     * @var OptimizePress_Modules_Email_ProviderInterface
     */
    protected $provider = null;

    /**
     * @var string
     */
    protected $cachePrefix = null;

    /**
     * Initializes $provider and caches its output
     * @param OptimizePress_Modules_Email_ProviderInterface $provider
     */
    public function __construct($provider)
    {
        $this->provider = $provider;
        $this->cachePrefix = get_class($provider);
    }

    /**
     * @see OptimizePress_Modules_Email_ProviderInterface::getData()
     */
    public function getData()
    {
        /*
         * Cache busting
         */
        if (function_exists('wp_using_ext_object_cache')) {
            $extCache = wp_using_ext_object_cache();
            if (true === $extCache) {
                wp_using_ext_object_cache(false);
            }
        }

        /*
         * Cache key consist of an hour value on purpose to be sure that cache will be invalidated every hour.
         * This is due to some plugins deleting _transient_timeout_* option and leaving _transient_* which makes it valid everytime. It won't expire.
         */
        $cacheKey = md5($this->cachePrefix . '_' . __FUNCTION__ . date('H'));

        if (false === $data = get_transient($cacheKey)) {
            $data = $this->provider->getData();
            uasort($data['lists'], array($this, 'sort'));
            set_transient($cacheKey, $data, self::CACHE_EXPIRY_TIME);
        }

        /*
         * Cache busting
         */
        if (function_exists('wp_using_ext_object_cache')) {
            wp_using_ext_object_cache($extCache);
        }

        return $data;
    }

    /**
     * Sorts items alphabeticaly
     *
     * @author OptimizePress <info@optimizepress.com>
     * @since 2.1.4
     * @param  array $a
     * @param  array $b
     * @return integer
     */
    protected function sort($a, $b)
    {
        if (strtolower($a['name']) > strtolower($b['name'])) {
            return 1;
        } else {
            return -1;
        }
    }

    /**
     * @see OptimizePress_Modules_Email_ProviderInterface::getItems()
     */
    public function getItems()
    {
        /*
         * Cache busting
         */
        if (function_exists('wp_using_ext_object_cache')) {
            $extCache = wp_using_ext_object_cache();
            if (true === $extCache) {
                wp_using_ext_object_cache(false);
            }
        }

        /*
         * Cache key consist of an hour value on purpose to be sure that cache will be invalidated every hour.
         * This is due to some plugins deleting _transient_timeout_* option and leaving _transient_* which makes it valid everytime. It won't expire.
         */
        $cacheKey = md5($this->cachePrefix . '_' . __FUNCTION__ . date('H'));

        if (false === $data = get_transient($cacheKey)) {
            $data = $this->provider->getItems();
            uasort($data['lists'], array($this, 'sort'));
            set_transient($cacheKey, $data, self::CACHE_EXPIRY_TIME);
        }

        /*
         * Cache busting
         */
        if (function_exists('wp_using_ext_object_cache')) {
            wp_using_ext_object_cache($extCache);
        }

        return $data;
    }

    /**
     * @see OptimizePress_Modules_Email_ProviderInterface::getListFields()
     */
    public function getListFields($listId)
    {
        /*
         * Cache busting
         */
        if (function_exists('wp_using_ext_object_cache')) {
            $extCache = wp_using_ext_object_cache();
            if (true === $extCache) {
                wp_using_ext_object_cache(false);
            }
        }

        /*
         * Cache key consist of an hour value on purpose to be sure that cache will be invalidated every hour.
         * This is due to some plugins deleting _transient_timeout_* option and leaving _transient_* which makes it valid everytime. It won't expire.
         */
        $cacheKey = md5($this->cachePrefix . '_' . __FUNCTION__ . date('H') . '_' . $listId);

        if (false === $data = get_transient($cacheKey)) {
            $data = $this->provider->getListFields($listId);
            set_transient($cacheKey, $data, self::CACHE_EXPIRY_TIME);
        }

        /*
         * Cache busting
         */
        if (function_exists('wp_using_ext_object_cache')) {
            wp_using_ext_object_cache($extCache);
        }

        return $data;
    }

    /**
     * @see OptimizePress_Modules_Email_ProviderInterface::getLists()
     */
    public function getLists()
    {
        /*
         * Cache busting
         */
        if (function_exists('wp_using_ext_object_cache')) {
            $extCache = wp_using_ext_object_cache();
            if (true === $extCache) {
                wp_using_ext_object_cache(false);
            }
        }

        /*
         * Cache key consist of an hour value on purpose to be sure that cache will be invalidated every hour.
         * This is due to some plugins deleting _transient_timeout_* option and leaving _transient_* which makes it valid everytime. It won't expire.
         */
        $cacheKey = md5($this->cachePrefix . '_' . __FUNCTION__ . date('H'));

        if (false === $data = get_transient($cacheKey)) {
            $data = $this->provider->getLists();
            uasort($data['lists'], array($this, 'sort'));
            set_transient($cacheKey, $data, self::CACHE_EXPIRY_TIME);
        }

        /*
         * Cache busting
         */
        if (function_exists('wp_using_ext_object_cache')) {
            wp_using_ext_object_cache($extCache);
        }

        return $data;
    }

    /**
     * @see OptimizePress_Modules_Email_ProviderInterface::isEnabled()
     */
    public function isEnabled()
    {
        return $this->provider->isEnabled();
    }

    /**
     * @see OptimizePress_Modules_Email_ProviderInterface::subscribe()
     */
    public function subscribe($data)
    {
        return $this->provider->subscribe($data);
    }

    /**
     * @see OptimizePress_Modules_Email_ProviderInterface::subscribe()
     */
    public function getClient()
    {
        return $this->provider->getClient();
    }

    /**
     * @see OptimizePress_Modules_Email_ProviderInterface::register()
     */
    public function register($list, $email, $fname, $lname)
    {
        return $this->provider->register($list, $email, $fname, $lname);
    }

    public function getFollowUpSequences()
    {
        /*
         * Cache busting
         */
        if (function_exists('wp_using_ext_object_cache')) {
            $extCache = wp_using_ext_object_cache();
            if (true === $extCache) {
                wp_using_ext_object_cache(false);
            }
        }

        /*
         * Cache key consist of an hour value on purpose to be sure that cache will be invalidated every hour.
         * This is due to some plugins deleting _transient_timeout_* option and leaving _transient_* which makes it valid everytime. It won't expire.
         */
        $cacheKey = md5($this->cachePrefix . '_' . __FUNCTION__ . date('H'));

        if (false === $data = get_transient($cacheKey)) {
            $data = $this->provider->getFollowUpSequences();
            uasort($data['lists'], array($this, 'sort'));
            set_transient($cacheKey, $data, self::CACHE_EXPIRY_TIME);
        }

        /*
         * Cache busting
         */
        if (function_exists('wp_using_ext_object_cache')) {
            wp_using_ext_object_cache($extCache);
        }

        return $data;
    }

    /**
     * Call method from decorated provider.
     * @param  string $method
     * @param  array $args
     * @return mixed
     */
    public function __call($method, $args)
    {
        if (method_exists($this->provider, $method)) {
            return call_user_func_array(array($this->provider, $method), $args);
        }
    }
}
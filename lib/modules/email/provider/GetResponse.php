<?php

require_once(OP_MOD . 'email/ProviderInterface.php');
require_once(OP_MOD . 'email/LoggerInterface.php');
require_once(OP_MOD . 'email/provider/AbstractProvider.php');

require_once(OP_LIB . 'vendor/getresponse/GetResponseAPI.class.php');

/**
 * GetResponse email integration provider
 * @author OptimizePress <info@optimizepress.com>
 */
class OptimizePress_Modules_Email_Provider_GetResponse extends OptimizePress_Modules_Email_Provider_AbstractProvider implements OptimizePress_Modules_Email_ProviderInterface
{
    const OPTION_NAME_API_KEY = 'getresponse_api_key';
    const OPTION_NAME_API_URL = 'getresponse_api_url';

    /**
     * @var OP_GetResponse
     */
    protected $client = null;

    /**
     * @var boolean
     */
    protected $apiKey = false;

    /**
     * @var OptimizePress_Modules_Email_LoggerInterface
     */
    protected $logger;

    /**
     * Initializes client object and fetches API KEY
     */
    public function __construct(OptimizePress_Modules_Email_LoggerInterface $logger)
    {
        /*
         * Fetching API key from the wp_options table
         */
        $this->apiKey = op_get_option(self::OPTION_NAME_API_KEY);
        $this->apiUrl = op_get_option(self::OPTION_NAME_API_URL);

        /*
         * Initializing logger
         */
        $this->logger = $logger;
    }

    /**
     * @see OptimizePress_Modules_Email_ProviderInterface::getClient()
     */
    public function getClient()
    {
        if (null === $this->client) {
            $this->client = new OP_GetResponse($this->apiKey, $this->apiUrl, $this->logger);
        }

        return $this->client;
    }

    /**
     * @see OptimizePress_Modules_Email_ProviderInterface::getLists()
     */
    public function getLists()
    {
        $lists = $this->getClient()->getCampaigns();

        $this->logger->info('Lists: ' . print_r($lists, true));

        return $lists;
    }

    /**
     * @see OptimizePress_Modules_Email_ProviderInterface::getData()
     */
    public function getData()
    {
        $data = array(
            'lists' => array()
        );

        $params = $this->getCustomFields();

        /*
         * List parsing
         */
        $lists = $this->getLists();
        if ($lists) {
            foreach ($lists as $id => $list) {
                $data['lists'][$id] = array('name' => $list->name, 'fields' => $params);
            }
        }

        $this->logger->info('Formatted lists: ' . print_r($data, true));

        return $data;
    }

    /**
     * @see OptimizePress_Modules_Email_ProviderInterface::getItems()
     */
    public function getItems()
    {
        $data = $this->getData();

        $this->logger->info('Items: ' . print_r($data, true));

        return $data;
    }

    /**
     * @see OptimizePress_Modules_Email_ProviderInterface::subscribe()
     */
    public function subscribe($data)
    {
        $this->logger->info('Subscribing user: ' . print_r($data, true));

        if (isset($data['list']) && isset($data['email'])) {

            $params = $this->prepareMergeVars();

            try {
                $status = $this->getClient()->addContact($data['list'], op_post('name') !== false ? op_post('name') : 'Friend', $data['email'], 'standard', 0, $params);
                $this->logger->notice('Subscription status: ' . print_r($status, true));

                /*
                 * If error occured (already subscribed user will be triggering error)
                 * and already_subscribed_url param is filled then we hijack redirect_url param
                 */
                if (empty($status) && isset($_POST['already_subscribed_url']) && !empty($_POST['already_subscribed_url'])) {
                    $_POST['redirect_url'] = op_post('already_subscribed_url');
                }
            } catch (Exception $e) {
                $this->logger->error('Error ' . $e->getCode() . ': ' . $e->getMessage());

                return false;
            }

            return true;
        } else {
            $this->logger->alert('Mandatory information not present [list and/or email address]');
            wp_die('Mandatory information not present [list and/or email address ].');

            return false;
        }
    }

    /**
     * @see OptimizePress_Modules_Email_ProviderInterface::register()
     */
    public function register($list, $email, $fname, $lname)
    {
        $this->logger->info('Registering user: ' . print_r(func_get_args(), true));

        try {
            $status = $this->getClient()->addContact($list, $fname . ' ' . $lname, $email, 'standard', 0, null);

            $this->logger->notice('Registration status: ' . print_r($status, true));
        } catch (Exception $e) {
            $this->logger->error('Error ' . $e->getCode() . ': ' . $e->getMessage());

            return false;
        }

        return true;
    }

    /**
     * Searches for possible form fields from POST and adds them to the collection
     * @return null|array     Null if no value/field found
     */
    protected function prepareMergeVars()
    {
        $vars = array();
        $allowed = array_keys($this->getCustomFields());

        foreach ($allowed as $name) {
            if ($name !== 'name' && op_post($name) !== false) {
                $vars[$name] = op_post($name);
            }
        }

        if (count($vars) === 0) {
            $vars = null;
        }

        return $vars;
    }

    /**
     * @see OptimizePress_Modules_Email_ProviderInterface::isEnabled()
     */
    public function isEnabled()
    {
        return $this->apiKey === false ? false : true;
    }

    /**
     * Returns form fields for given list
     * @return array
     */
    public function getCustomFields()
    {
        $fields = array('name' => __('Name', 'optimizepress'),
                        'firstname' => __('First Name', 'optimizepress'),
                        'lastname' => __('Last Name', 'optimizepress'));

        $vars = $this->getClient()->getAccountCustoms();

        if (is_object($vars) && count($vars) > 0) {
            foreach ($vars as $var) {
                $fields[$var->name] = $var->name;
            }
        }

        return $fields;
    }

    /**
     * @see OptimizePress_Modules_Email_ProviderInterface::getListFields()
     */
    public function getListFields($listId)
    {
        $fields = $this->getCustomFields();

        $this->logger->info("Fields for list $listId: " . print_r($fields, true));

        return array('fields' => $fields);
    }
}

<?php

require_once(OP_MOD . 'email/ProviderInterface.php');
require_once(OP_MOD . 'email/LoggerInterface.php');
require_once(OP_MOD . 'email/provider/AbstractProvider.php');

require_once(OP_LIB . 'vendor/maropost-api-class/maropost.class.php');

/**
 * Maropost email integration provider
 * @author OptimizePress <info@optimizepress.com>
 */
class OptimizePress_Modules_Email_Provider_Maropost extends OptimizePress_Modules_Email_Provider_AbstractProvider implements OptimizePress_Modules_Email_ProviderInterface
{
    const OPTION_NAME_ACCOUNT_ID = 'maropost_acount_id';
    const OPTION_NAME_AUTH_TOKEN = 'maropost_auth_token';

    /**
     * @var OP_MCAPI
     */
    protected $client = null;

    protected $authToken = false;

    protected $accountId = false;

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
        $this->accountId = op_get_option(self::OPTION_NAME_ACCOUNT_ID);
        $this->authToken = op_get_option(self::OPTION_NAME_AUTH_TOKEN);

        /*
         * Initializing logger
         */
        $this->logger = $logger;
    }

    /**
     * @see OptimizePress_Modules_Email_ProviderInterface::subscribe()
     */
    public function getClient()
    {
        if (null === $this->client) {
            $this->client = new OP_Maropost($this->accountId, $this->authToken, $this->logger);
        }

        return $this->client;
    }

    /**
     * @see OptimizePress_Modules_Email_ProviderInterface::getLists()
     */
    public function getLists()
    {
        $lists = $this->getClient()->lists();

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

        /*
         * List parsing
         */
        $lists = $this->getLists();

        $this->logger->info('Lists data: ' . print_r($lists, true));

        foreach ($lists as $list) {
                $this->logger->info('ID: ' . print_r($list->id, true));
                $data['lists'][$list->id] = array('name' => $list->name, 'fields' => $this->getFormFields($list->id));
            }

        $this->logger->info('Formatted lists: ' . print_r($data, true));

        return $data;
    }

    /**
     * @see OptimizePress_Modules_Email_ProviderInterface::subscribe()
     */
    public function subscribe($data)
    {
        $this->logger->info('Subscribing user: ' . print_r($data, true));

        if (isset($data['list']) && isset($data['email'])) {

            $result = $this->getClient()->listSubscribe(op_post('first_name'), op_post('last_name'), $data['email'], $data['list'], op_post('phone'), op_post('fax'), $this->prepareMergeVars($data['list']));

            /*
            * Returns status "Subscribed" whether user subscribed or not !!!
            */
            $this->logger->notice('Subscription status: ' . print_r($result->status, true));

            return true;

        } else {
            $this->logger->alert('Mandatory information not present [list and/or email address]');
            wp_die('Mandatory information not present [list and/or email address].');

            return false;
        }
    }

    /**
     * @see OptimizePress_Modules_Email_ProviderInterface::register()
     */
    public function register($list, $email, $fname, $lname)
    {
        $this->logger->info('Registering user: ' . print_r(func_get_args(), true));

        $result = $this->getClient()->listSubscribe($fname, $lname, $email, $list);

        $this->logger->notice('Registration status: ' . print_r($result->status, true));

        return true;
    }

    /**
     * Searches for possible form fields from POST and adds them to the collection
     * @param  string $id
     * @return null|array     Null if no value/field found
     */
    protected function prepareMergeVars($id)
    {
        $vars       = array();
        $allowed    = array_diff(array_keys($this->getFormFields($id)), array('first_name', 'last_name', 'phone', 'fax'));

        foreach ($allowed as $name) {
            if (false !== $value = op_post($name)) {
                $vars[$name] = $value;
            }
        }

        $this->logger->notice('Merged vars: ' . print_r($vars, true));

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
        return $this->authToken === false ? false : true;
    }

    /**
     * Returns form fields for given list
     * @param  string $id
     * @return array
     */
    public function getFormFields($id)
    {
        $fields = array(
            'first_name'    => 'first_name',
            'last_name'     => 'last_name',
            'phone'         => 'phone',
            'fax'           => 'fax'
        );

        $vars = $this->getClient()->customFieldsList();
        foreach ($vars as $var) {
            $fields[$var->name] = $var->name;
        }

        $this->logger->notice('Form Fields: ' . print_r($fields, true));

        return $fields;
    }

    /**
     * @see OptimizePress_Modules_Email_ProviderInterface::getListFields()
     */
    public function getListFields($listId)
    {
        $fields = $this->getFormFields($listId);

        $this->logger->info("Fields for list $listId: " . print_r($fields, true));

        return array('fields' => $fields);
    }

    /**
     * @see OptimizePress_Modules_Email_ProviderInterface::getItems()
     */
    public function getItems()
    {
        $data = array(
            'lists' => array()
        );

        /*
         * List parsing
         */
        $lists = $this->getLists();
        foreach ($lists as $list) {
            $data['lists'][$list->id] = array('name' => $list->name);
        }

        $this->logger->info('Items: ' . print_r($data, true));

        return $data;
    }
}
<?php

require_once(OP_MOD . 'email/ProviderInterface.php');
require_once(OP_MOD . 'email/LoggerInterface.php');
require_once(OP_MOD . 'email/provider/AbstractProvider.php');

require_once(OP_LIB . 'vendor/constant-contact/ConstantContactClient.php');

/**
 * ConstantContact email integration provider
 * @author OptimizePress <info@optimizepress.com>
 */
class OptimizePress_Modules_Email_Provider_ConstantContact extends OptimizePress_Modules_Email_Provider_AbstractProvider implements OptimizePress_Modules_Email_ProviderInterface
{
    const OPTION_NAME_API_KEY   = 'constantcontact_api_key';
    const OPTION_NAME_TOKEN     = 'constantcontact_token';

    /**
     * @var OP_ConstantContactClient
     */
    protected $client = null;

    /**
     * @var string
     */
    protected $apiKey;

    /**
     * @var string
     */
    protected $token;

    /**
     * @var OptimizePress_Modules_Email_LoggerInterface
     */
    protected $logger;

    /**
     * Initializes client object and fetches API KEY.
     */
    public function __construct(OptimizePress_Modules_Email_LoggerInterface $logger)
    {
        $this->apiKey   = op_get_option(self::OPTION_NAME_API_KEY);
        $this->token    = op_get_option(self::OPTION_NAME_TOKEN);

        /*
         * Initializing logger
         */
        $this->logger    = $logger;
    }

    /**
     * @see OptimizePress_Modules_Email_ProviderInterface::getClient()
     */
    public function getClient()
    {
        if (null === $this->client) {
            $this->client = new OP_ConstantContactClient($this->apiKey, $this->token, $this->logger);
        }

        return $this->client;
    }

    /**
     * @see OptimizePress_Modules_Email_ProviderInterface::isEnabled()
     */
    public function isEnabled()
    {
        return $this->apiKey === false ? false : true;
    }

    /**
     * @see OptimizePress_Modules_Email_ProviderInterface::getLists()
     */
    public function getLists()
    {
        $lists = $this->getClient()->getLists();

        $this->logger->info('Lists: ' . print_r($lists, true));

        return $lists;
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
        if (count($lists) > 0) {
            foreach ($lists as $list) {
                $data['lists'][$list->id] = array('name' => $list->name);
            }
        }

        $this->logger->info('Items: ' . print_r($data, true));

        return $data;
    }

    /**
     * @see OptimizePress_Modules_Email_ProviderInterface::getListFields()
     */
    public function getListFields($listId)
    {
        $fields = $this->getFormFields();

        $this->logger->info("Fields for list $listId: " . print_r($fields, true));

        return array('fields' => $fields);
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
        if (count($lists) > 0) {
            foreach ($lists as $list) {
                $data['lists'][$list->id] = array('name' => $list->name, 'fields' => $this->getFormFields());
            }
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

            $fields = $this->prepareMergeVars();
            $status = $this->getClient()->subscribeContact($data['list'], $data['email'], $fields);

            $this->logger->notice('Subscription status: ' . print_r($status, true));

            /*
             * Displays error
             */
            if (false === $status) {

                if (isset($_POST['already_subscribed_url']) && op_post('already_subscribed_url') !== '') {
                    $_POST['redirect_url'] = op_post('already_subscribed_url');
                } else {
                    if (isset($_POST['redirect_url'])) {
                        $action = sprintf(__('<a href="javascript:history.go(-1);">Return to previous page</a> or <a href="%s">continue</a>.', OP_SN), op_post('redirect_url'));
                    } else {
                        $action = __('<a href="javascript:history.go(-1);">Return to previous page.</a>', OP_SN);
                    }
                    op_warning_screen(
                        __('This email is already subscribed...', OP_SN),
                        __('Optin form - Warning', OP_SN),
                        $action
                    );
                }

                return false;
            }

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

        $status = $this->getClient()->subscribeContact($list, $email, array('first_name' => $fname, 'last_name' => $lname));

        $this->logger->notice('Registration status: ' . print_r($status, true));

        return true;
    }

    /**
     * Return all additional fields.
     * @return array
     */
    protected function getFormFields()
    {
        return array(
            'prefix_name'   => __('Name Prefix', 'optimizepress'),
            'first_name'    => __('First Name', 'optimizepress'),
            'middle_name'   => __('Middle Name', 'optimizepress'),
            'last_name'     => __('Last Name', 'optimizepress'),
            'home_phone'    => __('Home Phone', 'optimizepress'),
            'work_phone'    => __('Work Phone', 'optimizepress'),
            'cell_phone'    => __('Cell Phone', 'optimizepress'),
            'fax'           => __('Fax', 'optimizepress'),
            'job_title'     => __('Job Title', 'optimizepress'),
            'company_name'  => __('Company Name', 'optimizepress'),
        );
    }

    /**
     * Prepare post vars and merge them with allowed form fields.
     * @return mixed
     */
    protected function prepareMergeVars()
    {
        $vars       = array();
        $allowed    = array_keys($this->getFormFields());

        foreach ($allowed as $name) {
            if (false !== $value = op_post($name)) {
                $vars[$name] = $value;
            }
        }

        if (count($vars) === 0) {
            $vars = null;
        }

        return $vars;
    }
}
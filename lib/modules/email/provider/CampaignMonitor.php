<?php

require_once(OP_MOD . 'email/ProviderInterface.php');
require_once(OP_MOD . 'email/LoggerInterface.php');
require_once(OP_MOD . 'email/provider/AbstractProvider.php');

require_once(OP_LIB . 'vendor/campaignmonitor/csrest_general.php');
require_once(OP_LIB . 'vendor/campaignmonitor/csrest_clients.php');
require_once(OP_LIB . 'vendor/campaignmonitor/csrest_lists.php');
require_once(OP_LIB . 'vendor/campaignmonitor/csrest_subscribers.php');

/**
 * Campaign Monitor email integration provider
 * @author OptimizePress <info@optimizepress.com>
 */
class OptimizePress_Modules_Email_Provider_CampaignMonitor extends OptimizePress_Modules_Email_Provider_AbstractProvider implements OptimizePress_Modules_Email_ProviderInterface
{
    const OPTION_NAME_API_KEY = 'campaignmonitor_api_key';

    /**
     * @var OP_CS_REST_General
     */
    protected $client = null;

    /**
     * @var OP_CS_REST_Lists
     */
    protected $listsClient = null;

    /**
     * @var OP_CS_REST_Subscribers
     */
    protected $subscribersClient = null;

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
            $this->client = new OP_CS_REST_General(array('api_key' => $this->apiKey));
            $this->client->set_logger($this->logger);
        }

        return $this->client;
    }

    /**
     * Returns Clients Rest HTTP client
     * @param  string $id
     * @return OP_CS_REST_Clients
     */
    public function getClientsClient($id)
    {
        $client = new OP_CS_REST_Clients($id, array('api_key' => $this->apiKey));
        $client->set_logger($this->logger);

        return $client;
    }

    /**
     * Returns Lists Rest HTTP client
     * @param  string $id
     * @return OP_CS_REST_Lists
     */
    public function getListsClient($id)
    {
        if (null === $this->listsClient) {
            $this->listsClient = new OP_CS_REST_Lists($id, array('api_key' => $this->apiKey));
            $this->listsClient->set_logger($this->logger);
        }

        return $this->listsClient;
    }

    /**
     * Returns Subscribers Rest HTTP client
     * @param  string $id
     * @return OP_CS_REST_Subscribers
     */
    public function getSubscribersClient($id)
    {
        if (null === $this->subscribersClient) {
            $this->subscribersClient = new OP_CS_REST_Subscribers($id, array('api_key' => $this->apiKey));
            $this->subscribersClient->set_logger($this->logger);
        }

        return $this->subscribersClient;
    }

    /**
     * @see OptimizePress_Modules_Email_ProviderInterface::getLists()
     */
    public function getLists()
    {
        $clients = $this->getClient()->get_clients();

        $data = array();

        if ($clients->was_successful()) {
            foreach ($clients->response as $client) {

                $lists = $this->getClientsClient($client->ClientID)->get_lists();

                if ($lists->was_successful()) {
                    foreach ($lists->response as $list) {
                        $data[] = array('id' => $list->ListID, 'name' => $list->Name);
                    }
                }
            }
        }

        $this->logger->info('Lists (CampaignMonitor): ' . print_r($data, true));

        return $data;
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
        if ($lists > 0) {
            foreach ($lists as $list) {
                $data['lists'][$list['id']] = array('name' => $list['name'], 'fields' => $this->getFormFields($list['id']));
            }
        }

        $this->logger->info('Formatted lists (CampaignMonitor): ' . print_r($data, true));

        return $data;
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
        if ($lists > 0) {
            foreach ($lists as $list) {
                $data['lists'][$list['id']] = array('name' => $list['name']);
            }
        }

        $this->logger->info('Items (CampaignMonitor): ' . print_r($data, true));

        return $data;
    }

    /**
     * @see OptimizePress_Modules_Email_ProviderInterface::subscribe()
     */
    public function subscribe($data)
    {
        $this->logger->info('Subscribing user (CampaignMonitor): ' . print_r($data, true));

        if (isset($data['list']) && isset($data['email'])) {

            $mergeVars = $this->prepareMergeVars($data['list']);

            $subscriber = array(
                'EmailAddress' => $data['email'],
                'Name' => op_post('Name') ? op_post('Name') : '-',
                'CustomFields' => $mergeVars
            );

            $status = $this->getSubscribersClient($data['list'])->import(array($subscriber), true, true, true);

            $this->logger->notice('Subscription status (CampaignMonitor): ' . print_r($status, true));

            // Check if user was already subscribed earlier
            if ($status->was_successful() && isset($status->response->TotalNewSubscribers) && (int) $status->response->TotalNewSubscribers === 0
            && isset($_POST['already_subscribed_url']) && op_post('already_subscribed_url') !== '') {
                $_POST['redirect_url'] = op_post('already_subscribed_url');

                return false;
            }

            /*
             * Displays error
             */
            if (!$status->was_successful()) {
                $this->logger->error('Error ' . $status->response->Code . ': ' . $status->response->Message);

                return false;
            }

            return true;
        } else {
            $this->logger->alert('Mandatory information not present [list and/or email address] (CampaignMonitor)');
            wp_die('Mandatory information not present [list and/or email address].');

            return false;
        }
    }

    /**
     * @see OptimizePress_Modules_Email_ProviderInterface::register()
     */
    public function register($list, $email, $fname, $lname)
    {
        $this->logger->info('Registering user (CampaignMonitor): ' . print_r(func_get_args(), true));

        $subscriber = array(
            'EmailAddress' => $email,
            'Name' => $fname . ' ' . $lname,
            'CustomFields' => array(),
            'Resubscribe' => true,
            'RestartSubscriptionBasedAutoresponders' => true
        );

        $status = $this->getSubscribersClient($list)->add($subscriber);

        $this->logger->notice('Registration status (CampaignMonitor): ' . print_r($status, true));

        /*
         * Displays error
         */
        if (!$status->was_successful()) {
            $this->logger->error('Error ' . $status->response->Code . ': ' . $status->response->Message);

            return false;
        }

        return true;
    }

    /**
     * Searches for possible form fields from POST and adds them to the collection
     * @param  string $id
     * @return null|array     Null if no value/field found
     */
    protected function prepareMergeVars($id)
    {
        $vars = array();
        $allowed = array_keys($this->getFormFields($id));

        foreach ($allowed as $name) {
            if ('Name' !== $name && false !== $value = op_post($name)) {
                $vars[] = array('Key' => $name, 'Value' => $value);
            }
        }

        // Append GDPR vars
        if (isset($_POST['op_gdpr_consent_tag']) && is_array($_POST['op_gdpr_consent_tag']) && count($_POST['op_gdpr_consent_tag']) > 0) {
            foreach ($_POST['op_gdpr_consent_tag'] as $key => $name) {
                $vars[] = array('Key' => $name, 'Value' => apply_filters('op_gdpr_consent_custom_field_value', 'yes', 'campaignmonitor', $id));
            }
        }

        // GDPR note
        $note = $this->getGdprNote();
        if ( ! empty($note) && isset($_POST['op_gdpr_consent_notes_field']) && ! empty($_POST['op_gdpr_consent_notes_field'])) {
            $vars[] = array('Key' => sanitize_text_field($_POST['op_gdpr_consent_notes_field']), 'Value' => $note);
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
     * @param  string $id
     * @return array
     */
    public function getFormFields($id)
    {
        $fields = array('Name' => 'Name');

        $vars = $this->getListsClient($id)->get_custom_fields();
        if ($vars->was_successful()) {
            foreach ($vars->response as $var) {
                $fields[str_replace(array('[', ']'), '', $var->Key)] = $var->FieldName;
            }
        }

        return $fields;
    }

    /**
     * @see OptimizePress_Modules_Email_ProviderInterface::getListFields()
     */
    public function getListFields($listId)
    {
        $fields = $this->getFormFields($listId);

        $this->logger->info("Fields for list $listId (CampaignMonitor): " . print_r($fields, true));

        return array('fields' => $fields);
    }
}
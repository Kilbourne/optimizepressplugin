<?php

require_once(OP_MOD . 'email/ProviderInterface.php');
require_once(OP_MOD . 'email/LoggerInterface.php');
require_once(OP_MOD . 'email/provider/AbstractProvider.php');

require_once(OP_LIB . 'vendor/getresponsev3/GetResponsev3.php');

/**
 * GetResponse v3 email integration provider
 * @author OptimizePress <info@optimizepress.com>
 */
class OptimizePress_Modules_Email_Provider_GetResponsev3 extends OptimizePress_Modules_Email_Provider_AbstractProvider implements OptimizePress_Modules_Email_ProviderInterface
{
    const OPTION_NAME_API_KEY = 'getresponsev3_api_key';

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
     * @param OptimizePress_Modules_Email_LoggerInterface $logger
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
     * Return collection of lists
     * @return array
     */
    public function getLists()
    {
        $lists = $this->getClient()->getCampaigns();

        $this->logger->info('Lists GR3: ' . print_r($lists, true));

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
        //$this->logger->info('Lists: ' . print_r($lists, true));
        if ($lists) {
            foreach ($lists as $id => $list) {
                $data['lists'][$list->campaignId] = array('name' => $list->name, 'fields' => $params);
            }
        }

        $this->logger->info('Formatted lists: ' . print_r($data, true));

        return $data;
    }

    /**
     * Returns form fields for given list
     * @return array
     */
    public function getCustomFields()
    {
        $fields = array('name' => __('Name', 'optimizepress'));

        $vars = $this->getClient()->getCustomFields();

        if (is_object($vars) && !empty($vars)) {
            foreach ($vars as $var) {
                $fields[$var->customFieldId] = $var->name;
            }
        }

        return $fields;
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
     * Return tags as key => value.
     *
     * @return array
     */
    public function getTags()
    {
        $tags = $this->getClient()->getTags();

        $data = array();

        if (is_object($tags) && !empty($tags)) {
            foreach ($tags as $tag) {
                $data[$tag->tagId] = $tag->name;
            }
        }

        return array('tags' => $data);
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
     * @see OptimizePress_Modules_Email_ProviderInterface::subscribe()
     */
    public function subscribe($data)
    {
        $this->logger->info('Subscribing user: ' . print_r($data, true));

        if (isset($data['list']) && isset($data['email'])) {

            $params = array(
                'email'         => $data['email'],
                'campaign'      => array('campaignId' => $data['list']),
                'dayOfCycle'    => 0,
            );

            if (isset($_POST['name']) && !empty($_POST['name'])) {
                $params['name'] = sanitize_text_field($_POST['name']);
            }

            $customFields = $this->prepareMergeVars();

            if (!empty($customFields)) {
                foreach ($customFields as $key => $customField) {
                    $params['customFieldValues'][] = array(
                        'customFieldId' => $key,
                        'value' => array($customField)
                    );
                }
            }



            // Tags
            if (isset($_POST['op_gdpr_consent_tag']) && is_array($_POST['op_gdpr_consent_tag'])) {
                $params['tags'] = $this->cleanEmptyTags($_POST['op_gdpr_consent_tag']);
            }

            // GDPR note
            $note = $this->getGdprNote();
            if ( ! empty($note) && isset($_POST['op_gdpr_consent_notes_field']) && ! empty($_POST['op_gdpr_consent_notes_field'])) {
                $params['customFieldValues'][] = array(
                    'customFieldId' => sanitize_text_field($_POST['op_gdpr_consent_notes_field']),
                    'value' => array($note)
                );
            }

            try {
                $this->logger->info('PArams: ' . print_r($params, true));
                $status = $this->getClient()->addContact($params);
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

    }

    public function getApiKey()
    {
        return $this->apiKey;
    }

    /**
     * @see OptimizePress_Modules_Email_ProviderInterface::getClient()
     */
    public function getClient()
    {
        if (null === $this->client) {
            $this->client = new OP_GetResponsev3($this->getApiKey(), $this->logger);
        }

        return $this->client;
    }

    /**
     * Returns custom fields for list
     * @param  string $listId
     * @return array
     */
    public function getListFields($listId)
    {
        // TODO: Implement getListFields() method.
    }

    /**
     * Checks if provider integration is enabled (if API data is entered)
     * @return boolean
     */
    public function isEnabled()
    {
        return $this->apiKey === false ? false : true;
    }
}
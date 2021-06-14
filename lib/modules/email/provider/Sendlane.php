<?php

require_once(OP_MOD . 'email/ProviderInterface.php');
require_once(OP_MOD . 'email/LoggerInterface.php');
require_once(OP_MOD . 'email/provider/AbstractProvider.php');

require_once(OP_LIB . 'vendor/sendlane-api-class/SendlaneApi.php');


/**
 * Sendlane email integration provider
 * @author OptimizePress <info@optimizepress.com>
 */
class OptimizePress_Modules_Email_Provider_Sendlane extends OptimizePress_Modules_Email_Provider_AbstractProvider implements OptimizePress_Modules_Email_ProviderInterface
{
    const OPTION_NAME_API_URL = 'sendlane_api_url';
    const OPTION_NAME_API_KEY = 'sendlane_api_key';
    const OPTION_NAME_HASH_KEY = 'sendlane_hash_key';

    /**
     * @var OP_EgoiApi
     */
    protected $client = null;

    /**
     * @var String
     */
    protected $apiUrl = false;

    /**
     * @var String
     */
    protected $apiKey = false;

    /**
     * @var String
     */
    protected $hashKey = false;


    /**
     * @var OptimizePress_Modules_Email_LoggerInterface
     */
    protected $logger;

    /**
     * Initializes client object and fetches API KEY
     */
    public function __construct(OptimizePress_Modules_Email_LoggerInterface $logger)
    {
        $this->apiKey = op_get_option(self::OPTION_NAME_API_KEY);
        $this->hashKey = op_get_option(self::OPTION_NAME_HASH_KEY);
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
            $this->client = new OP_SendlaneApi($this->logger);
        }

        return $this->client;
    }

    /**
     * @see OptimizePress_Modules_Email_ProviderInterface::getLists()
     */
    public function getLists()
    {
        $lists = $this->getClient()->getLists($this->apiUrl, $this->apiKey, $this->hashKey );
        $this->logger->info('Lists: ' . print_r($lists, true));

        return $lists;
    }

    /**
     * Return tags as key => value.
     *
     * @return array
     */
    public function getTags()
    {
        $tags = $this->getClient()->getTags($this->apiUrl, $this->apiKey, $this->hashKey);

        $data = array();

        if (is_array($tags) && count($tags) > 0) {
            foreach ($tags as $tag) {
                $data[$tag['tag_id']] = $tag['tag_name'];
            }
        }

        return array('tags' => $data);
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
            foreach ($lists as $list) {
                $data['lists'][$list['listnum']] = array('name' => $list['title']);
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

            $params = array(
                'api' => $this->apiKey,
                'hash' => $this->hashKey,
                'email' => $data['email'],
                'list_id' => $data['list']
            );

            $params = array_merge($params, $this->prepareMergeVars($data['list']));

            $this->logger->info('params: ' . print_r($params, true));

            $user = $this->getClient()->addSubscriber($this->apiUrl, $params);

            $this->logger->info('user: ' . print_r($user, true));

            if (isset($user['ERROR'])) {
                if ($user['ERROR'] === 'EMAIL_ALREADY_EXISTS') {

                    if (isset($_POST['already_subscribed_url']) && op_post('already_subscribed_url') !== '') {
                        $_POST['redirect_url'] = op_post('already_subscribed_url');
                    } else {

                        if (isset($_POST['redirect_url'])) {
                            $action = sprintf(__('<a href="javascript:history.go(-1);">Return to previous page</a> or <a href="%s">continue</a>.', 'optimizepress'), op_post('redirect_url'));
                        } else {
                            $action = __('<a href="javascript:history.go(-1);">Return to previous page.</a>', 'optimizepress');
                        }
                        op_warning_screen(
                            __('This email is already subscribed...', 'optimizepress'),
                            __('Optin form - Warning', 'optimizepress'),
                            $action
                        );
                    }
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
        $params = array(
                'api' => $this->apiKey,
                'hash' => $this->hashKey,
                'email' => $data['email'],
                'list_id' => $data['list']
            );

        $params = array_merge($params, $this->prepareMergeVars($data['list']));
        $this->logger->info('params: ' . print_r($params, true));
        $user = $this->getClient()->addSubscriber($this->apiUrl, $params);

        return true;
    }

    /**
     * Searches for possible form fields from POST and adds them to the collection
     * @param  string $id
     * @return null|array     Null if no value/field found
     */
    protected function prepareMergeVars($id)
    {
        $vars = array('validate_phone' => 0);
        $allowed = array_keys($this->getFormFields($id));

        foreach ($allowed as $name) {
            if ($name !== 'email' && false !== $value = op_post($name)) {
                $vars[$name] = $value;
            }
        }

        // Tags
        if (isset($_POST['op_gdpr_consent_tag']) && is_array($_POST['op_gdpr_consent_tag'])) {
            $vars['tag_ids'] = implode(',', $this->cleanEmptyTags(array_values($_POST['op_gdpr_consent_tag'])));
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
       $fields = array(
            'first_name'    => __('First Name', 'optimizepress'),
            'last_name'     => __('Last Name', 'optimizepress'),
        );

        $lists = $this->getLists();
        foreach ($lists as $list) {
            if($id == $list['list_id']) {
                if(isset($list['extra_fields'])) {
                    if($list['extra_fields'] != false) {
                        foreach($list['extra_fields'] as $field) {
                            $fields['extra_' . $field['id']] = $field['ref'];
                        }
                    }
                }
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

        $this->logger->info("Fields for list $listId: " . print_r($fields, true));

        return array('fields' => $fields);
    }

    /**
     * @see OptimizePress_Modules_Email_ProviderInterface::getItems()
     */
    public function getItems()
    {

        $lists = $this->getLists();

            foreach ($lists as $list) {
                $data['lists'][$list['list_id']] = array('name' => $list['list_name']);
            }

        $this->logger->info('Items: ' . print_r($lists, true));

        return $data;
    }
}

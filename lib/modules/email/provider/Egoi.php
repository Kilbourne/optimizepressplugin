<?php

require_once(OP_MOD . 'email/ProviderInterface.php');
require_once(OP_MOD . 'email/LoggerInterface.php');
require_once(OP_MOD . 'email/provider/AbstractProvider.php');

require_once(OP_LIB . 'vendor/egoi-api-class/EgoiApi.php');


/**
 * Egoi email integration provider
 * @author OptimizePress <info@optimizepress.com>
 */
class OptimizePress_Modules_Email_Provider_Egoi extends OptimizePress_Modules_Email_Provider_AbstractProvider implements OptimizePress_Modules_Email_ProviderInterface
{
    const OPTION_NAME_API_KEY = 'egoi_api_key';

    /**
     * @var OP_EgoiApi
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
        $this->apiKey = op_get_option('egoi_api_key');

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
            $this->client = new OP_EgoiApi($this->logger);
        }

        return $this->client;
    }

    /**
     * @see OptimizePress_Modules_Email_ProviderInterface::getLists()
     */
    public function getLists()
    {
        $arguments = array(
            "apikey"        => $this->apiKey,
            'plugin_key'    => 'bb78ce44c9f6e99dd85ddd30fb782695',
        );

        $lists = $this->getClient()->call('getLists', $arguments);

        $this->logger->info('[E-goi] Lists: ' . print_r($lists, true));

        return $lists;
    }

    /**
     * Get tags from the platform
     * @return array
     */
    public function getTags()
    {
        $arguments = array(
            "apikey"        => $this->apiKey,
            'plugin_key'    => 'bb78ce44c9f6e99dd85ddd30fb782695',
        );

        $data = $this->getClient()->call('getTags', $arguments);

        $this->logger->info('[E-goi] Tags: ' . print_r($data, true));

        $tags = array();

        if (isset($data['TAG_LIST']) && is_array($data['TAG_LIST']) && count($data['TAG_LIST']) > 0) {
            foreach ($data['TAG_LIST'] as $tag) {
                $tags[$tag['ID']] = $tag['NAME'];
            }
        }

        return array('tags' => $tags);
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

        $this->logger->info('[E-goi] Formatted lists: ' . print_r($data, true));

        return $data;
    }

    /**
     * @see OptimizePress_Modules_Email_ProviderInterface::subscribe()
     */
    public function subscribe($data)
    {
         $this->logger->info('[E-goi] Subscribing user: ' . print_r($data, true));

        if (isset($data['list']) && isset($data['email'])) {

            $status = op_post('double_optin') === 'Y' ? 0 : 1;

            $tags = array();
            if (isset($_POST['op_gdpr_consent_tag']) && is_array($_POST['op_gdpr_consent_tag'])) {
                $tags = $this->cleanEmptyTags(array_values($_POST['op_gdpr_consent_tag']));
            }

            $params = array(
                'apikey'        => $this->apiKey,
                'plugin_key'    => 'bb78ce44c9f6e99dd85ddd30fb782695',
                'listID'        => $data['list'],
                'email'         => rawurlencode($data['email']),
                'status'        => $status,
                'tags'          => $tags,
            );

            $params = array_merge($params, $this->prepareMergeVars($data['list']));

            $this->logger->info('[E-goi] Params: ' . print_r($params, true));

            $user = $this->getClient()->call('addSubscriber', $params);

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
            $this->logger->alert('[E-goi] Mandatory information not present [list and/or email address]');
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
            'apikey'        => op_get_option('egoi_api_key'),
            'listID'        => $list,
            'email'         => rawurlencode($email),
            'first_name'    => $fname,
            'last_name'     => $lname
        );

        $this->logger->info('[E-goi] Registering user: ' . print_r($data, true));
        $this->logger->info('[E-goi] Params: ' . print_r($params, true));

        $user = $this->getClient()->call('addSubscriber', $params);

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

        // GDPR note
        $note = $this->getGdprNote();
        if ( ! empty($note) && isset($_POST['op_gdpr_consent_notes_field']) && ! empty($_POST['op_gdpr_consent_notes_field'])) {
            $vars[$_POST['op_gdpr_consent_notes_field']] = $note;
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
            'telephone'     => __('Telephone', 'optimizepress'),
            'cellphone'     => __('Cellphone', 'optimizepress'),
            'fax'           => __('Fax', 'optimizepress'),
            'birth_data'    => __('Birth Date', 'optimizepress'),
        );

        $lists = $this->getLists();
        foreach ($lists as $list) {
            if($id == $list['listnum']) {
                if($list['extra_fields'] != false) {
                    foreach($list['extra_fields'] as $field) {
                        $fields['extra_' . $field['id']] = $field['ref'];
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

        $this->logger->info("[E-goi] Fields for list $listId: " . print_r($fields, true));

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

        $lists = $this->getLists();

            foreach ($lists as $list) {
                $data['lists'][$list['listnum']] = array('name' => $list['title']);
            }

        $this->logger->info('[E-goi] Items: ' . print_r($data, true));

        return $data;
    }
}

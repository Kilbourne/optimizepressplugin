<?php

require_once(OP_MOD . 'email/ProviderInterface.php');
require_once(OP_MOD . 'email/LoggerInterface.php');
require_once(OP_MOD . 'email/provider/AbstractProvider.php');

require_once(OP_LIB . 'vendor/activecampaign/ActiveCampaign.class.php');

/**
 * ActiveCampaign email integration provider
 * @author OptimizePress <info@optimizepress.com>
 */
class OptimizePress_Modules_Email_Provider_ActiveCampaign extends OptimizePress_Modules_Email_Provider_AbstractProvider implements OptimizePress_Modules_Email_ProviderInterface
{
    const OPTION_NAME_ACCOUNT_URL = 'activecampaign_account_url';
    const OPTION_NAME_API_KEY = 'activecampaign_api_key';

    /**
     * @var ActiveCampaign
     */
    protected $client = null;

    /**
     * @var boolean
     */
    protected $accountUrl = false;
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
        $this->accountUrl   = op_get_option(self::OPTION_NAME_ACCOUNT_URL);
        $this->apiKey       = op_get_option(self::OPTION_NAME_API_KEY);

        /*
         * Initializing logger
         */
        $this->logger       = $logger;
    }

    /**
     * @see OptimizePress_Modules_Email_ProviderInterface::subscribe()
     */
    public function getClient()
    {
        if (null === $this->client) {
            $this->client = new OP_ActiveCampaign($this->accountUrl, $this->apiKey, '', '', $this->logger);
        }

        return $this->client;
    }

    /**
     * @see OptimizePress_Modules_Email_ProviderInterface::getLists()
     */
    public function getLists()
    {
        $list = array(
            "ids"   => "all",
            'full'  => 1,
            'global_fields' => true,
        );
        $lists = $this->getClient()->api("list/list", $list);
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
        $tags = $this->getClient()->api("tag/list");
        $this->logger->info('Tags: ' . print_r($tags, true));

        if ( ! empty($tags)) {
            $tags = json_decode($tags);
        }

        $data = array();

        if (is_array($tags) && count($tags) > 0) {
            foreach ($tags as $tag) {
                $data[$tag->name] = $tag->name;
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

        foreach ($lists as $key => $list) {
            if (is_object($list)) {
                $data['lists'][$list->id] = array('name' => $list->name, 'fields' => $this->getFormFields($list));
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

            $fields = $this->prepareMergeVars($data['list'], $data['email']);

            $this->logger->info('Prepared Merge Vars: ' . print_r($fields, true));

            $status = $this->getClient()->api("contact/sync", $fields);

            $this->logger->notice('Subscription status: ' . print_r($status, true));

            if ($status->success == 1) {
                if ($status->result_message == 'Contact updated') {
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
                } else {
                    $this->logger->notice('User updated to List');

                    $this->saveGdprNote($data['list'], $status->subscriber_id);

                    return true;
                }
            }
                return false;
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

        $fields = array(
            'email' => $email,
            'first_name' => $fname,
            'last_name' => $lname,
            'p[' . $list . ']' => $list,
        );

        $status = $this->getClient()->api("contact/sync", $fields);

        $this->logger->notice('Registration status: ' . print_r($status, true));

        return true;
    }

    /**
     * @see OptimizePress_Modules_Email_ProviderInterface::isEnabled()
     */
    public function isEnabled()
    {
        return $this->accountUrl === false ? false : true;
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

        foreach ($lists as $key => $list) {
            if (is_object($list)) {
                $data['lists'][$list->id] = array('name' => $list->name, 'fields' => $this->getFormFields($list));
            }
        }

        //$this->logger->info('Items: ' . print_r($data, true));

        return $data;
    }

    /**
     * @see OptimizePress_Modules_Email_ProviderInterface::getListFields()
     */
    public function getListFields($listId)
    {
        $fields = $this->getFormFields($listId);

        return array('fields' => $fields);
    }

    /**
     * Returns form fields for given list
     * @param  mixed $id
     * @return array
     */
    public function getFormFields($id)
    {
        $fields = array(
            'first_name'    => __('First name', 'optimizepress'),
            'last_name'     => __('Last name', 'optimizepress'),
            'phone'         => __('Phone', 'optimizepress'),
            'orgname'       => __('Organization name', 'optimizepress'),
            'tags'          => __('Tags', 'optimizepress'),
        );

        // In case that we already have list object we don't need to fetch lists again
        if (is_object($id) && isset($id->fields)) {
            foreach ($id->fields as $list_fields) {
                $fields['customfield_id_' . $list_fields->id] = $list_fields->title;
            }
        } else {
            $lists = $this->getLists();
            foreach ($lists as $key => $list) {
                if (is_object($list) && ($id == $list->id)) {
                    foreach ($list->fields as $list_fields) {
                        $fields['customfield_id_' . $list_fields->id] = $list_fields->title;
                    }
                }
            }
        }

        return $fields;
    }

    /**
     * Searches for possible form fields from POST and adds them to the collection
     * @param  string $id
     * @return null|array     Null if no value/field found
     */
    protected function prepareMergeVars($id, $email)
    {
        $vars = array();
        $allowed = array_keys($this->getFormFields($id));

        foreach ($allowed as $name) {
            if ($name !== 'email' && false !== $value = op_post($name)) {
                if ((strrpos($name, "customfield_id_") !== false)) {
                    $customID = str_replace('customfield_id_', '', $name);
                    $vars['field[' . $customID . ',0]'] = $value;
                } else {
                    $vars[$name] = $value;
                }
            }
        }


        $vars['p[' . $id . ']'] = $id;
        $vars['email'] = $email;
        if ( op_post('signup_form_id')) {
            $vars['form'] = op_post('signup_form_id');
        }

        // Triggering instant responders
        $vars['instantresponders'] = 1;

        $vars['ip4'] = op_get_client_ip_env();

        // Tags
        if (isset($_POST['op_gdpr_consent_tag']) && is_array($_POST['op_gdpr_consent_tag'])) {
            $vars['tags'] = implode(',', $this->cleanEmptyTags(array_values($_POST['op_gdpr_consent_tag'])));
        }

        return $vars;
    }

    /**
     * Save GDPR note.
     * @param  string $listId
     * @param  string $subscriberId
     * @return mixed
     */
    protected function saveGdprNote($listId, $subscriberId)
    {
        $note = $this->getGdprNote();

        if ( ! empty($note)) {
            $status = $this->getClient()->api("contact/note/add", array(
                'id' => $subscriberId,
                'note' => $note,
                'listid' => $listId,
            ));
        }
    }
}

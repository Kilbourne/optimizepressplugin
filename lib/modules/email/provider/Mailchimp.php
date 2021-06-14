<?php

require_once(OP_MOD . 'email/ProviderInterface.php');
require_once(OP_MOD . 'email/LoggerInterface.php');
require_once(OP_MOD . 'email/provider/AbstractProvider.php');

require_once(OP_LIB . 'vendor/mailchimp-api-class/OP_MailChimp.php');

/**
 * MailChimp email integration provider
 * @author OptimizePress <info@optimizepress.com>
 */
class OptimizePress_Modules_Email_Provider_Mailchimp extends OptimizePress_Modules_Email_Provider_AbstractProvider implements OptimizePress_Modules_Email_ProviderInterface
{
    const OPTION_NAME_API_KEY = 'mailchimp_api_key';

    /**
     * @var OP_MailChimp
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
            $this->client = new OP_MailChimp($this->apiKey, $this->logger);
        }

        return $this->client;
    }

    /**
     * @see OptimizePress_Modules_Email_ProviderInterface::getLists()
     */
    public function getLists()
    {
        $lists = $this->getClient()->get('lists', array('count' => 999));

        $this->logger->info('Lists (Mailchimp): ' . print_r($lists, true));

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
        if (isset($lists['lists'])){
            foreach ($lists['lists'] as $list) {
                $data['lists'][$list['id']] = array('name' => $list['name'], 'fields' => $this->getFormFields($list['id']));
            }
        }

        $this->logger->info('Formatted lists (Mailchimp): ' . print_r($data, true));

        return $data;
    }

    /**
     * @see OptimizePress_Modules_Email_ProviderInterface::subscribe()
     */
    public function subscribe($data)
    {
        $this->logger->info('Subscribing user (Mailchimp): ' . print_r($data, true));

        if (isset($data['list']) && isset($data['email'])) {

            $mergeVars = $this->prepareMergeVars($data['list']);

            $doubleOptin = op_post('double_optin') === 'Y' ? true : false;
            $updateExisting = apply_filters('op_mailchimp_update_existing_subscriber', false);

            $status = $this->getClient()->post("lists/" . $data['list'] . "/members", array(
                'email_address' => $data['email'],
                'status'        => (!$doubleOptin || $updateExisting) ? 'subscribed':'pending',
                'merge_fields'  => $mergeVars,
                'ip_signup'     => op_get_client_ip_env(),
                'ip_opt'        => op_get_client_ip_env(),
            ));

            $this->logger->notice('Subscription status (Mailchimp): ' . print_r($status, true));

            if (isset($status) && is_array($status)){
                if (isset($status['status']) && $status['status'] == 400) {

                    $mailchimpID = md5(strtolower($data['email']));

                    $realStatus = $this->getClient()->get("lists/" . $data['list'] . "/members/" . $mailchimpID);

                    $this->logger->notice('User status (Mailchimp): ' . print_r($realStatus, true));

                    $resubscription = false;
                    if($realStatus['status'] == 'unsubscribed') {
                        $resubscribedStatus = $this->getClient()->patch("lists/" . $data['list'] . "/members/" . $mailchimpID, array(
                            'status'        => (!$doubleOptin) ? 'subscribed':'pending',
                            'merge_fields'  => $mergeVars,
                            'ip_signup'     => op_get_client_ip_env(),
                            'ip_opt'        => op_get_client_ip_env(),
                        ));
                        $resubscription = true;
                        $this->logger->notice('Resubscribed Status (Mailchimp): ' . print_r($resubscribedStatus, true));
                    }

                    if (isset($status['detail']) && "Your merge fields were invalid." === $status['detail']){
                        $action = __('<a href="javascript:history.go(-1);">Return to previous page.</a>', 'optimizepress');
                        op_warning_screen(
                            __($status['detail'], 'optimizepress'),
                            __('Optin form - Warning', 'optimizepress'),
                            $action
                        );
                    }

                    $subscriber_hash = false;
                    if ($updateExisting && isset($status['status']) && $status['title'] == "Member Exists"){
                        $subscriber_hash = $this->getClient()->subscriberHash($data['email']);

                        $status = $this->getClient()->put("lists/" . $data['list'] . "/members/" . $subscriber_hash, array(
                            'email_address' => $data['email'],
                            'status'        => 'subscribed',
                            'merge_fields'  => $mergeVars,
                            'ip_signup'     => op_get_client_ip_env(),
                            'ip_opt'        => op_get_client_ip_env(),
                        ));
                        $this->logger->info('Subscriber update (MailChimp) - ' . print_r($status, true));
                    }

                    // Hijack redirect URL if user is already subscribed and already_subscribed_url param is defined
                    if (isset($_POST['already_subscribed_url']) && op_post('already_subscribed_url') !== '') {
                        if(false === $resubscription)
                            $_POST['redirect_url'] = op_post('already_subscribed_url');
                    } else {
                        if (isset($_POST['redirect_url'])) {
                            $action = sprintf(__('<a href="javascript:history.go(-1);">Return to previous page</a> or <a href="%s">continue</a>.', 'optimizepress'), op_post('redirect_url'));
                        } else {
                            $action = __('<a href="javascript:history.go(-1);">Return to previous page.</a>', 'optimizepress');
                        }

                        if (false !== $subscriber_hash || false !== $resubscription){
                            $this->saveGdprNote($data['list'], $this->getClient()->subscriberHash($data['email']));

                            op_warning_screen(
                                __('Your data has been updated...', 'optimizepress'),
                                __('Optin form - Message', 'optimizepress'),
                                $action
                            );
                        } else{
                            op_warning_screen(
                                __('This email is already subscribed...', 'optimizepress'),
                                __('Optin form - Warning', 'optimizepress'),
                                $action
                            );
                        }
                    } // else
                }
                $this->logger->info('User added to list (Mailchimp)');
            } else {
                $this->logger->error('Error (Mailchimp)');
                return false;
            }

            $this->saveGdprNote($data['list'], $this->getClient()->subscriberHash($data['email']));

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
        $this->logger->info('Registering user (Mailchimp): ' . print_r(func_get_args(), true));

        $mergeVars = array();
        $mergeVars['FNAME'] = $fname;
        $mergeVars['LNAME'] = $lname;

        $status = $this->getClient()->post("lists/" . $list . "/members", array(
            'email_address' => $email,
            'status'        => 'subscribed',
            'merge_fields'  => $mergeVars,
            'ip_signup'     => op_get_client_ip_env(),
        ));

        $this->logger->notice('Registration status (Mailchimp): ' . print_r($status, true));

        return true;
    }

    /**
     * Save GDPR note.
     * @param  string $listId
     * @param  string $subscriberHash
     * @return mixed
     */
    protected function saveGdprNote($listId, $subscriberHash)
    {
        $note = $this->getGdprNote();

        if ( ! empty($note)) {
            $status = $this->getClient()->post("lists/$listId/members/$subscriberHash/notes", array(
                'note' => $note,
            ));
        }
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
            if ($name !== 'EMAIL' && false !== $value = op_post($name)) {
                $vars[$name] = $value;
            }
        }

        // Append GDPR vars
        if (isset($_POST['op_gdpr_consent_tag']) && is_array($_POST['op_gdpr_consent_tag']) && count($_POST['op_gdpr_consent_tag']) > 0) {
            foreach ($_POST['op_gdpr_consent_tag'] as $key => $name) {
                $vars[$name] = apply_filters('op_gdpr_consent_custom_field_value', 'yes', 'mailchimp', $id);
            }
        }

        if (count($vars) === 0) {
            $vars = new stdClass();
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
        $fields = array();

        $vars = $this->getClient()->get('lists/' . $id . '/merge-fields', array('count' => 999));
        $this->logger->info("getFormFields for list $id (Mailchimp): " . print_r($vars, true));

        if (isset($vars['merge_fields'])){
            foreach ($vars['merge_fields'] as $var) {
                $fields[$var['tag']] = $var['name'];
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

        $this->logger->info("Fields for list $listId (Mailchimp): " . print_r($fields, true));

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
        if (isset($lists['lists'])){
            foreach ($lists['lists'] as $list) {
                $data['lists'][$list['id']] = array('name' => $list['name'], 'fields' => $this->getFormFields($list['id']));
            }
        }

        $this->logger->info('Items (Mailchimp): ' . print_r($data, true));

        return $data;
    }
}

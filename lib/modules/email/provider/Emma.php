<?php

require_once(OP_MOD . 'email/ProviderInterface.php');
require_once(OP_MOD . 'email/LoggerInterface.php');
require_once(OP_MOD . 'email/provider/AbstractProvider.php');

require_once(OP_LIB . 'vendor/emma-api-class/emma.class.php');

/**
 * Emma email integration provider
 * @author OptimizePress <info@optimizepress.com>
 */
class OptimizePress_Modules_Email_Provider_Emma extends OptimizePress_Modules_Email_Provider_AbstractProvider implements OptimizePress_Modules_Email_ProviderInterface
{
    const OPTION_NAME_ACCOUNT_ID    = 'emma_account_id';
    const OPTION_NAME_PUBLIC_KEY    = 'emma_public_key';
    const OPTION_NAME_PRIVATE_KEY   = 'emma_private_key';

    /**
     * @var OP_MCAPI
     */
    protected $client = null;

    /**
     * @var boolean
     */
    protected $accountID = false;
	/**
	 * @var boolean
	 */
	protected $publicKey = false;

	/**
	 * @var boolean
	 */
	protected $privateKey = false;

    /**
     * @var OptimizePress_Modules_Email_LoggerInterface
     */
    protected $logger;

    /**
     * Initializes client object and fetches API KEY
     */
    public function __construct(OptimizePress_Modules_Email_LoggerInterface $logger)
    {
        $this->accountID    = op_get_option(self::OPTION_NAME_ACCOUNT_ID);
        $this->publicKey    = op_get_option(self::OPTION_NAME_PUBLIC_KEY);
        $this->privateKey   = op_get_option(self::OPTION_NAME_PRIVATE_KEY);

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
            $this->client = new OP_Emma($this->accountID, $this->publicKey, $this->privateKey, $this->logger);
        }

        return $this->client;
    }

    /**
     * @see OptimizePress_Modules_Email_ProviderInterface::getLists()
     */
    public function getLists()
    {
        $lists = $this->getClient()->list_groups();
		$this->logger->info('[Emma] Lists: ' . print_r($lists, true));

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
        if ($lists['total'] > 0) {
            foreach ($lists as $list) {
                $data['lists'][$list->member_group_id] = array('name' => $list->group_name, 'fields' => $this->getFormFields($list->member_group_id));
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

            $fields = $this->prepareMergeVars($data['list']);

        	$status = $this->getClient()->import_single_member($data['email'], $fields, array($data['list']), isset($data['signup_form_id']) ? $data['signup_form_id'] : null);

            $this->logger->notice('Subscription status: ' . print_r($status, true));

            if (!isset($status->added) || (int) $status->added !== 1) {
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

        $status = $this->getClient()->import_single_member($email, array('first_name' => $fname, 'last_name' => $lname), array($list));

        $this->logger->notice('Registration status: ' . print_r($status, true));

        if (!isset($status->added) || (int) $status->added !== 1) {
            return false;
        }

        return true;
    }

    /**
     * @see OptimizePress_Modules_Email_ProviderInterface::isEnabled()
     */
    public function isEnabled()
    {
        return $this->accountID === false ? false : true;
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
        if (is_array($lists) && count($lists) > 0) {
            foreach ($lists as $list) {
                $data['lists'][$list->member_group_id] = array('name' => $list->group_name);
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
        $fields = $this->getFormFields($listId);

        $this->logger->info("Fields for list $listId: " . print_r($fields, true));

        return array('fields' => $fields);
    }

    /**
     * Returns form fields for given list
     * @param  string $id
     * @return array
     */
    public function getFormFields($id)
    {
        $fields = array('email' => 'Email');

        $vars = $this->getClient()->get_field_list(false);
        foreach ($vars as $var) {
            $fields[$var->shortcut_name] = $var->display_name;
        }

        return $fields;
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
            if ($name !== 'email' && false !== $value = op_post($name)) {
                $vars[$name] = $value;
            }
        }

        // Append GDPR vars
        if (isset($_POST['op_gdpr_consent_tag']) && is_array($_POST['op_gdpr_consent_tag']) && count($_POST['op_gdpr_consent_tag']) > 0) {
            foreach ($_POST['op_gdpr_consent_tag'] as $key => $name) {
                $vars[$name] = apply_filters('op_gdpr_consent_custom_field_value', 'yes', 'emma', $id);
            }
        }

        // GDPR note
        $note = $this->getGdprNote();
        if ( ! empty($note) && isset($_POST['op_gdpr_consent_notes_field']) && ! empty($_POST['op_gdpr_consent_notes_field'])) {
            $vars[$_POST['op_gdpr_consent_notes_field']] = $note;
        }

        if (count($vars) === 0) {
            $vars = null;
        }

        return $vars;
    }
}
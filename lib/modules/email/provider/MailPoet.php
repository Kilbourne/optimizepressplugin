<?php

require_once(OP_MOD . 'email/ProviderInterface.php');
require_once(OP_MOD . 'email/provider/AbstractProvider.php');

/**
 * MailPoet integration
 * @author OptimizePress <info@optimizepress.com>
 */
class OptimizePress_Modules_Email_Provider_MailPoet extends OptimizePress_Modules_Email_Provider_AbstractProvider implements OptimizePress_Modules_Email_ProviderInterface
{
    /**
     * @var OptimizePress_Modules_Email_LoggerInterface
     */
    protected $logger;

    /**
     * Constructor
     */
    public function __construct(OptimizePress_Modules_Email_LoggerInterface $logger)
    {
        /*
         * Initializing logger
         */
        $this->logger = $logger;
    }

    /**
     * @see OptimizePress_Modules_Email_ProviderInterface::isEnabled()
     */
    public function isEnabled()
    {
        require_once ABSPATH . 'wp-admin/includes/plugin.php';

        return is_plugin_active('wysija-newsletters/index.php');
    }

    /**
     * @see OptimizePress_Modules_Email_ProviderInterface::subscribe()
     */
    public function subscribe($data)
    {
        $this->logger->info('Subscribing user (MailPoet): ' . print_r($data, true));

        if (isset($data['list']) && isset($data['email'])) {
            // Formating data
            $convertedData = $this->prepareMergeVars();
            $convertedData['user']['email'] = $data['email'];
            $convertedData['user_list']['list_ids'] = array($data['list']);

            $helperUser = WYSIJA::get('user', 'helper');
            $status = $helperUser->addSubscriber($convertedData);

            $this->logger->notice('Subscription status (MailPoet): ' . print_r($status, true));

            // Lets check if user is already subscribed
            $errorMessages = $helperUser->getMsgs();
            if (
                ! empty($errorMessages)
                && isset($errorMessages['updated'])
                && false !== array_search("Oops! You're already subscribed.", $errorMessages['updated'])
            ) {
                $this->logger->notice('User already subscribed (MailPoet).');

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

            $this->logger->info('User added to list (MailPoet)');

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
        $this->logger->info('Registering user (MailPoet): ' . print_r(func_get_args(), true));

        $data = array(
            'user' => array(
                'email'     => $email,
                'firstname' => $fname,
                'lastname'  => $lname
            ),
            'user_list'     => array(
                'list_ids'  => array($list),
            ),
        );

        $helperUser = WYSIJA::get('user', 'helper');
        $status = $helperUser->addSubscriber($data);

        $this->logger->notice('Registration status (MailPoet): ' . print_r($status, true));

        return true;
    }

    /**
     * @see OptimizePress_Modules_Email_ProviderInterface::subscribe()
     */
    public function getClient()
    {
        return;
    }

    /**
     * @see OptimizePress_Modules_Email_ProviderInterface::getLists()
     */
    public function getLists()
    {
        $listModel  = WYSIJA::get('list', 'model');
        $lists      = $listModel->getLists();

        $this->logger->info('Lists (MailPoet): ' . print_r($lists, true));

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

        $lists  = $this->getLists();
        $fields = $this->getListFields(null);

        if (count($lists) > 0) {
            foreach ($lists as $list) {
                $data['lists'][$list['list_id']] = array('name' => $list['name'], 'fields' => $fields);
            }
        }

        $this->logger->info('Formatted lists (MailPoet): ' . print_r($data, true));

        return $data;
    }

    /**
     * Searches for possible form fields from POST and adds them to the collection
     * @return null|array     Null if no value/field found
     */
    protected function prepareMergeVars()
    {
        $vars = array();
        $allowed = array_keys($this->getListFields(null));

        foreach ($allowed as $name) {
            if (false !== stripos($name, 'cf_')) {
                // Custom fields
                $vars['user_field'][$name] = op_post($name);
            } else {
                // Hardcoded fields
                $vars['user'][$name] = op_post($name);
            }
        }

        // Append GDPR vars
        if (isset($_POST['op_gdpr_consent_tag']) && is_array($_POST['op_gdpr_consent_tag']) && count($_POST['op_gdpr_consent_tag']) > 0) {
            foreach ($_POST['op_gdpr_consent_tag'] as $key => $name) {
                $vars['user_field'][$name] = apply_filters('op_gdpr_consent_custom_field_value', 'yes', 'mailpoet', null);
            }
        }

        // GDPR note
        $note = $this->getGdprNote();
        if ( ! empty($note) && isset($_POST['op_gdpr_consent_notes_field']) && ! empty($_POST['op_gdpr_consent_notes_field'])) {
            $vars['user_field'][$_POST['op_gdpr_consent_notes_field']] = $note;
        }

        if (count($vars) === 0) {
            $vars = null;
        }

        return $vars;
    }

    /**
     * @see OptimizePress_Modules_Email_ProviderInterface::getListFields()
     */
    public function getListFields($listId)
    {
        $fields = array(
            'firstname' => __('First Name', 'optimizepress'),
            'lastname'  => __('Last Name', 'optimizepress'),
        );

        $customFields = WJ_Field::get_all(array('order_by' => 'name ASC'));

        if (! empty($customFields)) {
            foreach ($customFields as $customField) {
                $fields[$customField->user_column_name()] = $customField->name;
            }
        }

        $this->logger->info("Fields (MailPoet): " . print_r($fields, true));

        return $fields;
    }

    /**
     * @see OptimizePress_Modules_Email_ProviderInterface::getItems()
     */
    public function getItems()
    {
        $data = $this->getData();

        $this->logger->info('Items (MailPoet): ' . print_r($data, true));

        return $data;
    }
}
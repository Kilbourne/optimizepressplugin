<?php

require_once(OP_MOD . 'email/ProviderInterface.php');
require_once(OP_MOD . 'email/LoggerInterface.php');
require_once(OP_MOD . 'email/provider/AbstractProvider.php');

require_once(OP_LIB . 'vendor/arpreach/ArpReachClient.php');

/**
 * arpReach email integration provider
 * @author OptimizePress <info@optimizepress.com>
 */
class OptimizePress_Modules_Email_Provider_ArpReach extends OptimizePress_Modules_Email_Provider_AbstractProvider implements OptimizePress_Modules_Email_ProviderInterface
{
    const OPTION_NAME_API_KEY       = 'arpreach_api_key';
    const OPTION_NAME_API_ENDPOINT  = 'arpreach_api_endpoint';

    /**
     * @var OP_ArpReachClient
     */
    protected $client = null;

    /**
     * @var string
     */
    protected $apiKey;

    /**
     * @var string
     */
    protected $apiEndpoint;

    /**
     * @var OptimizePress_Modules_Email_LoggerInterface
     */
    protected $logger;

    /**
     * @var array
     */
    // protected $forbiddenFields = array('provider', 'redirect_url', 'list', 'already_subscribed_url', 'email', 'op_optin_nonce', '_wp_http_referer');

    /**
     * Initializes client object and fetches API KEY.
     */
    public function __construct(OptimizePress_Modules_Email_LoggerInterface $logger)
    {
        $this->apiKey       = op_get_option(self::OPTION_NAME_API_KEY);
        $this->apiEndpoint  = op_get_option(self::OPTION_NAME_API_ENDPOINT);

        /*
         * Initializing logger
         */
        $this->logger       = $logger;
    }

    /**
     * @see OptimizePress_Modules_Email_ProviderInterface::getClient()
     */
    public function getClient()
    {
        if (null === $this->client) {
            $this->client = new OP_ArpReachClient($this->apiKey, $this->apiEndpoint, $this->logger);
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
     * @see OptimizePress_Modules_Email_ProviderInterface::subscribe()
     */
    public function subscribe($data)
    {
        $this->logger->info('Subscribing user (arpReach): ' . print_r($data, true));

        if (isset($data['list']) && isset($data['email'])) {

            $fields = $this->prepareMergeVars();
            $status = $this->getClient()->subscribeContact($data['list'], $data['email'], $fields);

            $this->logger->notice('Subscription status (arpReach): ' . print_r($status, true));

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

            // Tags
            if (isset($_POST['op_gdpr_consent_tag']) && is_array($_POST['op_gdpr_consent_tag'])) {
                $tags = implode(',', $this->cleanEmptyTags(array_values($_POST['op_gdpr_consent_tag'])));

                $status = $this->assingTagToContact($tags, $data['email']);

                if (false === $status) {
                    $this->logger->alert('Something wrong with assign tags to contact (arpReach)');
                    $action = __('<a href="javascript:history.go(-1);">Return to previous page.</a>', OP_SN);
                    op_warning_screen(
                        __('Tag does not exist...', OP_SN),
                        __('Optin form - Warning', OP_SN),
                        $action
                    );
                }
            }

            return true;
        } else {
            $this->logger->alert('Mandatory information not present [list and/or email address] (arpReach)');
            wp_die('Mandatory information not present [list and/or email address].');

            return false;
        }
    }

    /**
     * @see OptimizePress_Modules_Email_ProviderInterface::register()
     */
    public function register($list, $email, $fname, $lname)
    {
        $this->logger->info('Registering user (arpReach): ' . print_r(func_get_args(), true));

        $status = $this->getClient()->subscribeContact($list, $email, array('first_name' => $fname, 'last_name' => $lname));

        $this->logger->notice('Registration status (arpReach): ' . print_r($status, true));

        return true;
    }

    /**
     * @see OptimizePress_Modules_Email_ProviderInterface::getListFields()
     */
    public function getListFields($listId)
    {
        return array('fields' => $this->getFormFields());
    }

    /**
     * Get tags.
     *
     * @return array
     */
    public function getTags()
    {
        $tags = $this->getClient()->getTags();

        $data = array();

        if (is_array($tags) && count($tags) > 0) {
            foreach ($tags as $tag) {
                $data[$tag[0]->tag_name] = $tag[0]->tag_name;
            }
        }

        return array('tags' => $data);
    }

    public function assingTagToContact($tags, $email)
    {
        return $this->getClient()->assignTagsToContact($tags, $email);
    }

    /**
     * @see OptimizePress_Modules_Email_ProviderInterface::getLists()
     */
    public function getLists()
    {
        // Not implemented on purpose. API currently doesn't a method for fetching lists.
        return;
    }

    /**
     * @see OptimizePress_Modules_Email_ProviderInterface::getItems()
     */
    public function getItems()
    {
        // Not implemented on purpose. API currently doesn't a method for fetching lists.
        return;
    }

    /**
     * @see OptimizePress_Modules_Email_ProviderInterface::getData()
     */
    public function getData()
    {
        // Not implemented on purpose. API currently doesn't a method for fetching lists.
        return;
    }

    /**
     * Return all additional fields.
     * @return array
     */
    protected function getFormFields()
    {
        return array(
            'title'                 => __('Title', OP_SN),
            'first_name'            => __('First Name', OP_SN),
            'middle_name'           => __('Middle Name', OP_SN),
            'last_name'             => __('Last Name', OP_SN),
            'full_name'             => __('Full Name', OP_SN),
            'company'               => __('Company', OP_SN),
            'department'            => __('Department', OP_SN),
            'address_1'             => __('Address 1', OP_SN),
            // 'address_2'          => __('Address 2', OP_SN),
            // 'address_3'          => __('Address 3', OP_SN),
            'city'                  => __('City', OP_SN),
            'state'                 => __('State', OP_SN),
            'postal_code'           => __('Postal Code', OP_SN),
            'country'               => __('Country', OP_SN),
            'phone_number_1'        => __('Phone Number 1', OP_SN),
            // 'phone_number_2'     => __('Phone Number 2', OP_SN),
            // 'phone_number_3'     => __('Phone Number 3', OP_SN),
            'mobile_phone_number_1' => __('Mobile Phone Number 1', OP_SN),
            // 'mobile_phone_number_2' => __('Mobile Phone Number 2', OP_SN),
            // 'mobile_phone_number_3' => __('Mobile Phone Number 3', OP_SN),
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
        // $forbidden  = array_merge($allowed, $this->forbiddenFields);

        foreach ($allowed as $name) {
            if (false !== $value = op_post($name)) {
                $vars[$name] = $value;
            }
        }

        // foreach ($_POST as $name => $value) {
        //     if (!in_array($name, $forbidden)) {
        //         $vars[$name] = $value;
        //     }
        // }

        if (count($vars) === 0) {
            $vars = null;
        }

        return $vars;
    }
}
<?php

require_once(OP_MOD . 'email/ProviderInterface.php');
require_once(OP_MOD . 'email/LoggerInterface.php');
require_once(OP_MOD . 'email/provider/AbstractProvider.php');

require_once(OP_LIB . 'vendor/aweber_api/aweber_api.php');

/**
 * AWeber email integration provider
 * @author OptimizePress <info@optimizepress.com>
 */
class OptimizePress_Modules_Email_Provider_Aweber extends OptimizePress_Modules_Email_Provider_AbstractProvider implements OptimizePress_Modules_Email_ProviderInterface
{
    /*
     * Application needs to be created/registered at labs.aweber.com to receive this info
     */
    const APP_ID = '175a01ab';
    const CONSUMER_KEY = 'AkGX4qiLDofJcXcmz00fN10D';
    const CONSUMER_SECRET = 'yEaZuqxLlLXbWltDMuEgRW4mKU7L3d5x3AdrhVFl';

    const OPTION_NAME_OAUTH_ACCESS_TOKEN = 'aweber_access_token';
    const OPTION_NAME_OAUTH_ACCESS_SECRET = 'aweber_access_secret';

    /**
     * @var OP_AWeberAPI
     */
    protected $client;

    /**
     * @var AWeberCollection
     */
    protected $account;

    /**
     * @var string|bool
     */
    protected $accessToken;

    /**
     * @var string|bool
     */
    protected $accessSecret;

    /**
     * @var OptimizePress_Modules_Email_LoggerInterface
     */
    protected $logger;

    /**
     * Constructor, initializes $accessToken, $accessSecret and creates $client
     */
    public function __construct(OptimizePress_Modules_Email_LoggerInterface $logger)
    {
        /*
         * Fetching values from wp_options table
         */
        $this->accessToken = op_get_option(self::OPTION_NAME_OAUTH_ACCESS_TOKEN);
        $this->accessSecret = op_get_option(self::OPTION_NAME_OAUTH_ACCESS_SECRET);

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
            $this->client = new OP_AWeberAPI(self::CONSUMER_KEY, self::CONSUMER_SECRET, $this->logger);
        }

        return $this->client;
    }

    /**
     * Initializes AWeber account
     * @return OP_AWeberCollection
     */
    public function getAccount()
    {
        if (null === $this->account) {
            $this->account = $this->getClient()->getAccount($this->accessToken, $this->accessSecret);
        }

        return $this->account;
    }

    /**
     * @see OptimizePress_Modules_Email_ProviderInterface::isEnabled()
     */
    public function isEnabled()
    {
        return $this->accessToken === false || $this->accessSecret === false ? false : true;
    }

    /**
     * Authorizes user on AWeber using OAuth
     *
     * User will be redirected to AWeber website for authorization
     *
     * @return void
     */
    public function authorize()
    {
        /*
         * If 'callback' is defined we are returned from AWeber with auth details
         */
        if (false === op_get('callback') && false === op_get('disconnect')) {
            /*
             * Defining callback URL where AWeber will return with auth information
             */
            $callbackUrl = admin_url('admin.php?action=' . OP_AWEBER_AUTH_URL . '&callback=1');

            /*
             * Fetching request token from AWeber
             */
            list($requestToken, $requestTokenSecret) = $this->getClient()->getRequestToken($callbackUrl);

            /*
             * Saving temp request token secret
             */
            op_update_option(self::OPTION_NAME_OAUTH_ACCESS_SECRET, $requestTokenSecret);

            /*
             * Redirecting to AWeber login/authorization dialog
             */
            header("HTTP/1.1 200 OK");
            header('Location: ' . $this->getClient()->getAuthorizeUrl());
            exit();
        } else if ('1' == op_get('disconnect')) {
            /*
             * Saving access data
             */
            op_delete_option(self::OPTION_NAME_OAUTH_ACCESS_TOKEN);
            op_delete_option(self::OPTION_NAME_OAUTH_ACCESS_SECRET);
            /*
             * Redirecting user to dashboard page
             */
            header("HTTP/1.1 200 OK");
            header('Location: ' . admin_url() . 'admin.php?page=optimizepress-dashboard#email_marketing_services--aweber');
            exit();

        } else {
            /*
             * Filling AWeber user with needed information (from GET and from data received in earlier step)
             */
            $this->getClient()->user->tokenSecret = op_get_option(self::OPTION_NAME_OAUTH_ACCESS_SECRET);
            $this->getClient()->user->requestToken = op_get('oauth_token');
            $this->getClient()->user->verifier = op_get('oauth_verifier');

            /*
             * Fetching access token
             */
            list($accessToken, $accessTokenSecret) = $this->getClient()->getAccessToken();

            /*
             * Saving access data
             */
            op_update_option(self::OPTION_NAME_OAUTH_ACCESS_TOKEN, $accessToken);
            op_update_option(self::OPTION_NAME_OAUTH_ACCESS_SECRET, $accessTokenSecret);

            /*
             * Redirecting user to dashboard page
             */
            header("HTTP/1.1 200 OK");
            header('Location: ' . admin_url() . 'admin.php?page=optimizepress-dashboard#email_marketing_services--aweber');
            exit();
        }
    }

    /**
     * @see OptimizePress_Modules_Email_ProviderInterface::subscribe()
     */
    public function subscribe($data)
    {
        $this->logger->info('Subscribing user: ' . print_r($data, true));

        if (isset($data['list']) && isset($data['email'])) {

            $list = $this->getListById($data['list']);

            $tags = array();
            if (isset($_POST['op_gdpr_consent_tag']) && is_array($_POST['op_gdpr_consent_tag'])) {
                $tags = $this->cleanEmptyTags(array_values($_POST['op_gdpr_consent_tag']));
            }

            $consentNotes = '';
            if (isset($_POST['op_gdpr_button_label']) && ! empty($_POST['op_gdpr_button_label'])) {
                $consentNotes .= 'Button Text: ' . sanitize_text_field($_POST['op_gdpr_button_label']);
            }
            if (isset($_POST['op_gdpr_consent_label']) && is_array($_POST['op_gdpr_consent_label'])) {
                foreach ($_POST['op_gdpr_consent_label'] as $key => $value) {
                    $consentNotes .= " | Consent $key Text: $value";
                }
            }

            $params = array(
                'email' => $data['email'],
                'name' => false === op_post('name') ? '' : op_post('name'),
                'ip_address' => op_get_client_ip_env(),
                'tags' => $tags,
                'misc_notes' => $this->getGdprNote(),
            );

            if (null === $list) {
                $this->logger->error('Error: list ' . $data['list'] . ' not found');
                wp_die('Error when subscribing user: ' . print_r($params, true) . "\n" . 'List not found [' . $data['list'] . ']');
            }

            $mergeVars = $this->prepareMergeVars($list);
            if (null !== $mergeVars) {
                $params['custom_fields'] = $mergeVars;
            }

            try {
                $status = $list->subscribers->create($params);

                $this->logger->notice('Subscription status: ' . print_r($status, true));

            } catch (OP_AWeberAPIException $e) {

                $this->logger->error('Error ' . $e->type . ': ' . $e->message);

                if (trim($e->message) == 'email: Subscriber already subscribed.' || (trim($e->message) == 'email: Subscriber already subscribed and has not confirmed.')){
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
        $this->logger->info('Registering user: ' . print_r(func_get_args(), true));

        $list = $this->getListById($list);

        try {

            $status = $list->subscribers->create(array(
                'email' => $email,
                'name' => $fname . ' ' . $lname
            ));

            $this->logger->notice('Registration status: ' . print_r($status, true));

        } catch (OP_AWeberAPIException $e) {
            $this->logger->error('Error ' . $e->type . ': ' . $e->message);

            return false;
        }

        return true;
    }

    /**
     * Traverses through the list collection and returns needed list
     * @param string $id
     * @return OP_AWeberEntry|null
     */
    protected function getListById($id)
    {
        $lists = $this->getLists();
        foreach ($lists as $list) {
            if ($list->id == $id) {
                return $list;
            }
        }

        return null;
    }

    /**
     * Searches for possible form fields from POST and adds them to the collection
     * @param  OP_AWeberEntry $list
     * @return null|array     Null if no value/field found
     */
    protected function prepareMergeVars($list)
    {
        $vars = array();
        $allowed = array_keys($this->getFormFields($list));

        foreach ($allowed as $name) {
            if ($name !== 'name' && false !== $value = op_post(str_replace(' ', '_', $name))) {
                $vars[$name] = $value;
            }
        }

        if (count($vars) === 0) {
            $vars = null;
        }

        return $vars;
    }

    /**
     * @see OptimizePress_Modules_Email_ProviderInterface::getLists()
     */
    public function getLists()
    {
        $lists = $this->getAccount()->lists;

        $this->logger->info('Lists: ' . print_r($lists, true));

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
        if (count($lists) > 0) {
            foreach ($lists as $list) {
                $data['lists'][$list->id] = array('name' => $list->name, 'fields' => $this->getFormFields($list));
            }
        }

        $this->logger->info('Formatted lists: ' . print_r($data, true));

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
        $fields = $this->getFormFields($this->getLists()->getById($listId));

        $this->logger->info("Fields for list $listId: " . print_r($fields, true));

        return array('fields' => $fields);
    }

    /**
     * Returns form fields for given list
     * @param  OP_AWeberEntry $list
     * @return array
     */
    public function getFormFields($list)
    {
        $fields = array('name' => 'name');

        $vars = $list->custom_fields;
        if (count($vars) > 0) {
            foreach ($vars as $var) {
                $fields[esc_attr($var->name)] = $var->name;
            }
        }

        return $fields;
    }
}
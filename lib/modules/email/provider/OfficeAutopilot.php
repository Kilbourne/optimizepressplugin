<?php

require_once(OP_MOD . 'email/ProviderInterface.php');
require_once(OP_MOD . 'email/provider/AbstractProvider.php');

require_once(OP_LIB . 'vendor/officeautopilot/OAPAPI.php');

/**
 * Office Autopilot email integration provider
 * @author OptimizePress <info@optimizepress.com>
 */
class OptimizePress_Modules_Email_Provider_OfficeAutopilot extends OptimizePress_Modules_Email_Provider_AbstractProvider implements OptimizePress_Modules_Email_ProviderInterface
{
    const OPTION_NAME_APP_ID    = 'officeautopilot_app_id';
    const OPTION_NAME_API_KEY   = 'officeautopilot_api_key';

    /**
     * @var OP_OAPAPI
     */
    protected $client = null;

    /**
     * @var string
     */
    protected $appId;

    /**
     * @var string
     */
    protected $apiKey;

    /**
     * @var OptimizePress_Modules_Email_LoggerInterface
     */
    protected $logger;

    public function __construct(OptimizePress_Modules_Email_LoggerInterface $logger)
    {
        $this->appId    = op_get_option(self::OPTION_NAME_APP_ID);
        $this->apiKey   = op_get_option(self::OPTION_NAME_API_KEY);

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
            $this->client = new OP_OAPAPI(array('AppID' =>  $this->appId, 'Key' => $this->apiKey));
            $this->client->set_logger($this->logger);
        }

        return $this->client;
    }

    /**
     * @see OptimizePress_Modules_Email_ProviderInterface::subscribe()
     */
    public function subscribe($data)
    {
        $this->logger->info('Subscribing user: ' . print_r($data, true));

        if (isset($data['email'])) {

            $params['fields'] = $this->prepareMergeVars();
            $params['fields']['E-Mail'] = $data['email'];

            if (isset($data['list']) && !empty($data['list'])) {
                $params['sequences'] = array($data['list']);
            }

            try {
                $status = $this->getClient()->add_contact($params);

                // add gdpr note
                if (isset($_POST['op_gdpr_consent_label'])) {
                    $this->saveGdprNote($status->contact['id'][0]);
                }

                //$this->logger->notice('Subscription status: ' . print_r($status, true));
            } catch (Exception $e) {
                $this->logger->error('Error ' . $e->getCode() . ': ' . $e->getMessage());

                return false;
            }

            return true;
        } else {
            $this->logger->alert('Mandatory information not present [email address]');
            wp_die('Mandatory information not present [email address].');

            return false;
        }
    }

    /**
     * @see OptimizePress_Modules_Email_ProviderInterface::register()
     */
    public function register($list, $email, $fname, $lname)
    {
        $this->logger->info('Registering user: ' . print_r(func_get_args(), true));

        $params['fields']['First Name'] = $fname;
        $params['fields']['Last Name'] = $lname;
        $params['fields']['E-Mail'] = $email;

        if (!empty($list)) {
            $params['sequences'] = array($list);
        }

        try {
            $status = $this->getClient()->add_contact($params);

            $this->logger->notice('Registration status: ' . print_r($status, true));
        } catch (Exception $e) {
            $this->logger->error('Error ' . $e->getCode() . ': ' . $e->getMessage());

            return false;
        }

        return true;
    }

    /**
     * @see OptimizePress_Modules_Email_ProviderInterface::getLists()
     */
    public function getLists()
    {
        $lists = $this->getClient()->fetch_sequences_type();

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
        $tags = $this->getClient()->pull_tag();

        $data = array();

        if (is_array($tags) && count($tags) > 0) {
            foreach ($tags as $key => $tag) {
                $data[esc_attr($tag)] = $tag;
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
        if (is_array($lists) && count($lists) > 0) {
            $extraFields = $this->getFields();
            foreach ($lists as $key => $name) {
                $data['lists'][$key] = array('name' => $name, 'fields' => $extraFields);
            }
        }

        $this->logger->info('Formatted lists: ' . print_r($data, true));

        return $data;
    }

    /**
     * @see OptimizePress_Modules_Email_ProviderInterface::isEnabled()
     */
    public function isEnabled()
    {
        if (false !== $this->appId && false !== $this->apiKey) {
            return true;
        } else {
            return false;
        }
    }

    protected function getFields()
    {
        return array (
            'First-Name'    => 'First Name',
            'Promo-Code'    => 'Promo Code',
            'Last-Name'     => 'Last Name',
            // 'E-Mail'     => 'E-Mail',
            'Cell-Phone'    => 'Cell Phone',
            'DC-Phone'      => 'DC Phone',
            'Office-Phone'  => 'Office Phone',
            'Fax'           => 'Fax',
            'Home-Phone'    => 'Home Phone',
            'Title'         => 'Title',
            'Company'       => 'Company',
            'Address'       => 'Address',
            'Address-2'     => 'Address 2',
            'Zip-Code'      => 'Zip Code',
            'City'          => 'City',
            'State'         => 'State'
        );
    }

    /**
     * Searches for possible form fields from POST and adds them to the collection
     * @return null|array     Null if no value/field found
     */
    protected function prepareMergeVars()
    {
        $vars = array();
        $fields = $this->getFields();

        foreach ($fields as $key => $name) {
            if (false !== $value = op_post($key)) {
                $vars[$name] = $value;
            }
        }

        // Tags
        if (isset($_POST['op_gdpr_consent_tag']) && is_array($_POST['op_gdpr_consent_tag'])) {
            $vars['tags'] = array_values($_POST['op_gdpr_consent_tag']);
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
        $fields = $this->getFields();

        $this->logger->info("Fields for list $listId: " . print_r($fields, true));

        return array('fields' => $fields);
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
     * Return condensed GDPR note.
     *
     * @return string
     */
    protected function getGdprNote()
    {
        $consentNotes = '';

        if (isset($_POST['op_gdpr_button_label']) && ! empty($_POST['op_gdpr_button_label'])) {
            $consentNotes .= 'Button Text: ' . sanitize_text_field($_POST['op_gdpr_button_label']);
        }
        if (isset($_POST['op_gdpr_consent_label']) && is_array($_POST['op_gdpr_consent_label'])) {
            foreach ($_POST['op_gdpr_consent_label'] as $key => $value) {
                $consentNotes .= " | Consent $key Text: $value";
            }
        }

        return $consentNotes;
    }

    /**
     * Save GDPR note.
     *
     * @param $contactId
     * @return mixed
     */
    protected function saveGdprNote($contactId)
    {
        $note = $this->getGdprNote();

        if ( ! empty($note)) {
            return $this->getClient()->add_note($contactId, $note);
        }
    }
}
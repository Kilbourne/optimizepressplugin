<?php

require_once(OP_MOD . 'email/ProviderInterface.php');
require_once(OP_MOD . 'email/provider/OfficeAutopilot.php');

//require_once(OP_LIB . 'vendor/officeautopilot/OAPAPI.php');

require_once(OP_LIB . 'vendor/ontraport/Ontraport.php');

/**
 * Ontraport email integration provider
 * @author OptimizePress <info@optimizepress.com>
 */
class OptimizePress_Modules_Email_Provider_Ontraport extends OptimizePress_Modules_Email_Provider_AbstractProvider implements OptimizePress_Modules_Email_ProviderInterface
{
    const OPTION_NAME_APP_ID    = 'ontraport_app_id';
    const OPTION_NAME_API_KEY   = 'ontraport_api_key';

    protected $host             = 'https://api.ontraport.com/1/';

    protected $client;

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

    public function getClient()
    {
        if (null === $this->client) {
            //$this->client = new OP_OAPAPI(array('AppID' =>  $this->appId, 'Key' => $this->apiKey, 'Host' => $this->host));
            $this->client = new OntraportAPI\Ontraport($this->appId, $this->apiKey);
            //$this->client->set_logger($this->logger);
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
            $form_params = array(
                'objectID'       => 0,
                'email'          => $data['email'],
                'updateSequence' => "*/*".$data['list']."*/*"
            );
            /* make back-compatible for old api fields */
            /* make back-compatible for old api fields */
            if (isset($_POST['first_name']))
                $form_params['firstname'] = $_POST['first_name'];
            if (isset($_POST['last_name']))
                $form_params['lastname'] = $_POST['last_name'];

            /* New api fields */
            if (isset($_POST['firstname']))
                $form_params['firstname'] = $_POST['firstname'];
            if (isset($_POST['lastname']))
                $form_params['lastname'] = $_POST['lastname'];

            try {
                $response = $this->getClient()->request($form_params, 'objects/saveorupdate', "post", '5', '');
                $result = json_decode($response);
                $data = $result->data;
                $user_id = $data->id;

                $this->logger->info('After Subscribing user id: ' . print_r($user_id, true));

                // add gdpr note
                if (isset($_POST['op_gdpr_consent_label'])) {
                    $this->saveGdprNote($user_id);
                }

                return true;
            } catch (Exception $e) {
                $this->logger->error('Error ' . $e->getCode() . ': ' . $e->getMessage());

                return false;
            }

        }else{
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


        if (isset($email)) {
            $form_params = array(
                'objectID'       => 0,
                'firstname'      => $fname,
                'lastname'       => $lname,
                'email'          => $email,
                'updateSequence' => "*/*".$list."*/*"
            );

            try {
                $response = $this->getClient()->request($form_params, 'objects', "post", '5', '');

                // add gdpr note
                if (isset($_POST['op_gdpr_consent_label'])) {
                    $this->saveGdprNote($response->contact['id'][0]);
                }

                return true;
            } catch (Exception $e) {
                $this->logger->error('Error ' . $e->getCode() . ': ' . $e->getMessage());

                return false;
            }

        }else{
            $this->logger->alert('Mandatory information not present [email address]');
            wp_die('Mandatory information not present [email address].');

            return false;
        }

        return true;
    }

    /**
     * @see OptimizePress_Modules_Email_ProviderInterface::getLists()
     */
    public function getLists()
    {
        $limit    = 50;
        $page     = 0;
        $lists     = $this->getListsOnPage($page, $limit);
        $loadMore = $loadMore = (count($lists) >= $limit);

        // Append
        while ($loadMore) {
            $page++;
            $additionalLists = $this->getListsOnPage($page, $limit);

            // Merge it
            if (count($additionalLists)) $lists = array_merge($lists, $additionalLists);

            // Check if we stop loading
            if (count($additionalLists) < $limit) $loadMore = false;
        }

        $this->logger->info('Lists: ' . print_r($lists, true));

        return array_unique($lists);
    }

    public function getListsOnPage($page, $limit)
    {
        // And try to make the request
        try {
            $start = $page * $limit;
            // Prepare request data
            $response = $this->getClient()->request(array('objectID' => 5, 'start' => $start), 'objects', "get", '5', '');

            if ($result = @json_decode($response) and isset($result->data)) {
                foreach($result->data as $item){
                    $lists[$item->drip_id] = $item->name;
                }

                return $lists;
            }

            error_log('[ONTRAPORT] Failed to get lists. ' . @json_decode($response->getBody()));
        } catch (Exception $e) {
            error_log('[ONTRAPORT] Error when fetching lists from service. ' . $e->getMessage());
        }
    }

    /**
     * Return tags as key => value.
     *
     * @return array
     */
    public function getTags()
    {
        $data = array();
        $response = $this->getClient()->request(array('objectID' => 14), 'objects', "get", '5', '');

        $result = json_decode($response);

        foreach($result->data as $item){
            $data[$item->tag_id] = $item->tag_name;
        }

        $this->logger->info('Tags: ' . print_r($data, true));

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
            'firstname'    => 'First Name',
            'lastname'     => 'Last Name',
            'email'         => 'E-Mail'
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
     * Return condensed GDPR note.
     *
     * @return string
     */
    protected function getGdprSelectedTags()
    {
        $tags = array();

        if (isset($_POST['op_gdpr_consent_label']) && is_array($_POST['op_gdpr_consent_label'])) {
            foreach ($_POST['op_gdpr_consent_label'] as $key => $value) {
                //$consentNotes .= " | Consent $key Text: $value";
                $tags[] = $key;
            }
        }

        return $tags;
    }


    /**
     * Save GDPR note.
     *
     * @param $contactId
     * @return mixed
     */
    protected function saveGdprNote($contactId)
    {
        // selected tags
        $tags = $_POST['op_gdpr_consent_tag'];
        $this->logger->info('selected tags :' . print_r($tags, true));

        foreach($tags as $tagID){
            $form_params = array(
                'objectID'       => 0,
                'add_list'      => $tagID,
                'ids'       => $contactId
            );
            $response = $this->getClient()->request($form_params, 'objects/tag', "put", '5', '');

            $this->logger->info('taggig user['.$contactId.'] with tag['.$tagID.']: ' . print_r($response, true));
        }

    }
}

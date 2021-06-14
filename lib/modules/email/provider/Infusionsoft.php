<?php

require_once(OP_MOD . 'email/ProviderInterface.php');
require_once(OP_MOD . 'email/provider/AbstractProvider.php');

require_once(OP_LIB . 'vendor/infusionsoft/isdk.php');

/**
 * Infusionsoft email integration provider
 * @author OptimizePress <info@optimizepress.com>
 */
class OptimizePress_Modules_Email_Provider_Infusionsoft extends OptimizePress_Modules_Email_Provider_AbstractProvider implements OptimizePress_Modules_Email_ProviderInterface
{
    const OPTION_NAME_ACCOUNT_ID = 'infusionsoft_account_id';
    const OPTION_NAME_API_KEY = 'infusionsoft_api_key';

    /**
     * @var OP_iSDK
     */
    protected $client = null;

    /**
     * @var string
     */
    protected $accountId;

    /**
     * @var string
     */
    protected $apiKey;

    public function __construct(OptimizePress_Modules_Email_LoggerInterface $logger)
    {
        $this->accountId = op_get_option(self::OPTION_NAME_ACCOUNT_ID);
        $this->apiKey = op_get_option(self::OPTION_NAME_API_KEY);

        /*
         * Initializing logger
         */
        $this->logger = $logger;
    }

    public function getClient()
    {
        if (null === $this->client) {
            $this->client = new OP_iSDK();
            $this->client->setLogger($this->logger);
            $this->client->cfgCon($this->accountId, $this->apiKey);
        }

        return $this->client;
    }

    public function subscribe($data)
    {
        $this->logger->info('Subscribing user: ' . print_r($data, true));

        if (isset($data['email'])) {

            $name = op_post('name');
            $params = array(
                'FirstName' => false !== $name ? $name : '',
                'Email' => $data['email']
            );

            try {
                $status = $this->getClient()->addWithDupCheck($params, 'Email');

                $this->logger->notice('Subscription status: ' . print_r($status, true));
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

        $params = array(
            'FirstName' => $fname,
            'LastName'  => $lname,
            'Email'     => $email
        );

        try {
            $contactId = $this->getClient()->addWithDupCheck($params, 'Email');

            $this->logger->notice('Registration status: ' . print_r($contactId, true));

            $status = $this->getClient()->campAssign($contactId, $list);

            $this->logger->notice('Campaign assigning status: ' . print_r($status, true));
        } catch (Exception $e) {
            $this->logger->error('Error ' . $e->getCode() . ': ' . $e->getMessage());

            return false;
        }

        return true;
    }

    public function getLists()
    {
        $lists = $this->getClient()->getWebFormMap();

        $this->logger->info('Lists: ' . print_r($lists, true));

        return $lists;
    }

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
            foreach ($lists as $key => $name) {
                $formData = $this->parseHtmlForm($key);
                $data['lists'][$key] = array('name' => $name, 'fields' => $formData['fields'], 'action' => $formData['action'], 'hidden' => $formData['hidden']);
            }
        }

        $this->logger->info('Formatted lists: ' . print_r($data, true));

        return $data;
    }

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
            foreach ($lists as $key => $name) {
                $data['lists'][$key] = array('name' => $name);
            }
        }

        $this->logger->info('Items: ' . print_r($data, true));

        return $data;
    }

    public function getListFields($listId)
    {
        $fields = $this->parseHtmlForm($listId);

        $this->logger->info("Fields for list $listId: " . print_r($fields, true));

        return $fields;
    }

    public function getFollowUpSequences()
    {
        $sequences = array();

        $data = $this->getClient()->dsQuery('Campaign', 100, 0, array('Id' => '%'), array('Id', 'Name'));
        if (count($data) > 0) {
            foreach ($data as $row) {
                $sequences[$row['Id']] = array('name' => $row['Name']);
            }
        }

        $this->logger->info('Sequences: ' . print_r($sequences, true));

        return array('lists' => $sequences);
    }

    public function isEnabled()
    {
        if (false !== $this->accountId && false !== $this->apiKey) {
            return true;
        } else {
            return false;
        }
    }

    protected function parseHtmlForm($id)
    {
        $data = array('action' => '', 'fields' => array(), 'hidden' => array());

        $doc = new DOMDocument();
        if ($doc->loadHTML($this->getClient()->getWebFormHtml($id))) {
            $xpath = new DOMXPath($doc);
            $form = $xpath->query('//form');
            if ($form->length > 0) {
                $data['action'] = $form->item(0)->getAttribute('action');

                // Parse labels
                $htmlLabels = $xpath->query('//label');
                $labels     = array();
                foreach ($htmlLabels as $label) {
                    $labels[$label->getAttribute("for")] = $label->nodeValue;
                }

                // Parse inputs
                $inputs = $xpath->query('//input');
                foreach ($inputs as $input) {
                    if ('hidden' === $input->getAttribute('type')) {
                        $data['hidden'][esc_attr($input->getAttribute('name'))] = $input->getAttribute('value');
                    } elseif ('inf_field_Email' !== esc_attr($input->getAttribute('name'))) {
                        $data['fields'][esc_attr($input->getAttribute('name'))] = isset($labels[$input->getAttribute('name')]) ? $labels[$input->getAttribute('name')] : $input->getAttribute('name');
                    }
                }
            }
        }

        return $data;
    }
}

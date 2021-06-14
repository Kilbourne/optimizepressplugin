<?php

require_once('rest.inc.php');

Class OP_Maropost
{
    const URL_PREFIX = 'http://app.maropost.com/accounts/';

    /**
     * Emma API Dommain
     * @var int
     */
    private $maropost_account_id = null;

    /**
     * Emma API Dommain
     * @var string
     */
    private $maropost_auth_token = null;

    public function __construct($account_id, $auth_token, OptimizePress_Modules_Email_LoggerInterface $logger)
    {
        // Save account ID to class object variable
        $this->maropost_account_id = $account_id;
        $this->maropost_auth_token = $auth_token;

        /*
         * Initializing logger
         */
        $this->logger = $logger;
    }

    public function lists()
    {
        $page       = 0;
        $allLists   = array();

        /*
         * Maropost service returns 20 results at one time. This iterates through pages until all data is retrieved.
         */
        do {
            $page++;

            $lists = RestCurl::get(self::URL_PREFIX . $this->maropost_account_id . '/lists', array(
                'auth_token'    => $this->maropost_auth_token,
                'page'          => $page
            ));

            $this->logger->debug('Response: ' . print_r($lists, true));

            $allLists = array_merge($allLists, $lists['data']);

        } while (count($lists['data']) === 20);

        return $allLists;
    }

    public function listSubscribe($first_name, $last_name, $email, $listID, $phone = null, $fax = null, $data = null)
    {
        $result = RestCurl::post(self::URL_PREFIX . $this->maropost_account_id . '/lists/' . $listID . '/contacts', array(
            'auth_token'    => $this->maropost_auth_token,
            'first_name'    => $first_name,
            'last_name'     => $last_name,
            'email'         => $email,
            'phone'         => (int)$phone,
            'fax'           => (int)$fax,
            'custom_field'  => $data
        ));

        $this->logger->debug('Response: ' . print_r($result, true));

        return $result['data'];
    }

    public function customFieldsList()
    {
        $result = RestCurl::get(self::URL_PREFIX . $this->maropost_account_id . '/custom_fields/', array(
            'auth_token' =>  $this->maropost_auth_token
        ));

        $this->logger->debug('Response: ' . print_r($result, true));

        return $result['data'];
    }
}
<?php

/**
 * arpReach wp_remote_get/post wrapper
 * @author OptimizePress <info@optimizepress.com>
 */
class Op_ArpReachClient
{
    /**
     * @var OptimizePress_Modules_Email_LoggerInterface
     */
    protected $logger;

    /**
     * @var string
     */
    protected $apiKey;

    /**
     * @var string
     */
    protected $apiEndpoint;

    /**
     * Initialize object and logger
     * @param string                                      $apiKey
     * @param string                                      $apiEndpoint
     * @param OptimizePress_Modules_Email_LoggerInterface $logger
     */
    public function __construct($apiKey, $apiEndpoint, OptimizePress_Modules_Email_LoggerInterface $logger)
    {
        $this->logger       = $logger;
        $this->apiKey       = $apiKey;
        $this->apiEndpoint  = $apiEndpoint;
    }

    /**
     * Subscribe contact to list
     * @param  string $list
     * @param  string $email
     * @param  array $data
     * @return boolean
     */
    public function subscribeContact($list, $email, $data)
    {
        if (null === $this->getContact($email)) {
            return $this->addContact($list, $email, $data);
        } else {
            $this->updateContact($list, $email, $data);
            return $this->addToList($list, $email);
        }
    }

    /**
     * Add contact.
     *
     * @param  string $list
     * @param  string $email
     * @param  array $data
     * @return boolean
     */
    protected function addContact($list, $email, $data)
    {
        $this->logger->info("Adding contact $email\n");

        $data['email_address'] = $email;
        $data['lists'] = json_encode(array(array("list" => $list)));

        try {
            $response = $this->request("add_contact", $data);
        } catch (Exception $e) {
            $this->logger->error("Error when adding contact");
            return false;
        }

        $contact = wp_remote_retrieve_body($response);

        $this->logger->info("Added contact: " . print_r($contact, true) . "\n");

        $contact = json_decode($contact);

        if ($contact[0]->status === "ok") {
            return true;
        }

        return false;
    }

    /**
     * Update contact.
     *
     * @param  string $list
     * @param  string $email
     * @param  array $data
     * @return boolean
     */
    protected function updateContact($list, $email, $data)
    {
        $this->logger->info("Updating contact $email\n");

        $data['email_address'] = $email;

        try {
            $response = $this->request("edit_contact", $data);
        } catch (Exception $e) {
            $this->logger->error("Error when updating contact");
            return false;
        }

        $contact = wp_remote_retrieve_body($response);

        $this->logger->info("Updated contact: " . print_r($contact, true) . "\n");

        $contact = json_decode($contact);

        if ($contact->status !== "ok") {
            return false;
        }

        return true;
    }

    /**
     * Add contact to list.
     *
     * @param string $list
     * @param string $email
     * @return boolean
     */
    protected function addToList($list, $email)
    {
        try {
            $response = $this->request("add_to_list", array('email_address' => $email, 'lists' => json_encode(array(array("list" => $list)))));
        } catch (Exception $e) {
            $this->logger->error("Error when adding contact to list");
            return false;
        }

        $data = wp_remote_retrieve_body($response);

        $this->logger->info("Added to list: " . print_r($data, true) . "\n");

        $data = json_decode($data);

        if ($data[0]->status === "ok") {
            return true;
        }

        return false;
    }

    /**
     * Retrieve contact based on $email
     * @param  string $email
     * @return mixed
     */
    protected function getContact($email)
    {
        $this->logger->info("Fetching contact $email");

        try {
            $response = $this->request('get_contact', array('email_address' => $email));
        } catch (Exception $e) {
            return null;
        }

        $contact = wp_remote_retrieve_body($response);

        $this->logger->info("Retrieved contact: " . print_r($contact, true) . "\n");

        $contact = json_decode($contact);

        if ($contact->status === "ok") {
            return $contact;
        }

        return null;
    }

    /**
     * Retrieve contact based on $email
     * @return mixed
     */
    public function getTags()
    {
        $this->logger->info("Fetching tags ");

        try {
            $response = $this->request('list_tags', array());
        } catch (Exception $e) {
            $this->logger->error("Error: " . $e->getMessage());
            return null;
        }

        $tags = wp_remote_retrieve_body($response);

        $this->logger->info("Retrieved tags: " . print_r($tags, true) . "\n");

        $tags = json_decode($tags);

        return $tags;
    }

    /**
     * Assigns tags to contact
     * @param $tags string comma separated list of tag names
     * @param $email string
     * @return bool
     */
    public function assignTagsToContact($tags, $email)
    {
        try {
            $response = $this->request("assign_tag_to_contact", array('email_address' => $email, 'tag_name' => $tags));
        } catch (Exception $e) {
            $this->logger->error("Error when adding tags to contact " . $e->getMessage());
            return false;
        }

        $data = wp_remote_retrieve_body($response);

        $this->logger->info("Assing tags to contact: " . print_r($data, true) . "\n");

        $data = json_decode($data);

        if ($data->status === "ok") {
            return true;
        }

        return false;
    }

    /**
     * HTTP request wrapped with wp_remote_get
     * @param  string $action [description]
     * @param  array $params [description]
     * @return mixed
     * @throws Exception
     */
    protected function request($action, array $params)
    {
        $this->logger->info("arpReach Request\n");
        $this->logger->info("Action: $action\n");
        $this->logger->info("Params: " . print_r($params, true) . "\n");

        // Add API key to params stack
        $params['api_key'] = $this->apiKey;

        // Lets create request URL
        $url = add_query_arg($this->urlEncodeParams($params), trailingslashit($this->apiEndpoint) . 'api/' . $action);

        $this->logger->info("URL: $url\n");

        $response = wp_remote_get($url);

        // Log error and throw exception
        if (is_wp_error($response)) {
            $this->logger->error("WP ERR: " . print_r($response, true) . "\n");

            throw new Exception("Error when trying to connect to arpReach API");
        }

         // Check if status 200 was received
        if (200 !== (int) wp_remote_retrieve_response_code($response)) {
            $this->logger->info("HTTP status error: " . print_r($response, true) . "\n");
        }

        return $response;
    }

    /**
     * Encode URL params with PHP "urlencode" function
     * @param  array $params
     * @return array
     */
    protected function urlEncodeParams($params)
    {
        foreach ($params as &$value) {
            $value = urlencode($value);
        }

        return $params;
    }
}
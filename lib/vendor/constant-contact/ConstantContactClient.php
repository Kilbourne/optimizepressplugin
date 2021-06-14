<?php

/**
 * Constant Contact wp_remote_get/post wrapper
 * @author OptimizePress <info@optimizepress.com>
 */
class OP_ConstantContactClient
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
    protected $token;

    /**
     * @var string
     */
    protected $apiEndpoint = 'https://api.constantcontact.com/v2/';

    /**
     * Initialize object and logger
     * @param string                                      $apiKey
     * @param string                                      $token
     * @param OptimizePress_Modules_Email_LoggerInterface $logger
     */
    public function __construct($apiKey, $token, OptimizePress_Modules_Email_LoggerInterface $logger)
    {
        $this->logger   = $logger;
        $this->apiKey   = $apiKey;
        $this->token    = $token;
    }

    /**
     * Return lists
     * @return array
     */
    public function getLists()
    {
        try {
            $response = $this->request('get', $this->apiEndpoint . 'lists');
        } catch (Exception $e) {
            return array();
        }

        $lists = wp_remote_retrieve_body($response);

        $this->logger->info("Retrieved lists: " . print_r($lists, true) . "\n");

        return json_decode($lists);
    }

    /**
     * Return contact if it exists.
     * @param  string $email
     * @return mixed object with contact data if it exists and false if it doesn't
     */
    public function getContact($email)
    {
        try {
            $response = $this->request('get', add_query_arg(array('email' => $email), $this->apiEndpoint . 'contacts'));
        } catch (Exception $e) {
            return false;
        }

        $contact = wp_remote_retrieve_body($response);

        $this->logger->info("Retrieved contact: " . print_r($contact, true) . "\n");

        $contact = json_decode($contact);

        if (count($contact->results) > 0) {
            return $contact->results[0];
        }

        return false;
    }

    /**
     * Subscribe contact to the list.
     *
     * @param string $listId
     * @param string $email
     * @param array $fields
     *
     * @return bool
     */
    public function subscribeContact($listId, $email, $fields)
    {
        $contact = $this->getContact($email);

        if (false === $contact) {
            // Create new contact
            return $this->addContact($listId, $email, $fields);

        } else if (isset($contact->lists) && is_array($contact->lists) && count($contact->lists) > 0 && !in_array($listId, wp_list_pluck($contact->lists, 'id'))) {
            // Update a contact
            return $this->updateContact($contact, $listId, $email, $fields);

        } else {
            $this->logger->info("Contact $email is already subscribed to the list $listId\n");
            // Contact already is subscribed to the list
            return false;
        }

        return true;
    }

    /**
     * Add contact to the list.
     *
     * @param string $listId
     * @param string $email
     * @param array $fields
     *
     * @return bool
     */
    public function addContact($listId, $email, $fields)
    {
        $this->logger->info("Adding contact\n");

        try {
            $data       = $this->prepareData($listId, $email, $fields);
            $response   = $this->request('post', $this->apiEndpoint . 'contacts', json_encode($data));
        } catch (Exception $e) {
            return false;
        }

        return true;
    }

    /**
     * Add contact to another list. Used when contact with email address already exists and is subscribing to a different list.
     *
     * @param  stdClass $contact
     * @param  string $listId
     * @param  string $email
     * @param  array $fields
     * @return bool
     */
    public function updateContact($contact, $listId, $email, $fields)
    {
        $this->logger->info("Updating contact\n");

        try {
            $fields     = $this->prepareData($listId, $email, $fields, (array) $contact);
            $response   = $this->request('put', $this->apiEndpoint . 'contacts/' . $contact->id, json_encode($fields));
        } catch (Exception $e) {
            return false;
        }
        return true;
    }

    /**
     * Prepare and merge data to format needed by Constant Contact API.
     *
     * @param  string $listId
     * @param  string $email
     * @param  array  $fields
     * @param  array  $data
     * @return array
     */
    protected function prepareData($listId, $email, $fields, $data = array())
    {
        if (!isset($data['email_addresses'])) {
            $data['email_addresses'][] = array('email_address' => $email);
        }

        $data['lists'][] = array('id' => $listId);

        if (!is_array($fields) || count($fields) === 0) {
            return $data;
        }

        return $fields + $data;
    }

    /**
     * Do actual HTTP request.
     *
     * @param  string $method
     * @param  string $url
     * @param  string $body
     * @param  array  $headers
     * @return mixed
     */
    protected function request($method, $url, $body = null, $headers = array())
    {
        // Append URL to URL
        $url = add_query_arg(array('api_key' => $this->apiKey), $url);

        // Add authorization token to request headers
        $headers['Authorization'] = "Bearer " . $this->token;

        // Log method params
        $this->logger->info("URL: $url\n");
        $this->logger->info("Method: $method\n");
        $this->logger->info("Headers: " . print_r($headers, true) . "\n");
        $this->logger->info("Body: " . print_r($body, true) . "\n");

        switch ($method) {
            case 'put':
                $headers['Content-Type'] = 'application/json';
                $response = wp_remote_request($url, array(
                    'method'    => 'PUT',
                    'headers'   => $headers,
                    'body'      => $body,
                ));
                break;
            case 'post':
                $headers['Content-Type'] = 'application/json';
                $response = wp_remote_post($url, array(
                    'headers'   => $headers,
                    'body'      => $body,
                ));
                break;
            default:
                $response = wp_remote_get($url, array(
                    'headers'   => $headers,
                    'body'      => $body,
                ));
                break;
        }

        // Log error and throw exception
        if (is_wp_error($response)) {
            $this->logger->error("WP ERR: " . print_r($response, true) . "\n");

            throw new Exception("Error when trying to connect to ConstantContact API");
        }

        // Check if status 200 was received
        if (200 !== (int) wp_remote_retrieve_response_code($response)) {
            $this->logger->info("HTTP status error: " . print_r($response, true) . "\n");
        }

        return $response;
    }
}
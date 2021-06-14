<?php

/**
 * ConvertKit wp_remote_get/post wrapper
 * @author OptimizePress <info@optimizepress.com>
 */
class OP_ConvertKitClient
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
    protected $apiEndpoint = 'https://api.convertkit.com/v3/';

    /**
     * Initialize object and logger
     * @param string                                      $apiKey
     * @param OptimizePress_Modules_Email_LoggerInterface $logger
     */
    public function __construct($apiKey, OptimizePress_Modules_Email_LoggerInterface $logger)
    {
        $this->logger   = $logger;
        $this->apiKey   = $apiKey;
    }

    /**
     * Return lists
     * @return array
     */
    public function getLists()
    {
        try {
            $response = $this->request('get', $this->apiEndpoint . 'forms');
        } catch (Exception $e) {
            return array();
        }

        $lists = wp_remote_retrieve_body($response);

        $this->logger->info("Retrieved lists: " . print_r($lists, true) . "\n");

        return json_decode($lists);
    }

    /**
     * Retrun all tags.
     *
     * @return array
     */
    public function getTags()
    {
        try {
            $response = $this->request('get', $this->apiEndpoint . 'tags');
        } catch (Exception $e) {
            return array();
        }

        $tags = wp_remote_retrieve_body($response);

        $this->logger->info("Retrieved tags: " . print_r($tags, true) . "\n");

        return json_decode($tags);
    }

    /**
     * Add contact to the list.
     *
     * @param string $listId
     * @param string $email
     * @param array $fields
     * @param array $tags
     *
     * @return bool
     */
    public function addContact($listId, $email, $fields, $tags = array())
    {
        $this->logger->info("Adding contact\n");

        try {
            $data       = $this->prepareData($email, $fields, $tags);
            $response   = $this->request('post', $this->apiEndpoint . 'forms/' . $listId . '/subscribe', json_encode($data));
        } catch (Exception $e) {
            return false;
        }

        return true;
    }

    /**
     * Prepare and merge data to format needed by Constant Contact API.
     *
     * @param  string $email
     * @param  array  $fields
     * @param  array  $tags
     * @return array
     */
    protected function prepareData($email, $fields, $tags)
    {
        // Email field
        $data['email'] = $email;

        // The rest of the fields
        if (is_array($fields) && count($fields) > 0) {
            foreach ($fields as $name => $value) {
                $data[$name] = $value;
            }
        }

        if (is_array($tags) && count($tags) > 0) {
            $data['tags'] = $tags;
        }

        return $data;
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
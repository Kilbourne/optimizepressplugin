<?php

/**
 * Egoi wp_remote_get wrapper
 * @author OptimizePress <info@optimizepress.com>
 */
class OP_SendlaneApi
{
    /**
     * @var OptimizePress_Modules_Email_LoggerInterface
     */
    protected $logger;

    public function __construct(OptimizePress_Modules_Email_LoggerInterface $logger)
    {
        /*
         * Initializing logger
         */
        $this->logger = $logger;
    }

    public function call($url, $arguments)
    {
        $params =  array(
            'method' => 'POST',
            'timeout' => 45,
            'redirection' => 5,
            'httpversion' => '1.0',
            'blocking' => true,
            'headers' => array(),
            'body' => array( 'api' => 'bob', 'hash' => '1234xyz' ),
            'cookies' => array()
        );

        $response = wp_remote_post(add_query_arg($params, $url . '/api/v1/lists'));

        if (is_wp_error($response) || $response['response']['code'] != 200) {
            $this->logger->error('Response: ' . print_r($response, true));
            return;
        }

        $json = json_decode($response['body'], true);
        $map = $json;
        //$map = $json['OP_SendlaneApi'][$method];

        $this->logger->debug('Response: ' . print_r($map, true));

        $status = $map['status'];
        unset($map['status']);

        return $this->setMap($map);
    }

    public function getLists($url, $api, $hash)
    {
        $params =  array(
            'method' => 'POST',
            'timeout' => 45,
            'redirection' => 5,
            'httpversion' => '1.0',
            'blocking' => true,
            'headers' => array(),
            'api' => $api,
            'hash' => $hash,
            'cookies' => array()
        );
        $response = wp_remote_post(add_query_arg($params, $url . '/api/v1/lists'));

        if (is_wp_error($response) || $response['response']['code'] != 200) {
            $this->logger->error('Response: ' . print_r($response, true));
            return;
        }

        $json = json_decode($response['body'], true);
        return $json;
    }

    public function getTags($url, $api, $hash)
    {
        $params =  array(
            'method' => 'POST',
            'timeout' => 45,
            'redirection' => 5,
            'httpversion' => '1.0',
            'blocking' => true,
            'headers' => array(),
            'api' => $api,
            'hash' => $hash,
            'cookies' => array()
        );
        $response = wp_remote_post(add_query_arg($params, $url . '/api/v1/tags'));

        if (is_wp_error($response) || $response['response']['code'] != 200) {
            $this->logger->error('Response: ' . print_r($response, true));
            return;
        }

        $json = json_decode($response['body'], true);
        return $json;
    }

    public function addSubscriber($url, $params){

        $data =  array(
            'method' => 'POST',
            'timeout' => 45,
            'redirection' => 5,
            'httpversion' => '1.0',
            'blocking' => true,
            'headers' => array(),
            'cookies' => array()
        );

        $params = array_merge($params, $data);

        $response = wp_remote_post(add_query_arg($params, $url . '/api/v1/list-subscriber-add'));
        $this->logger->error('Response: ' . print_r($response, true));
        if (is_wp_error($response) || $response['response']['code'] != 200) {
            $this->logger->error('Response: ' . print_r($response, true));
            return;
        }

        $json = json_decode($response['body'], true);
        return $json;
    }

    protected function setMap($map)
    {
        if(array_key_exists("key_0", $map)) {
            $mrl = array();
            foreach($map as $k => $v) {
                if(strpos($k, "key_") != 0) {
                    continue;
                }
                if (is_array($v)) {
                    $mrl[] = $this->setValues($v);
                } else {
                    $mrl[] = $v;
                }

            }
            return $mrl;
        } else {
            return $this->setValues($map);
        }
    }

    protected function setValues($map)
    {
        foreach($map as $k => $v) {
            if(is_array($v)) {
                $map[$k] = $this->setMap($v);
            }
        }
        return $map;
    }
}

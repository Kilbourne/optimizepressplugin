<?php

/**
 * Egoi wp_remote_get wrapper
 * @author OptimizePress <info@optimizepress.com>
 */
class OP_EgoiApi
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

    public function call($method, $arguments)
    {
        $params =  array(
            "method" => $method,
            "functionOptions" => $arguments,
            "type" => "json"
        );

        $response = wp_remote_get(add_query_arg($params, 'http://api.e-goi.com/v2/rest.php'));

        if (is_wp_error($response) || $response['response']['code'] != 200) {
            $this->logger->error('Response: ' . print_r($response, true));
            return;
        }

        $json = json_decode($response['body'], true);
        $map = $json['Egoi_Api'][$method];

        $this->logger->debug('Response: ' . print_r($map, true));

        $status = $map['status'];
        unset($map['status']);

        return $this->setMap($map);
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
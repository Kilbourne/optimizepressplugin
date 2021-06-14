<?php

require_once(OP_MOD . 'email/LoggerInterface.php');

class OptimizePress_Modules_Email_Logger_Null implements OptimizePress_Modules_Email_LoggerInterface
{
    public function log($level, $message)
    {
        return;
    }

    public function emergency($message)
    {
        return;
    }

    public function alert($message)
    {
        return;
    }

    public function critical($message)
    {
        return;
    }

    public function error($message)
    {
        return;
    }

    public function warning($message)
    {
        return;
    }

    public function notice($message)
    {
        return;
    }

    public function info($message)
    {
        return;
    }

    public function debug($message)
    {
        return;
    }
}
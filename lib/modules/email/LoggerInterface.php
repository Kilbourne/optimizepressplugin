<?php

/**
 * Email marketing services logger interface
 */
interface OptimizePress_Modules_Email_LoggerInterface
{
    /**
     * Log message
     * @param  mixed $level
     * @param  string $message
     * @return void
     */
    public function log($level, $message);

    /**
     * System is unusable
     * @param  string $message
     * @return void
     */
    public function emergency($message);

    /**
     * Action must be taken immediately
     * @param  string $message
     * @return void
     */
    public function alert($message);

    /**
     * Critical conditions
     * @param  string $message
     * @return void
     */
    public function critical($message);

    /**
     * Runtime errors that do not require immediate action but should typically
     * be logged and monitored
     * @param  string $message
     * @return void
     */
    public function error($message);

    /**
     * Exceptional occurrences that are not errors
     * @param  string $message
     * @return void
     */
    public function warning($message);

    /**
     * Normal but significant events
     * @param  string $message
     * @return void
     */
    public function notice($message);

    /**
     * Interesting events
     * @param  string $message
     * @return void
     */
    public function info($message);

    /**
     * Detailed debug information
     * @param  string $message
     * @return void
     */
    public function debug($message);
}
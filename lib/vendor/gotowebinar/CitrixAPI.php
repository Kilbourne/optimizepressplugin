<?php
class OP_CitrixAPI {

    public $_organizerKey;
    public $_accessToken;
    

    /**
     * @var OptimizePress_Modules_Email_LoggerInterface
     */
    protected $logger;

    public function __construct ($_accessToken = null, $_organizerKey = null, OptimizePress_Modules_Email_LoggerInterface $logger) {
        $this->_accessToken = $_accessToken;
        $this->_organizerKey = $_organizerKey;

        /*
         * Initializing logger
         */
        $this->logger = $logger;
    }

    public function getOAuthToken ($_apiKey = null, $_apiSecret = null, $_callbackUrl = null) {
        if (isset($_GET['authorize']) && (int)$_GET['authorize'] == 1) {
            header('location:https://api.getgo.com/oauth/v2/authorize?response_type=code&client_id='. $_apiKey );
            exit();
        }

        if (isset($_GET['code'])) {
            $url = 'https://api.getgo.com/oauth/v2/token?grant_type=authorization_code&code='. $_GET['code'] .'&client_id='. $_apiKey;

            $headers = array(
                'Authorization: Basic '. base64_encode($_apiKey . ':' . $_apiSecret),
                'Content-Type: application/x-www-form-urlencoded',
                'Accept:application/json'
            );
            $this->logger->debug(base64_encode($_apiKey . ':' . $_apiSecret));
            $this->logger->debug(sanitize_text_field($_GET['code']));

            $data = 'grant_type=authorization_code&code=' . sanitize_text_field($_GET['code']) . '&redirect_uri='.$_callbackUrl;
            return $this->makeApiRequest($url, 'POST', $data, $headers);
        }
    }

    /**
     * @param $apiKey
     * @param $apiSecret
     * @param $refreshToken
     * @return array|bool|mixed|object|string
     */
    public function refreshToken($apiKey, $apiSecret, $refreshToken)
    {
        $headers = array(
            'Authorization: Basic '. base64_encode($apiKey . ':' . $apiSecret),
            'Content-Type: application/x-www-form-urlencoded',
            'Accept:application/json'
        );

        //$data = array();
        //$data['grant_type'] = 'refresh_token';
        //$data['refresh_token'] = $refreshToken;

        $data = 'grant_type=refresh_token&refresh_token=' . $refreshToken;

        $url  = 'https://api.getgo.com/oauth/v2/token?grant_type=refresh_token&refresh_token=' . $refreshToken;
        return $this->makeApiRequest($url, 'POST', $data, $headers);
    }

    /**
     * @name getAttendeesByOrganizer
     * @desc GoToMeeting API
     */

    public function getAttendeesByOrganizer () {
        $url  = 'https://api.getgo.com/G2M/rest/v2/organizers/'. $this->_organizerKey .'/attendees';
        $url .= '?startDate='. date('c');
        $url .= '?endDate='. date('c', strtotime("-7 Days"));

        return $this->makeApiRequest($url, 'GET', array(), $this->getJsonHeaders());
    }

    /**
     * @name getFutureMeetings
     * @desc GoToMeeting API
     */

    public function getFutureMeetings () {
        $url  = 'https://api.getgo.com/G2M/rest/v2/meetings?scheduled=true';
        return $this->makeApiRequest($url, 'GET', array(), $this->getJsonHeaders());
    }

    /**
     * @name getUpcomingWebinars
     * @desc GoToWebinar API
     * @return array|bool|mixed|object|string
     * @throws Exception
     */
    public function getUpcomingWebinars () {
        $now = new DateTime();
        $now->setTimezone(new DateTimeZone('UTC'));
        $startTime = $now->format('Y-m-d\TH:i:s\Z');
        $end = $now->add(new DateInterval("P1Y"));
        $end->setTimezone(new DateTimeZone('UTC'));
        $endTime = $end->format('Y-m-d\TH:i:s\Z');

        $url  = 'https://api.getgo.com/G2W/rest/v2/organizers/'. $this->_organizerKey .'/webinars/?fromTime=' . $startTime . '&toTime=' . $endTime;

        return $this->makeApiRequest($url, 'GET', array(), $this->getJsonHeaders());
    }

    /**
     * @name getUpcomingWebinars
     * @desc GoToWebinar API
     */
    public function getPastWebinars () {
        $url  = 'https://api.getgo.com/G2W/rest/v2/organizers/'. $this->_organizerKey .'/historicalWebinars';
        return $this->makeApiRequest($url, 'GET', array(), $this->getJsonHeaders());
    }

    /**
     * @name getWebinarAttendees
     * @desc GoToWebinar API
     */
    public function getWebinarAttendees ($webinarKey) {
        $url  = 'https://api.getgo.com/G2W/rest/v2/organizers/'. $this->_organizerKey .'/webinars/'. $webinarKey .'/attendees';
        return $this->makeApiRequest($url, 'GET', array(), $this->getJsonHeaders());
    }

    public function getWebinarRegistrants ($webinarKey) {
        $url  = 'https://api.getgo.com/G2W/rest/v2/organizers/'. $this->_organizerKey .'/webinars/'. $webinarKey .'/registrants';
        return $this->makeApiRequest($url, 'GET', array(), $this->getJsonHeaders());
    }

    public function getWebinar ($webinarKey) {
        $url  = 'https://api.getgo.com/G2W/rest/v2/organizers/'. $this->_organizerKey .'/webinars/'. $webinarKey;
        return $this->makeApiRequest($url, 'GET', array(), $this->getJsonHeaders());
    }

    /**
     * Create new attendee
     * @param  string $webinarKey
     * @param  array $postData
     * @return array
     */
    public function createRegistrant($webinarKey, $postData) {
        $url  = 'https://api.getgo.com/G2W/rest/v2/organizers/'. $this->_organizerKey .'/webinars/'. $webinarKey . '/registrants';
        return $this->makeApiRequest($url, 'POST', json_encode($postData), $this->getJsonHeaders());
    }

    /**
     * @param String $url
     * @param String $requestType
     * @param Array $postData
     * @param Array $headers
     */
    public function makeApiRequest ($url = null, $requestType = 'GET', $postData = array(), $headers = array()) {

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);

        if ($requestType == 'POST') {
            curl_setopt($ch, CURLOPT_POST, 1);
            curl_setopt($ch, CURLOPT_POSTFIELDS, $postData);
        }

        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
        $data = curl_exec($ch);

        $this->logger->debug('Response: ' . print_r($data, true) . "\n");

        $validResponseCodes = array(200, 201, 409);
        $responseCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

        if (curl_errno($ch)) {
            curl_close($ch);
            return curl_error($ch);
        }
        elseif (!in_array($responseCode, $validResponseCodes)) {
            if ($this->isJson($data)) {
                $data = json_decode($data);
            }
        }

        curl_close($ch);
        return $data;
    }

    public function getJsonHeaders () {
        return array(
            "Accept: application/json",
            "Authorization: Bearer ". $this->_accessToken
        );
    }

    public function isJson ($string) {
        $isJson = 0;
        $decodedString = json_decode($string);

        if (is_array($decodedString) || is_object($decodedString)) {
            $isJson = 1;
        }

        return $isJson;
    }
}
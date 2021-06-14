<?php

class OptimizePress_Social_Count{
    /**
     * @var OptimizePress_Social_Count
     */
    protected static $instance;

    /**
     * @var string
     */
    protected $facebookId = null;

    /**
     * @var string
     */
    protected $facebookSecret = null;

    /**
     * @var string
     */
    protected $twitterSearchTweetUrl = 'https://api.twitter.com/1.1/search/tweets.json';

    /**
     * @var array
     */
    protected $twitterSettings = null;

    /**
     * @var array
     */
    protected $twitterCount = null;

    /**
     * @var array
     */
    protected $twitterCountIteration = null;

    /**
     * Constructor function
     */
    public function __construct(){
        require_once "social-count/TwitterAPIExchange.php";

        $this->facebookId = op_get_option('comments','facebook','id');
        $this->facebookSecret = op_get_option('comments','facebook','secret');

        $this->twitterSettings = array(
            'consumer_key' => op_get_option('comments','twitter','consumer_key'),
            'consumer_secret' => op_get_option('comments','twitter','consumer_secret'),
            'oauth_access_token' => op_get_option('comments','twitter','oauth_access_token'),
            'oauth_access_token_secret' => op_get_option('comments','twitter','oauth_access_token_secret')
        );
    }

    /**
     * Get Twitter share count
     *
     * @param $url string
     * @return int
     */
    public function getTwitterShareCount($url){
        $count = 0;

        $optimizedUrl = $this->cleanUrl($url);

        if (isset($optimizedUrl) && !empty($this->twitterSettings['consumer_key']) && !empty($this->twitterSettings['consumer_secret']) && !empty($this->twitterSettings['oauth_access_token']) && !empty($this->twitterSettings['oauth_access_token_secret'])){
            if (!isset($this->twitterCountIteration[$optimizedUrl])){
                $this->twitterCountIteration[$optimizedUrl] = 0;
            }

            if (!isset($this->twitterCount[$optimizedUrl])){
                $this->sumTwitterCounts($optimizedUrl);
            }

            $count = $this->twitterCount[$optimizedUrl];
        }

        return $count;
    }

    /**
     * Get Facebook share count over FB access token & application secret
     *
     * @param $url string
     * @return int
     */
    public function getFacebookShareCount($url){
        $count = 0;
        if (isset($url) && !empty($this->facebookId) && !empty($this->facebookSecret)){
            $curlUrl = "https://graph.facebook.com/?id=$url&pretty=0&access_token=$this->facebookId|$this->facebookSecret";
	        $fbParse = json_decode($this->parse($curlUrl));
	        if (isset($fbParse->share) && isset($fbParse->share->share_count)){
		        $count = $fbParse->share->share_count;
	        }
        }
        return $count;
    }

    /**
     * Basic cURL request
     *
     * @param $encUrl string
     * @return string
     */
    protected function parse($encUrl){
        $options = array(
            CURLOPT_RETURNTRANSFER => true, // return web page
            CURLOPT_HEADER => false, // don't return headers
            CURLOPT_FOLLOWLOCATION => true, // follow redirects
            CURLOPT_ENCODING => "", // handle all encodings
            CURLOPT_USERAGENT => 'optimizePress', // who am i
            CURLOPT_AUTOREFERER => true, // set referer on redirect
            CURLOPT_CONNECTTIMEOUT => 5, // timeout on connect
            CURLOPT_TIMEOUT => 10, // timeout on response
            CURLOPT_MAXREDIRS => 3, // stop after 10 redirects
            CURLOPT_SSL_VERIFYHOST => 0,
            CURLOPT_SSL_VERIFYPEER => false,
        );
        $ch = curl_init();

        $options[CURLOPT_URL] = $encUrl;
        curl_setopt_array($ch, $options);

        $content = curl_exec($ch);
        $err = curl_errno($ch);
        $errmsg = curl_error($ch);

        curl_close($ch);

        if ($errmsg != '' || $err != '') {
            //print_r($errmsg);
        }
        return $content;
    }

    /**
     * Call to Twitter API for grabbing share counts
     *
     * @param $countUrl string
     * @param $search_metadata object
     * @return void
     */
    protected function sumTwitterCounts($countUrl, $search_metadata = null){
        $this->twitterCount[$countUrl] = (isset($this->twitterCount[$countUrl])) ? $this->twitterCount[$countUrl]:0;

        $this->twitterCountIteration[$countUrl]++;
        if ($this->twitterCountIteration[$countUrl] > 10){
            return;
        }

        $twitter = new OP_TwitterAPIExchange($this->twitterSettings);
        if (null === $search_metadata){
            $getField = '?count=100&q=' . urlencode($countUrl);
            $requestMethod = 'GET';

            $result = json_decode($twitter->setGetfield($getField)->buildOauth($this->twitterSearchTweetUrl, $requestMethod)->performRequest());

	        if (isset($result)) {
		        $this->addTweetCounts($result, $countUrl);
	        }

            if (isset($result->search_metadata)) {
                $this->sumTwitterCounts($countUrl, $result->search_metadata);
            }
        } else{
            if (isset($search_metadata->next_results)){
                $getField = $search_metadata->next_results;
                $requestMethod = 'GET';

                $result = json_decode($twitter->setGetfield($getField)->buildOauth($this->twitterSearchTweetUrl, $requestMethod)->performRequest());

                $this->addTweetCounts($result, $countUrl);

                $this->sumTwitterCounts($countUrl, $result->search_metadata);
            }
        }
    }

    /**
     * Add count to public variable for requested URL
     *
     * @param $result object
     * @param $url string
     * @return int
     */
    protected function addTweetCounts($result, $url) {
        if (isset($result) && isset($result->statuses)) {
            foreach ($result->statuses as $status) {
	            $this->twitterCount[$url]++;
	            if (isset($status->retweet_count)){
		            $this->twitterCount[$url] += intval($status->retweet_count);
	            }
	            if (isset($status->favorite_count)){
		            $this->twitterCount[$url] += intval($status->favorite_count);
	            }
            }
        }
    }

    /**
     * Removes http, https and www from URL
     *
     * @param $url string
     * @return string
     */
    protected function cleanUrl($url) {
        $url = preg_replace('/https?:\/\/|www\./', '', $url);
        return $url;
    }

    /**
     * Singleton
     * @return OptimizePress_Social_Count
     */
    public static function getInstance()
    {
        if (null == self::$instance) {
            self::$instance = new self;
        }

        return self::$instance;
    }
}
OptimizePress_Social_Count::getInstance();
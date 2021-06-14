<?php
class OptimizePress_Sections_Email_Marketing_Services {
    function sections(){
        static $sections;
        if(!isset($sections)){
            $sections = array(
                'oneshoppingcart'   => array(
                    'title'         => __('1ShoppingCart', 'optimizepress'),
                    'action'        => array($this,'oneshoppingcart'),
                    'save_action'   => array($this,'save_oneshoppingcart')
                ),
                'activecampaign'    => array(
                    'title'         => __('ActiveCampaign', 'optimizepress'),
                    'action'        => array($this,'activecampaign'),
                    'save_action'   => array($this,'save_activecampaign')
                ),
                'arpreach'          => array(
                    'title'         => __('arpReach', 'optimizepress'),
                    'action'        => array($this, 'arpreach'),
                    'save_action'   => array($this, 'save_arpreach')
                ),
                'aweber'            => array(
                    'title'         => __('AWeber', 'optimizepress'),
                    'action'        => array($this,'aweber'),
                    'save_action'   => array($this,'save_aweber')
                ),
                'campaignmonitor'   => array(
                    'title'         => __('CampaignMonitor', 'optimizepress'),
                    'action'        => array($this,'campaignmonitor'),
                    'save_action'   => array($this,'save_campaignmonitor')
                ),
                'constantcontact'   => array(
                    'title'         => __('ConstantContact', 'optimizepress'),
                    'action'        => array($this,'constantcontact'),
                    'save_action'   => array($this,'save_constantcontact')
                ),
                'convertkit'   => array(
                    'title'         => __('ConvertKit', 'optimizepress'),
                    'action'        => array($this,'convertkit'),
                    'save_action'   => array($this,'save_convertkit')
                ),
                'egoi'              => array(
                    'title'         => __('Egoi', 'optimizepress'),
                    'action'        => array($this,'egoi'),
                    'save_action'   => array($this,'save_egoi')
                ),
                'emma'              => array(
                    'title'         => __('Emma', 'optimizepress'),
                    'action'        => array($this,'emma'),
                    'save_action'   => array($this,'save_emma')
                ),
                'getresponse'       => array(
                    'title'         => __('GetResponse', 'optimizepress'),
                    'action'        => array($this,'getresponse'),
                    'save_action'   => array($this,'save_getresponse')
                ),
                'getresponsev3'       => array(
                    'title'         => __('GetResponse new API (v3)', 'optimizepress'),
                    'action'        => array($this,'getresponsev3'),
                    'save_action'   => array($this,'save_getresponsev3')
                ),
                'gotowebinar'       => array(
                    'title'         => __('GoToWebinar', 'optimizepress'),
                    'action'        => array($this,'gotowebinar'),
                    'save_action'   => array($this,'save_gotowebinar')
                ),
                'icontact'          => array(
                    'title'         => __('iContact', 'optimizepress'),
                    'action'        => array($this,'icontact'),
                    'save_action'   => array($this,'save_icontact')
                ),
                'infusionsoft'      => array(
                    'title'         => __('InfusionSoft', 'optimizepress'),
                    'action'        => array($this,'infusionsoft'),
                    'save_action'   => array($this,'save_infusionsoft')
                ),
                'mailchimp'         => array(
                    'title'         => __('MailChimp', 'optimizepress'),
                    'action'        => array($this,'mailchimp'),
                    'save_action'   => array($this,'save_mailchimp')
                ),
                'mailpoet'         => array(
                    'title'         => __('MailPoet', 'optimizepress'),
                    'action'        => array($this,'mailpoet'),
                    'save_action'   => array($this,'save_mailpoet')
                ),
                'maropost'          => array(
                    'title'         => __('Maropost', 'optimizepress'),
                    'action'        => array($this,'maropost'),
                    'save_action'   => array($this,'save_maropost')
                ),
                'officeautopilot'   => array(
                    'title'         => __('OfficeAutopilot', 'optimizepress'),
                    'action'        => array($this,'officeautopilot'),
                    'save_action'   => array($this,'save_officeautopilot')
                ),
                'ontraport'         => array(
                    'title'         => __('Ontraport', 'optimizepress'),
                    'action'        => array($this,'ontraport'),
                    'save_action'   => array($this,'save_ontraport')
                ),
                'sendlane'              => array(
                    'title'         => __('Sendlane', 'optimizepress'),
                    'action'        => array($this,'sendlane'),
                    'save_action'   => array($this,'save_sendlane')
                ),
            );
            $sections = apply_filters('op_edit_sections_email_marketing_services',$sections);
        }
        return $sections;
    }

    /* GoToWebinar */
    function gotowebinar(){
        echo op_load_section('gotowebinar', array(), 'email_marketing_services');
    }

    function save_gotowebinar($op){
        if ($gotowebinar = op_get_var($op['email_marketing_services'], 'gotowebinar_api_key')) {
            $this->op_update_trim_option('gotowebinar_api_key', $gotowebinar);
        }
        if ($gotowebinar = op_get_var($op['email_marketing_services'], 'gotowebinar_api_secret')) {
            $this->op_update_trim_option('gotowebinar_api_secret', $gotowebinar);
        }
    }

    /* Aweber */
    function aweber(){
        echo op_load_section('aweber', array(), 'email_marketing_services');
    }

    function save_aweber($op){
        if ($aweber = op_get_var($op, 'aweber')){
            op_update_option('aweber', $aweber);
        }
    }

    /* iContact */
    function icontact(){
        echo op_load_section('icontact', array(), 'email_marketing_services');
    }

    function save_icontact($op){
        $icontactUsername = op_get_var($op['email_marketing_services'], 'icontact_username');
        $icontactPassword = op_get_var($op['email_marketing_services'], 'icontact_password');

        if ($icontactUsername) {
            op_update_option('icontact_username', $icontactUsername);
        } else {
            op_delete_option('icontact_username');
        }

        if ($icontactPassword) {
            op_update_option('icontact_password', $icontactPassword);
        } else {
            op_delete_option('icontact_password');
        }

    }

    /* MailChimp */
    function mailchimp(){
        echo op_load_section('mailchimp', array(), 'email_marketing_services');
    }

    function save_mailchimp($op){
        if ($mailchimp = op_get_var($op['email_marketing_services'], 'mailchimp_api_key')){
            $this->op_update_trim_option('mailchimp_api_key', $mailchimp);
        } else {
            op_delete_option('mailchimp_api_key');
        }
    }

    /* Emma */
    function emma(){
        echo op_load_section('emma', array(), 'email_marketing_services');
    }

    function save_emma($op){

        if ($account_id = op_get_var($op['email_marketing_services'], 'emma_account_id')){
            $this->op_update_trim_option('emma_account_id',$account_id);
        } else {
            op_delete_option('emma_account_id');
        }
        if ($public_key = op_get_var($op['email_marketing_services'], 'emma_public_key')){
            $this->op_update_trim_option('emma_public_key', $public_key);
        } else {
            op_delete_option('emma_public_key');
        }
        if ($private_key = op_get_var($op['email_marketing_services'], 'emma_private_key')){
            $this->op_update_trim_option('emma_private_key', $private_key);
        } else {
            op_delete_option('emma_private_key');
        }

    }

    /* E-Goi */
    function egoi(){
        echo op_load_section('egoi', array(), 'email_marketing_services');
    }

    function save_egoi($op){
        if ($public_key = op_get_var($op['email_marketing_services'], 'egoi_api_key')){
            $this->op_update_trim_option('egoi_api_key', $public_key);
        } else {
            op_delete_option('egoi_api_key');
        }
    }

    /* Maropost */
    function maropost(){
        echo op_load_section('maropost', array(), 'email_marketing_services');
    }

    function save_maropost($op){
        if ($account_id = op_get_var($op['email_marketing_services'], 'maropost_acount_id')){
            $this->op_update_trim_option('maropost_acount_id', $account_id);
        } else {
            op_delete_option('maropost_acount_id');
        }
        if ($public_key = op_get_var($op['email_marketing_services'], 'maropost_auth_token')){
            $this->op_update_trim_option('maropost_auth_token', $public_key);
        } else {
            op_delete_option('maropost_auth_token');
        }
    }


    /* CampaignMonitor */
    function campaignmonitor(){
        echo op_load_section('campaignmonitor', array(), 'email_marketing_services');
    }

    function save_campaignmonitor($op){
        if ($campaignmonitor = op_get_var($op['email_marketing_services'], 'campaignmonitor_api_key')){
            $this->op_update_trim_option('campaignmonitor_api_key', $campaignmonitor);
        } else {
            op_delete_option('campaignmonitor_api_key');
        }
    }

    /* InfusionSoft */
    function infusionsoft(){
        echo op_load_section('infusionsoft', array(), 'email_marketing_services');
    }

    function save_infusionsoft($op){
        $accountId = op_get_var($op['email_marketing_services'], 'infusionsoft_account_id');
        $apiKey = op_get_var($op['email_marketing_services'], 'infusionsoft_api_key');

        if ($accountId) {
            op_update_option('infusionsoft_account_id', $accountId);
        } else {
            op_delete_option('infusionsoft_account_id');
        }

        if ($apiKey) {
            $this->op_update_trim_option('infusionsoft_api_key', $apiKey);
        } else {
            op_delete_option('infusionsoft_api_key');
        }
    }

    /* GetResponse */
    function getresponse(){
        echo op_load_section('getresponse', array(), 'email_marketing_services');
    }

    function save_getresponse($op){
        $apiKey = op_get_var($op['email_marketing_services'], 'getresponse_api_key');
        $apiUrl = op_get_var($op['email_marketing_services'], 'getresponse_api_url');

        if ($apiKey) {
            $this->op_update_trim_option('getresponse_api_key', $apiKey);
        } else {
            op_delete_option('getresponse_api_key');
        }

        if ($apiUrl) {
            $this->op_update_trim_option('getresponse_api_url', $apiUrl);
        } else {
            op_delete_option('getresponse_api_url');
        }
    }

    /* GetResponse v3 */
    function getresponsev3(){
        echo op_load_section('getresponsev3', array(), 'email_marketing_services');
    }

    function save_getresponsev3($op){
        $apiKey = op_get_var($op['email_marketing_services'], 'getresponsev3_api_key');

        if ($apiKey) {
            $this->op_update_trim_option('getresponsev3_api_key', $apiKey);
        } else {
            op_delete_option('getresponsev3_api_key');
        }
    }

    /* 1ShoppingCart */
    function oneshoppingcart(){
        echo op_load_section('oneshoppingcart', array(), 'email_marketing_services');
    }

    function save_oneshoppingcart($op){}

    /* OfficeAutopilot */
    function officeautopilot(){
        echo op_load_section('officeautopilot', array(), 'email_marketing_services');
    }

    function save_officeautopilot($op){
        $appId = op_get_var($op['email_marketing_services'], 'officeautopilot_app_id');
        $apiKey = op_get_var($op['email_marketing_services'], 'officeautopilot_api_key');

        if ($appId) {
            $this->op_update_trim_option('officeautopilot_app_id', $appId);
        } else {
            op_delete_option('officeautopilot_app_id');
        }

        if ($apiKey) {
            $this->op_update_trim_option('officeautopilot_api_key', $apiKey);
        } else {
            op_delete_option('officeautopilot_api_key');
        }
    }

    /* Ontraport */
    function ontraport(){
        echo op_load_section('ontraport', array(), 'email_marketing_services');
    }

    function save_ontraport($op){
        $appId = op_get_var($op['email_marketing_services'], 'ontraport_app_id');
        $apiKey = op_get_var($op['email_marketing_services'], 'ontraport_api_key');

        if ($appId) {
            $this->op_update_trim_option('ontraport_app_id', $appId);
        } else {
            op_delete_option('ontraport_app_id');
        }

        if ($apiKey) {
            $this->op_update_trim_option('ontraport_api_key', $apiKey);
        } else {
            op_delete_option('ontraport_api_key');
        }
    }

    /* ActiveCampaign */
    function activecampaign(){
        echo op_load_section('activecampaign', array(), 'email_marketing_services');
    }

    function save_activecampaign($op){
        $accountUrl = op_get_var($op['email_marketing_services'], 'activecampaign_account_url');
        $apiKey = op_get_var($op['email_marketing_services'], 'activecampaign_api_key');

        if ($accountUrl) {
            $this->op_update_trim_option('activecampaign_account_url', $accountUrl);
        } else {
            op_delete_option('activecampaign_account_url');
        }

        if ($apiKey) {
            $this->op_update_trim_option('activecampaign_api_key', $apiKey);
        } else {
            op_delete_option('activecampaign_api_key');
        }
    }

    /* arpReach */
    function arpreach()
    {
        echo op_load_section('arpreach', array(), 'email_marketing_services');
    }

    function save_arpreach($op)
    {
        if ($apiKey = op_get_var($op['email_marketing_services'], 'arpreach_api_key')) {
            $this->op_update_trim_option('arpreach_api_key', $apiKey);
        } else {
            op_delete_option('arpreach_api_key');
        }

        if ($apiEndpoint = op_get_var($op['email_marketing_services'], 'arpreach_api_endpoint')) {
            $apiEndpoint = trailingslashit(str_replace('/a.php', '', $apiEndpoint)) . 'a.php';

            if (0 !== strpos($apiEndpoint, 'http')) {
                $apiEndpoint = 'http://' . $apiEndpoint;
            }

            $this->op_update_trim_option('arpreach_api_endpoint', $apiEndpoint);
        } else {
            op_delete_option('arpreach_api_endpoint');
        }
    }

    /* ConstantContact */
    function constantcontact()
    {
        echo op_load_section('constantcontact', array(), 'email_marketing_services');
    }

    function save_constantcontact($op)
    {
        if ($apiKey = op_get_var($op['email_marketing_services'], 'constantcontact_api_key')) {
            $this->op_update_trim_option('constantcontact_api_key', $apiKey);
        } else {
            op_delete_option('constantcontact_api_key');
        }

        if ($token = op_get_var($op['email_marketing_services'], 'constantcontact_token')) {
            $this->op_update_trim_option('constantcontact_token', $token);
        } else {
            op_delete_option('constantcontact_token');
        }
    }

    /* ConvertKit */
    function convertkit()
    {
        echo op_load_section('convertkit', array(), 'email_marketing_services');
    }

    function save_convertkit($op)
    {
        if ($apiKey = op_get_var($op['email_marketing_services'], 'convertkit_api_key')) {
            $this->op_update_trim_option('convertkit_api_key', $apiKey);
        } else {
            op_delete_option('convertkit_api_key');
        }
    }

    /**
     * Render MailPoet settings sections.
     *
     * @return void
     */
    public function mailpoet()
    {
        echo op_load_section('mailpoet', array(), 'email_marketing_services');
    }

    /**
     * Save MailPoet settings data.
     *
     * @param  array $op
     * @return void
     */
    public function save_mailpoet($op)
    {
        // Intentionally left empty
        return;
    }
    public function sendlane()
    {
        echo op_load_section('sendlane', array(), 'email_marketing_services');
    }

    function save_sendlane($op){

        if ($url = op_get_var($op['email_marketing_services'], 'sendlane_api_url')) {
            if (strpos($url, 'http') === false) {
                $url = 'https://' . $url;
            }
            $this->op_update_trim_option('sendlane_api_url',$url);
        } else {
            op_delete_option('sendlane_api_url');
        }
        if ($api_key = op_get_var($op['email_marketing_services'], 'sendlane_api_key')){
            $this->op_update_trim_option('sendlane_api_key',$api_key);
        } else {
            op_delete_option('sendlane_api_key');
        }
        if ($hash_key = op_get_var($op['email_marketing_services'], 'sendlane_hash_key')){
            $this->op_update_trim_option('sendlane_hash_key', $hash_key);
        } else {
            op_delete_option('sendlane_hash_key');
        }
    }
    /* Helper methods */
    function op_update_trim_option($name,$value){
        op_update_option($name, preg_replace("/\s+/",'', $value));
    }
}
